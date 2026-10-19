import { useEffect, useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Loader2, Plus, Save, Send } from "lucide-react";
import {
  getAdminLearningLessons,
  getLevels,
  publishAdminLearningLesson,
  saveAdminLearningLesson,
} from "@/lib/api";
import type { LearningLesson, LearningLessonDraft } from "@/lib/api";
import type { Level } from "@/types/quiz";

export const Route = createFileRoute("/_authenticated/learning-admin")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "admin") throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Learning content - Quitech Admin" }] }),
  component: LearningAdminPage,
});

interface LessonForm {
  slug: string;
  levelId: string;
  subject: string;
  title: string;
  summary: string;
  objectives: string;
  body: string;
  estimatedMinutes: number;
  difficulty: LearningLesson["difficulty"];
  quizSectionId: string;
  sources: string;
  reviewedAt: string;
}

const EMPTY_LEVELS: Level[] = [];
const EMPTY_LESSONS: LearningLesson[] = [];

function emptyForm(levelId = "foundations"): LessonForm {
  return {
    slug: "",
    levelId,
    subject: "",
    title: "",
    summary: "",
    objectives: "",
    body: "",
    estimatedMinutes: 8,
    difficulty: "Easy",
    quizSectionId: "",
    sources: "",
    reviewedAt: "",
  };
}

function formFromLesson(lesson: LearningLesson): LessonForm {
  return {
    slug: lesson.slug,
    levelId: lesson.levelId,
    subject: lesson.subject,
    title: lesson.title,
    summary: lesson.summary,
    objectives: lesson.objectives.join("\n"),
    body: lesson.body,
    estimatedMinutes: lesson.estimatedMinutes,
    difficulty: lesson.difficulty,
    quizSectionId: lesson.quizSectionId ?? "",
    sources: lesson.sources.map((source) => `${source.title} | ${source.url}`).join("\n"),
    reviewedAt: lesson.reviewedAt ?? "",
  };
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseDraft(form: LessonForm): { slug: string; draft: LearningLessonDraft } {
  return {
    slug: form.slug.trim(),
    draft: {
      levelId: form.levelId,
      subject: form.subject.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      objectives: form.objectives
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      body: form.body.trim(),
      estimatedMinutes: Number(form.estimatedMinutes),
      difficulty: form.difficulty,
      quizSectionId: form.quizSectionId || null,
      sources: form.sources
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const separator = line.indexOf("|");
          return {
            title: separator < 0 ? "" : line.slice(0, separator).trim(),
            url: separator < 0 ? "" : line.slice(separator + 1).trim(),
          };
        }),
      reviewedAt: form.reviewedAt,
    },
  };
}

function LearningAdminPage() {
  const queryClient = useQueryClient();
  const levelsQuery = useQuery({ queryKey: ["levels"], queryFn: getLevels });
  const lessonsQuery = useQuery({
    queryKey: ["admin", "learning"],
    queryFn: getAdminLearningLessons,
  });
  const levels = levelsQuery.data?.levels ?? EMPTY_LEVELS;
  const lessons = lessonsQuery.data?.lessons ?? EMPTY_LESSONS;
  const [form, setForm] = useState<LessonForm>(() => emptyForm());
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const selectedLevel = levels.find((level) => level.id === form.levelId);
  const selectedLessons = useMemo(
    () =>
      [...lessons].sort(
        (a, b) =>
          a.levelName.localeCompare(b.levelName) ||
          a.subject.localeCompare(b.subject) ||
          a.title.localeCompare(b.title),
      ),
    [lessons],
  );

  useEffect(() => {
    if (!levels.length || editingSlug) return;
    setForm((current) =>
      levels.some((level) => level.id === current.levelId) ? current : emptyForm(levels[0].id),
    );
  }, [editingSlug, levels]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "learning"] });
    void queryClient.invalidateQueries({ queryKey: ["learning", "lessons"] });
  };
  const saveMutation = useMutation({
    mutationFn: ({ slug, draft }: ReturnType<typeof parseDraft>) =>
      saveAdminLearningLesson(slug, draft),
    onSuccess: ({ lesson }) => {
      setEditingSlug(lesson.slug);
      setForm(formFromLesson(lesson));
      setFeedback("Draft saved. Review the source links and publish when it is ready.");
      refresh();
    },
    onError: (error) =>
      setFeedback(error instanceof Error ? error.message : "Could not save the draft."),
  });
  const publishMutation = useMutation({
    mutationFn: async (slug: string) => {
      const current = parseDraft(form);
      const saved = await saveAdminLearningLesson(slug, current.draft);
      return publishAdminLearningLesson(saved.lesson.slug);
    },
    onSuccess: ({ lesson }) => {
      setEditingSlug(lesson.slug);
      setForm(formFromLesson(lesson));
      setFeedback("Lesson published and available in the study library.");
      refresh();
    },
    onError: (error) =>
      setFeedback(error instanceof Error ? error.message : "Could not publish the lesson."),
  });

  const setField = <K extends keyof LessonForm>(key: K, value: LessonForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  };
  const selectLesson = (lesson: LearningLesson) => {
    setEditingSlug(lesson.slug);
    setForm(formFromLesson(lesson));
    setFeedback(null);
  };
  const startNewLesson = () => {
    setEditingSlug(null);
    setForm(emptyForm(levels[0]?.id));
    setFeedback(null);
  };
  const busy = saveMutation.isPending || publishMutation.isPending;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <a
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Admin dashboard
      </a>
      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpen className="h-4 w-4" /> Curriculum workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Learning content
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Draft and publish source-linked lessons. Publishing replaces live content only after the
            draft has passed validation; built-in lessons remain available while an edit is a draft.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewLesson}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New lesson
        </button>
      </header>

      {levelsQuery.isError || lessonsQuery.isError ? (
        <p
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          role="alert"
        >
          Could not load the lesson editor.{" "}
          {levelsQuery.error instanceof Error
            ? levelsQuery.error.message
            : lessonsQuery.error instanceof Error
              ? lessonsQuery.error.message
              : ""}
        </p>
      ) : (
        <div className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Curriculum inventory</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lessons.length} lesson{lessons.length === 1 ? "" : "s"} · published content stays
                  live until replaced
                </p>
              </div>
              {lessonsQuery.isFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {selectedLessons.map((lesson) => (
                <button
                  key={lesson.slug}
                  type="button"
                  onClick={() => selectLesson(lesson)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    editingSlug === lesson.slug
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{lesson.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        lesson.published
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {lesson.published
                        ? lesson.hasUnpublishedChanges
                          ? "Published · draft changed"
                          : "Published"
                        : "Draft"}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {lesson.levelName} · {lesson.subject}
                    {lesson.builtIn ? " · built-in" : ""}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  {editingSlug ? "Edit lesson" : "Create a lesson"}
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use concise teaching text, clear objectives, a relevant practice section, and
                  authoritative HTTPS references. Keep dates honest: record when sources and claims
                  were actually reviewed.
                </p>
              </div>
              {editingSlug && (
                <span className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                  {editingSlug}
                </span>
              )}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-foreground">
                Course
                <select
                  value={form.levelId}
                  onChange={(event) => setField("levelId", event.target.value)}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Quiz section (optional)
                <select
                  value={form.quizSectionId}
                  onChange={(event) => setField("quizSectionId", event.target.value)}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">No linked quiz</option>
                  {form.quizSectionId &&
                    !selectedLevel?.sections.some(
                      (section) => section.id === form.quizSectionId,
                    ) && (
                      <option value={form.quizSectionId}>Current section (not published)</option>
                    )}
                  {selectedLevel?.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Lesson title
                <input
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      slug: editingSlug ? current.slug : slugify(title),
                    }));
                    setFeedback(null);
                  }}
                  maxLength={160}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                URL slug
                <input
                  value={form.slug}
                  onChange={(event) => setField("slug", slugify(event.target.value))}
                  disabled={Boolean(editingSlug)}
                  maxLength={100}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm disabled:opacity-70"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Subject or topic
                <input
                  value={form.subject}
                  onChange={(event) => setField("subject", event.target.value)}
                  maxLength={120}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium text-foreground">
                  Difficulty
                  <select
                    value={form.difficulty}
                    onChange={(event) =>
                      setField("difficulty", event.target.value as LessonForm["difficulty"])
                    }
                    className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-foreground">
                  Minutes
                  <input
                    type="number"
                    value={form.estimatedMinutes}
                    onChange={(event) => setField("estimatedMinutes", Number(event.target.value))}
                    min={2}
                    max={120}
                    className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                </label>
              </div>
              <label className="text-sm font-medium text-foreground sm:col-span-2">
                Summary
                <textarea
                  value={form.summary}
                  onChange={(event) => setField("summary", event.target.value)}
                  rows={2}
                  maxLength={500}
                  className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground sm:col-span-2">
                Learning objectives · one per line
                <textarea
                  value={form.objectives}
                  onChange={(event) => setField("objectives", event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground sm:col-span-2">
                Lesson content · use headings, lists, **bold**, and blank lines between paragraphs
                <textarea
                  value={form.body}
                  onChange={(event) => setField("body", event.target.value)}
                  rows={14}
                  className="mt-1 w-full rounded-md border border-input bg-background p-3 font-mono text-sm leading-6"
                />
              </label>
              <label className="text-sm font-medium text-foreground sm:col-span-2">
                Source references · one per line: title | https://…
                <textarea
                  value={form.sources}
                  onChange={(event) => setField("sources", event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Sources reviewed on (enter only after checking the sources)
                <input
                  type="date"
                  value={form.reviewedAt}
                  onChange={(event) => setField("reviewedAt", event.target.value)}
                  className="mt-1 min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>
            {feedback && (
              <p
                className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground"
                role="status"
              >
                {feedback}
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => saveMutation.mutate(parseDraft(form))}
                disabled={busy || !form.slug}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save draft
              </button>
              <button
                type="button"
                onClick={() => publishMutation.mutate(form.slug)}
                disabled={busy || !form.slug}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Save and publish
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
