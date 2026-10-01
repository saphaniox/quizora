import { randomUUID } from "node:crypto";
import {
  CERTIFICATE_QUESTION_COUNT,
  findQuiz,
  PASS_MARK,
} from "../models/quizModel.js";
import * as leaderboardModel from "../models/leaderboardModel.js";
import * as certificateModel from "../models/certificateModel.js";
import type {
  AnswerPayload,
  AnswerResult,
  Certificate,
  LeaderboardEntry,
} from "../types.js";
import type { User } from "./authService.js";
import { appUrl } from "../email/layout.js";
import * as emailNotificationModel from "../models/emailNotificationModel.js";
import { queueTemplateEmail } from "./emailService.js";
import {
  cancelPushNotification,
  sendUserPushNotification,
} from "./pushService.js";

type QuizPushNotification = {
  type: string;
  title: string;
  body: string;
  url: string;
};

function quizPushNotification(input: {
  quizTitle: string;
  percentage: number;
  passed: boolean;
  fullSection: boolean;
  certificate: Certificate | null;
  leaderboardRank: number;
  leaderboardImproved: boolean;
  previousPercentage: number | null;
}): QuizPushNotification {
  const {
    quizTitle,
    percentage,
    passed,
    fullSection,
    certificate,
    leaderboardRank,
    leaderboardImproved,
    previousPercentage,
  } = input;
  const improvement =
    previousPercentage === null ? null : percentage - previousPercentage;
  const event = (
    type: string,
    title: string,
    body: string,
    url = "/history",
  ): QuizPushNotification => ({ type, title, body, url });

  if (certificate) {
    return event(
      "certificate-earned",
      "Certificate earned",
      `You passed ${quizTitle} with ${percentage}%.`,
      `/certificate/${certificate.code}`,
    );
  }
  if (percentage === 100) {
    return event("perfect-score", "Perfect score", `You got every question right in ${quizTitle}.`);
  }
  if (previousPercentage === null && passed) {
    return event("first-quiz-pass", "First quiz pass", `You passed ${quizTitle} on your first recorded result.`);
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 1) {
    return event("leaderboard-first", "You reached first place", `${quizTitle}: you now lead the leaderboard.`);
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 2) {
    return event("leaderboard-second", "Second place", `${quizTitle}: your new best puts you in second place.`);
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 3) {
    return event("leaderboard-third", "On the podium", `${quizTitle}: your new best puts you in third place.`);
  }
  if (leaderboardImproved && leaderboardRank > 0 && leaderboardRank <= 10) {
    return event("leaderboard-top-ten", "Top ten result", `${quizTitle}: your new score is in the top ten.`);
  }
  if (leaderboardImproved && leaderboardRank > 10 && leaderboardRank <= 25) {
    return event("leaderboard-top-twenty-five", "Top 25 result", `${quizTitle}: your new score is in the top 25.`);
  }
  if (leaderboardImproved && improvement !== null && improvement >= 20) {
    return event("major-comeback", "Huge improvement", `You improved your ${quizTitle} score by ${improvement} points.`);
  }
  if (leaderboardImproved && improvement !== null && improvement >= 10) {
    return event("strong-comeback", "Big improvement", `You raised your ${quizTitle} score by ${improvement} points.`);
  }
  if (leaderboardImproved && previousPercentage !== null) {
    return event("personal-best", "New personal best", `You scored ${percentage}% on ${quizTitle}.`);
  }
  if (passed && !fullSection) {
    return event("partial-section-pass", "Section passed", `You passed this part of ${quizTitle}.`);
  }
  if (passed && percentage >= 90) {
    return event("excellent-pass", "Excellent result", `You passed ${quizTitle} with ${percentage}%.`);
  }
  if (passed && percentage >= 80) {
    return event("strong-pass", "Strong result", `You passed ${quizTitle} with ${percentage}%.`);
  }
  if (passed) {
    return event("quiz-passed", "Quiz passed", `You passed ${quizTitle} with ${percentage}%.`);
  }
  if (percentage >= PASS_MARK - 5) {
    return event("near-pass", "So close", `You were within five points of passing ${quizTitle}.`);
  }
  if (percentage >= PASS_MARK - 10) {
    return event("close-to-pass", "Nearly there", `A little more practice could get you through ${quizTitle}.`);
  }
  if (fullSection) {
    return event("full-section-practice", "Keep building", `You finished ${quizTitle}. Review your answers and try again.`);
  }
  if (previousPercentage === null) {
    return event("first-quiz-attempt", "First result recorded", `Your first result for ${quizTitle} is ready to review.`);
  }
  return event("section-practice", "Practice saved", `Your ${quizTitle} result is ready. Keep going at your pace.`);
}

export async function scoreSubmission(
  payload: AnswerPayload,
  user: User | null = null,
): Promise<AnswerResult | null> {
  const quiz = await findQuiz(payload.quizId);
  if (!quiz) return null;

  const questionById = new Map(
    quiz.questions.map((question) => [question.id, question]),
  );
  const answeredIds = Object.keys(payload.answers);
  const submittedQuestionIds =
    payload.questionIds && payload.questionIds.length > 0
      ? payload.questionIds
      : answeredIds;
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
      return (
        answer === undefined || !question || answer >= question.options.length
      );
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
  const visitorId = user ? null : (payload.visitorId ?? null);
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
  const leaderboardResult = leaderboardVisible
    ? await leaderboardModel.recordBestEntry(entry)
    : null;
  if (!leaderboardVisible) await leaderboardModel.hideParticipantEntries(entry);

  const fullSection = graded.length === quiz.questions.length;
  const certificateSection = quiz.questions.length === CERTIFICATE_QUESTION_COUNT;
  const certificateEligible = fullSection && certificateSection;
  const passed = percentage >= PASS_MARK;
  let certificate: Certificate | null = null;
  let certificateMessage: string;

  if (passed && certificateEligible) {
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
  } else if (!certificateSection) {
    certificateMessage = `This ${quiz.questions.length}-question section is available for practice. Certificates are issued after a verified ${CERTIFICATE_QUESTION_COUNT}-question section.`;
  } else if (passed) {
    certificateMessage = `Great score! Certificates are awarded after completing all ${CERTIFICATE_QUESTION_COUNT} questions.`;
  } else {
    certificateMessage = `You need ${PASS_MARK}% or more after completing all ${CERTIFICATE_QUESTION_COUNT} questions to earn a certificate.`;
  }

  const leaderboardRank = leaderboardResult
    ? await leaderboardModel.rankOf(leaderboardResult.entry.id, {
        quizId: quiz.id,
      })
    : 0;
  const totalEntries = leaderboardResult
    ? await leaderboardModel.count({ quizId: quiz.id })
    : 0;

  if (user) {
    await cancelPushNotification(`unfinished:${user.id}:${quiz.id}`).catch(
      (error: unknown) =>
        console.warn("Could not cancel unfinished-quiz push reminder", error),
    );
  }

  if (user?.email) {
    try {
      await emailNotificationModel.cancelEmailJob(
        `unfinished:${user.id}:${quiz.id}`,
      );
      const commonData = {
        displayName: user.displayName,
        quizTitle: quiz.title,
        score,
        maxScore,
        percentage,
        rank: leaderboardRank,
      };
      if (certificate) {
        await queueTemplateEmail({
          to: user.email,
          userId: user.id,
          template: "certificateEarned",
          data: {
            ...commonData,
            certificateCode: certificate.code,
            certificateUrl: appUrl(`/certificates/${certificate.code}`),
          },
          dedupeKey: `certificate:${certificate.code}`,
        });
      } else if (
        leaderboardResult?.improved &&
        leaderboardResult.previousPercentage !== null
      ) {
        await queueTemplateEmail({
          to: user.email,
          userId: user.id,
          template: "personalBest",
          data: {
            ...commonData,
            previousPercentage: leaderboardResult.previousPercentage,
          },
          dedupeKey: `personal-best:${user.id}:${quiz.id}:${percentage}`,
        });
      } else {
        await queueTemplateEmail({
          to: user.email,
          userId: user.id,
          template: passed ? "quizPassed" : "quizNeedsPractice",
          data: commonData,
          dedupeKey: `quiz-result:${user.id}:${quiz.id}:${entry.completedAt}`,
        });
      }
    } catch (error) {
      console.warn("Could not queue quiz result email", error);
    }
  }

  if (user) {
    try {
      const notification = quizPushNotification({
        quizTitle: quiz.title,
        percentage,
        passed,
        fullSection,
        certificate,
        leaderboardRank,
        leaderboardImproved: leaderboardResult?.improved ?? false,
        previousPercentage: leaderboardResult?.previousPercentage ?? null,
      });
      await sendUserPushNotification(user.id, notification);
    } catch (error) {
      console.warn("Could not send quiz achievement push notification", error);
    }
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
    leaderboardRank,
    totalEntries,
    leaderboardImproved: leaderboardResult?.improved,
    leaderboardBestPercentage: leaderboardResult?.entry.percentage,
    leaderboardVisible,
    certificate,
    certificateMessage,
  };
}
