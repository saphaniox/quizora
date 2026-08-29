import { z } from "zod";
import { scoreSubmission } from "../services/scoringService.server";
import * as leaderboardModel from "../models/leaderboardModel.server";
import * as certificateModel from "../models/certificateModel.server";
import type { ControllerResult } from "./quizController.server";

const answerSchema = z.object({
  quizId: z.string().min(1).max(120),
  playerName: z.string().trim().min(1, "Name is required").max(50),
  answers: z
    .record(z.string().max(120), z.number().int().min(0).max(20))
    .refine((answers) => Object.keys(answers).length <= 500, "Too many answers"),
  timeSpentSeconds: z.number().int().min(0).max(60 * 60 * 12),
});

export function submitAnswers(payload: unknown): ControllerResult {
  const parsed = answerSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: 400, body: { error: "Invalid submission", details: parsed.error.format() } };
  }
  const result = scoreSubmission(parsed.data);
  if (!result) return { status: 404, body: { error: "Quiz not found" } };
  return { status: 200, body: { result } };
}

export function getLeaderboard(quizId?: string | null, levelId?: string | null): ControllerResult {
  return {
    status: 200,
    body: {
      leaderboard: leaderboardModel.list({
        quizId: quizId ?? undefined,
        levelId: levelId ?? undefined,
        limit: 100,
      }),
    },
  };
}

export function getCertificate(code: string): ControllerResult {
  const certificate = certificateModel.findByCode(code ?? "");
  if (!certificate) return { status: 404, body: { error: "Certificate not found" } };
  return { status: 200, body: { certificate } };
}
