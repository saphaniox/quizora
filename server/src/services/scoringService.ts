import { randomUUID } from "node:crypto";
import { findQuiz, PASS_MARK } from "../models/quizModel.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as certificateModel from "../models/certificateModel.js";
import type {
  AnswerPayload,
  AnswerResult,
  Certificate,
  LeaderboardEntry,
} from "../types.js";
import type { User } from "./authService.js";

export async function scoreSubmission(
  payload: AnswerPayload,
  user: User | null = null,
): Promise<AnswerResult | null> {
  const quiz = findQuiz(payload.quizId);
  if (!quiz) return null;

  const questionById = new Map(
    quiz.questions.map((question) => [question.id, question]),
  );
  const answeredIds = Object.keys(payload.answers);
  if (answeredIds.some((id) => !questionById.has(id))) return null;
  if (
    answeredIds.some((id) => {
      const answer = payload.answers[id];
      return (
        answer === undefined ||
        answer >= (questionById.get(id)?.options.length ?? 0)
      );
    })
  ) {
    return null;
  }

  const graded = quiz.questions;
  const correctAnswers: Record<string, boolean> = {};
  const correctOptionIndices: Record<string, number> = {};
  const explanations: Record<string, string> = {};
  let score = 0;

  for (const question of graded) {
    const isCorrect =
      payload.answers[question.id] === question.correctOptionIndex;
    correctAnswers[question.id] = isCorrect;
    correctOptionIndices[question.id] = question.correctOptionIndex;
    explanations[question.id] = question.explanation;
    if (isCorrect) score += 1;
  }

  const maxScore = graded.length;
  const percentage = Math.round((score / maxScore) * 100);
  const submittedName = payload.playerName.trim();
  const playerName =
    submittedName && submittedName.toLowerCase() !== "anonymous"
      ? submittedName
      : user?.displayName || submittedName || "Anonymous";
  const countryCode = payload.countryCode ?? null;
  const countryName = payload.countryName ?? null;

  const entry: LeaderboardEntry = {
    id: `lb-${randomUUID()}`,
    playerName,
    quizId: quiz.id,
    levelId: quiz.levelId,
    quizTitle: `${quiz.levelName} - ${quiz.title}`,
    levelName: quiz.levelName,
    userId: user?.id ?? null,
    countryCode,
    countryName,
    score,
    maxScore,
    percentage,
    timeSpentSeconds: payload.timeSpentSeconds,
    completedAt: new Date().toISOString(),
  };
  await leaderboardModel.addEntry(entry);

  const fullSection = answeredIds.length === quiz.questions.length;
  const passed = percentage >= PASS_MARK;
  let certificate: Certificate | null = null;
  let certificateMessage: string;

  if (passed && fullSection) {
    certificate = await certificateModel.issue({
      code: certificateModel.makeCode(quiz.id),
      playerName,
      quizId: quiz.id,
      quizTitle: quiz.title,
      levelName: quiz.levelName,
      category: quiz.category,
      userId: user?.id ?? null,
      countryCode,
      countryName,
      score,
      maxScore,
      percentage,
      issuedAt: new Date().toISOString(),
    });
    certificateMessage = `Congratulations! You scored ${percentage}% and earned a certificate in ${quiz.title}.`;
  } else if (passed) {
    certificateMessage = `Great score! Certificates are awarded for the full ${quiz.questions.length}-question section only.`;
  } else {
    certificateMessage = `You need ${PASS_MARK}% or more on the full section to earn a certificate.`;
  }

  return {
    playerName,
    countryCode,
    countryName,
    score,
    maxScore,
    percentage,
    passMark: PASS_MARK,
    passed,
    correctAnswers,
    correctOptionIndices,
    explanations,
    leaderboardRank: await leaderboardModel.rankOf(entry.id),
    totalEntries: await leaderboardModel.count(),
    certificate,
    certificateMessage,
  };
}
