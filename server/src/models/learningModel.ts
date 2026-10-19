import { builtInLearningLessons } from "../content/learningLessons.js";
import { pool } from "../db.js";
import * as adminAuditModel from "./adminAuditModel.js";
import * as quizModel from "./quizModel.js";

export interface LearningSource {
  title: string;
  url: string;
}

export interface LearningLessonContent {
  levelId: string;
  subject: string;
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  quizSectionId: string | null;
  sources: LearningSource[];
  reviewedAt: string | null;
}

export interface LearningLesson extends LearningLessonContent {
  slug: string;
  levelName: string;
  quizTitle: string | null;
  builtIn: boolean;
  published: boolean;
  hasUnpublishedChanges: boolean;
}

export interface LearningProgress {
  lessonSlug: string;
  status: "started" | "completed";
  lastOpenedAt: string;
  completedAt: string | null;
}

interface LearningLessonRow {
  slug: string;
  draftContent: LearningLessonContent;
  publishedContent: LearningLessonContent | null;
  builtIn: boolean;
}

interface LearningProgressRow {
  lessonSlug: string;
  status: "started" | "completed";
  lastOpenedAt: Date | string;
  completedAt: Date | string | null;
}

const builtInBySlug = new Map(
  builtInLearningLessons.map((lesson) => [lesson.slug, lesson]),
);

function iso(value: Date | string | null): string | null {
  if (value === null) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function contentSignature(content: LearningLessonContent): string {
  return JSON.stringify([
    content.levelId,
    content.subject,
    content.title,
    content.summary,
    content.objectives,
    content.body,
    content.estimatedMinutes,
    content.difficulty,
    content.quizSectionId,
    content.sources.map((source) => [source.title, source.url]),
    content.reviewedAt,
  ]);
}

function hasContentChanged(
  content: LearningLessonContent,
  published: LearningLessonContent | null,
): boolean {
  return published === null || contentSignature(content) !== contentSignature(published);
}

function toLesson(
  slug: string,
  content: LearningLessonContent,
  builtIn: boolean,
  published: boolean,
  hasUnpublishedChanges: boolean,
  levels: Awaited<ReturnType<typeof quizModel.listLevels>>,
  preserveHiddenQuizLink = false,
): LearningLesson {
  const level = levels.find((item) => item.id === content.levelId);
  const quiz = level?.sections.find((section) => section.id === content.quizSectionId);
  return {
    ...content,
    quizSectionId: quiz?.id ?? (preserveHiddenQuizLink ? content.quizSectionId : null),
    slug,
    levelName: level?.name ?? content.levelId,
    quizTitle: quiz?.title ?? null,
    builtIn,
    published,
    hasUnpublishedChanges,
  };
}

const lessonColumns = `
  slug,
  draft_content AS "draftContent",
  published_content AS "publishedContent",
  built_in AS "builtIn"
`;

export async function listPublishedLessons(): Promise<LearningLesson[]> {
  const [levels, result] = await Promise.all([
    quizModel.listLevels(),
    pool.query<
      Pick<
        LearningLessonRow,
        "slug" | "publishedContent" | "builtIn"
      >
    >(
      `SELECT slug, published_content AS "publishedContent",
              built_in AS "builtIn"
       FROM learning_lessons
       WHERE published_content IS NOT NULL`,
    ),
  ]);
  const published = new Map(result.rows.map((row) => [row.slug, row]));
  const lessons = new Map<string, LearningLesson>();

  for (const lesson of builtInLearningLessons) {
    const override = published.get(lesson.slug);
    lessons.set(
      lesson.slug,
      toLesson(
        lesson.slug,
        override?.publishedContent ?? lesson,
        true,
        true,
        false,
        levels,
      ),
    );
  }
  for (const row of result.rows) {
    if (builtInBySlug.has(row.slug) || !row.publishedContent) continue;
    lessons.set(
      row.slug,
      toLesson(
        row.slug,
        row.publishedContent,
        row.builtIn,
        true,
        false,
        levels,
      ),
    );
  }
  const levelOrder = new Map(levels.map((level) => [level.id, level.order]));
  return [...lessons.values()].sort(
    (a, b) =>
      (levelOrder.get(a.levelId) ?? Number.MAX_SAFE_INTEGER) -
        (levelOrder.get(b.levelId) ?? Number.MAX_SAFE_INTEGER) ||
      a.subject.localeCompare(b.subject) ||
      a.title.localeCompare(b.title),
  );
}

export async function findPublishedLesson(
  slug: string,
): Promise<LearningLesson | null> {
  const [levels, result] = await Promise.all([
    quizModel.listLevels(),
    pool.query<
      Pick<
        LearningLessonRow,
        "slug" | "publishedContent" | "builtIn"
      >
    >(
      `SELECT slug, published_content AS "publishedContent",
              built_in AS "builtIn"
       FROM learning_lessons
       WHERE slug = $1 AND published_content IS NOT NULL`,
      [slug],
    ),
  ]);
  const row = result.rows[0];
  if (row?.publishedContent) {
    return toLesson(
      row.slug,
      row.publishedContent,
      row.builtIn,
      true,
      false,
      levels,
    );
  }
  const builtIn = builtInBySlug.get(slug);
  return builtIn
    ? toLesson(slug, builtIn, true, true, false, levels)
    : null;
}

export async function listAdminLessons(): Promise<LearningLesson[]> {
  const [levels, result] = await Promise.all([
    quizModel.listLevels(),
    pool.query<LearningLessonRow>(
      `SELECT ${lessonColumns} FROM learning_lessons`,
    ),
  ]);
  const overrides = new Map(result.rows.map((row) => [row.slug, row]));
  const lessons = new Map<string, LearningLesson>();
  for (const lesson of builtInLearningLessons) {
    const row = overrides.get(lesson.slug);
    const content = row?.draftContent ?? lesson;
    const baseline = row?.publishedContent ?? lesson;
    lessons.set(
      lesson.slug,
      toLesson(
        lesson.slug,
        content,
        true,
        true,
        hasContentChanged(content, baseline),
        levels,
        true,
      ),
    );
  }
  for (const row of result.rows) {
    if (builtInBySlug.has(row.slug)) continue;
    lessons.set(
      row.slug,
      toLesson(
        row.slug,
        row.draftContent,
        row.builtIn,
        row.publishedContent !== null,
        hasContentChanged(row.draftContent, row.publishedContent),
        levels,
        true,
      ),
    );
  }
  const levelOrder = new Map(levels.map((level) => [level.id, level.order]));
  return [...lessons.values()].sort(
    (a, b) =>
      Number(a.published) - Number(b.published) ||
      (levelOrder.get(a.levelId) ?? Number.MAX_SAFE_INTEGER) -
        (levelOrder.get(b.levelId) ?? Number.MAX_SAFE_INTEGER) ||
      a.subject.localeCompare(b.subject) ||
      a.title.localeCompare(b.title),
  );
}

export async function saveLessonDraft(
  slug: string,
  content: LearningLessonContent,
  actorId: string,
): Promise<void> {
  const result = await pool.query(
    `INSERT INTO learning_lessons (slug, draft_content, built_in, updated_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (slug) DO UPDATE SET
       draft_content = EXCLUDED.draft_content,
       updated_by = EXCLUDED.updated_by,
       updated_at = NOW()
     RETURNING slug`,
    [slug, content, builtInBySlug.has(slug), actorId],
  );
  if (result.rowCount !== 1)
    throw new Error("Could not save the lesson draft.");
  await adminAuditModel.record(
    actorId,
    "learning.lesson_draft_saved",
    "learning_lesson",
    slug,
    {
      title: content.title,
      levelId: content.levelId,
      subject: content.subject,
    },
  );
}

export async function publishLesson(
  slug: string,
  actorId: string,
): Promise<boolean> {
  const result = await pool.query(
    `UPDATE learning_lessons
     SET published_content = draft_content,
         published_by = $2,
         published_at = NOW()
     WHERE slug = $1
     RETURNING slug`,
    [slug, actorId],
  );
  if (result.rowCount !== 1) return false;
  await adminAuditModel.record(
    actorId,
    "learning.lesson_published",
    "learning_lesson",
    slug,
  );
  return true;
}

export async function listProgress(
  userId: string,
): Promise<LearningProgress[]> {
  const result = await pool.query<LearningProgressRow>(
    `SELECT lesson_slug AS "lessonSlug", status,
            last_opened_at AS "lastOpenedAt",
            completed_at AS "completedAt"
     FROM learning_progress
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId],
  );
  return result.rows.map((row) => ({
    lessonSlug: row.lessonSlug,
    status: row.status,
    lastOpenedAt: iso(row.lastOpenedAt) ?? new Date().toISOString(),
    completedAt: iso(row.completedAt),
  }));
}

export async function saveProgress(
  userId: string,
  lessonSlug: string,
  status: "started" | "completed",
): Promise<LearningProgress> {
  const result = await pool.query<LearningProgressRow>(
    `INSERT INTO learning_progress (user_id, lesson_slug, status, completed_at)
     VALUES ($1, $2, $3, CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END)
     ON CONFLICT (user_id, lesson_slug) DO UPDATE SET
       status = CASE
         WHEN learning_progress.status = 'completed' THEN 'completed'
         ELSE EXCLUDED.status
       END,
       last_opened_at = NOW(),
       completed_at = CASE
         WHEN learning_progress.status = 'completed' THEN learning_progress.completed_at
         WHEN EXCLUDED.status = 'completed' THEN NOW()
         ELSE NULL
       END,
       updated_at = NOW()
     RETURNING lesson_slug AS "lessonSlug", status,
               last_opened_at AS "lastOpenedAt",
               completed_at AS "completedAt"`,
    [userId, lessonSlug, status],
  );
  const row = result.rows[0];
  if (!row) throw new Error("Could not save study progress.");
  return {
    lessonSlug: row.lessonSlug,
    status: row.status,
    lastOpenedAt: iso(row.lastOpenedAt) ?? new Date().toISOString(),
    completedAt: iso(row.completedAt),
  };
}
