import nodemailer, { type Transporter } from "nodemailer";
import { appUrl } from "../email/layout.js";
import { buildEmailTemplate } from "../email/templates.js";
import type { EmailTemplateData, EmailTemplateName } from "../email/types.js";
import * as emailModel from "../models/emailNotificationModel.js";

const EMAIL_TIMEOUT_MS = 15_000;
const WORKER_INTERVAL_MS = 30_000;
const SCHEDULER_INTERVAL_MS = 60 * 60 * 1000;
let cachedTransporter: Transporter | null | undefined;
let workerTimer: NodeJS.Timeout | null = null;
let lastSchedulerRun = 0;

function mailer(): Transporter | null {
  if (cachedTransporter !== undefined) return cachedTransporter;
  const host = process.env["SMTP_HOST"]?.trim();
  const user = process.env["SMTP_USER"]?.trim();
  const pass = process.env["SMTP_PASS"]?.trim();
  if (!host || !user || !pass) {
    cachedTransporter = null;
    return null;
  }
  const port = Number(process.env["SMTP_PORT"] ?? 587);
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env["SMTP_SECURE"] === "true" || port === 465,
    auth: { user, pass },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
  });
  return cachedTransporter;
}

export function isEmailConfigured(): boolean {
  return Boolean(mailer());
}

function preferenceUrl(token: string): string {
  return appUrl(`/email-preferences?token=${encodeURIComponent(token)}`);
}

async function safelyRecordDelivery(
  input: Parameters<typeof emailModel.recordEmailDelivery>[0],
): Promise<void> {
  try {
    await emailModel.recordEmailDelivery(input);
  } catch (error) {
    console.warn("Could not record email delivery", error);
  }
}

export async function sendTemplateEmail(input: {
  to: string;
  userId?: string | null;
  template: EmailTemplateName;
  data?: EmailTemplateData;
  ignorePreferences?: boolean;
}): Promise<{ sent: boolean; skipped: boolean; messageId?: string }> {
  const recipient = input.to.trim().toLowerCase();
  let managePreferencesUrl: string | undefined;
  const preview = buildEmailTemplate(input.template, input.data);

  if (input.userId) {
    const stored = await emailModel.ensureEmailPreferences(input.userId);
    managePreferencesUrl = preferenceUrl(stored.unsubscribeToken);
    if (
      !input.ignorePreferences &&
      !emailModel.categoryEnabled(preview.category, stored.preferences)
    ) {
      await safelyRecordDelivery({
        userId: input.userId,
        recipient,
        template: input.template,
        category: preview.category,
        status: "skipped",
        errorMessage: "Disabled by user preference",
      });
      return { sent: false, skipped: true };
    }
  }

  const rendered = buildEmailTemplate(
    input.template,
    input.data,
    managePreferencesUrl,
  );
  const transport = mailer();
  if (!transport) {
    const error = new Error("SMTP is not configured");
    await safelyRecordDelivery({
      userId: input.userId,
      recipient,
      template: input.template,
      category: rendered.category,
      status: "failed",
      errorMessage: error.message,
    });
    throw error;
  }

  try {
    const info = await transport.sendMail({
      from: process.env["SMTP_FROM"] ?? "Quitech <quitech@saptechug.com>",
      replyTo: process.env["SUPPORT_EMAIL"] ?? "quitech@saptechug.com",
      to: recipient,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      headers: rendered.headers,
    });
    await safelyRecordDelivery({
      userId: input.userId,
      recipient,
      template: input.template,
      category: rendered.category,
      status: "sent",
      providerMessageId: info.messageId,
    });
    return { sent: true, skipped: false, messageId: info.messageId };
  } catch (error) {
    await safelyRecordDelivery({
      userId: input.userId,
      recipient,
      template: input.template,
      category: rendered.category,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function queueTemplateEmail(input: {
  to: string;
  userId?: string | null;
  template: EmailTemplateName;
  data?: EmailTemplateData;
  dedupeKey?: string | null;
  scheduledFor?: Date;
}): Promise<boolean> {
  const rendered = buildEmailTemplate(input.template, input.data);
  return emailModel.enqueueEmailJob({
    userId: input.userId,
    recipient: input.to,
    template: input.template,
    category: rendered.category,
    payload: input.data,
    dedupeKey: input.dedupeKey,
    scheduledFor: input.scheduledFor,
  });
}

export async function queueBulkTemplateEmail(input: {
  template: EmailTemplateName;
  data: EmailTemplateData;
}): Promise<number> {
  const rendered = buildEmailTemplate(input.template, input.data);
  const recipients = await emailModel.listEmailRecipients(rendered.category);
  const campaignId = String(input.data["campaignId"] ?? Date.now());
  await Promise.all(
    recipients.map((recipient) =>
      queueTemplateEmail({
        to: recipient.email,
        userId: recipient.userId,
        template: input.template,
        data: { ...input.data, displayName: recipient.displayName },
        dedupeKey: `${input.template}:${recipient.userId}:${campaignId}`,
      }),
    ),
  );
  return recipients.length;
}

export async function processEmailQueue(limit = 20): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  if (!isEmailConfigured()) return { processed: 0, sent: 0, failed: 0 };
  const jobs = await emailModel.claimDueEmailJobs(limit);
  let sent = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      const result = await sendTemplateEmail({
        to: job.recipient,
        userId: job.userId,
        template: job.template,
        data: job.payload,
      });
      await emailModel.finishEmailJob(job.id, true, job.attempts);
      if (result.sent) sent += 1;
    } catch (error) {
      failed += 1;
      await emailModel.finishEmailJob(job.id, false, job.attempts, error);
    }
  }
  return { processed: jobs.length, sent, failed };
}

async function scheduleLifecycleEmails(): Promise<void> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
  const weekKey = weekStart.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);
  const weeklyRecipients = await emailModel.listWeeklyProgressRecipients();
  await Promise.all(
    weeklyRecipients.map((recipient) =>
      queueTemplateEmail({
        to: recipient.email,
        userId: recipient.userId,
        template: "weeklyProgress",
        data: {
          displayName: recipient.displayName,
          quizCount: recipient.quizCount,
          averagePercentage: recipient.averagePercentage,
          certificateCount: recipient.certificateCount,
        },
        dedupeKey: `weekly-progress:${recipient.userId}:${weekKey}`,
      }),
    ),
  );

  const inactiveRecipients = await emailModel.listInactiveRecipients();
  await Promise.all(
    inactiveRecipients.map((recipient) =>
      queueTemplateEmail({
        to: recipient.email,
        userId: recipient.userId,
        template: "inactivityReminder",
        data: { displayName: recipient.displayName, actionUrl: appUrl("/") },
        dedupeKey: `inactivity:${recipient.userId}:${monthKey}`,
      }),
    ),
  );
}

export function startEmailWorker(log?: {
  info: (message: string) => void;
  error: (error: unknown, message: string) => void;
}): () => void {
  if (workerTimer || process.env["NODE_ENV"] === "test") return () => undefined;
  const run = () => {
    void (async () => {
      if (Date.now() - lastSchedulerRun >= SCHEDULER_INTERVAL_MS) {
        lastSchedulerRun = Date.now();
        await scheduleLifecycleEmails();
      }
      await processEmailQueue();
    })().catch((error) => log?.error(error, "Email queue processing failed"));
  };
  workerTimer = setInterval(run, WORKER_INTERVAL_MS);
  workerTimer.unref();
  run();
  log?.info("Quitech email queue worker started");
  return () => {
    if (workerTimer) clearInterval(workerTimer);
    workerTimer = null;
  };
}

export function sendPasswordResetEmail(
  email: string,
  token: string,
  displayName?: string,
  userId?: string,
) {
  const resetUrl = appUrl(
    `/forgot-password?token=${encodeURIComponent(token)}`,
  );
  return sendTemplateEmail({
    to: email,
    userId,
    template: "passwordReset",
    data: { displayName, resetUrl },
    ignorePreferences: true,
  });
}
