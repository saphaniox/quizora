import assert from "node:assert/strict";
import test from "node:test";
import { builtInLearningLessons } from "../dist/content/learningLessons.js";
import * as learningModel from "../dist/models/learningModel.js";
import { pool } from "../dist/db.js";
import * as quizModel from "../dist/models/quizModel.js";
import {
  hasDuplicateQuizSection,
  isLearningSectionConflict,
} from "../dist/controllers/learningController.js";

const originalQuery = pool.query;
let publishedRows = [];
let unpublishedSectionId = null;

pool.query = async (query) => {
  if (query.includes("FROM catalogue_section_edits")) {
    return {
      rows: unpublishedSectionId
        ? [
            {
              sectionId: unpublishedSectionId,
              draftTitle: "Hidden section",
              draftDescription: "Not currently available.",
              draftDifficulty: "Medium",
              draftPublished: false,
              publishedTitle: "Hidden section",
              publishedDescription: "Not currently available.",
              publishedDifficulty: "Medium",
              published: false,
              updatedAt: null,
              publishedAt: null,
            },
          ]
        : [],
    };
  }
  if (query.includes("FROM learning_lessons")) return { rows: publishedRows };
  throw new Error(`Unexpected learning test query: ${query}`);
};

test("built-in lessons have valid curriculum links and source references", async () => {
  const levels = await quizModel.listLevels();
  const quizzes = quizModel.listBuiltInQuizzes();
  assert.equal(builtInLearningLessons.length, quizzes.length);
  assert.deepEqual(
    new Set(builtInLearningLessons.map((lesson) => lesson.quizSectionId)),
    new Set(quizzes.map((quiz) => quiz.sectionId)),
  );
  assert.equal(
    new Set(builtInLearningLessons.map((lesson) => lesson.quizSectionId)).size,
    builtInLearningLessons.length,
  );
  assert.equal(
    new Set(builtInLearningLessons.map((lesson) => lesson.slug)).size,
    builtInLearningLessons.length,
  );
  const publishedLessons = await learningModel.listPublishedLessons();
  assert.deepEqual(
    [...new Set(publishedLessons.map((lesson) => lesson.levelId))],
    levels.map((level) => level.id),
  );
  for (const lesson of builtInLearningLessons) {
    assert.equal(lesson.reviewedAt, null, `unexpected review date ${lesson.slug}`);
    const level = levels.find((item) => item.id === lesson.levelId);
    assert.ok(level, `missing course ${lesson.levelId}`);
    assert.ok(
      level.sections.some((section) => section.id === lesson.quizSectionId),
      `missing quiz section ${lesson.quizSectionId}`,
    );
    assert.ok(lesson.objectives.length >= 3);
    assert.ok(lesson.body.length >= 100);
    assert.ok(lesson.sources.length > 0);
    assert.ok(
      lesson.sources.every((source) => source.url.startsWith("https://")),
    );
    assert.equal(
      new Set(lesson.sources.map((source) => source.url)).size,
      lesson.sources.length,
    );
    if (lesson.slug === lesson.quizSectionId && lesson.levelId !== "foundations") {
      assert.ok(lesson.body.includes("Worked examples"));
      assert.ok(lesson.body.includes("quiz directly"));
      const workedExamples = [...lesson.body.matchAll(/### Worked example \d+: (.+)/g)].map(
        ([, prompt]) => prompt.replace(/ - Set \d+:\s*/i, ": ").toLowerCase(),
      );
      assert.ok(workedExamples.length <= 3);
      assert.equal(new Set(workedExamples).size, workedExamples.length);
    }
  }
});

test("Core Foundations has complete long-form lessons with realistic study durations", () => {
  const foundations = builtInLearningLessons.filter(
    (lesson) => lesson.levelId === "foundations",
  );
  assert.equal(foundations.length, 21);
  for (const lesson of foundations) {
    const wordCount = lesson.body.trim().split(/\s+/).length;
    assert.ok(
      wordCount >= 1_500,
      `${lesson.quizSectionId} has only ${wordCount} words`,
    );
    assert.ok(
      lesson.estimatedMinutes >= 300,
      `${lesson.quizSectionId} is estimated below five hours`,
    );
    assert.ok(
      lesson.body.includes("## "),
      `${lesson.quizSectionId} is missing structured lesson headings`,
    );
    assert.match(
      lesson.body,
      /worked examples?|worked revision|example/i,
      `${lesson.quizSectionId} is missing worked examples`,
    );
    assert.match(
      lesson.body,
      /guided practice|practice \d+/i,
      `${lesson.quizSectionId} is missing guided practice`,
    );
    assert.match(
      lesson.body,
      /answer key|answers and explanations/i,
      `${lesson.quizSectionId} is missing explained answers`,
    );
    assert.match(
      lesson.body,
      /cumulative (review|transfer task)/i,
      `${lesson.quizSectionId} is missing cumulative practice`,
    );
    assert.match(
      lesson.body,
      /study (plan|sequence)/i,
      `${lesson.quizSectionId} is missing a study sequence`,
    );
    assert.ok(
      lesson.estimatedMinutes <= 600,
      `${lesson.quizSectionId} exceeds the maximum supported study duration`,
    );
  }
});

test("secondary, higher-education, professional, and popular courses have expanded lessons", () => {
  const courseIds = [
    "secondary",
    "college",
    "professional",
    "popular-topics",
  ];
  const lessons = builtInLearningLessons.filter((lesson) =>
    courseIds.includes(lesson.levelId),
  );
  assert.equal(lessons.length, 90);

  for (const lesson of lessons) {
    const wordCount = lesson.body.trim().split(/\s+/).length;
    assert.ok(
      wordCount >= 1_200,
      `${lesson.quizSectionId} has only ${wordCount} words`,
    );
    assert.ok(
      lesson.estimatedMinutes >= 300,
      `${lesson.quizSectionId} is estimated below five hours`,
    );
    assert.ok(lesson.estimatedMinutes <= 600);
    assert.equal(lesson.reviewedAt, null);
    assert.match(lesson.body, /### Worked example 8/);
    assert.match(lesson.body, /### Answers and explanations/);
    assert.match(lesson.body, /take the linked quiz directly/i);
    assert.match(lesson.body, /Suggested study sequence/);
    if (["college", "professional"].includes(lesson.levelId)) {
      assert.ok(
        wordCount >= 2_500,
        `${lesson.quizSectionId} has only ${wordCount} words of advanced-course material`,
      );
      assert.equal(
        [...lesson.body.matchAll(/### Worked example \d+/g)].length,
        40,
        `${lesson.quizSectionId} should include 40 worked examples`,
      );
      assert.equal(
        [...lesson.body.matchAll(/\*\*Answer:\*\*/g)].length,
        64,
        `${lesson.quizSectionId} should include 64 explained quiz-bank examples`,
      );
    }
  }
});

test("built-in draft comparisons ignore database object-key ordering", async () => {
  const builtIn = builtInLearningLessons[0];
  const { slug, ...content } = builtIn;
  const reordered = Object.fromEntries(Object.entries(content).reverse());
  publishedRows = [
    {
      slug,
      draftContent: reordered,
      publishedContent: null,
      builtIn: true,
    },
  ];
  const lesson = (await learningModel.listAdminLessons()).find(
    (item) => item.slug === slug,
  );
  assert.equal(lesson.hasUnpublishedChanges, false);
});

test("a quiz section can have one study guide without blocking edits", () => {
  const lessons = [
    { slug: "math-guide", quizSectionId: "math" },
    { slug: "unlinked-guide", quizSectionId: null },
  ];
  assert.equal(hasDuplicateQuizSection(lessons, "new-guide", "math"), true);
  assert.equal(hasDuplicateQuizSection(lessons, "math-guide", "math"), false);
  assert.equal(hasDuplicateQuizSection(lessons, "new-guide", null), false);
});

test("database uniqueness conflicts are reported as study-section conflicts", () => {
  assert.equal(
    isLearningSectionConflict({
      code: "23505",
      constraint: "learning_lessons_quiz_section_idx",
    }),
    true,
  );
  assert.equal(
    isLearningSectionConflict({
      code: "23505",
      constraint: "another_unique_index",
    }),
    false,
  );
});

test("published catalogue combines built-ins with admin-published lessons", async () => {
  const customLesson = {
    levelId: "secondary",
    subject: "Chemistry",
    title: "Atoms and elements",
    summary:
      "Understand how atoms form the building blocks of chemical elements.",
    objectives: ["Describe the structure of a simple atom."],
    body: "## Atomic structure\nAn atom contains a nucleus and electrons.",
    estimatedMinutes: 6,
    difficulty: "Easy",
    quizSectionId: "secondary-chemistry",
    sources: [
      {
        title: "OpenStax Chemistry 2e",
        url: "https://openstax.org/details/books/chemistry-2e",
      },
    ],
    reviewedAt: "2026-10-19",
  };
  const editedBuiltin = {
    ...builtInLearningLessons[0],
    title: "Updated fractions lesson",
  };
  publishedRows = [
    {
      slug: editedBuiltin.slug,
      publishedContent: editedBuiltin,
      builtIn: true,
      updatedAt: "2026-10-19T10:00:00.000Z",
    },
    {
      slug: "atoms-and-elements",
      publishedContent: customLesson,
      builtIn: false,
      updatedAt: "2026-10-19T10:00:00.000Z",
    },
  ];

  const lessons = await learningModel.listPublishedLessons();
  assert.equal(lessons.length, builtInLearningLessons.length + 1);
  assert.equal(
    lessons.find((lesson) => lesson.slug === editedBuiltin.slug).title,
    "Updated fractions lesson",
  );
  const addedLesson = lessons.find(
    (lesson) => lesson.slug === "atoms-and-elements",
  );
  assert.equal(addedLesson.title, "Atoms and elements");
  assert.equal(addedLesson.levelName, "Secondary Education");
  assert.equal(addedLesson.quizTitle, "Chemistry");
  assert.equal(addedLesson.published, true);
});

test("unpublished lessons are not exposed to learners", async () => {
  publishedRows = [];
  const result = await learningModel.findPublishedLesson("not-published");
  assert.equal(result, null);
});

test("a lesson does not link to a quiz section after that quiz is unpublished", async () => {
  const builtIn = builtInLearningLessons[0];
  unpublishedSectionId = builtIn.quizSectionId;
  try {
    const lesson = await learningModel.findPublishedLesson(builtIn.slug);
    assert.ok(lesson);
    assert.equal(lesson.quizSectionId, null);
    assert.equal(lesson.quizTitle, null);
    const adminLesson = (await learningModel.listAdminLessons()).find(
      (item) => item.slug === builtIn.slug,
    );
    assert.equal(adminLesson.quizSectionId, builtIn.quizSectionId);
  } finally {
    unpublishedSectionId = null;
  }
});

test("quiz catalogue remains directly available without completing a lesson", async () => {
  const quiz = await quizModel.findQuiz("secondary-chemistry");
  assert.ok(quiz);
  assert.equal(quiz.id, "secondary-chemistry");
});

test.after(() => {
  pool.query = originalQuery;
});
