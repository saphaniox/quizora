import type { Level, Quiz, QuizSummary, PublicQuiz } from "../types.server";
import {
  expandSectionToQuestionCount,
  finalize,
  makeRng,
  normalizeQuestionText,
  type Draft,
  type SectionDefinition,
} from "./bank/helpers.server";
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
export const CERTIFICATE_QUESTION_COUNT = 500;

const descriptionTails: Record<string, string> = {
  foundations: "Built for clear 13+ refreshers, steady confidence, and everyday learning momentum.",
  secondary: "Built for focused revision, confident recall, and steady exam-style practice.",
  college: "Built for higher-level practice, applied reasoning, and certificate-ready review.",
  professional:
    "Built for practical workplace review, interview preparation, and certification practice.",
  "popular-topics":
    "Built for curious learners who want quick recall, challenge, and steady progress.",
};

function sectionDescription(levelId: string, description: string): string {
  const base = description.trim();
  if (base.length >= 80) return base;
  const tail =
    descriptionTails[levelId] ??
    "Built for focused practice, useful recall, and steady learning progress.";
  return `${base} ${tail}`;
}

const foundationPresentation: Record<string, Pick<SectionDefinition, "name" | "description">> = {
  "foundations-mathematics": {
    name: "Quantitative Reasoning",
    description: "Arithmetic, fractions, estimation and introductory algebra for secondary entry.",
  },
  "foundations-english": {
    name: "English Language",
    description: "Vocabulary, grammar, sentence control and precise written communication.",
  },
  "foundations-science": {
    name: "Integrated Science",
    description: "Scientific reasoning across life science, matter, energy and the environment.",
  },
  "foundations-social-studies": {
    name: "Global Studies & Civics",
    description: "Geography, citizenship, institutions and evidence-based global awareness.",
  },
  "foundations-ict": {
    name: "Digital Literacy",
    description: "Computing concepts, online safety, information skills and responsible technology use.",
  },
  "foundations-money-time": {
    name: "Practical Numeracy & Time Management",
    description: "Financial calculations, time planning, schedules and applied numerical decisions.",
  },
  "foundations-reading": {
    name: "Academic Reading & Grammar",
    description: "Reading accuracy, grammar, punctuation and editing for secondary-level learning.",
  },
  "foundations-health": {
    name: "Health, Wellbeing & Safety",
    description: "Health literacy, personal safety, nutrition and responsible everyday decisions.",
  },
  "foundations-reasoning": {
    name: "Critical Thinking & Problem Solving",
    description: "Patterns, logic, quantitative problems and clear step-by-step reasoning.",
  },
  "foundations-arts": {
    name: "Creative Arts, Design & Music",
    description: "Visual design, music literacy, cultural arts and creative analysis.",
  },
  "foundations-times-tables": {
    name: "Multiplicative Reasoning",
    description: "Multiplication, factors, multiples and proportional reasoning for secondary entry.",
  },
  "foundations-division": {
    name: "Division, Ratios & Proportion",
    description: "Division, remainders, ratios and proportional reasoning in applied contexts.",
  },
  "foundations-fractions": {
    name: "Fractions, Decimals & Percentages",
    description: "Equivalent forms, operations and percentage reasoning for secondary mathematics.",
  },
  "foundations-measures": {
    name: "Measurement & Applied Geometry",
    description: "Units, conversion, perimeter, area and measurement-based problem solving.",
  },
  "foundations-time": {
    name: "Time, Schedules & Planning",
    description: "Durations, timetables, time zones and practical planning calculations.",
  },
  "foundations-money": {
    name: "Personal Finance & Budgeting",
    description: "Costs, change, discounts, budgets and sound financial decisions.",
  },
  "foundations-rounding": {
    name: "Estimation & Numerical Accuracy",
    description: "Rounding, significant figures, estimation and checking numerical reasonableness.",
  },
  "foundations-spelling": {
    name: "English Usage & Editing",
    description: "Spelling, grammar, punctuation and precise word choice in formal writing.",
  },
  "foundations-wellbeing": {
    name: "Wellbeing & Health Literacy",
    description: "Evidence-based personal wellbeing, prevention, safety and informed choices.",
  },
  "foundations-world": {
    name: "World Geography & Global Awareness",
    description: "Places, people, environments and global patterns for informed citizenship.",
  },
  "foundations-place-value": {
    name: "Number Sense & Place Value",
    description: "Whole numbers, decimals, place value and numerical representation.",
  },
};

function asFoundationSection(section: SectionDefinition): SectionDefinition {
  const presentation = foundationPresentation[section.id];
  return {
    ...section,
    id: section.id,
    name: presentation?.name ?? section.name,
    description: presentation?.description ?? section.description,
    difficulty: "Medium",
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
    name: "Secondary Entry Foundations",
    tagline: "Academic foundations for learners preparing to enter secondary education.",
    ageRange: "Secondary-entry preparation",
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

let draftCache: Map<string, Draft[]> | undefined;

function draftsBySection(): Map<string, Draft[]> {
  if (draftCache) return draftCache;

  const uniquePrompts = new Set<string>();
  const drafts = new Map<string, Draft[]>();
  for (const level of levelDefinitions) {
    for (const section of level.sections) {
      const sectionDrafts: Draft[] = [];
      for (const item of section.build()) {
        const prompt = normalizeQuestionText(item.text);
        if (!prompt || uniquePrompts.has(prompt)) continue;
        uniquePrompts.add(prompt);
        sectionDrafts.push(item);
      }
      drafts.set(section.id, expandSectionToQuestionCount(section.name, sectionDrafts));
    }
  }

  draftCache = drafts;
  return drafts;
}

function draftsFor(section: SectionDefinition): Draft[] {
  return draftsBySection().get(section.id) ?? [];
}

function targetFor(section: SectionDefinition): number {
  return draftsFor(section).length;
}

/** Timed practice gives Hard runs two minutes per question; other practice is one minute. */
const PRACTICE_SECONDS_PER_QUESTION: Record<Difficulty, number> = {
  Easy: 60,
  Medium: 60,
  Hard: 120,
};
const FULL_SECONDS_PER_QUESTION = 120;

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
        metaCache.set(section.id, { level, section, target: targetFor(section) });
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

/** Build each authored bank once, assigning duplicate prompts to the first section. */
function buildQuiz(meta: SectionMeta): Quiz {
  const cached = quizCache.get(meta.section.id);
  if (cached) return cached;
  const questions = finalize(meta.section.id, draftsFor(meta.section));
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
  const fullSection = count === total;
  const certificateEligible = fullSection && total === CERTIFICATE_QUESTION_COUNT;
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    levelId: quiz.levelId,
    levelName: quiz.levelName,
    sectionId: quiz.sectionId,
    difficulty: quiz.difficulty,
    timeLimitSeconds: fullSection
      ? questions.length * FULL_SECONDS_PER_QUESTION
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
