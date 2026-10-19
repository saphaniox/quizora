import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { LearningBody } from "@/components/LearningBody";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";
import { formatStudyDuration } from "@/lib/learning";
import {
  getCurrentUser,
  getLearningLesson,
  getLearningProgress,
  saveLearningProgress,
} from "@/lib/api";

export const Route = createFileRoute("/learn/$slug")({
  head: () => ({
    meta: [{ title: "Study lesson - Quitech" }],
  }),
  component: LearningLessonPage,
});

function LearningLessonPage() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const lessonQuery = useQuery({
    queryKey: ["learning", "lesson", slug],
    queryFn: () => getLearningLesson(slug),
  });
  const accountQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });
  const user = accountQuery.data?.user ?? null;
  const progressQuery = useQuery({
    queryKey: ["learning", "progress", user?.id],
    queryFn: getLearningProgress,
    enabled: Boolean(user),
    retry: false,
  });
  const progressMutation = useMutation({
    mutationFn: (status: "started" | "completed") => saveLearningProgress(slug, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["learning", "progress"] }),
  });
  const startedSlugRef = useRef<string | null>(null);
  const lesson = lessonQuery.data?.lesson;
  const progress = progressQuery.data?.progress.find((item) => item.lessonSlug === slug);

  useEffect(() => {
    const progressKey = user && lesson ? `${user.id}:${slug}` : null;
    if (
      progressKey &&
      !progress &&
      !progressQuery.isLoading &&
      !progressQuery.isError &&
      startedSlugRef.current !== progressKey
    ) {
      startedSlugRef.current = progressKey;
      progressMutation.mutate("started");
    }
  }, [
    lesson,
    progress,
    progressMutation,
    progressQuery.isError,
    progressQuery.isLoading,
    slug,
    user,
  ]);

  if (lessonQuery.isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-sm text-muted-foreground">
        Loading lesson…
      </main>
    );
  }
  if (lessonQuery.isError || !lesson) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load this lesson.{" "}
          {lessonQuery.error instanceof Error ? lessonQuery.error.message : ""}
        </p>
        <Link
          to="/learn"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to study library
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/learn"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Study library
      </Link>

      <header className="mt-5 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-6 sm:p-9">
        <p className="text-sm font-semibold text-primary">
          {lesson.levelName} · {lesson.subject}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{lesson.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5">
            <Clock3 className="h-3.5 w-3.5" /> About {formatStudyDuration(lesson.estimatedMinutes)}
          </span>
          <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">
            {lesson.difficulty}
          </span>
          <span className="rounded-full border border-border bg-background/80 px-3 py-1.5">
            {lesson.reviewedAt
              ? `Content reviewed ${new Date(`${lesson.reviewedAt}T00:00:00`).toLocaleDateString()}`
              : "Expert review pending"}
          </span>
        </div>
      </header>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <BookOpenCheck className="h-5 w-5 text-primary" /> Learning objectives
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          By the end of this lesson, you should be able to:
        </p>
        <ul className="mt-4 space-y-3">
          {lesson.objectives.map((objective) => (
            <li key={objective} className="flex gap-3 text-sm leading-6 text-foreground">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
              {objective}
            </li>
          ))}
        </ul>
      </section>

      <article className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-8">
        <LearningBody body={lesson.body} />
      </article>

      <section className="mt-6 rounded-xl border border-border bg-muted/20 p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-foreground">Sources and further study</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          References are provided so you can check details and continue learning from the source.
        </p>
        <ul className="mt-4 space-y-2">
          {lesson.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {source.title} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-semibold text-foreground">Ready to check your understanding?</h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Practice after studying, and use the feedback to decide what to review next.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => progressMutation.mutate("completed")}
              disabled={progress?.status === "completed" || progressMutation.isPending}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {progress?.status === "completed" ? "Lesson completed" : "Mark lesson complete"}
            </button>
          ) : (
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-accent"
            >
              Sign in to track progress
            </Link>
          )}
          {lesson.quizSectionId && (
            <Link
              to="/quizzes/$id"
              params={{ id: lesson.quizSectionId }}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Practice {lesson.quizTitle ? `· ${lesson.quizTitle}` : "this topic"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
      {progressMutation.isError && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          Could not save study progress.{" "}
          {progressMutation.error instanceof Error ? progressMutation.error.message : ""}
        </p>
      )}

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>
    </main>
  );
}
