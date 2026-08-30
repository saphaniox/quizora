import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as certificateModel from "../models/certificateModel.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as progressModel from "../models/progressModel.js";
import * as auth from "../services/authService.js";
import type { User } from "../services/authService.js";
import {
  clearSessionCookie,
  readSessionToken,
  setSessionCookie,
} from "../sessionCookie.js";

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
    reply.code(201).send({ user: result.user });
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
  reply.send({ user: result.user });
}

export async function me(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await auth.getUser(readSessionToken(request));
  reply.send({ user });
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
  clearSessionCookie(reply).send({ ok: true });
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
  clearSessionCookie(reply).send({ ok: true });
}
