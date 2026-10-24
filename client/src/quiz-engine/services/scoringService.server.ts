import { findQuiz, PASS_MARK } from "../models/quizModel.server";
import * as leaderboardModel from "../models/leaderboardModel.server";
import * as certificateModel from "../models/certificateModel.server";
import {
  certificateTierForQuestionCount,
  isCertificateRunEligible,
} from "../models/certificateAwards.server";
import type { AnswerPayload, AnswerResult, Certificate, LeaderboardEntry } from "../types.server";

export function scoreSubmission(payload: AnswerPayload): AnswerResult | null {
  const quiz = findQuiz(payload.quizId);
  if (!quiz) return null;

  const questionById = new Map(quiz.questions.map((question) => [question.id, question]));
  const answeredIds = Object.keys(payload.answers);
  const submittedQuestionIds =
    payload.questionIds && payload.questionIds.length > 0 ? payload.questionIds : answeredIds;
  const uniqueQuestionIds = new Set(submittedQuestionIds);
  if (
    submittedQuestionIds.length === 0 ||
    uniqueQuestionIds.size !== submittedQuestionIds.length ||
    submittedQuestionIds.some((id) => !questionById.has(id))
  ) {
    return null;
  }
  const submittedQuestionSet = new Set(submittedQuestionIds);
  if (answeredIds.some((id) => !submittedQuestionSet.has(id))) return null;
  if (
    answeredIds.some((id) => {
      const question = questionById.get(id);
      const answer = payload.answers[id];
      return answer === undefined || !question || answer >= question.options.length;
    })
  ) {
    return null;
  }

  const graded = submittedQuestionIds.map((id) => questionById.get(id)!);
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
  const visitorId = payload.visitorId ?? null;
  const countryCode = payload.countryCode ?? null;
  const countryName = payload.countryName ?? null;

  const entry: LeaderboardEntry = {
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playerName,
    quizId: quiz.id,
    levelId: quiz.levelId,
    quizTitle: `${quiz.levelName} - ${quiz.title}`,
    levelName: quiz.levelName,
    visitorId,
    countryCode,
    countryName,
    leaderboardVisible: payload.showOnLeaderboard !== false,
    score,
    maxScore,
    percentage,
    timeSpentSeconds: payload.timeSpentSeconds,
    completedAt: new Date().toISOString(),
  };
  const leaderboardVisible = payload.showOnLeaderboard !== false;
  const leaderboardResult = leaderboardVisible ? leaderboardModel.recordBestEntry(entry) : null;
  if (!leaderboardVisible) leaderboardModel.hideParticipantEntries(entry);

  const fullSection = graded.length === quiz.questions.length;
  const certificateTier = certificateTierForQuestionCount(maxScore);
  const certificateEligible = isCertificateRunEligible(maxScore, fullSection);
  const passed = percentage >= PASS_MARK;
  let certificate: Certificate | null = null;
  let certificateMessage: string;

  if (passed && certificateEligible) {
    certificate = certificateModel.issue({
      code: certificateModel.makeCode(quiz.id),
      awardTier: certificateTier ?? "standard",
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
    const awardName =
      certificateTier === "gold"
        ? "Gold"
        : certificateTier === "platinum"
          ? "Platinum"
          : certificateTier === "diamond"
            ? "Diamond"
            : "achievement";
    certificateMessage = `Congratulations! You scored ${percentage}% and earned a ${awardName} certificate in ${quiz.title}.`;
  } else if (certificateEligible && !passed) {
    certificateMessage = `You need ${PASS_MARK}% or higher on all ${maxScore} questions to earn this certificate.`;
  } else if (passed) {
    certificateMessage = `Complete 100 questions with ${PASS_MARK}% or higher for Gold, 200 for Platinum, or all 500 for Diamond.`;
  } else {
    certificateMessage = `Gold requires 100 questions, Platinum 200, and Diamond all 500 questions. A score of ${PASS_MARK}% or higher is required.`;
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
    leaderboardRank: leaderboardResult
      ? leaderboardModel.rankOf(leaderboardResult.entry.id, { quizId: quiz.id })
      : 0,
    totalEntries: leaderboardResult ? leaderboardModel.count({ quizId: quiz.id }) : 0,
    leaderboardImproved: leaderboardResult?.improved,
    leaderboardBestPercentage: leaderboardResult?.entry.percentage,
    leaderboardVisible,
    certificate,
    certificateMessage,
  };
}
