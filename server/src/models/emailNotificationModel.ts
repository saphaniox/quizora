import { randomBytes, randomUUID } from "node:crypto";
import { pool } from "../db.js";
import type {
  EmailCategory,
  EmailTemplateData,
  EmailTemplateName,
} from "../email/types.js";

export interface EmailPreferences {
  learningUpdates: boolean;
  reminders: boolean;
  productUpdates: boolean;
}

type PreferenceRow = {
  user_id: string;
  learning_updates: boolean;
  reminders: boolean;
  product_updates: boolean;
  unsubscribe_token: string;
};

export interface QueuedEmailJob {
  id: string;
  userId: string | null;
  recipient: string;
  template: EmailTemplateName;
  category: EmailCategory;
  payload: EmailTemplateData;
  attempts: number;
}

function preferencesFromRow(row: PreferenceRow): EmailPreferences {
  return {
    learningUpdates: row.learning_updates,
    reminders: row.reminders,
    productUpdates: row.product_updates,
  };
}

export async function ensureEmailPreferences(userId: string): Promise<{
  preferences: EmailPreferences;
  unsubscribeToken: string;
}> {
  await pool.query(
    `INSERT INTO email_preferences (user_id, unsubscribe_token)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, randomBytes(24).toString("base64url")],
  );
  const result = await pool.query<PreferenceRow>(
    `SELECT user_id, learning_updates, reminders, product_updates, unsubscribe_token
     FROM email_preferences WHERE user_id = $1`,
    [userId],
  );
  const row = result.rows[0];
  if (!row) throw new Error("Could not create email preferences");
  return {
    preferences: preferencesFromRow(row),
    unsubscribeToken: row.unsubscribe_token,
  };
}

export async function updateEmailPreferences(
  userId: string,
  preferences: EmailPreferences,
): Promise<EmailPreferences> {
  await ensureEmailPreferences(userId);
  const result = await pool.query<PreferenceRow>(
    `UPDATE email_preferences
     SET learning_updates = $2, reminders = $3, product_updates = $4, updated_at = NOW()
     WHERE user_id = $1
     RETURNING user_id, learning_updates, reminders, product_updates, unsubscribe_token`,
    [
      userId,
      preferences.learningUpdates,
      preferences.reminders,
      preferences.productUpdates,
    ],
  );
  return preferencesFromRow(result.rows[0]!);
}

export async function updateEmailPreferencesByToken(
  token: string,
  preferences: EmailPreferences,
): Promise<EmailPreferences | null> {
  const result = await pool.query<PreferenceRow>(
    `UPDATE email_preferences
     SET learning_updates = $2, reminders = $3, product_updates = $4, updated_at = NOW()
     WHERE unsubscribe_token = $1
     RETURNING user_id, learning_updates, reminders, product_updates, unsubscribe_token`,
    [
      token,
      preferences.learningUpdates,
      preferences.reminders,
      preferences.productUpdates,
    ],
  );
  return result.rows[0] ? preferencesFromRow(result.rows[0]) : null;
}

export async function getEmailPreferencesByToken(
  token: string,
): Promise<EmailPreferences | null> {
  const result = await pool.query<PreferenceRow>(
    `SELECT user_id, learning_updates, reminders, product_updates, unsubscribe_token
     FROM email_preferences WHERE unsubscribe_token = $1`,
    [token],
  );
  return result.rows[0] ? preferencesFromRow(result.rows[0]) : null;
}

export function categoryEnabled(
  category: EmailCategory,
  preferences: EmailPreferences,
): boolean {
  if (category === "learning") return preferences.learningUpdates;
  if (category === "reminder") return preferences.reminders;
  if (category === "product") return preferences.productUpdates;
  return true;
}

export async function recordEmailDelivery(input: {
  userId?: string | null;
  recipient: string;
  template: EmailTemplateName;
  category: EmailCategory;
  status: "sent" | "failed" | "skipped";
  providerMessageId?: string | null;
  errorMessage?: string | null;
}): Promise<void> {
  await pool.query(
    `INSERT INTO email_delivery_log
       (id, user_id, recipient, template, category, status, provider_message_id, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      randomUUID(),
      input.userId ?? null,
      input.recipient.toLowerCase(),
      input.template,
      input.category,
      input.status,
      input.providerMessageId ?? null,
      input.errorMessage?.slice(0, 1000) ?? null,
    ],
  );
}

export async function enqueueEmailJob(input: {
  userId?: string | null;
  recipient: string;
  template: EmailTemplateName;
  category: EmailCategory;
  payload?: EmailTemplateData;
  dedupeKey?: string | null;
  scheduledFor?: Date;
}): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO email_jobs
       (id, user_id, recipient, template, category, payload, dedupe_key, scheduled_for)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
     ON CONFLICT (dedupe_key) DO UPDATE
       SET recipient = EXCLUDED.recipient,
           template = EXCLUDED.template,
           category = EXCLUDED.category,
           payload = EXCLUDED.payload,
           scheduled_for = EXCLUDED.scheduled_for,
           status = 'pending',
           attempts = 0,
           last_error = NULL,
           updated_at = NOW()
     WHERE email_jobs.status IN ('pending', 'cancelled')
     RETURNING id`,
    [
      randomUUID(),
      input.userId ?? null,
      input.recipient.toLowerCase(),
      input.template,
      input.category,
      JSON.stringify(input.payload ?? {}),
      input.dedupeKey ?? null,
      input.scheduledFor ?? new Date(),
    ],
  );
  return Boolean(result.rowCount);
}

export async function cancelEmailJob(dedupeKey: string): Promise<void> {
  await pool.query(
    `UPDATE email_jobs SET status = 'cancelled', updated_at = NOW()
     WHERE dedupe_key = $1 AND status IN ('pending', 'processing')`,
    [dedupeKey],
  );
}

export async function claimDueEmailJobs(limit = 20): Promise<QueuedEmailJob[]> {
  await pool.query(
    `UPDATE email_jobs
     SET status = 'pending', updated_at = NOW()
     WHERE status = 'processing' AND updated_at < NOW() - INTERVAL '15 minutes'`,
  );
  const result = await pool.query<QueuedEmailJob>(
    `WITH due AS (
       SELECT id FROM email_jobs
       WHERE status = 'pending' AND scheduled_for <= NOW()
       ORDER BY scheduled_for, created_at
       FOR UPDATE SKIP LOCKED
       LIMIT $1
     )
     UPDATE email_jobs jobs
     SET status = 'processing', attempts = jobs.attempts + 1, updated_at = NOW()
     FROM due
     WHERE jobs.id = due.id
     RETURNING jobs.id, jobs.user_id AS "userId", jobs.recipient, jobs.template,
       jobs.category, jobs.payload, jobs.attempts`,
    [Math.min(Math.max(limit, 1), 100)],
  );
  return result.rows;
}

export async function finishEmailJob(
  id: string,
  success: boolean,
  attempts: number,
  error?: unknown,
): Promise<void> {
  const retry = !success && attempts < 4;
  const delayMinutes = Math.min(60, 2 ** Math.max(attempts, 1));
  await pool.query(
    `UPDATE email_jobs
     SET status = $2,
         scheduled_for = CASE WHEN $2 = 'pending' THEN NOW() + ($3 * INTERVAL '1 minute') ELSE scheduled_for END,
         last_error = $4,
         updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      success ? "sent" : retry ? "pending" : "failed",
      delayMinutes,
      success
        ? null
        : String(error instanceof Error ? error.message : error).slice(0, 1000),
    ],
  );
}

export async function listEmailRecipients(
  category: EmailCategory,
): Promise<Array<{ userId: string; email: string; displayName: string }>> {
  const preferenceColumn =
    category === "learning"
      ? "learning_updates"
      : category === "reminder"
        ? "reminders"
        : category === "product"
          ? "product_updates"
          : null;
  const condition = preferenceColumn
    ? `COALESCE(preferences.${preferenceColumn}, TRUE) = TRUE`
    : "TRUE";
  const result = await pool.query<{
    userId: string;
    email: string;
    displayName: string;
  }>(
    `SELECT users.id AS "userId", users.email, users.display_name AS "displayName"
     FROM users
     LEFT JOIN email_preferences preferences ON preferences.user_id = users.id
     WHERE users.email IS NOT NULL AND ${condition}
     ORDER BY users.created_at`,
  );
  return result.rows;
}

export async function listWeeklyProgressRecipients(): Promise<
  Array<{
    userId: string;
    email: string;
    displayName: string;
    quizCount: number;
    averagePercentage: number;
    certificateCount: number;
  }>
> {
  const result = await pool.query<{
    userId: string;
    email: string;
    displayName: string;
    quizCount: string;
    averagePercentage: string;
    certificateCount: string;
  }>(
    `SELECT users.id AS "userId", users.email, users.display_name AS "displayName",
            COUNT(leaderboard.id)::text AS "quizCount",
            ROUND(AVG(leaderboard.percentage))::text AS "averagePercentage",
            (SELECT COUNT(*)::text FROM certificates
             WHERE certificates.user_id = users.id
               AND certificates.issued_at >= NOW() - INTERVAL '7 days') AS "certificateCount"
     FROM users
     JOIN leaderboard ON leaderboard.user_id = users.id
       AND leaderboard.completed_at >= NOW() - INTERVAL '7 days'
     LEFT JOIN email_preferences preferences ON preferences.user_id = users.id
     WHERE users.email IS NOT NULL
       AND COALESCE(preferences.reminders, TRUE) = TRUE
     GROUP BY users.id, users.email, users.display_name`,
  );
  return result.rows.map((row) => ({
    ...row,
    quizCount: Number(row.quizCount),
    averagePercentage: Number(row.averagePercentage),
    certificateCount: Number(row.certificateCount),
  }));
}

export async function listInactiveRecipients(): Promise<
  Array<{ userId: string; email: string; displayName: string }>
> {
  const result = await pool.query<{
    userId: string;
    email: string;
    displayName: string;
  }>(
    `SELECT users.id AS "userId", users.email, users.display_name AS "displayName"
     FROM users
     LEFT JOIN email_preferences preferences ON preferences.user_id = users.id
     WHERE users.email IS NOT NULL
       AND users.created_at < NOW() - INTERVAL '21 days'
       AND COALESCE(preferences.reminders, TRUE) = TRUE
       AND NOT EXISTS (
         SELECT 1 FROM leaderboard
         WHERE leaderboard.user_id = users.id
           AND leaderboard.completed_at >= NOW() - INTERVAL '21 days'
       )`,
  );
  return result.rows;
}
