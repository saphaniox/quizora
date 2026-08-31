import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { scoreSubmission } from "../services/scoringService.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as certificateModel from "../models/certificateModel.js";
import * as auth from "../services/authService.js";
import { readSessionToken } from "../sessionCookie.js";

const optionalCountryCode = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== ""
      ? value.trim().toUpperCase()
      : undefined,
  z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional(),
);
const optionalCountryName = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== "" ? value.trim() : undefined,
  z.string().max(80).optional(),
);
const optionalVisitorId = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() !== "" ? value.trim() : undefined,
  z
    .string()
    .min(12)
    .max(100)
    .regex(/^[A-Za-z0-9:_-]+$/)
    .optional(),
);

const answerSchema = z
  .object({
    quizId: z.string().min(1).max(120),
    playerName: z.string().trim().max(50).optional().default(""),
    visitorId: optionalVisitorId,
    countryCode: optionalCountryCode,
    countryName: optionalCountryName,
    questionIds: z.array(z.string().min(1).max(120)).max(500).optional(),
    answers: z
      .record(z.string().max(120), z.number().int().min(0).max(20))
      .refine(
        (answers: Record<string, number>) => Object.keys(answers).length <= 500,
        "Too many answers",
      ),
    timeSpentSeconds: z
      .number()
      .int()
      .min(0)
      .max(60 * 60 * 12),
  })
  .refine(
    (value) => Boolean(value.countryCode) === Boolean(value.countryName),
    {
      message: "Country code and country name must be submitted together",
      path: ["countryCode"],
    },
  );

export async function submitAnswers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const parsed = answerSchema.safeParse(request.body);
  if (!parsed.success) {
    reply
      .code(400)
      .send({ error: "Invalid submission", details: parsed.error.format() });
    return;
  }
  const user = await auth.getUser(readSessionToken(request));
  const result = await scoreSubmission(parsed.data, user);
  if (!result) {
    reply.code(404).send({ error: "Quiz not found" });
    return;
  }
  return reply.send({ result });
}

export async function getLeaderboard(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = request.query as { quizId?: string; levelId?: string };
  return reply.send({
    leaderboard: await leaderboardModel.list({
      quizId: query.quizId,
      levelId: query.levelId,
      limit: 100,
    }),
  });
}

export async function getCertificate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const params = request.params as { code: string };
  const certificate = await certificateModel.findByCode(params.code ?? "");
  if (!certificate) {
    reply.code(404).send({ error: "Certificate not found" });
    return;
  }
  return reply.send({ certificate });
}
