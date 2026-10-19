import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as auth from "../services/authService.js";
import { builtInLearningLessons } from "../content/learningLessons.js";
import * as learningModel from "../models/learningModel.js";
import * as quizModel from "../models/quizModel.js";
import { readSessionToken } from "../sessionCookie.js";

const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const learningSourceSchema = z.object({
  title: z.string().trim().min(3).max(200),
  url: z
    .string()
    .url()
    .max(1000)
    .refine((value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, "Sources must use HTTPS."),
});
const lessonContentSchema = z.object({
  levelId: z.string().trim().min(1).max(80),
  subject: z.string().trim().min(2).max(120),
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(20).max(500),
  objectives: z.array(z.string().trim().min(5).max(240)).min(1).max(12),
  body: z.string().trim().min(100).max(30_000),
  estimatedMinutes: z.number().int().min(2).max(120),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  quizSectionId: z.string().trim().min(1).max(120).nullable(),
  sources: z.array(learningSourceSchema).min(1).max(12),
  reviewedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(date.valueOf()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "Enter a valid review date."),
});
const progressSchema = z.object({
  status: z.enum(["started", "completed"]),
});
const paramsSchema = z.object({ slug: slugSchema });

async function requireUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<auth.User | null> {
  const user = await auth.getUser(readSessionToken(request));
  if (!user) {
    reply.code(401).send({ error: "Sign in to save your learning progress." });
    return null;
  }
  return user;
}

async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<auth.User | null> {
  const user = await requireUser(request, reply);
  if (!user) return null;
  if (user.role !== "admin") {
    reply.code(403).send({ error: "Admin access required." });
    return null;
  }
  return user;
}

function validCurriculumLink(
  content: z.infer<typeof lessonContentSchema>,
  levels: Awaited<ReturnType<typeof quizModel.listLevels>>,
): boolean {
  const level = levels.find((item) => item.id === content.levelId);
  if (!level) return false;
  return (
    content.quizSectionId === null ||
    quizModel
      .listBuiltInQuizzes()
      .some(
        (quiz) =>
          quiz.sectionId === content.quizSectionId && quiz.levelId === level.id,
      )
  );
}

export function hasDuplicateQuizSection(
  lessons: Array<{ slug: string; quizSectionId: string | null }>,
  slug: string,
  quizSectionId: string | null,
): boolean {
  return Boolean(
    quizSectionId &&
      lessons.some(
        (lesson) => lesson.slug !== slug && lesson.quizSectionId === quizSectionId,
      ),
  );
}

export function isLearningSectionConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505" &&
    "constraint" in error &&
    error.constraint === "learning_lessons_quiz_section_idx"
  );
}

export async function listLessons(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const lessons = await learningModel.listPublishedLessons();
  reply
    .header("cache-control", "public, max-age=60, stale-while-revalidate=300")
    .send({
      lessons,
    });
}

export async function getLesson(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const params = paramsSchema.safeParse(request.params);
  if (!params.success) {
    reply.code(400).send({ error: "Invalid lesson identifier." });
    return;
  }
  const lesson = await learningModel.findPublishedLesson(params.data.slug);
  if (!lesson) {
    reply.code(404).send({ error: "Study lesson not found." });
    return;
  }
  reply
    .header("cache-control", "public, max-age=60, stale-while-revalidate=300")
    .send({
      lesson,
    });
}

export async function getLearningProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(request, reply);
  if (!user) return;
  reply.header("cache-control", "no-store").send({
    progress: await learningModel.listProgress(user.id),
  });
}

export async function saveLearningProgress(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const user = await requireUser(request, reply);
  if (!user) return;
  const params = paramsSchema.safeParse(request.params);
  const parsed = progressSchema.safeParse(request.body);
  if (!params.success || !parsed.success) {
    reply.code(400).send({ error: "Invalid study progress." });
    return;
  }
  if (!(await learningModel.findPublishedLesson(params.data.slug))) {
    reply.code(404).send({ error: "Study lesson not found." });
    return;
  }
  reply.send({
    progress: await learningModel.saveProgress(
      user.id,
      params.data.slug,
      parsed.data.status,
    ),
  });
}

export async function listAdminLessons(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (!(await requireAdmin(request, reply))) return;
  reply.header("cache-control", "no-store").send({
    lessons: await learningModel.listAdminLessons(),
  });
}

export async function saveAdminLessonDraft(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const params = paramsSchema.safeParse(request.params);
  const content = lessonContentSchema.safeParse(request.body);
  if (!params.success || !content.success) {
    reply.code(400).send({
      error:
        "Check the lesson fields and HTTPS sources, and enter the date you actually reviewed them. Do not guess the review date.",
    });
    return;
  }
  const levels = await quizModel.listLevels();
  if (!validCurriculumLink(content.data, levels)) {
    reply.code(400).send({
      error:
        "Choose a current course and a quiz section from that same course.",
    });
    return;
  }
  const builtInLesson = builtInLearningLessons.find(
    (lesson) => lesson.slug === params.data.slug,
  );
  if (
    builtInLesson &&
    builtInLesson.quizSectionId !== content.data.quizSectionId
  ) {
    reply.code(400).send({
      error: "A built-in guide must stay linked to its original quiz section.",
    });
    return;
  }
  if (
    hasDuplicateQuizSection(
      await learningModel.listAdminLessons(),
      params.data.slug,
      content.data.quizSectionId,
    )
  ) {
    reply.code(409).send({
      error:
        "That quiz section already has a study guide. Edit the existing guide to avoid duplicate lessons.",
    });
    return;
  }
  try {
    await learningModel.saveLessonDraft(params.data.slug, content.data, admin.id);
  } catch (error) {
    if (!isLearningSectionConflict(error)) throw error;
    reply.code(409).send({
      error:
        "That quiz section already has a study guide. Edit the existing guide to avoid duplicate lessons.",
    });
    return;
  }
  reply.send({
    lesson: (await learningModel.listAdminLessons()).find(
      (lesson) => lesson.slug === params.data.slug,
    ),
  });
}

export async function publishAdminLesson(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const admin = await requireAdmin(request, reply);
  if (!admin) return;
  const params = paramsSchema.safeParse(request.params);
  if (!params.success) {
    reply.code(400).send({ error: "Invalid lesson identifier." });
    return;
  }
  const lesson = (await learningModel.listAdminLessons()).find(
    (item) => item.slug === params.data.slug,
  );
  if (!lesson) {
    reply.code(404).send({ error: "Study lesson draft not found." });
    return;
  }
  const content = lessonContentSchema.safeParse({
    levelId: lesson.levelId,
    subject: lesson.subject,
    title: lesson.title,
    summary: lesson.summary,
    objectives: lesson.objectives,
    body: lesson.body,
    estimatedMinutes: lesson.estimatedMinutes,
    difficulty: lesson.difficulty,
    quizSectionId: lesson.quizSectionId,
    sources: lesson.sources,
    reviewedAt: lesson.reviewedAt,
  });
  if (
    !content.success ||
    !validCurriculumLink(content.data, await quizModel.listLevels())
  ) {
    reply.code(400).send({
      error:
        "The lesson needs valid course links and at least one HTTPS source before publishing.",
    });
    return;
  }
  const published = await learningModel.publishLesson(
    params.data.slug,
    admin.id,
  );
  if (!published) {
    reply.code(404).send({ error: "Save the lesson draft before publishing." });
    return;
  }
  reply.send({
    lesson: (await learningModel.listAdminLessons()).find(
      (item) => item.slug === params.data.slug,
    ),
  });
}
