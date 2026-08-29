import type { FastifyReply, FastifyRequest } from "fastify";
import { findQuiz, listLevels, listQuizzes, toPublicQuiz, totalQuestions } from "../models/quizModel.js";

export async function getLevels(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  return reply.send({ levels: listLevels(), totalQuestions: totalQuestions() });
}

export async function getQuizzes(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const query = request.query as { level?: string };
  return reply.send({ quizzes: listQuizzes(query.level) });
}

export async function getQuizById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const params = request.params as { id: string };
  const query = request.query as { limit?: string; seed?: string };
  const quiz = findQuiz(params.id);
  if (!quiz) {
    reply.code(404).send({ error: "Quiz not found" });
    return;
  }
  const parsedLimit = query.limit ? Number.parseInt(query.limit, 10) : undefined;
  if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 500)) {
    reply.code(400).send({ error: "Invalid quiz limit" });
    return;
  }
  return reply.send({ quiz: toPublicQuiz(quiz, parsedLimit, query.seed) });
}
