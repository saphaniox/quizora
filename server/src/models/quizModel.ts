import type {
  AdminCatalogueSection,
  CatalogueStatus,
  Level,
  Quiz,
  QuizSummary,
  PublicQuiz,
} from "../types.js";
import * as catalogueEditModel from "./catalogueEditModel.js";
import type { CatalogueDraftInput, CatalogueEditRow } from "./catalogueEditModel.js";
import {
  expandTo,
  finalize,
  makeRng,
  type SectionDefinition,
} from "./bank/helpers.js";
import { primarySections } from "./bank/primary.js";
import { primaryExtraSections } from "./bank/primary-extra.js";
import { secondarySections } from "./bank/secondary.js";
import { secondaryExtraSections } from "./bank/secondary-extra.js";
import { collegeSections } from "./bank/college.js";
import { collegeExtraSections } from "./bank/college-extra.js";
import { professionalSections } from "./bank/professional.js";
import { professionalExtraSections } from "./bank/professional-extra.js";
import {
  primaryTopicSections,
  secondaryTopicSections,
  collegeTopicSections,
  professionalTopicSections,
} from "./bank/topics.js";
import {
  primaryExtraTopics,
  secondaryExtraTopics,
  collegeExtraTopics,
} from "./bank/topics-extra.js";
import { popularTopicSections } from "./bank/popular-topics.js";

export const PASS_MARK = 80;

const descriptionTails: Record<string, string> = {
  foundations: "Built for clear 13+ refreshers, steady confidence, and everyday learning momentum.",
  secondary: "Built for focused revision, confident recall, and steady exam-style practice.",
  college: "Built for higher-level practice, applied reasoning, and certificate-ready review.",
  professional:
    "Built for practical workplace review, interview preparation, and certification practice.",
  "popular-topics":
    "Built for curious learners who want quick recall, challenge, and steady progress.",
};

function foundationDescription(description: string): string {
  return description.replace(/^Number work,/, "Core number work,");
}

function sectionDescription(levelId: string, description: string): string {
  const base = description.trim();
  if (base.length >= 80) return base;
  const tail =
    descriptionTails[levelId] ??
    "Built for focused practice, useful recall, and steady learning progress.";
  return `${base} ${tail}`;
}

function foundationName(name: string): string {
  return (
    {
      "Basic Science": "Science Fundamentals",
      "Social Studies": "Civic & World Basics",
      "ICT Basics": "Digital Basics",
      "Everyday Problem Solving": "Practical Problem Solving",
    }[name] ?? name
  );
}

function asFoundationSection(section: SectionDefinition): SectionDefinition {
  return {
    ...section,
    id: section.id,
    name: foundationName(section.name),
    description: foundationDescription(section.description),
  };
}

const foundationSections = [
  ...primarySections,
  ...primaryExtraSections,
  ...primaryTopicSections,
  ...primaryExtraTopics,
].map(asFoundationSection);

const levelDefinitions: (Level & { sections: SectionDefinition[] })[] = [
  {
    id: "foundations",
    name: "Core Foundations",
    tagline:
      "Basic math, English, science, digital skills, and everyday reasoning refreshers.",
    ageRange: "Ages 13+",
    order: 1,
    sections: foundationSections,
  },
  {
    id: "secondary",
    name: "Secondary Education",
    tagline: "Focused 13+ revision across core secondary-level subjects.",
    ageRange: "Ages 13+",
    order: 2,
    sections: [
      ...secondarySections,
      ...secondaryExtraSections,
      ...secondaryTopicSections,
      ...secondaryExtraTopics,
    ],
  },
  {
    id: "college",
    name: "College & University",
    tagline: "Degree-level reasoning and applied problem solving.",
    ageRange: "Ages 18+",
    order: 3,
    sections: [
      ...collegeSections,
      ...collegeExtraSections,
      ...collegeTopicSections,
      ...collegeExtraTopics,
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Workplace certification practice across every department.",
    ageRange: "Career learners",
    order: 4,
    sections: [
      ...professionalSections,
      ...professionalExtraSections,
      ...professionalTopicSections,
    ],
  },
  {
    id: "popular-topics",
    name: "Popular Topics",
    tagline: "Take on the subjects people love most, from football to gaming.",
    ageRange: "Ages 13+",
    order: 5,
    sections: popularTopicSections,
  },
];

const LEVEL_TARGETS: Record<string, number> = {
  foundations: 320,
  secondary: 360,
  college: 400,
  professional: 420,
};

function targetFor(levelId: string, section: SectionDefinition): number {
  return section.target ?? LEVEL_TARGETS[levelId] ?? 300;
}

function buildQuizzes(): Quiz[] {
  const out: Quiz[] = [];
  for (const level of levelDefinitions) {
    for (const section of level.sections) {
      const questions = finalize(
        section.id,
        expandTo(section.id, section.build(), targetFor(level.id, section)),
      );
      out.push({
        id: section.id,
        title: section.name,
        description: sectionDescription(level.id, section.description),
        category: section.name,
        levelId: level.id,
        levelName: level.name,
        sectionId: section.id,
        difficulty: section.difficulty,
        timeLimitSeconds: questions.length * 30,
        questions,
      });
    }
  }
  return out;
}

const quizzes: Quiz[] = buildQuizzes();
const quizIndex = new Map(quizzes.map((quiz) => [quiz.id, quiz]));

function editMap(rows: CatalogueEditRow[]): Map<string, CatalogueEditRow> {
  return new Map(rows.map((row) => [row.sectionId, row]));
}

function withPublishedEdit(quiz: Quiz, edit?: CatalogueEditRow): Quiz | null {
  if (!edit) return quiz;
  if (!edit.published) return null;
  return {
    ...quiz,
    title: edit.publishedTitle,
    description: edit.publishedDescription,
    category: edit.publishedTitle,
    difficulty: edit.publishedDifficulty,
  };
}

function hasDraftChanges(edit: CatalogueEditRow | undefined): boolean {
  if (!edit) return false;
  return (
    edit.draftTitle !== edit.publishedTitle ||
    edit.draftDescription !== edit.publishedDescription ||
    edit.draftDifficulty !== edit.publishedDifficulty ||
    edit.draftPublished !== edit.published
  );
}

function statusFor(edit: CatalogueEditRow | undefined): CatalogueStatus {
  if (edit && !edit.published) return "unpublished";
  if (hasDraftChanges(edit)) return "draft";
  return "published";
}

function toAdminSection(quiz: Quiz, edit?: CatalogueEditRow): AdminCatalogueSection {
  const draftTitle = edit?.draftTitle ?? quiz.title;
  const draftDescription = edit?.draftDescription ?? quiz.description;
  const draftDifficulty = edit?.draftDifficulty ?? quiz.difficulty;
  const draftPublished = edit?.draftPublished ?? true;
  const publishedTitle = edit?.publishedTitle ?? quiz.title;
  const publishedDescription = edit?.publishedDescription ?? quiz.description;
  const publishedDifficulty = edit?.publishedDifficulty ?? quiz.difficulty;
  const published = edit?.published ?? true;

  return {
    ...toSummary({
      ...quiz,
      title: publishedTitle,
      description: publishedDescription,
      category: publishedTitle,
      difficulty: publishedDifficulty,
    }),
    baseTitle: quiz.title,
    baseDescription: quiz.description,
    baseDifficulty: quiz.difficulty,
    draftTitle,
    draftDescription,
    draftDifficulty,
    draftPublished,
    publishedTitle,
    publishedDescription,
    publishedDifficulty,
    published,
    hasDraftChanges: hasDraftChanges(edit),
    status: statusFor(edit),
    updatedAt: edit?.updatedAt ?? null,
    publishedAt: edit?.publishedAt ?? null,
  };
}

async function publishedQuizzes(levelId?: string): Promise<Quiz[]> {
  const edits = editMap(await catalogueEditModel.list());
  return quizzes
    .filter((quiz) => !levelId || quiz.levelId === levelId)
    .map((quiz) => withPublishedEdit(quiz, edits.get(quiz.id)))
    .filter((quiz): quiz is Quiz => Boolean(quiz));
}

export function toSummary(quiz: Quiz): QuizSummary {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    levelId: quiz.levelId,
    levelName: quiz.levelName,
    sectionId: quiz.sectionId,
    difficulty: quiz.difficulty,
    timeLimitSeconds: quiz.timeLimitSeconds,
    questionCount: quiz.questions.length,
  };
}

export async function listQuizzes(levelId?: string): Promise<QuizSummary[]> {
  return (await publishedQuizzes(levelId)).map(toSummary);
}

export async function listLevels() {
  const edits = editMap(await catalogueEditModel.list());
  return levelDefinitions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((level) => {
      const sections = quizzes
        .filter((quiz) => quiz.levelId === level.id)
        .map((quiz) => withPublishedEdit(quiz, edits.get(quiz.id)))
        .filter((quiz): quiz is Quiz => Boolean(quiz))
        .map(toSummary);
      return {
        id: level.id,
        name: level.name,
        tagline: level.tagline,
        ageRange: level.ageRange,
        order: level.order,
        questionCount: sections.reduce(
          (sum, section) => sum + section.questionCount,
          0,
        ),
        sections,
      };
    });
}

export async function findQuiz(id: string): Promise<Quiz | undefined> {
  const quiz = quizIndex.get(id);
  if (!quiz) return undefined;
  return withPublishedEdit(quiz, (await catalogueEditModel.find(id)) ?? undefined) ?? undefined;
}

export async function listAdminSections(): Promise<AdminCatalogueSection[]> {
  const edits = editMap(await catalogueEditModel.list());
  return quizzes.map((quiz) => toAdminSection(quiz, edits.get(quiz.id)));
}

export async function saveCatalogueDraft(
  sectionId: string,
  draft: CatalogueDraftInput,
  actorId: string,
): Promise<AdminCatalogueSection | null> {
  const quiz = quizIndex.get(sectionId);
  if (!quiz) return null;
  const edit = await catalogueEditModel.saveDraft(
    sectionId,
    draft,
    {
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
    },
    actorId,
  );
  return toAdminSection(quiz, edit);
}

export async function publishCatalogueSection(
  sectionId: string,
  actorId: string,
): Promise<AdminCatalogueSection | null> {
  const quiz = quizIndex.get(sectionId);
  if (!quiz) return null;
  const edit = await catalogueEditModel.publishDraft(sectionId, actorId);
  return edit ? toAdminSection(quiz, edit) : null;
}

export async function listAdminAuditLog() {
  return catalogueEditModel.listAudit(30);
}

/**
 * Build the client-safe quiz. `limit` produces a shorter practice run, which is
 * never certificate eligible. `seed` shuffles question order for every run.
 */
export function toPublicQuiz(
  quiz: Quiz,
  limit?: number,
  seed?: string,
): PublicQuiz {
  const total = quiz.questions.length;
  const count = limit && limit > 0 && limit < total ? limit : total;
  let pool = quiz.questions;
  if (seed) {
    const random = makeRng(`${quiz.id}-${seed}`);
    pool = quiz.questions
      .map((question) => ({ question, sort: random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.question);
  }
  const questions = pool
    .slice(0, count)
    .map(({ id, text, options }) => ({ id, text, options }));
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    levelId: quiz.levelId,
    levelName: quiz.levelName,
    sectionId: quiz.sectionId,
    difficulty: quiz.difficulty,
    timeLimitSeconds: questions.length * 30,
    totalQuestionsInSection: total,
    certificateEligible: count === total,
    passMark: PASS_MARK,
    questions,
  };
}

export async function totalQuestions(): Promise<number> {
  return (await publishedQuizzes()).reduce((sum, quiz) => sum + quiz.questions.length, 0);
}
