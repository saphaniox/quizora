import { findQuiz, listLevels, listQuizzes, toPublicQuiz, totalQuestions } from "../models/quizModel.server";

export interface ControllerResult {
  status: number;
  body: unknown;
}

const ok = (body: unknown): ControllerResult => ({ status: 200, body });
const notFound = (error: string): ControllerResult => ({ status: 404, body: { error } });

export function getLevels(): ControllerResult {
  return ok({ levels: listLevels(), totalQuestions: totalQuestions() });
}

export function getQuizzes(levelId?: string): ControllerResult {
  return ok({ quizzes: listQuizzes(levelId) });
}

export function getQuizById(id: string, limitRaw?: string | null, seed?: string | null): ControllerResult {
  const quiz = findQuiz(id);
  if (!quiz) return notFound("Quiz not found");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;
  return ok({ quiz: toPublicQuiz(quiz, Number.isFinite(limit) ? limit : undefined, seed ?? undefined) });
}
