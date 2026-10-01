import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { pool } from "../db.js";

type ServiceAccountConfig = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type PushJob = {
  id: string;
  userId: string;
  title: string;
  body: string;
  url: string | null;
  type: string;
  attempts: number;
};

let workerTimer: NodeJS.Timeout | null = null;

function firebaseApp(): App | null {
  const value = process.env["FIREBASE_SERVICE_ACCOUNT_JSON"];
  if (!value) return null;
  if (getApps()[0]) return getApps()[0]!;

  const serviceAccount = JSON.parse(value) as ServiceAccountConfig;
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
}

export async function sendPushNotification(input: {
  title: string;
  body: string;
  url?: string | undefined;
  type?: string | undefined;
}): Promise<{
  recipients: number;
  sent: number;
  failed: number;
  configured: boolean;
}> {
  const app = firebaseApp();
  if (!app) return { recipients: 0, sent: 0, failed: 0, configured: false };

  const result = await pool.query<{ token: string }>(
    `SELECT devices.token FROM push_devices devices
     JOIN users ON users.id = devices.user_id
     WHERE devices.enabled = TRUE AND users.push_notifications_enabled = TRUE
     ORDER BY devices.updated_at DESC`,
  );
  return sendToTokens(app, result.rows.map((row) => row.token), input);
}

export async function sendUserPushNotification(
  userId: string,
  input: {
    title: string;
    body: string;
    url?: string | undefined;
    type?: string | undefined;
  },
): Promise<void> {
  const app = firebaseApp();
  if (!app) return;

  const result = await pool.query<{ token: string }>(
    `SELECT devices.token FROM push_devices devices
     JOIN users ON users.id = devices.user_id
     WHERE devices.user_id = $1 AND devices.enabled = TRUE
       AND users.push_notifications_enabled = TRUE
     ORDER BY devices.updated_at DESC`,
    [userId],
  );
  await sendToTokens(app, result.rows.map((row) => row.token), input);
}

export async function schedulePushNotification(input: {
  userId: string;
  title: string;
  body: string;
  url: string;
  type: string;
  dedupeKey: string;
  scheduledFor: Date;
}): Promise<void> {
  await pool.query(
    `INSERT INTO push_jobs
       (id, user_id, title, body, url, type, dedupe_key, scheduled_for)
     SELECT $1, users.id, $3, $4, $5, $6, $7, $8
     FROM users
     WHERE users.id = $2 AND users.push_notifications_enabled = TRUE
     ON CONFLICT (dedupe_key) DO UPDATE
       SET title = EXCLUDED.title,
           body = EXCLUDED.body,
           url = EXCLUDED.url,
           type = EXCLUDED.type,
           scheduled_for = EXCLUDED.scheduled_for,
           status = 'pending',
           attempts = 0,
           last_error = NULL,
               updated_at = NOW()
             WHERE push_jobs.status IN ('pending', 'cancelled')`,
    [
      randomUUID(),
      input.userId,
      input.title,
      input.body,
      input.url,
      input.type,
      input.dedupeKey,
      input.scheduledFor,
    ],
  );
}

export async function cancelPushNotification(dedupeKey: string): Promise<void> {
  await pool.query(
    `UPDATE push_jobs SET status = 'cancelled', updated_at = NOW()
     WHERE dedupe_key = $1 AND status IN ('pending', 'processing')`,
    [dedupeKey],
  );
}

export async function cancelUserPushNotifications(userId: string): Promise<void> {
  await pool.query(
    `UPDATE push_jobs SET status = 'cancelled', updated_at = NOW()
     WHERE user_id = $1 AND status IN ('pending', 'processing')`,
    [userId],
  );
}

async function claimDuePushJobs(limit = 20): Promise<PushJob[]> {
  await pool.query(
    `UPDATE push_jobs SET status = 'pending', updated_at = NOW()
     WHERE status = 'processing' AND updated_at < NOW() - INTERVAL '15 minutes'`,
  );
  const result = await pool.query<PushJob>(
    `WITH due AS (
       SELECT id FROM push_jobs
       WHERE status = 'pending' AND scheduled_for <= NOW()
       ORDER BY scheduled_for, created_at
       FOR UPDATE SKIP LOCKED
       LIMIT $1
     )
     UPDATE push_jobs jobs
     SET status = 'processing', attempts = jobs.attempts + 1, updated_at = NOW()
     FROM due WHERE jobs.id = due.id
     RETURNING jobs.id, jobs.user_id AS "userId", jobs.title, jobs.body,
       jobs.url, jobs.type, jobs.attempts`,
    [Math.min(Math.max(limit, 1), 100)],
  );
  return result.rows;
}

async function finishPushJob(
  id: string,
  attempts: number,
  error?: unknown,
): Promise<void> {
  const retry = error !== undefined && attempts < 4;
  const status = error === undefined ? "sent" : retry ? "pending" : "failed";
  await pool.query(
    `UPDATE push_jobs
     SET status = $2,
         scheduled_for = CASE WHEN $2 = 'pending'
           THEN NOW() + ($3 * INTERVAL '1 minute') ELSE scheduled_for END,
         last_error = $4,
         updated_at = NOW()
     WHERE id = $1`,
    [id, status, Math.min(60, 2 ** Math.max(attempts, 1)),
      error instanceof Error ? error.message.slice(0, 1000) : error ? String(error).slice(0, 1000) : null],
  );
}

export async function processPushQueue(limit = 20): Promise<void> {
  if (!firebaseApp()) return;
  const jobs = await claimDuePushJobs(limit);
  for (const job of jobs) {
    try {
      await sendUserPushNotification(job.userId, {
        title: job.title,
        body: job.body,
        url: job.url ?? undefined,
        type: job.type,
      });
      await finishPushJob(job.id, job.attempts);
    } catch (error) {
      await finishPushJob(job.id, job.attempts, error);
    }
  }
}

export function startPushWorker(log?: {
  error: (error: unknown, message: string) => void;
}): () => void {
  if (workerTimer || process.env["NODE_ENV"] === "test") return () => undefined;
  const run = () => {
    void processPushQueue().catch((error: unknown) =>
      log?.error(error, "Could not process push notification queue"),
    );
  };
  workerTimer = setInterval(run, 60_000);
  workerTimer.unref();
  run();
  return () => {
    if (workerTimer) clearInterval(workerTimer);
    workerTimer = null;
  };
}

async function sendToTokens(
  app: App,
  tokens: string[],
  input: {
    title: string;
    body: string;
    url?: string | undefined;
    type?: string | undefined;
  },
): Promise<{ recipients: number; sent: number; failed: number; configured: true }> {
  let sent = 0;
  let failed = 0;
  const invalidTokens: string[] = [];

  for (let index = 0; index < tokens.length; index += 500) {
    const batch = tokens.slice(index, index + 500);
    const response = await getMessaging(app).sendEachForMulticast({
      tokens: batch,
      notification: { title: input.title, body: input.body },
      data:
        input.url || input.type
          ? {
              ...(input.url ? { url: input.url } : {}),
              ...(input.type ? { type: input.type } : {}),
            }
          : undefined,
      android: {
        priority: "high",
        notification: { channelId: "quitech_updates" },
      },
    });
    sent += response.successCount;
    failed += response.failureCount;
    response.responses.forEach((item, responseIndex) => {
      const code = item.error?.code;
      if (
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token"
      ) {
        invalidTokens.push(batch[responseIndex]!);
      }
    });
  }

  if (invalidTokens.length) {
    await pool.query("DELETE FROM push_devices WHERE token = ANY($1::text[])", [
      invalidTokens,
    ]);
  }
  return { recipients: tokens.length, sent, failed, configured: true };
}
