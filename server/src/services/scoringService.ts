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
      "You earned a certificate!",
      `Well done on passing ${quizTitle} with ${percentage}%.`,
      `/certificate/${certificate.code}`,
    );
  }
  if (percentage === 100) {
    return event(
      "perfect-score",
      "A perfect score!",
      `You got every question right in ${quizTitle}. Brilliant work.`,
    );
  }
  if (previousPercentage === null && passed) {
    return event(
      "first-quiz-pass",
      "You passed on your first try!",
      `That’s a great start in ${quizTitle} — you scored ${percentage}%.`,
    );
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 1) {
    return event(
      "leaderboard-first",
      "You’re in first place!",
      `Your latest ${quizTitle} score puts you at the top of the leaderboard.`,
    );
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 2) {
    return event(
      "leaderboard-second",
      "You’ve reached second place!",
      `Your new best in ${quizTitle} has moved you up the leaderboard.`,
    );
  }
  if (leaderboardImproved && previousPercentage !== null && leaderboardRank === 3) {
    return event(
      "leaderboard-third",
      "You’ve made the top three!",
      `Your new best in ${quizTitle} has earned you a place on the podium.`,
    );
  }
  if (leaderboardImproved && leaderboardRank > 0 && leaderboardRank <= 10) {
    return event(
      "leaderboard-top-ten",
      "You’re in the top ten!",
      `Your latest ${quizTitle} score has moved you into the top ten.`,
    );
  }
  if (leaderboardImproved && leaderboardRank > 10 && leaderboardRank <= 25) {
    return event(
      "leaderboard-top-twenty-five",
      "You’ve reached the top 25!",
      `Your latest ${quizTitle} score has moved you up the leaderboard.`,
    );
  }
  if (leaderboardImproved && improvement !== null && improvement >= 20) {
    return event(
      "major-comeback",
      "Look how far you’ve come!",
      `You improved your ${quizTitle} score by ${improvement} points. Keep it up.`,
    );
  }
  if (leaderboardImproved && improvement !== null && improvement >= 10) {
    return event(
      "strong-comeback",
      "Your hard work is paying off",
      `You raised your ${quizTitle} score by ${improvement} points. Nice progress.`,
    );
  }
  if (leaderboardImproved && previousPercentage !== null) {
    return event(
      "personal-best",
      "A new personal best!",
      `You scored ${percentage}% in ${quizTitle}. You’re making progress.`,
    );
  }
  if (passed && !fullSection) {
    return event(
      "partial-section-pass",
      "You passed this round!",
      `You passed this part of ${quizTitle} with ${percentage}%.`,
    );
  }
  if (passed && percentage >= 90) {
    return event(
      "excellent-pass",
      "Excellent work!",
      `You passed ${quizTitle} with ${percentage}%. That’s a strong result.`,
    );
  }
  if (passed && percentage >= 80) {
    return event(
      "strong-pass",
      "You did really well!",
      `You passed ${quizTitle} with ${percentage}%. Keep that momentum going.`,
    );
  }
  if (passed) {
    return event(
      "quiz-passed",
      "You passed!",
      `You made it through ${quizTitle} with ${percentage}%. Well done.`,
    );
  }
  if (percentage >= PASS_MARK - 5) {
    return event(
      "near-pass",
      "You were so close",
      `You were just a few points short in ${quizTitle}. A little more practice can help.`,
    );
  }
  if (percentage >= PASS_MARK - 10) {
    return event(
      "close-to-pass",
      "You’re getting there",
      `A little more practice in ${quizTitle} could get you over the line. Go at your own pace.`,
    );
  }
  if (fullSection) {
    return event(
      "full-section-practice",
      "Thanks for giving it a go",
      `You finished ${quizTitle}. Review your answers and try again whenever you’re ready.`,
    );
  }
  if (previousPercentage === null) {
    return event(
      "first-quiz-attempt",
      "Your first result is ready",
      `Take a look at your answers in ${quizTitle} and see what you’d like to practise next.`,
    );
  }
  return event(
    "section-practice",
    "Your progress is saved",
    `Your ${quizTitle} result is ready whenever you want to review it.`,
  );
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
