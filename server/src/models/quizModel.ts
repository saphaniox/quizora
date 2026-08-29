import type { Level, Quiz, QuizSummary, PublicQuiz } from "../types.js";
import { expandTo, finalize, makeRng, type SectionDefinition } from "./bank/helpers.js";
import { primarySections } from "./bank/primary.js";
import { primaryExtraSections } from "./bank/primary-extra.js";
import { secondarySections } from "./bank/secondary.js";
import { secondaryExtraSections } from "./bank/secondary-extra.js";
import { collegeSections } from "./bank/college.js";
import { collegeExtraSections } from "./bank/college-extra.js";
import { professionalSections } from "./bank/professional.js";
import { professionalExtraSections } from "./bank/professional-extra.js";
import { earlySections } from "./bank/early.js";
import {
  earlyTopicSections,
  primaryTopicSections,
  secondaryTopicSections,
  collegeTopicSections,
  professionalTopicSections,
} from "./bank/topics.js";
import {
  earlyExtraTopics,
  primaryExtraTopics,
  secondaryExtraTopics,
  collegeExtraTopics,
} from "./bank/topics-extra.js";
import { popularTopicSections } from "./bank/popular-topics.js";

export const PASS_MARK = 80;

const levelDefinitions: (Level & { sections: SectionDefinition[] })[] = [
  {
    id: "early-years",
    name: "Early Learners",
    tagline: "First steps in counting, letters, shapes and the world around us.",
    ageRange: "Ages 3-6",
    order: 1,
    sections: [...earlySections, ...earlyTopicSections, ...earlyExtraTopics],
  },
  {
    id: "primary",
    name: "Primary School",
    tagline: "Fun foundational quizzes for young learners.",
    ageRange: "Ages 6–12",
    order: 2,
    sections: [...primarySections, ...primaryExtraSections, ...primaryTopicSections, ...primaryExtraTopics],
  },
  {
    id: "secondary",
    name: "Secondary School",
    tagline: "Exam-style practice across the core subjects.",
    ageRange: "Ages 13–18",
    order: 3,
    sections: [...secondarySections, ...secondaryExtraSections, ...secondaryTopicSections, ...secondaryExtraTopics],
  },
  {
    id: "college",
    name: "College & University",
    tagline: "Degree-level reasoning and applied problem solving.",
    ageRange: "Ages 18+",
    order: 4,
    sections: [...collegeSections, ...collegeExtraSections, ...collegeTopicSections, ...collegeExtraTopics],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Workplace certification practice across every department.",
    ageRange: "Career",
    order: 5,
    sections: [...professionalSections, ...professionalExtraSections, ...professionalTopicSections],
  },
  {
    id: "popular-topics",
    name: "Popular Topics",
    tagline: "Take on the subjects people love most, from football to gaming.",
    ageRange: "All ages",
    order: 6,
    sections: popularTopicSections,
  },
];

const LEVEL_TARGETS: Record<string, number> = {
  "early-years": 300,
  primary: 320,
  secondary: 360,
  college: 400,
  professional: 500,
};

function targetFor(levelId: string, section: SectionDefinition): number {
  return section.target ?? LEVEL_TARGETS[levelId] ?? 300;
}


function buildQuizzes(): Quiz[] {
  const out: Quiz[] = [];
  for (const level of levelDefinitions) {
    for (const section of level.sections) {
      const questions = finalize(section.id, expandTo(section.id, section.build(), targetFor(level.id, section)));
      out.push({
        id: section.id,
        title: section.name,
        description: section.description,
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
  return quizzes.filter((quiz) => !levelId || quiz.levelId === levelId).map(toSummary);
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
  return quizIndex.get(id);
}

/**
 * Build the client-safe quiz. `limit` produces a shorter practice run, which is
 * never certificate eligible — certificates require the full section.
 */
export function toPublicQuiz(quiz: Quiz, limit?: number, seed?: string): PublicQuiz {
  const total = quiz.questions.length;
  const count = limit && limit > 0 && limit < total ? limit : total;
  let pool = quiz.questions;
  if (seed && count < total) {
    const random = makeRng(`${quiz.id}-${seed}`);
    pool = quiz.questions
      .map((question) => ({ question, sort: random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.question);
  }
  const questions = pool.slice(0, count).map(({ id, text, options }) => ({ id, text, options }));
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

export function totalQuestions(): number {
  return quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
}
