import os from "node:os";
import { statfs } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import * as certificateModel from "../models/certificateModel.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as progressModel from "../models/progressModel.js";
import * as quizModel from "../models/quizModel.js";
import * as auth from "../services/authService.js";
import type { User } from "../services/authService.js";
import * as adminDataModel from "../models/adminDataModel.js";
import * as appUpdateModel from "../models/appUpdateModel.js";
import * as adminAnalyticsModel from "../models/adminAnalyticsModel.js";
import * as adminAuditModel from "../models/adminAuditModel.js";
import * as emailProviderModel from "../models/emailProviderModel.js";
import { getRuntimeMetrics } from "../runtimeMetrics.js";
import {
  clearSessionCookie,
  readSessionToken,
  setSessionCookie,
} from "../sessionCookie.js";
import { pool } from "../db.js";
import {
  queueBulkTemplateEmail,
  queueTemplateEmail,
  sendTemplateEmail,
  sendPasswordResetEmail,
  verifyEmailTransport,
} from "../services/emailService.js";
import { sendPushNotification, verifyFirebaseAdmin } from "../services/pushService.js";
import {
  cancelPushNotification,
  cancelUserPushNotifications,
  schedulePushNotification,
} from "../services/pushService.js";
import * as emailNotificationModel from "../models/emailNotificationModel.js";
import { appUrl } from "../email/layout.js";

const optionalEmail = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().email().max(254).optional(),
);
const optionalPhone = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/)
    .optional(),
);

const registerCredentials = z
  .object({
    email: optionalEmail,
    phoneE164: optionalPhone,
    password: z.string().min(8).max(200),
    displayName: z.string().trim().min(1).max(80),
  })
  .refine((value) => value.email || value.phoneE164, {
    message: "Email or phone number is required",
    path: ["email"],
  });

const loginCredentials = z.object({
  identifier: z.string().trim().min(3).max(254).optional(),
  email: z.string().trim().min(3).max(254).optional(),
  password: z.string().min(8).max(200),
});

const googleCredentials = z.object({
  credential: z.string().min(100).max(10_000),
});
const emailSchema = z.object({ email: z.string().trim().email().max(254) });
const resetPasswordSchema = z.object({
  token: z.string().min(32).max(200),
  password: z.string().min(8).max(200),
});
const pushDeviceSchema = z.object({
  token: z.string().min(20).max(4096),
  platform: z.enum(["android", "ios", "web"]),
});
const pushPreferenceSchema = z.object({ enabled: z.boolean() });
const pushNotificationSchema = z.object({
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(2).max(240),
  url: z.string().trim().max(500).optional().or(z.literal("")),
});

const progressSchema = z.object({
  mode: z.union([z.literal("full"), z.number().int().min(1).max(500)]),
  seed: z.string().max(80),
  answers: z
    .record(z.string().max(120), z.number().int().min(0).max(20))
    .refine(
      (answers) => Object.keys(answers).length <= 500,
      "Too many answers",
    ),
  flagged: z.array(z.string().max(120)).max(500),
  currentIndex: z.number().int().min(0).max(500),
  elapsedSeconds: z
    .number()
    .int()
    .min(0)
    .max(60 * 60 * 12),
  deviceLabel: z.string().trim().max(80).nullable().optional(),
});

const catalogueDraftSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(500),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  published: z.boolean(),
});

const appUpdateSettingsSchema = z.object({
  enabled: z.boolean(),
  minimumVersion: z.string().trim().min(1).max(32),
  latestVersion: z.string().trim().min(1).max(32),
  required: z.boolean(),
  storeUrl: z.string().trim().max(500).nullable().optional().or(z.literal("")),
  message: z.string().trim().min(1).max(500),
});

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
});

const adminUserUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z.string().min(8).max(200),
});

const adminRoleSchema = z.object({ role: z.enum(["user", "admin"]) });
const emailPreferencesSchema = z.object({
  learningUpdates: z.boolean(),
  reminders: z.boolean(),
  productUpdates: z.boolean(),
});
const publicEmailPreferencesSchema = emailPreferencesSchema.extend({
  token: z.string().min(20).max(200),
});
const secureEmailActionUrl = z
  .string()
  .trim()
  .url()
  .max(500)
  .refine((url) => url.startsWith("https://"), "Use a secure HTTPS link");
const adminEmailSchema = z.object({
  template: z.enum([
    "adminMessage",
    "appUpdate",
    "newContent",
    "maintenanceNotice",
    "securityNotice",
    "privacyTermsUpdate",
  ]),
  subject: z.string().trim().min(3).max(160),
  title: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
  actionLabel: z.string().trim().max(60).optional().or(z.literal("")),
  actionUrl: secureEmailActionUrl.optional().or(z.literal("")),
});
const emailProviderSchema = z.object({
  provider: z.enum(["smtp", "resend"]),
});

async function requireUser(
  request: FastifyRequest,
  reply: FastifyReply,
  message: string,
): Promise<User | null> {
  const user = await auth.getUser(readSessionToken(request));
  if (!user) {
    reply.code(401).send({ error: message });
    return null;
  }
  return user;
}

async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<User | null> {
  const user = await requireUser(request, reply, "Sign in as an admin");
  if (!user) return null;
  if (user.role !== "admin") {
    reply.code(403).send({ error: "Admin access required" });
    return null;
  }
  return user;
}

function roundMetric(value: number): number {
  return Math.round(value * 100) / 100;
}

async function processCpuPercent(): Promise<number> {
  const startedAt = performance.now();
  const startedUsage = process.cpuUsage();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const elapsedMilliseconds = performance.now() - startedAt;
  const usage = process.cpuUsage(startedUsage);
  const cpuMilliseconds = (usage.user + usage.system) / 1000;
  return roundMetric(
    (cpuMilliseconds / (elapsedMilliseconds * Math.max(os.cpus().length, 1))) *
      100,
  );
}

async function diskMetrics(): Promise<{
  totalBytes: number;
  freeBytes: number;
} | null> {
  try {
    const stats = await statfs(process.cwd());
    return {
      totalBytes: Number(stats.blocks) * Number(stats.bsize),
      freeBytes: Number(stats.bavail) * Number(stats.bsize),
    };
  } catch {
    return null;
  }
}

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = registerCredentials.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({
      error: "Email or phone, password, and display name are required",
    });
    return;
  }
  try {
    const result = await auth.register(
      { email: parsed.data.email, phoneE164: parsed.data.phoneE164 },
      parsed.data.password,
      parsed.data.displayName,
    );
    setSessionCookie(reply, result.token);
    if (result.user.email) {
      void queueTemplateEmail({
        to: result.user.email,
        userId: result.user.id,
        template: "welcome",
        data: { displayName: result.user.displayName },
        dedupeKey: `welcome:${result.user.id}`,
      }).catch((error) =>
        request.log.error(error, "Could not queue welcome email"),
      );
    }
    reply.code(201).send({ user: result.user, token: result.token });
  } catch (error) {
    if ((error as { code?: string }).code === "23505")
      reply
        .code(409)
        .send({ error: "Email or phone number is already registered" });
    else throw error;
  }
}

export async function login(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = loginCredentials.safeParse(request.body);
  const identifier = parsed.success
    ? (parsed.data.identifier ?? parsed.data.email)?.trim()
    : "";
  if (!parsed.success || !identifier) {
    reply.code(400).send({ error: "Invalid email/phone or password" });
    return;
  }
  const result = await auth.login(identifier, parsed.data.password);
  if (!result) {
    reply.code(401).send({ error: "Invalid email/phone or password" });
    return;
  }
  setSessionCookie(reply, result.token);
  reply.send({ user: result.user, token: result.token });
}

export async function googleLogin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = googleCredentials.safeParse(request.body);
  const audiences =
    process.env["GOOGLE_CLIENT_IDS"]
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];
  if (!parsed.success || audiences.length === 0) {
    reply.code(audiences.length ? 400 : 503).send({
      error: audiences.length
        ? "Google credential is required"
        : "Google sign-in is not configured",
    });
    return;
  }
  try {
    const ticket = await new OAuth2Client().verifyIdToken({
      idToken: parsed.data.credential,
      audience: audiences,
    });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      reply
        .code(401)
        .send({ error: "Google could not verify this email address" });
      return;
    }
    const result = await auth.loginWithGoogle({
      sub: profile.sub,
      email: profile.email,
      displayName:
        profile.name ?? profile.given_name ?? profile.email.split("@")[0]!,
    });
    setSessionCookie(reply, result.token);
    if (result.isNewAccount && result.user.email) {
      void queueTemplateEmail({
        to: result.user.email,
        userId: result.user.id,
        template: "googleWelcome",
        data: { displayName: result.user.displayName },
        dedupeKey: `welcome:${result.user.id}`,
      }).catch((error) =>
        request.log.error(error, "Could not queue Google welcome email"),
      );
    }
    reply.send({ user: result.user, token: result.token });
  } catch (error) {
    const verificationError =
      error instanceof Error ? error.message.slice(0, 300) : "Unknown verification error";
    const audienceMismatch = /audience|recipient|client.?id/i.test(verificationError);
    request.log.warn(
      {
        event: "auth.google_verification_failed",
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: verificationError,
        configuredAudienceCount: audiences.length,
      },
      "Google ID token verification failed",
    );
    reply.code(audienceMismatch ? 503 : 401).send({
      error: audienceMismatch
        ? "Google sign-in is misconfigured. The Web client ID used by the app must be included in GOOGLE_CLIENT_IDS on the API, then the API must be redeployed."
        : "Google sign-in could not be verified. Please try again.",
    });
  }
}

export async function requestPasswordReset(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = emailSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Enter a valid email address" });
    return;
  }
  const reset = await auth.createPasswordResetToken(parsed.data.email);
  if (reset) {
    try {
      await sendPasswordResetEmail(
        reset.email,
        reset.token,
        reset.displayName,
        reset.userId,
      );
    } catch (error) {
      request.log.error(error, "Could not send password reset email");
    }
  }
  reply.send({
    ok: true,
    message: "If that email belongs to an account, a reset link is on its way.",
  });
}

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = resetPasswordSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({
      error: "Use a valid reset link and a password of at least 8 characters",
    });
    return;
  }
  const user = await auth.resetPasswordWithToken(
    parsed.data.token,
    parsed.data.password,
  );
  if (!user) {
    reply
      .code(400)
      .send({ error: "This reset link is invalid or has expired" });
    return;
  }
  if (user.email) {
    void queueTemplateEmail({
      to: user.email,
      userId: user.id,
      template: "passwordChanged",
      data: { displayName: user.displayName },
    }).catch((error) =>
      request.log.error(error, "Could not queue password-change email"),
    );
  }
  reply.send({ ok: true });
}

export async function registerPushDevice(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Please sign in to turn on notifications.",
  );
  if (!user) return;
  const parsed = pushDeviceSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "This device could not be registered for notifications." });
    return;
  }
  await auth.savePushDevice(user.id, parsed.data.token, parsed.data.platform);
  reply.send({ ok: true });
}

export async function getPushPreference(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Please sign in to manage your notifications.",
  );
  if (!user) return;
  reply.header("cache-control", "no-store").send({
    enabled: await auth.getPushNotificationsEnabled(user.id),
  });
}

export async function savePushPreference(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Please sign in to manage your notifications.",
  );
  if (!user) return;
  const parsed = pushPreferenceSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Please choose whether you’d like to receive notifications." });
    return;
  }
  await auth.setPushNotificationsEnabled(user.id, parsed.data.enabled);
  if (!parsed.data.enabled) await cancelUserPushNotifications(user.id);
  reply.header("cache-control", "no-store").send(parsed.data);
}

export async function sendAdminPushNotification(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const parsed = pushNotificationSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Please add a short title and message for the notification." });
    return;
  }
  try {
    const result = await sendPushNotification({
      title: parsed.data.title,
      body: parsed.data.body,
      url: parsed.data.url || undefined,
    });
    if (!result.configured) {
      reply
        .code(503)
        .send({
          error:
            "Push notifications are temporarily unavailable. Please try again later.",
        });
      return;
    }
    await adminAuditModel.record(
      admin.id,
      "notification.sent",
      "notification",
      randomAuditId(),
      {
        title: parsed.data.title,
        recipients: result.recipients,
        sent: result.sent,
        failed: result.failed,
      },
    );
    reply.send(result);
  } catch (error) {
    request.log.error(error, "Could not send push notification");
    reply
      .code(502)
      .send({
        error:
          "We couldn’t send that notification right now. Please check Firebase settings and try again.",
      });
  }
}

export async function sendAdminEmail(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const parsed = adminEmailSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Add a valid subject, heading, and email message" });
    return;
  }
  const campaignId = `admin-${Date.now()}`;
  const recipients = await queueBulkTemplateEmail({
    template: parsed.data.template,
    data: {
      campaignId,
      subject: parsed.data.subject,
      title: parsed.data.title,
      message: parsed.data.message,
      actionLabel: parsed.data.actionLabel || undefined,
      actionUrl: parsed.data.actionUrl || undefined,
    },
  });
  await adminAuditModel.record(
    admin.id,
    "email.queued",
    "email_campaign",
    campaignId,
    {
      template: parsed.data.template,
      subject: parsed.data.subject,
      recipients,
    },
  );
  reply.send({ queued: recipients, campaignId });
}

export async function sendAdminTestEmail(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  if (!admin.email) {
    reply.code(400).send({
      error: "Add an email address to this admin account before sending a test",
    });
    return;
  }
  const provider = await emailProviderModel.getEmailProvider();
  const providerStatus = await verifyEmailTransport(provider);
  if (!providerStatus.configured || providerStatus.verified !== true) {
    reply.code(503).send({
      error: providerStatus.error ||
        `${provider === "smtp" ? "SMTP" : "Resend"} is not configured or verified.`,
    });
    return;
  }

  try {
    const result = await sendTemplateEmail({
      to: admin.email,
      userId: admin.id,
      template: "adminMessage",
      data: {
        displayName: admin.displayName,
        subject: "Your Quitech email connection is working",
        title: "Your test email arrived",
        message:
          "This is a test message from the Quitech admin dashboard. If you can read it, your SMTP connection and branded email layout are working properly.",
        actionLabel: "Open Quitech",
        actionUrl: appUrl("/"),
      },
      ignorePreferences: true,
    });
    await adminAuditModel.record(
      admin.id,
      "email.test_sent",
      "email",
      randomAuditId(),
      { provider, recipient: admin.email, messageId: result.messageId ?? null },
    );
    reply.send({ sentTo: admin.email, messageId: result.messageId ?? null });
  } catch (error) {
    request.log.error(error, "Could not send test email");
    reply.code(502).send({
      error:
        "Quitech could not send the test email. Check the selected email provider configuration in Coolify.",
    });
  }
}

function randomAuditId(): string {
  return `push-${Date.now()}`;
}

export async function me(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await auth.getUser(readSessionToken(request));
  reply.send({ user });
}

export async function recordPresence(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const updated = await auth.touchSession(readSessionToken(request));
  if (!updated) {
    reply.code(401).send({ error: "Sign in to update your online status" });
    return;
  }
  reply.header("cache-control", "no-store").send({ ok: true });
}

export async function getEmailPreferences(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to manage email preferences",
  );
  if (!user) return;
  const { preferences } = await emailNotificationModel.ensureEmailPreferences(
    user.id,
  );
  reply.header("cache-control", "no-store").send({ preferences });
}

export async function saveEmailPreferences(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to manage email preferences",
  );
  if (!user) return;
  const parsed = emailPreferencesSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Choose valid email preference settings" });
    return;
  }
  const preferences = await emailNotificationModel.updateEmailPreferences(
    user.id,
    parsed.data,
  );
  if (user.email) {
    void queueTemplateEmail({
      to: user.email,
      userId: user.id,
      template: "emailPreferencesChanged",
      data: { displayName: user.displayName },
    }).catch((error) =>
      request.log.error(error, "Could not queue preference email"),
    );
  }
  reply.header("cache-control", "no-store").send({ preferences });
}

export async function getPublicEmailPreferences(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const token = String((request.query as { token?: string }).token ?? "");
  if (token.length < 20) {
    reply.code(400).send({ error: "This email preference link is invalid" });
    return;
  }
  const preferences =
    await emailNotificationModel.getEmailPreferencesByToken(token);
  if (!preferences) {
    reply
      .code(404)
      .send({ error: "This email preference link is invalid or expired" });
    return;
  }
  reply.header("cache-control", "no-store").send({ preferences });
}

export async function savePublicEmailPreferences(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = publicEmailPreferencesSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "This email preference request is invalid" });
    return;
  }
  const { token, ...nextPreferences } = parsed.data;
  const preferences =
    await emailNotificationModel.updateEmailPreferencesByToken(
      token,
      nextPreferences,
    );
  if (!preferences) {
    reply
      .code(404)
      .send({ error: "This email preference link is invalid or expired" });
    return;
  }
  reply.header("cache-control", "no-store").send({ preferences });
}

export async function getAdminSystemMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const databaseStartedAt = performance.now();
  const [databaseResult, cpuPercent, disk] = await Promise.all([
    pool.query<{ bytes: string }>(
      "SELECT pg_database_size(current_database())::text AS bytes",
    ),
    processCpuPercent(),
    diskMetrics(),
  ]);
  const databaseLatencyMs = roundMetric(performance.now() - databaseStartedAt);
  const databaseBytes = Number(databaseResult.rows[0]?.bytes ?? 0);
  const memory = process.memoryUsage();

  reply.header("cache-control", "no-store").send({
    collectedAt: new Date().toISOString(),
    host: {
      platform: process.platform,
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      cpuCores: os.cpus().length,
      processCpuPercent: cpuPercent,
      loadAverage1m:
        process.platform === "win32" ? null : roundMetric(os.loadavg()[0] ?? 0),
      memoryTotalBytes: os.totalmem(),
      memoryFreeBytes: os.freemem(),
      processRssBytes: memory.rss,
      processHeapUsedBytes: memory.heapUsed,
      diskTotalBytes: disk?.totalBytes ?? null,
      diskFreeBytes: disk?.freeBytes ?? null,
    },
    database: {
      latencyMs: databaseLatencyMs,
      sizeBytes: databaseBytes,
      poolTotal: pool.totalCount,
      poolIdle: pool.idleCount,
      poolWaiting: pool.waitingCount,
    },
    api: getRuntimeMetrics(),
  });
}

function sanitizeDiagnosticError(value: string | null): string | null {
  return (
    value
      ?.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[redacted email]")
      .replace(/ya29\.[\w-]+/g, "[redacted token]")
      .replace(/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/g, "[redacted key]")
      .replace(/[\r\n]+/g, " ")
      .slice(0, 300) ?? null
  );
}

export async function getAdminIntegrationStatus(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const selectedEmailProvider = await emailProviderModel.getEmailProvider();
  const [
    smtpConfiguration,
    resendConfiguration,
    firebase,
    emailActivityResult,
    emailQueueResult,
    latestEmailFailureResult,
    pushDeviceResult,
    pushQueueResult,
    latestPushFailureResult,
  ] = await Promise.all([
    verifyEmailTransport("smtp"),
    verifyEmailTransport("resend"),
    verifyFirebaseAdmin(),
    pool.query<{ status: string; count: number }>(
      `SELECT status, COUNT(*)::int AS count
       FROM email_delivery_log
       WHERE created_at >= NOW() - INTERVAL '24 hours'
       GROUP BY status`,
    ),
    pool.query<{ pending: number; processing: number; failed: number }>(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
         COUNT(*) FILTER (WHERE status = 'processing')::int AS processing,
         COUNT(*) FILTER (WHERE status = 'failed')::int AS failed
       FROM email_jobs`,
    ),
    pool.query<{
      createdAt: string;
      template: string;
      errorMessage: string | null;
    }>(
      `SELECT created_at AS "createdAt", template, error_message AS "errorMessage"
       FROM email_delivery_log
       WHERE status = 'failed'
       ORDER BY created_at DESC
       LIMIT 1`,
    ),
    pool.query<{
      total: number;
      enabled: number;
      android: number;
      ios: number;
      web: number;
    }>(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE enabled = TRUE)::int AS enabled,
         COUNT(*) FILTER (WHERE enabled = TRUE AND platform = 'android')::int AS android,
         COUNT(*) FILTER (WHERE enabled = TRUE AND platform = 'ios')::int AS ios,
         COUNT(*) FILTER (WHERE enabled = TRUE AND platform = 'web')::int AS web
       FROM push_devices`,
    ),
    pool.query<{ pending: number; processing: number; failed: number }>(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
         COUNT(*) FILTER (WHERE status = 'processing')::int AS processing,
         COUNT(*) FILTER (WHERE status = 'failed')::int AS failed
       FROM push_jobs`,
    ),
    pool.query<{ createdAt: string; errorMessage: string | null }>(
      `SELECT created_at AS "createdAt", last_error AS "errorMessage"
       FROM push_jobs
       WHERE status = 'failed' AND last_error IS NOT NULL
       ORDER BY updated_at DESC
       LIMIT 1`,
    ),
  ]);

  const emailActivity = { sent: 0, failed: 0, skipped: 0 };
  for (const row of emailActivityResult.rows) {
    if (row.status === "sent" || row.status === "failed" || row.status === "skipped") {
      emailActivity[row.status] = row.count;
    }
  }

  reply.header("cache-control", "no-store").send({
    collectedAt: new Date().toISOString(),
    email: {
      ...(
        selectedEmailProvider === "resend"
          ? resendConfiguration
          : smtpConfiguration
      ),
      provider: selectedEmailProvider,
      providers: {
        smtp: smtpConfiguration,
        resend: resendConfiguration,
      },
      activity24Hours: emailActivity,
      queue: emailQueueResult.rows[0] ?? { pending: 0, processing: 0, failed: 0 },
      lastFailure: latestEmailFailureResult.rows[0]
        ? {
            ...latestEmailFailureResult.rows[0],
            errorMessage: sanitizeDiagnosticError(
              latestEmailFailureResult.rows[0].errorMessage,
            ),
          }
        : null,
    },
    firebase: {
      ...firebase,
      devices: pushDeviceResult.rows[0] ?? {
        total: 0,
        enabled: 0,
        android: 0,
        ios: 0,
        web: 0,
      },
      queue: pushQueueResult.rows[0] ?? { pending: 0, processing: 0, failed: 0 },
      lastFailure: latestPushFailureResult.rows[0]
        ? {
            ...latestPushFailureResult.rows[0],
            errorMessage: sanitizeDiagnosticError(
              latestPushFailureResult.rows[0].errorMessage,
            ),
          }
        : null,
    },
  });
}

export async function saveAdminEmailProvider(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const parsed = emailProviderSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Choose a supported email provider." });
    return;
  }

  const status = await verifyEmailTransport(parsed.data.provider);
  if (!status.configured || status.verified !== true) {
    reply.code(400).send({
      error:
        status.error ||
        `Configure and verify ${parsed.data.provider === "resend" ? "Resend" : "SMTP"} before selecting it.`,
      provider: parsed.data.provider,
    });
    return;
  }

  const provider = await emailProviderModel.setEmailProvider(
    parsed.data.provider,
    admin.id,
  );
  await adminAuditModel.record(
    admin.id,
    "email.provider_changed",
    "email_provider",
    provider,
    { provider },
  );
  reply.send({ provider });
}

export async function getAdminAnalytics(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const query = request.query as { from?: string; to?: string };
  reply.header("cache-control", "no-store").send(
    await adminAnalyticsModel.getAnalytics({
      from: query.from,
      to: query.to,
    }),
  );
}

export async function updateMe(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Display name must be between 1 and 80 characters" });
    return;
  }
  const user = await auth.updateCurrentUser(
    readSessionToken(request),
    parsed.data.displayName,
  );
  if (!user) {
    reply.code(401).send({ error: "Sign in to update your profile" });
    return;
  }
  await leaderboardModel.updateDisplayNameForUser(user.id, user.displayName);
  if (user.email) {
    void queueTemplateEmail({
      to: user.email,
      userId: user.id,
      template: "profileUpdated",
      data: { displayName: user.displayName },
    }).catch((error) =>
      request.log.error(error, "Could not queue profile email"),
    );
  }
  reply.send({ user });
}

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = passwordChangeSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Both passwords must be at least 8 characters" });
    return;
  }
  if (parsed.data.currentPassword === parsed.data.newPassword) {
    reply.code(400).send({ error: "Choose a different password" });
    return;
  }
  const user = await requireUser(
    request,
    reply,
    "Sign in to change your password",
  );
  if (!user) return;
  const changed = await auth.changeCurrentPassword(
    readSessionToken(request),
    parsed.data.currentPassword,
    parsed.data.newPassword,
  );
  if (!changed) {
    reply.code(401).send({ error: "The current password is not correct" });
    return;
  }
  if (user.email) {
    void queueTemplateEmail({
      to: user.email,
      userId: user.id,
      template: "passwordChanged",
      data: { displayName: user.displayName },
    }).catch((error) =>
      request.log.error(error, "Could not queue password-change email"),
    );
  }
  reply.send({ ok: true });
}

export async function activity(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to load account activity",
  );
  if (!user) return;
  const [history, certificates] = await Promise.all([
    leaderboardModel.listByUser(user.id),
    certificateModel.listByUser(user.id),
  ]);
  reply.send({ history, certificates });
}

export async function setLeaderboardVisibility(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await auth.getUser(readSessionToken(request));
  const params = request.params as { quizId?: string };
  const quizId = params.quizId?.trim();
  const body = request.body as { visible?: unknown; visitorId?: unknown };
  const visitorId =
    typeof body?.visitorId === "string" ? body.visitorId.trim() : "";
  if (!quizId || typeof body?.visible !== "boolean") {
    reply.code(400).send({ error: "Quiz id and visibility are required" });
    return;
  }
  if (user) {
    await leaderboardModel.setVisibilityForUser(user.id, quizId, body.visible);
  } else if (/^[A-Za-z0-9:_-]{12,100}$/.test(visitorId)) {
    await leaderboardModel.setVisibilityForVisitor(
      quizId,
      visitorId,
      body.visible,
    );
  } else {
    reply.code(401).send({ error: "Sign in or provide a valid visitor id" });
    return;
  }
  reply.send({ visible: body.visible });
}

export async function getProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to load saved progress",
  );
  if (!user) return;
  const params = request.params as { quizId?: string };
  const quizId = params.quizId?.trim();
  if (!quizId) {
    reply.code(400).send({ error: "Quiz id is required" });
    return;
  }
  reply.send({ progress: await progressModel.find(user.id, quizId) });
}

export async function listProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to load saved progress",
  );
  if (!user) return;
  reply.send({ progress: await progressModel.list(user.id) });
}

export async function saveProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(request, reply, "Sign in to save progress");
  if (!user) return;
  const params = request.params as { quizId?: string };
  const quizId = params.quizId?.trim();
  const parsed = progressSchema.safeParse(request.body);
  if (!quizId || !parsed.success) {
    reply.code(400).send({ error: "Invalid progress snapshot" });
    return;
  }
  const progress = await progressModel.save(user.id, {
    quizId,
    mode: parsed.data.mode,
    seed: parsed.data.seed,
    answers: parsed.data.answers,
    flagged: parsed.data.flagged,
    currentIndex: parsed.data.currentIndex,
    elapsedSeconds: parsed.data.elapsedSeconds,
    deviceLabel: parsed.data.deviceLabel ?? null,
  });
  if (user.email) {
    const quiz = await quizModel.findQuiz(quizId);
    if (quiz) {
      void queueTemplateEmail({
        to: user.email,
        userId: user.id,
        template: "unfinishedQuiz",
        data: {
          displayName: user.displayName,
          quizTitle: quiz.title,
          actionUrl: appUrl(`/quizzes/${quiz.id}`),
        },
        dedupeKey: `unfinished:${user.id}:${quiz.id}`,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }).catch((error) =>
        request.log.error(error, "Could not queue unfinished-quiz reminder"),
      );
    }
  }
  const quiz = await quizModel.findQuiz(quizId);
  if (quiz) {
    await schedulePushNotification({
      userId: user.id,
      title: "Ready when you are",
      body: `You’ve got a little more to do in ${quiz.title}. Your progress is saved whenever you want to come back.`,
      url: `/quizzes/${quiz.id}`,
      type: "unfinished-quiz-reminder",
      dedupeKey: `unfinished:${user.id}:${quiz.id}`,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).catch((error: unknown) =>
      request.log.error(error, "Could not schedule unfinished-quiz push reminder"),
    );
  }
  reply.send({ progress });
}

export async function deleteProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(
    request,
    reply,
    "Sign in to clear saved progress",
  );
  if (!user) return;
  const params = request.params as { quizId?: string };
  const quizId = params.quizId?.trim();
  if (!quizId) {
    reply.code(400).send({ error: "Quiz id is required" });
    return;
  }
  await progressModel.remove(user.id, quizId);
  await emailNotificationModel.cancelEmailJob(
    `unfinished:${user.id}:${quizId}`,
  );
  await cancelPushNotification(`unfinished:${user.id}:${quizId}`);
  reply.send({ ok: true });
}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await auth.logout(readSessionToken(request));
  clearSessionCookie(reply)
    .header("cache-control", "no-store")
    .send({ ok: true });
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const currentUser = await auth.getUser(readSessionToken(request));
  const deleted = await auth.deleteCurrentUser(readSessionToken(request));
  if (!deleted) {
    reply.code(401).send({ error: "Sign in before deleting your account" });
    return;
  }
  if (currentUser?.email) {
    void queueTemplateEmail({
      to: currentUser.email,
      template: "accountDeleted",
      data: { displayName: currentUser.displayName },
      dedupeKey: `account-deleted:${currentUser.id}`,
    }).catch((error) =>
      request.log.error(error, "Could not queue account-deletion email"),
    );
  }
  clearSessionCookie(reply)
    .header("cache-control", "no-store")
    .send({ ok: true });
}

export async function deleteLeaderboardEntry(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const params = request.params as { id?: string };
  const id = params.id?.trim();
  if (!id) {
    reply.code(400).send({ error: "Leaderboard record id is required" });
    return;
  }

  const deleted = await leaderboardModel.remove(id);
  if (!deleted) {
    reply.code(404).send({ error: "Leaderboard record not found" });
    return;
  }
  await adminAuditModel.record(
    admin.id,
    "leaderboard.deleted",
    "leaderboard",
    id,
  );

  reply.send({ ok: true });
}

export async function listAdminUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const query = request.query as {
    search?: string;
    limit?: string;
    offset?: string;
  };
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);
  const offset = Math.max(Number(query.offset) || 0, 0);
  reply.send(await adminDataModel.listUsers(query.search ?? "", limit, offset));
}

export async function deleteAdminUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const params = request.params as { userId?: string };
  const userId = params.userId?.trim();
  if (!userId) {
    reply.code(400).send({ error: "User id is required" });
    return;
  }
  if (userId === admin.id) {
    reply
      .code(400)
      .send({ error: "You cannot delete your own admin account here" });
    return;
  }

  const deleted = await adminDataModel.deleteUserData(userId);
  if (!deleted) {
    reply.code(404).send({ error: "User not found" });
    return;
  }
  await adminAuditModel.record(admin.id, "user.deleted", "user", userId);
  reply.header("cache-control", "no-store").send({ ok: true });
}

export async function updateAdminUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const userId = (request.params as { userId?: string }).userId?.trim();
  const parsed = adminUserUpdateSchema.safeParse(request.body);
  if (!userId || !parsed.success) {
    reply.code(400).send({ error: "User id and display name are required" });
    return;
  }
  if (
    !(await adminDataModel.updateUserDisplayName(
      userId,
      parsed.data.displayName,
    ))
  ) {
    reply.code(404).send({ error: "User not found" });
    return;
  }
  await adminAuditModel.record(
    admin.id,
    "user.display_name_updated",
    "user",
    userId,
    {
      displayName: parsed.data.displayName,
    },
  );
  reply.send({ ok: true });
}

export async function resetAdminUserPassword(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const userId = (request.params as { userId?: string }).userId?.trim();
  if (!userId) {
    reply.code(400).send({ error: "User id is required" });
    return;
  }
  const temporaryPassword = await auth.setTemporaryPassword(userId);
  if (!temporaryPassword) {
    reply.code(404).send({ error: "User not found" });
    return;
  }
  const recipient = await adminDataModel.findUserContact(userId);
  if (recipient?.email) {
    void queueTemplateEmail({
      to: recipient.email,
      userId: recipient.id,
      template: "temporaryPassword",
      data: { displayName: recipient.displayName, temporaryPassword },
    }).catch((error) =>
      request.log.error(error, "Could not queue temporary-password email"),
    );
  }
  await adminAuditModel.record(admin.id, "user.password_reset", "user", userId);
  reply.send({ temporaryPassword });
}

export async function updateAdminUserRole(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const userId = (request.params as { userId?: string }).userId?.trim();
  const parsed = adminRoleSchema.safeParse(request.body);
  if (!userId || !parsed.success) {
    reply.code(400).send({ error: "User id and role are required" });
    return;
  }
  if (userId === admin.id && parsed.data.role !== "admin") {
    reply.code(400).send({ error: "You cannot remove your own admin access" });
    return;
  }
  if (!(await adminDataModel.updateUserRole(userId, parsed.data.role))) {
    reply.code(404).send({ error: "User not found" });
    return;
  }
  const recipient = await adminDataModel.findUserContact(userId);
  if (recipient?.email) {
    void queueTemplateEmail({
      to: recipient.email,
      userId: recipient.id,
      template: "roleChanged",
      data: { displayName: recipient.displayName, role: parsed.data.role },
    }).catch((error) =>
      request.log.error(error, "Could not queue role-change email"),
    );
  }
  await adminAuditModel.record(admin.id, "user.role_updated", "user", userId, {
    role: parsed.data.role,
  });
  reply.send({ ok: true });
}

export async function listAdminCertificates(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  reply.send({ certificates: await adminDataModel.listCertificates() });
}

export async function deleteAdminCertificate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const params = request.params as { code?: string };
  const code = params.code?.trim();
  if (!code) {
    reply.code(400).send({ error: "Certificate code is required" });
    return;
  }
  if (!(await adminDataModel.deleteCertificate(code))) {
    reply.code(404).send({ error: "Certificate not found" });
    return;
  }
  await adminAuditModel.record(
    admin.id,
    "certificate.revoked",
    "certificate",
    code.toUpperCase(),
  );
  reply.header("cache-control", "no-store").send({ ok: true });
}

export async function getAdminCatalogue(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  reply.send({ sections: await quizModel.listAdminSections() });
}

export async function getAdminAuditLog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  reply.send({ auditLog: await quizModel.listAdminAuditLog() });
}

export async function getAppUpdateSettings(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const settings = await appUpdateModel.getSettings();
  reply.send({ settings });
}

export async function saveAppUpdateSettings(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const parsed = appUpdateSettingsSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Invalid app update settings" });
    return;
  }

  const settings = await appUpdateModel.upsertSettings({
    enabled: parsed.data.enabled,
    minimumVersion: parsed.data.minimumVersion,
    latestVersion: parsed.data.latestVersion,
    required: parsed.data.required,
    storeUrl: parsed.data.storeUrl?.trim() || null,
    message: parsed.data.message,
    updatedBy: admin.id,
  });
  await adminAuditModel.record(
    admin.id,
    "app_update.settings_saved",
    "app_update",
    "settings",
    {
      enabled: settings.enabled,
      minimumVersion: settings.minimumVersion,
      latestVersion: settings.latestVersion,
      required: settings.required,
    },
  );

  reply.send({ settings });
}

export async function saveCatalogueDraft(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const params = request.params as { sectionId?: string };
  const sectionId = params.sectionId?.trim();
  const parsed = catalogueDraftSchema.safeParse(request.body);
  if (!sectionId || !parsed.success) {
    reply.code(400).send({ error: "Invalid catalogue draft" });
    return;
  }

  const section = await quizModel.saveCatalogueDraft(
    sectionId,
    parsed.data,
    admin.id,
  );
  if (!section) {
    reply.code(404).send({ error: "Catalogue section not found" });
    return;
  }
  reply.send({ section });
}

export async function publishCatalogueSection(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const params = request.params as { sectionId?: string };
  const sectionId = params.sectionId?.trim();
  if (!sectionId) {
    reply.code(400).send({ error: "Catalogue section id is required" });
    return;
  }

  const section = await quizModel.publishCatalogueSection(sectionId, admin.id);
  if (!section) {
    reply
      .code(404)
      .send({ error: "Save a draft before publishing this section" });
    return;
  }
  reply.send({ section });
}
