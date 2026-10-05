import { pool } from "../db.js";

export type EmailProvider = "smtp" | "resend";

export async function getEmailProvider(): Promise<EmailProvider> {
  const result = await pool.query<{ provider: EmailProvider }>(
    "SELECT provider FROM email_provider_settings WHERE id = 1",
  );
  const provider = result.rows[0]?.provider;
  if (provider !== "smtp" && provider !== "resend") {
    throw new Error("Email provider settings are missing; run database migrations.");
  }
  return provider;
}

export async function setEmailProvider(
  provider: EmailProvider,
  updatedBy: string,
): Promise<EmailProvider> {
  const result = await pool.query<{ provider: EmailProvider }>(
    `INSERT INTO email_provider_settings (id, provider, updated_by, updated_at)
     VALUES (1, $1, $2, NOW())
     ON CONFLICT (id) DO UPDATE
       SET provider = EXCLUDED.provider,
           updated_by = EXCLUDED.updated_by,
           updated_at = NOW()
     RETURNING provider`,
    [provider, updatedBy],
  );
  const saved = result.rows[0]?.provider;
  if (saved !== provider) throw new Error("Could not save the email provider.");
  return saved;
}
