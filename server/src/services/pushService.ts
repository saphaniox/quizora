import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { pool } from "../db.js";

type ServiceAccountConfig = {
  project_id: string;
  client_email: string;
  private_key: string;
};

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
}): Promise<{
  recipients: number;
  sent: number;
  failed: number;
  configured: boolean;
}> {
  const app = firebaseApp();
  if (!app) return { recipients: 0, sent: 0, failed: 0, configured: false };

  const result = await pool.query<{ token: string }>(
    "SELECT token FROM push_devices WHERE enabled = TRUE ORDER BY updated_at DESC",
  );
  const tokens = result.rows.map((row) => row.token);
  let sent = 0;
  let failed = 0;
  const invalidTokens: string[] = [];

  for (let index = 0; index < tokens.length; index += 500) {
    const batch = tokens.slice(index, index + 500);
    const response = await getMessaging(app).sendEachForMulticast({
      tokens: batch,
      notification: { title: input.title, body: input.body },
      data: input.url ? { url: input.url } : undefined,
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
