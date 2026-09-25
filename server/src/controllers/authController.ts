import os from "node:os";
import { statfs } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
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
import { getRuntimeMetrics } from "../runtimeMetrics.js";
import {
  clearSessionCookie,
  readSessionToken,
  setSessionCookie,
} from "../sessionCookie.js";
import { pool } from "../db.js";

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
    (cpuMilliseconds / (elapsedMilliseconds * Math.max(os.cpus().length, 1))) * 100,
  );
}

async function diskMetrics(): Promise<{ totalBytes: number; freeBytes: number } | null> {
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

export async function me(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await auth.getUser(readSessionToken(request));
  reply.send({ user });
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
      loadAverage1m: process.platform === "win32" ? null : roundMetric(os.loadavg()[0] ?? 0),
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

export async function getAdminAnalytics(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const query = request.query as { from?: string; to?: string };
  reply.header("cache-control", "no-store").send(
    await adminAnalyticsModel.getAnalytics({ from: query.from, to: query.to }),
  );
}

export async function updateMe(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Display name must be between 1 and 80 characters" });
    return;
  }
  const user = await auth.updateCurrentUser(readSessionToken(request), parsed.data.displayName);
  if (!user) {
    reply.code(401).send({ error: "Sign in to update your profile" });
    return;
  }
  await leaderboardModel.updateDisplayNameForUser(user.id, user.displayName);
  reply.send({ user });
}

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = passwordChangeSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Both passwords must be at least 8 characters" });
    return;
  }
  if (parsed.data.currentPassword === parsed.data.newPassword) {
    reply.code(400).send({ error: "Choose a different password" });
    return;
  }
  const changed = await auth.changeCurrentPassword(
    readSessionToken(request),
    parsed.data.currentPassword,
    parsed.data.newPassword,
  );
  if (!changed) {
    reply.code(401).send({ error: "The current password is not correct" });
    return;
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
  const visitorId = typeof body?.visitorId === "string" ? body.visitorId.trim() : "";
  if (!quizId || typeof body?.visible !== "boolean") {
    reply.code(400).send({ error: "Quiz id and visibility are required" });
    return;
  }
  if (user) {
    await leaderboardModel.setVisibilityForUser(user.id, quizId, body.visible);
  } else if (/^[A-Za-z0-9:_-]{12,100}$/.test(visitorId)) {
    await leaderboardModel.setVisibilityForVisitor(quizId, visitorId, body.visible);
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
  const user = await requireUser(request, reply, "Sign in to load saved progress");
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
  reply.send({ ok: true });
}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await auth.logout(readSessionToken(request));
  clearSessionCookie(reply).header("cache-control", "no-store").send({ ok: true });
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const deleted = await auth.deleteCurrentUser(readSessionToken(request));
  if (!deleted) {
    reply.code(401).send({ error: "Sign in before deleting your account" });
    return;
  }
  clearSessionCookie(reply).header("cache-control", "no-store").send({ ok: true });
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
  await adminAuditModel.record(admin.id, "leaderboard.deleted", "leaderboard", id);

  reply.send({ ok: true });
}

export async function listAdminUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;

  const query = request.query as { search?: string; limit?: string; offset?: string };
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
    reply.code(400).send({ error: "You cannot delete your own admin account here" });
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
  if (!(await adminDataModel.updateUserDisplayName(userId, parsed.data.displayName))) {
    reply.code(404).send({ error: "User not found" });
    return;
  }
  await adminAuditModel.record(admin.id, "user.display_name_updated", "user", userId, {
    displayName: parsed.data.displayName,
  });
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
  await adminAuditModel.record(admin.id, "certificate.revoked", "certificate", code.toUpperCase());
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
  await adminAuditModel.record(admin.id, "app_update.settings_saved", "app_update", "settings", {
    enabled: settings.enabled,
    minimumVersion: settings.minimumVersion,
    latestVersion: settings.latestVersion,
    required: settings.required,
  });

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

  const section = await quizModel.saveCatalogueDraft(sectionId, parsed.data, admin.id);
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
    reply.code(404).send({ error: "Save a draft before publishing this section" });
    return;
  }
  reply.send({ section });
}
