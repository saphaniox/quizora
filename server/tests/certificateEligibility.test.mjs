import assert from "node:assert/strict";
import test from "node:test";

import {
  CERTIFICATE_QUESTION_COUNT,
  PASS_MARK,
  listBuiltInQuizzes,
  toPublicQuiz,
} from "../dist/models/quizModel.js";
import {
  certificateTierForQuestionCount,
  isCertificateRunEligible,
  requiresAccountForCertificateRun,
} from "../dist/services/certificateAwards.js";

function makeQuiz(questionCount) {
  return {
    id: `section-${questionCount}`,
    title: "Reviewed practice section",
    description:
      "A reviewed question bank for testing certificate eligibility.",
    category: "Reviewed practice section",
    levelId: "professional",
    levelName: "Professional",
    sectionId: `section-${questionCount}`,
    difficulty: "Medium",
    timeLimitSeconds: 0,
    questions: Array.from({ length: questionCount }, (_, index) => ({
      id: `question-${index + 1}`,
      text: `Distinct test question ${index + 1}?`,
      options: ["Correct", "Option B", "Option C", "Option D"],
      correctOptionIndex: 0,
      explanation: "This is a deterministic test explanation.",
    })),
  };
}

test("full runs of 100 or 200 questions qualify for tiered certificates", () => {
  const goldRun = toPublicQuiz(
    makeQuiz(CERTIFICATE_QUESTION_COUNT),
    100,
    "gold",
  );
  const platinumRun = toPublicQuiz(
    makeQuiz(CERTIFICATE_QUESTION_COUNT),
    200,
    "platinum",
  );

  assert.equal(goldRun.questions.length, 100);
  assert.equal(goldRun.certificateEligible, true);
  assert.equal(platinumRun.questions.length, 200);
  assert.equal(platinumRun.certificateEligible, true);
  assert.equal(certificateTierForQuestionCount(100), "gold");
  assert.equal(certificateTierForQuestionCount(200), "platinum");
  assert.equal(
    certificateTierForQuestionCount(CERTIFICATE_QUESTION_COUNT),
    "diamond",
  );
  assert.equal(certificateTierForQuestionCount(50), null);
  assert.equal(isCertificateRunEligible(100, false), true);
  assert.equal(isCertificateRunEligible(200, false), true);
  assert.equal(PASS_MARK, 80);
});

test("a full 500-question section remains eligible for Diamond", () => {
  const certificateRun = toPublicQuiz(
    makeQuiz(CERTIFICATE_QUESTION_COUNT),
    undefined,
    "run",
  );
  const shorterRun = toPublicQuiz(
    makeQuiz(CERTIFICATE_QUESTION_COUNT - 1),
    undefined,
    "run",
  );

  assert.equal(certificateRun.certificateEligible, true);
  assert.equal(shorterRun.certificateEligible, false);
  assert.equal(
    isCertificateRunEligible(CERTIFICATE_QUESTION_COUNT, true),
    true,
  );
  assert.equal(
    isCertificateRunEligible(CERTIFICATE_QUESTION_COUNT, false),
    false,
  );
});

test("full-length runs are self-paced while short practice runs remain timed", () => {
  const quiz = makeQuiz(CERTIFICATE_QUESTION_COUNT);
  assert.equal(toPublicQuiz(quiz).timeLimitSeconds, 0);
  assert.equal(toPublicQuiz(quiz, 100).timeLimitSeconds, 100 * 60);
});

test("new foundation banks have 500 distinct questions and usable answer choices", () => {
  const sectionIds = [
    "foundations-money-time",
    "foundations-reading",
    "foundations-health",
    "foundations-reasoning",
  ];
  const quizzes = listBuiltInQuizzes();

  for (const sectionId of sectionIds) {
    const quiz = quizzes.find(({ id }) => id === sectionId);
    assert.ok(quiz, `missing section ${sectionId}`);
    assert.equal(
      quiz.questions.length,
      500,
      `${sectionId} should support full runs`,
    );
    assert.equal(
      new Set(quiz.questions.map(({ text }) => text)).size,
      500,
      `${sectionId} should not repeat prompts`,
    );
    for (const question of quiz.questions) {
      assert.doesNotMatch(
        question.text,
        /\b(?:report|claim|set|week|lesson|event|scenario|paragraph)\s+\d+\b/i,
        `${question.id} contains a synthetic sequence label`,
      );
      assert.equal(
        new Set(question.options).size,
        4,
        `${question.id} has repeated choices`,
      );
      assert.ok(
        Number.isInteger(question.correctOptionIndex) &&
          question.correctOptionIndex >= 0 &&
          question.correctOptionIndex < 4,
        `${question.id} has an invalid answer key`,
      );
    }
  }
});

test("a limited practice run is never certificate eligible", () => {
  const practiceRun = toPublicQuiz(
    makeQuiz(CERTIFICATE_QUESTION_COUNT),
    50,
    "practice",
  );

  assert.equal(practiceRun.questions.length, 50);
  assert.equal(practiceRun.certificateEligible, false);
});

test("certificate-eligible runs require an account, but practice remains open", () => {
  assert.equal(requiresAccountForCertificateRun(100, false, false), true);
  assert.equal(requiresAccountForCertificateRun(200, false, false), true);
  assert.equal(
    requiresAccountForCertificateRun(CERTIFICATE_QUESTION_COUNT, true, false),
    true,
  );
  assert.equal(requiresAccountForCertificateRun(50, false, false), false);
  assert.equal(requiresAccountForCertificateRun(100, false, true), false);
});
