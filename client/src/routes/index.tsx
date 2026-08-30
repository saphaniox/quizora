import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Sparkles,
  GraduationCap,
  Award,
  Users,
  Trophy,
  BookOpen,
  Gamepad2,
  Globe2,
  Layers3,
} from "lucide-react";
import { getLevels } from "@/lib/api";
import { QuizCard } from "@/components/QuizCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quitech Online: Learn, Challenge & Progress" },
      {
        name: "description",
        content:
          "Quitech online helps you learn faster, challenge yourself smarter, and earn verifiable certificates across every level from beginner to professional.",
      },
      { property: "og:title", content: "Quitech Online: Learn, Challenge & Progress" },
      {
        property: "og:description",
        content:
          "Timed quizzes, instant feedback, leaderboards, and verifiable certificates from quitech.online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["levels"],
    queryFn: () => getLevels(),
  });

  const levels = useMemo(() => data?.levels ?? [], [data]);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const currentLevelId = activeLevel ?? levels[0]?.id ?? null;
  const currentLevel = levels.find((level) => level.id === currentLevelId);

  const categoryIcons = [BookOpen, GraduationCap, Globe2, Award, Trophy, Gamepad2];

  const sections = useMemo(() => {
    const list = currentLevel?.sections ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (section) =>
        section.title.toLowerCase().includes(term) ||
        section.description.toLowerCase().includes(term) ||
        section.category.toLowerCase().includes(term),
    );
  }, [currentLevel, search]);

  return (
    <div>
      <section className="border-b border-border bg-linear-to-b from-secondary/60 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {data
              ? `${data.totalQuestions.toLocaleString()} questions`
              : "Thousands of questions"}{" "}
            across every level
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Learn online, challenge yourself, and grow from beginner to expert.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Quitech online helps learners build confidence across primary, secondary, college, and
            professional tracks. Practice at your own pace, take timed quizzes, and earn a
            verifiable certificate when you reach the pass mark.
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: GraduationCap, label: "Learning levels", value: levels.length || "5" },
              {
                icon: Users,
                label: "Subject sections",
                value: levels.reduce((n, l) => n + l.sections.length, 0) || "-",
              },
              { icon: Award, label: "Certificate pass mark", value: "80%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <Icon className="h-5 w-5 text-primary" />
                <dt className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-2xl font-semibold text-card-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <p className="font-medium text-foreground">We couldn't load the quiz catalogue.</p>
            <p className="mt-1 text-sm text-muted-foreground">{(error as Error)?.message}</p>
            <button
              onClick={() => void refetch()}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-xl border border-border bg-muted/50"
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Browse the catalogue
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Choose a category
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick what you want to learn, practise, or challenge yourself on.
                </p>
              </div>

              <div
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                role="tablist"
                aria-label="Quiz categories"
              >
                {levels.map((level, index) => {
                  const Icon = categoryIcons[index % categoryIcons.length] ?? Layers3;
                  const selected = level.id === currentLevelId;
                  return (
                    <button
                      key={level.id}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveLevel(level.id)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          selected ? "bg-primary-foreground/15" : "bg-secondary",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{level.name}</span>
                        <span
                          className={cn(
                            "mt-1 block text-xs",
                            selected ? "text-primary-foreground/75" : "text-muted-foreground",
                          )}
                        >
                          {level.sections.length} quizzes - {level.questionCount.toLocaleString()}{" "}
                          questions
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search quizzes or topics..."
                  aria-label="Search quizzes or topics"
                  className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {currentLevel && (
              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {currentLevel.name} quizzes
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentLevel.tagline} - {currentLevel.ageRange} -{" "}
                      {currentLevel.questionCount.toLocaleString()} questions
                    </p>
                  </div>
                  <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                    {sections.length} available
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => (
                <QuizCard key={section.id} quiz={section} />
              ))}
            </div>

            {sections.length === 0 && (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                No sections match "{search}". Try a different search.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
