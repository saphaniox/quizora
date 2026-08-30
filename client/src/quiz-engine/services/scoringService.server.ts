import { findQuiz, PASS_MARK } from "../models/quizModel.server";
import * as leaderboardModel from "../models/leaderboardModel.server";
import * as certificateModel from "../models/certificateModel.server";
import type { AnswerPayload, AnswerResult, Certificate, LeaderboardEntry } from "../types.server";

export function scoreSubmission(payload: AnswerPayload): AnswerResult | null {
  const quiz = findQuiz(payload.quizId);
  if (!quiz) return null;

  const questionById = new Map(quiz.questions.map((question) => [question.id, question]));
  const answeredIds = Object.keys(payload.answers);
  if (answeredIds.some((id) => !questionById.has(id))) return null;
  if (
    answeredIds.some((id) => {
      const answer = payload.answers[id];
      return answer === undefined || answer >= (questionById.get(id)?.options.length ?? 0);
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
    const isCorrect = payload.answers[question.id] === question.correctOptionIndex;
    correctAnswers[question.id] = isCorrect;
    correctOptionIndices[question.id] = question.correctOptionIndex;
    explanations[question.id] = question.explanation;
    if (isCorrect) score += 1;
  }

  const maxScore = graded.length;
  const percentage = Math.round((score / maxScore) * 100);
  const playerName = payload.playerName.trim() || "Anonymous";
  const countryCode = payload.countryCode ?? null;
  const countryName = payload.countryName ?? null;

  const entry: LeaderboardEntry = {
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playerName,
    quizId: quiz.id,
    levelId: quiz.levelId,
    quizTitle: `${quiz.levelName} - ${quiz.title}`,
    levelName: quiz.levelName,
    countryCode,
    countryName,
    score,
    maxScore,
    percentage,
    timeSpentSeconds: payload.timeSpentSeconds,
    completedAt: new Date().toISOString(),
  };
  leaderboardModel.addEntry(entry);

  const fullSection = answeredIds.length === quiz.questions.length;
  const passed = percentage >= PASS_MARK;
  let certificate: Certificate | null = null;
  let certificateMessage: string;

  if (passed && fullSection) {
    certificate = certificateModel.issue({
      code: certificateModel.makeCode(quiz.id),
      playerName,
      quizId: quiz.id,
      quizTitle: quiz.title,
      levelName: quiz.levelName,
      category: quiz.category,
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
    leaderboardRank: leaderboardModel.rankOf(entry.id),
    totalEntries: leaderboardModel.count(),
    certificate,
    certificateMessage,
  };
}
