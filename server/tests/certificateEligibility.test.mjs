import assert from "node:assert/strict";
import test from "node:test";

import {
  CERTIFICATE_QUESTION_COUNT,
  toPublicQuiz,
} from "../dist/models/quizModel.js";

function makeQuiz(questionCount) {
  return {
    id: `section-${questionCount}`,
    title: "Reviewed practice section",
    description: "A reviewed question bank for testing certificate eligibility.",
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

test("only a full verified 500-question section is certificate eligible", () => {
  const certificateRun = toPublicQuiz(makeQuiz(CERTIFICATE_QUESTION_COUNT), undefined, "run");
  const shorterRun = toPublicQuiz(makeQuiz(CERTIFICATE_QUESTION_COUNT - 1), undefined, "run");

  assert.equal(certificateRun.certificateEligible, true);
  assert.equal(shorterRun.certificateEligible, false);
});

test("a limited practice run is never certificate eligible", () => {
  const practiceRun = toPublicQuiz(makeQuiz(CERTIFICATE_QUESTION_COUNT), 50, "practice");

  assert.equal(practiceRun.questions.length, 50);
  assert.equal(practiceRun.certificateEligible, false);
});
