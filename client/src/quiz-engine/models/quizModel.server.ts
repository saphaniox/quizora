import type { Level, Quiz, QuizSummary, PublicQuiz } from "../types.server";
import { expandTo, finalize, makeRng, type SectionDefinition } from "./bank/helpers.server";
import { primarySections } from "./bank/primary.server";
import { primaryExtraSections } from "./bank/primary-extra.server";
import { secondarySections } from "./bank/secondary.server";
import { secondaryExtraSections } from "./bank/secondary-extra.server";
import { collegeSections } from "./bank/college.server";
import { collegeExtraSections } from "./bank/college-extra.server";
import { professionalSections } from "./bank/professional.server";
import { professionalExtraSections } from "./bank/professional-extra.server";
import {
  primaryTopicSections,
  secondaryTopicSections,
  collegeTopicSections,
  professionalTopicSections,
} from "./bank/topics.server";
import {
  primaryExtraTopics,
  secondaryExtraTopics,
  collegeExtraTopics,
} from "./bank/topics-extra.server";
import { popularTopicSections } from "./bank/popular-topics.server";

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
    tagline: "Basic math, English, science, digital skills, and everyday reasoning refreshers.",
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
    sections: [...professionalSections, ...professionalExtraSections, ...professionalTopicSections],
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

/**
 * Certificate sections are marathons: every section is grown to this many
 * questions so only committed learners finish a full run.
 */
const LEVEL_TARGETS: Record<string, number> = {
  foundations: 500,
  secondary: 500,
  college: 500,
  professional: 500,
};

function targetFor(levelId: string, section: SectionDefinition): number {
  return section.target ?? LEVEL_TARGETS[levelId] ?? 500;
}

/** Seconds allowed for a timed practice run. Full sections are self-paced. */
const PRACTICE_SECONDS_PER_QUESTION: Record<Difficulty, number> = {
  Easy: 45,
  Medium: 60,
  Hard: 75,
};

interface SectionMeta {
  level: (typeof levelDefinitions)[number];
  section: SectionDefinition;
  target: number;
}

let metaCache: Map<string, SectionMeta> | undefined;

function metaIndex(): Map<string, SectionMeta> {
  if (!metaCache) {
    metaCache = new Map();
    for (const level of levelDefinitions) {
      for (const section of level.sections) {
        metaCache.set(section.id, { level, section, target: targetFor(level.id, section) });
      }
    }
  }
  return metaCache;
}

function summaryFor(meta: SectionMeta): QuizSummary {
  return {
    id: meta.section.id,
    title: meta.section.name,
    description: sectionDescription(meta.level.id, meta.section.description),
    category: meta.section.name,
    levelId: meta.level.id,
    levelName: meta.level.name,
    sectionId: meta.section.id,
    difficulty: meta.section.difficulty,
    timeLimitSeconds: 0,
    questionCount: meta.target,
  };
}

const quizCache = new Map<string, Quiz>();

/** Built lazily per section: the full bank is far too large to build eagerly. */
function buildQuiz(meta: SectionMeta): Quiz {
  const cached = quizCache.get(meta.section.id);
  if (cached) return cached;
  const questions = finalize(
    meta.section.id,
    expandTo(meta.section.id, meta.section.build(), meta.target),
  );
  const quiz: Quiz = {
    id: meta.section.id,
    title: meta.section.name,
    description: sectionDescription(meta.level.id, meta.section.description),
    category: meta.section.name,
    levelId: meta.level.id,
    levelName: meta.level.name,
    sectionId: meta.section.id,
    difficulty: meta.section.difficulty,
    timeLimitSeconds: 0,
    questions,
  };
  quizCache.set(quiz.id, quiz);
  return quiz;
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

export function listQuizzes(levelId?: string): QuizSummary[] {
  return Array.from(metaIndex().values())
    .filter((meta) => !levelId || meta.level.id === levelId)
    .map(summaryFor);
}

export function listLevels() {
  return levelDefinitions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((level) => {
      const sections = listQuizzes(level.id);
      return {
        id: level.id,
        name: level.name,
        tagline: level.tagline,
        ageRange: level.ageRange,
        order: level.order,
        questionCount: sections.reduce((sum, section) => sum + section.questionCount, 0),
        sections,
      };
    });
}

export function findQuiz(id: string): Quiz | undefined {
  const meta = metaIndex().get(id);
  return meta ? buildQuiz(meta) : undefined;
}

/**
 * Build the client-safe quiz. `limit` produces a shorter practice run, which is
 * never certificate eligible. `seed` shuffles question order for every run.
 */
export function toPublicQuiz(quiz: Quiz, limit?: number, seed?: string): PublicQuiz {
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
  const questions = pool.slice(0, count).map(({ id, text, options }) => ({ id, text, options }));
  const certificateEligible = count === total;
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    levelId: quiz.levelId,
    levelName: quiz.levelName,
    sectionId: quiz.sectionId,
    difficulty: quiz.difficulty,
    // Full certificate sections are self-paced (0 = untimed) so learners can rest.
    timeLimitSeconds: certificateEligible
      ? 0
      : questions.length * PRACTICE_SECONDS_PER_QUESTION[quiz.difficulty],
    totalQuestionsInSection: total,
    certificateEligible,
    passMark: PASS_MARK,
    questions,
  };
}

export function totalQuestions(): number {
  return Array.from(metaIndex().values()).reduce((sum, meta) => sum + meta.target, 0);
}
