import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock3, GraduationCap, Search, ShieldCheck } from "lucide-react";
import { getLearningLessons } from "@/lib/api";
import type { LearningLesson } from "@/lib/api";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn before you practise - Quitech" },
      {
        name: "description",
        content:
          "Explore structured, source-linked lessons by course and subject, then practise what you learned.",
      },
    ],
  }),
  component: LearningHubPage,
});

type SortMode = "course" | "title" | "recent" | "shortest";

const EMPTY_LESSONS: LearningLesson[] = [];

function LearningHubPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sort, setSort] = useState<SortMode>("course");
  const lessonsQuery = useQuery({
    queryKey: ["learning", "lessons"],
    queryFn: getLearningLessons,
    staleTime: 60_000,
  });
  const lessons = lessonsQuery.data?.lessons ?? EMPTY_LESSONS;

  const levels = useMemo(() => {
    const byId = new Map(lessons.map((lesson) => [lesson.levelId, lesson.levelName] as const));
    return [...byId].map(([id, name]) => ({ id, name }));
  }, [lessons]);
  const levelOrder = useMemo(
    () => new Map(levels.map((level, index) => [level.id, index])),
    [levels],
  );
  const subjects = useMemo(
    () =>
      [
        ...new Set(
          lessons
            .filter((lesson) => levelFilter === "all" || lesson.levelId === levelFilter)
            .map((lesson) => lesson.subject),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [lessons, levelFilter],
  );
  const filteredLessons = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return lessons
      .filter((lesson) => levelFilter === "all" || lesson.levelId === levelFilter)
      .filter((lesson) => subjectFilter === "all" || lesson.subject === subjectFilter)
      .filter((lesson) => {
        if (!term) return true;
        return [
          lesson.title,
          lesson.summary,
          lesson.subject,
          lesson.levelName,
          ...lesson.objectives,
        ].some((value) => value.toLocaleLowerCase().includes(term));
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "shortest") {
          return a.estimatedMinutes - b.estimatedMinutes || a.title.localeCompare(b.title);
        }
        if (sort === "recent") {
          return (
            (b.reviewedAt ?? "").localeCompare(a.reviewedAt ?? "") || a.title.localeCompare(b.title)
          );
        }
        return (
          (levelOrder.get(a.levelId) ?? Number.MAX_SAFE_INTEGER) -
            (levelOrder.get(b.levelId) ?? Number.MAX_SAFE_INTEGER) ||
          a.subject.localeCompare(b.subject) ||
          a.title.localeCompare(b.title)
        );
      });
  }, [lessons, levelFilter, levelOrder, search, sort, subjectFilter]);

  const groupedLessons = useMemo(() => {
    const groups = new Map<
      string,
      { levelName: string; subject: string; items: LearningLesson[] }
    >();
    for (const lesson of filteredLessons) {
      const key = `${lesson.levelId}:${lesson.subject}`;
      const group = groups.get(key) ?? {
        levelName: lesson.levelName,
        subject: lesson.subject,
        items: [],
      };
      group.items.push(lesson);
      groups.set(key, group);
    }
    return [...groups.entries()].map(([key, group]) => ({ key, ...group }));
  }, [filteredLessons]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-6 sm:p-9">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <GraduationCap className="h-5 w-5" />
          Learn first. Practise with purpose.
        </div>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Study a topic before you take its quiz.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Browse short, structured lessons by course and subject. Each lesson states what you will
          learn, links its references, and takes you to related practice when you are ready.
        </p>
        <p className="mt-4 text-sm font-medium text-foreground">
          Studying first is optional.{" "}
          <Link to="/" className="text-primary underline-offset-4 hover:underline">
            Go straight to quizzes
          </Link>{" "}
          whenever you prefer.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Source links and review status shown
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            Short, focused study sessions
          </span>
        </div>
      </section>

      <section className="mt-7" aria-label="Find a lesson">
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search lessons</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses, subjects, topics…"
              className="min-h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label>
            <span className="sr-only">Filter by course</span>
            <select
              value={levelFilter}
              onChange={(event) => {
                setLevelFilter(event.target.value);
                setSubjectFilter("all");
              }}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All courses</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by subject</span>
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Sort lessons</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="course">Sort: course and subject</option>
              <option value="title">Sort: title A–Z</option>
              <option value="recent">Sort: recently reviewed</option>
              <option value="shortest">Sort: shortest first</option>
            </select>
          </label>
        </div>
        {!lessonsQuery.isLoading && !lessonsQuery.isError && (
          <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
            Showing {filteredLessons.length} of {lessons.length} lessons
          </p>
        )}
      </section>

      {lessonsQuery.isLoading ? (
        <p className="mt-8 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading the study library…
        </p>
      ) : lessonsQuery.isError ? (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          Could not load study lessons.{" "}
          {lessonsQuery.error instanceof Error ? lessonsQuery.error.message : "Please try again."}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 font-semibold text-foreground">
            {lessons.length
              ? "No lessons match those filters"
              : "The study library is getting ready"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {lessons.length
              ? "Try a different search or clear one of the filters."
              : "No study guides are available right now. Try again later, or go straight to the quizzes whenever you prefer."}
          </p>
          {lessons.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setLevelFilter("all");
                setSubjectFilter("all");
              }}
              className="mt-4 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-7 space-y-8">
          {groupedLessons.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {group.levelName}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">{group.subject}</h2>
                </div>
                <span className="text-xs text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    to="/learn/$slug"
                    params={{ slug: lesson.slug }}
                    className="group flex min-h-52 flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {lesson.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.reviewedAt
                          ? `Reviewed ${new Date(`${lesson.reviewedAt}T00:00:00`).toLocaleDateString()}`
                          : "Expert review pending"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-6 text-foreground">
                      {lesson.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                      {lesson.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {lesson.estimatedMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                        Study lesson{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
