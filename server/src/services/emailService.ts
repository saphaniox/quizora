import nodemailer, { type Transporter } from "nodemailer";
import type { FastifyBaseLogger } from "fastify";
import { appUrl } from "../email/layout.js";
import { buildEmailTemplate } from "../email/templates.js";
import type { EmailTemplateData, EmailTemplateName } from "../email/types.js";
import * as emailProviderModel from "../models/emailProviderModel.js";
import * as emailModel from "../models/emailNotificationModel.js";

const EMAIL_TIMEOUT_MS = 15_000;
const WORKER_INTERVAL_MS = 30_000;
const SCHEDULER_INTERVAL_MS = 60 * 60 * 1000;
let cachedTransporter: Transporter | undefined;
let workerTimer: NodeJS.Timeout | null = null;
let lastSchedulerRun = 0;
let emailLogger: FastifyBaseLogger | undefined;

function errorDetails(error: unknown): Record<string, string | number> {
  if (!(error instanceof Error)) {
    return { errorMessage: String(error).slice(0, 300) };
  }
  const details: Record<string, string | number> = {
    errorName: error.name,
    errorMessage: error.message.slice(0, 300),
  };
  const smtpError = error as Error & {
    code?: unknown;
    responseCode?: unknown;
    command?: unknown;
  };
  if (typeof smtpError.code === "string") details.errorCode = smtpError.code;
  if (typeof smtpError.responseCode === "number") {
    details.responseCode = smtpError.responseCode;
  }
  if (typeof smtpError.command === "string") details.smtpCommand = smtpError.command;
  return details;
}

function logEmailFailure(
  error: unknown,
  context: Record<string, string | number>,
  message: string,
): void {
  emailLogger?.error({ event: "email.failed", ...context, ...errorDetails(error) }, message);
}

function mailer(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env["SMTP_HOST"]?.trim();
  const user = process.env["SMTP_USER"]?.trim();
  const pass = process.env["SMTP_PASS"]?.trim();
  if (!host || !user || !pass) return null;
  const port = Number(process.env["SMTP_PORT"] ?? 587);
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env["SMTP_SECURE"] === "true" || port === 465,
    tls: {
      rejectUnauthorized:
        process.env["SMTP_TLS_REJECT_UNAUTHORIZED"]?.trim().toLowerCase() !== "false",
    },
    auth: { user, pass },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
  });
  return cachedTransporter;
}

export function getSmtpFromAddress(): string {
  const user = process.env["SMTP_USER"]?.trim() || "quitechug@gmail.com";
  const host = process.env["SMTP_HOST"]?.trim().toLowerCase();

  if (host === "smtp.gmail.com") return `Quitech <${user}>`;
  return process.env["SMTP_FROM"]?.trim() || `Quitech <${user}>`;
}

export function isEmailConfigured(): boolean {
  return Boolean(mailer() || (process.env["RESEND_API_KEY"]?.trim() && process.env["RESEND_FROM"]?.trim()));
}

export interface EmailTransportStatus {
  provider: emailProviderModel.EmailProvider;
  configured: boolean;
  verified: boolean | null;
  from: string | null;
  host: string | null;
  port: number | null;
  secure: boolean;
  tlsRejectUnauthorized: boolean;
  senderConfigured: boolean;
  replyToConfigured: boolean;
  missingVariables: string[];
  error: string | null;
}

function resendFromAddress(): string {
  return process.env["RESEND_FROM"]?.trim() ?? "";
}

function resendFromDomain(from: string): string | null {
  const address = from.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/)?.[1] ?? from;
  const domain = address.trim().match(/^[^@\s]+@([^@\s]+)$/)?.[1];
  return domain?.toLowerCase() ?? null;
}

export async function verifyEmailTransport(
  provider: emailProviderModel.EmailProvider = "smtp",
): Promise<EmailTransportStatus> {
  if (provider === "resend") {
    const apiKey = process.env["RESEND_API_KEY"]?.trim();
    const from = resendFromAddress();
    const domain = resendFromDomain(from);
    const missingVariables = [
      !apiKey ? "RESEND_API_KEY" : null,
      !from ? "RESEND_FROM" : null,
      from && !domain ? "RESEND_FROM (must contain a valid email address)" : null,
    ].filter((key): key is string => key !== null);
    const base = {
      provider,
      configured: missingVariables.length === 0,
      verified: null as boolean | null,
      from: from || null,
      host: null,
      port: null,
      secure: false,
      tlsRejectUnauthorized: true,
      senderConfigured: Boolean(from),
      replyToConfigured: Boolean(process.env["SUPPORT_EMAIL"]?.trim()),
      missingVariables,
      error: null as string | null,
    };
    if (missingVariables.length > 0 || !apiKey || !domain) return base;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);
      let response: Response;
      try {
        response = await fetch("https://api.resend.com/domains", {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      const body = (await response.json().catch(() => ({}))) as {
        data?: Array<{ name?: string; status?: string }>;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(body.message || `Resend domain check failed (${response.status}).`);
      }
      const senderDomain = body.data?.find(
        (item) => item.name?.toLowerCase() === domain,
      );
      if (!senderDomain) {
        return {
          ...base,
          verified: false,
          error: `The sender domain ${domain} is not registered in Resend.`,
        };
      }
      const verified = senderDomain.status === "verified";
      return {
        ...base,
        verified,
        error: verified ? null : `The sender domain ${domain} is not verified in Resend.`,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Resend verification failed.";
      emailLogger?.error(
        { event: "email.resend_verification_failed", ...errorDetails(error) },
        "Admin Resend verification failed",
      );
      return {
        ...base,
        verified: false,
        error: message.replace(/[\r\n]+/g, " ").slice(0, 300),
      };
    }
  }

  const host = process.env["SMTP_HOST"]?.trim() || null;
  const user = process.env["SMTP_USER"]?.trim();
  const pass = process.env["SMTP_PASS"]?.trim();
  const senderConfigured = Boolean(process.env["SMTP_FROM"]?.trim() || user);
  const replyToConfigured = Boolean(process.env["SUPPORT_EMAIL"]?.trim() || user);
  const rawPort = process.env["SMTP_PORT"] ?? "587";
  const parsedPort = Number(rawPort);
  const port =
    Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
      ? parsedPort
      : null;
  const secure = process.env["SMTP_SECURE"] === "true" || port === 465;
  const tlsRejectUnauthorized =
    process.env["SMTP_TLS_REJECT_UNAUTHORIZED"]?.trim().toLowerCase() !== "false";
  const missingVariables = [
    !host ? "SMTP_HOST" : null,
    !user ? "SMTP_USER" : null,
    !pass ? "SMTP_PASS" : null,
    !port ? "SMTP_PORT (must be a valid port)" : null,
  ].filter((value): value is string => value !== null);

  if (missingVariables.length) {
    return {
      provider,
      configured: false,
      verified: null,
      from: process.env["SMTP_FROM"]?.trim() || process.env["SMTP_USER"]?.trim() || null,
      host,
      port,
      secure,
      tlsRejectUnauthorized,
      senderConfigured,
      replyToConfigured,
      missingVariables,
      error: "Complete the listed SMTP settings and restart the API.",
    };
  }

  try {
    const transport = mailer();
    if (!transport) {
      return {
        provider,
        configured: false,
        verified: false,
        from: process.env["SMTP_FROM"]?.trim() || process.env["SMTP_USER"]?.trim() || null,
        host,
        port,
        secure,
        tlsRejectUnauthorized,
        senderConfigured,
        replyToConfigured,
        missingVariables: [],
        error: "SMTP transport could not be initialized.",
      };
    }
    await transport.verify();
    return {
      provider,
      configured: true,
      verified: true,
      from: process.env["SMTP_FROM"]?.trim() || process.env["SMTP_USER"]?.trim() || null,
      host,
      port,
      secure,
      tlsRejectUnauthorized,
      senderConfigured,
      replyToConfigured,
      missingVariables: [],
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "SMTP connection verification failed.";
    emailLogger?.error(
      { event: "email.smtp_verification_failed", ...errorDetails(error) },
      "Admin SMTP verification failed",
    );
    return {
      provider,
      configured: true,
      verified: false,
      from: process.env["SMTP_FROM"]?.trim() || process.env["SMTP_USER"]?.trim() || null,
      host,
      port,
      secure,
      tlsRejectUnauthorized,
      senderConfigured,
      replyToConfigured,
      missingVariables: [],
      error: message.replace(/[\r\n]+/g, " ").slice(0, 300),
    };
  }
}

export async function sendWithResend(input: {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
}): Promise<string> {
  const apiKey = process.env["RESEND_API_KEY"]?.trim();
  if (!apiKey || !input.from) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM.");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
        ...(input.headers ? { headers: input.headers } : {}),
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    name?: string;
  };
  if (!response.ok || !body.id) {
    throw new Error(body.message || `Resend rejected the email (${response.status}).`);
  }
  return body.id;
}

function preferenceUrl(token: string): string {
  return appUrl(`/email-preferences?token=${encodeURIComponent(token)}`);
}

async function safelyRecordDelivery(
  input: Parameters<typeof emailModel.recordEmailDelivery>[0],
): Promise<void> {
  try {
    await emailModel.recordEmailDelivery(input);
  } catch {
    emailLogger?.error(
      { event: "email.delivery_log_failed", template: input.template, status: input.status },
      "Could not record email delivery",
    );
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
      emailLogger?.info(
        {
          event: "email.skipped",
          template: input.template,
          category: preview.category,
          reason: "disabled_by_user_preference",
        },
        "Email skipped by user preference",
      );
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
  const provider = await emailProviderModel.getEmailProvider();
  const transport = provider === "smtp" ? mailer() : null;
  const resendReady = Boolean(
    process.env["RESEND_API_KEY"]?.trim() && resendFromAddress(),
  );
  if ((provider === "smtp" && !transport) || (provider === "resend" && !resendReady)) {
    const missingVariables =
      provider === "smtp"
        ? ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"].filter(
            (key) => !process.env[key]?.trim(),
          )
        : ["RESEND_API_KEY", "RESEND_FROM"].filter((key) => !process.env[key]?.trim());
    const error = new Error(`${provider === "smtp" ? "SMTP" : "Resend"} is not configured`);
    logEmailFailure(
      error,
      {
        template: input.template,
        category: rendered.category,
        provider,
        missingVariables: missingVariables.join(","),
      },
      `Email delivery failed because ${provider} is not configured`,
    );
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
    const replyTo =
      process.env["SUPPORT_EMAIL"]?.trim() ||
      process.env["SMTP_USER"]?.trim() ||
      "quitechug@gmail.com";
    const messageId =
      provider === "resend"
        ? await sendWithResend({
            from: resendFromAddress(),
            replyTo,
            to: recipient,
            subject: rendered.subject,
            text: rendered.text,
            html: rendered.html,
            headers: rendered.headers,
          })
        : (
            await transport!.sendMail({
              from: getSmtpFromAddress(),
              replyTo,
              to: recipient,
              subject: rendered.subject,
              text: rendered.text,
              html: rendered.html,
              headers: rendered.headers,
            })
          ).messageId;
    await safelyRecordDelivery({
      userId: input.userId,
      recipient,
      template: input.template,
      category: rendered.category,
      status: "sent",
      providerMessageId: messageId,
    });
    emailLogger?.info(
      {
        event: "email.sent",
        template: input.template,
        category: rendered.category,
        provider,
        messageId,
      },
      `Email accepted by ${provider} provider`,
    );
    return { sent: true, skipped: false, messageId };
  } catch (error) {
    logEmailFailure(
      error,
      { template: input.template, category: rendered.category, provider },
      `${provider} provider rejected or failed to send email`,
    );
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
  const queued = await emailModel.enqueueEmailJob({
    userId: input.userId,
    recipient: input.to,
    template: input.template,
    category: rendered.category,
    payload: input.data,
    dedupeKey: input.dedupeKey,
    scheduledFor: input.scheduledFor,
  });
  emailLogger?.info(
    {
      event: queued ? "email.queued" : "email.queue_skipped",
      template: input.template,
      category: rendered.category,
      reason: queued ? undefined : "duplicate_or_already_processed",
    },
    queued ? "Email queued" : "Email was not queued",
  );
  return queued;
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
  emailLogger?.info(
    {
      event: "email.campaign_queued",
      template: input.template,
      category: rendered.category,
      recipientCount: recipients.length,
    },
    "Email campaign queued",
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
      else {
        emailLogger?.info(
          {
            event: "email.queue_job_skipped",
            jobId: job.id,
            template: job.template,
            reason: "disabled_by_user_preference",
          },
          "Queued email skipped",
        );
      }
    } catch (error) {
      failed += 1;
      await emailModel.finishEmailJob(job.id, false, job.attempts, error);
      logEmailFailure(
        error,
        {
          jobId: job.id,
          template: job.template,
          attempt: job.attempts,
          finalAttempt: job.attempts >= 4 ? 1 : 0,
        },
        "Queued email delivery failed",
      );
    }
  }
  if (jobs.length > 0) {
    emailLogger?.info(
      { event: "email.queue_batch_completed", processed: jobs.length, sent, failed },
      "Email queue batch completed",
    );
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

export function startEmailWorker(log?: FastifyBaseLogger): () => void {
  if (workerTimer || process.env["NODE_ENV"] === "test") return () => undefined;
  emailLogger = log;
  if (!isEmailConfigured()) {
    emailLogger?.error(
      { event: "email.smtp_unconfigured" },
      "Email worker started without SMTP configuration; queued messages will remain pending",
    );
  }
  const run = () => {
    void (async () => {
      if (Date.now() - lastSchedulerRun >= SCHEDULER_INTERVAL_MS) {
        lastSchedulerRun = Date.now();
        await scheduleLifecycleEmails();
      }
      await processEmailQueue();
    })().catch((error) => {
      emailLogger?.error({ event: "email.worker_failed", ...errorDetails(error) }, "Email queue processing failed");
    });
  };
  workerTimer = setInterval(run, WORKER_INTERVAL_MS);
  workerTimer.unref();
  run();
  emailLogger?.info(
    { event: "email.worker_started", smtpConfigured: isEmailConfigured() },
    "Quitech email queue worker started",
  );
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
