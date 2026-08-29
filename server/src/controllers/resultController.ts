import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { scoreSubmission } from "../services/scoringService.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as certificateModel from "../models/certificateModel.js";

const answerSchema = z.object({
  quizId: z.string().min(1).max(120),
  playerName: z.string().trim().min(1).max(50),
  answers: z.record(z.string().max(120), z.number().int().min(0).max(20)).refine(
    (answers: Record<string, number>) => Object.keys(answers).length <= 500,
    "Too many answers",
  ),
  timeSpentSeconds: z.number().int().min(0).max(60 * 60 * 12),
});

export async function submitAnswers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = answerSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.code(400).send({ error: "Invalid submission", details: parsed.error.format() });
    return;
  }
  const result = await scoreSubmission(parsed.data);
  if (!result) {
    reply.code(404).send({ error: "Quiz not found" });
    return;
  }
  return reply.send({ result });
}

export async function getLeaderboard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const query = request.query as { quizId?: string; levelId?: string };
  return reply.send({ leaderboard: await leaderboardModel.list({ quizId: query.quizId, levelId: query.levelId, limit: 100 }) });
}

export async function getCertificate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const params = request.params as { code: string };
  const certificate = await certificateModel.findByCode(params.code ?? "");
  if (!certificate) {
    reply.code(404).send({ error: "Certificate not found" });
    return;
  }
  return reply.send({ certificate });
}
