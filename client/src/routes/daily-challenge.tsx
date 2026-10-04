import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";
import { getLevels } from "@/lib/api";
import { offlineCatalogue } from "@/lib/offline-catalogue";

export const Route = createFileRoute("/daily-challenge")({
  head: () => ({
    meta: [
      { title: "Daily challenge - Quitech" },
      {
        name: "description",
        content: "Take a focused 10-question practice challenge on Quitech today.",
      },
      { property: "og:title", content: "Daily challenge - Quitech" },
      {
        property: "og:description",
        content: "Build a daily learning habit with a focused Quitech quiz challenge.",
      },
    ],
  }),
  component: DailyChallengePage,
});

function DailyChallengePage() {
  const { data } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
    initialData: offlineCatalogue,
    staleTime: 0,
  });

  const day = new Date().toISOString().slice(0, 10);
  const sections = data.levels.flatMap((level) => level.sections);
  let hash = 0;
  for (const character of day) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const featured = sections.length ? sections[hash % sections.length] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Daily challenge</h1>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
        A small, focused way to keep learning in motion. Take today’s topic at your own pace, then
        use what you discover to choose your next step.
      </p>

      {featured ? (
        <>
          <section className="mt-6 overflow-hidden rounded-xl border border-primary/25 bg-card shadow-sm">
            <div className="border-b border-border bg-primary/5 px-5 py-4 sm:px-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "long",
                  timeZone: "UTC",
                }).format(new Date(`${day}T12:00:00Z`))}{" "}
                · UTC
              </span>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {featured.levelName} · {featured.category}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {featured.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
                  10-question practice round
                </span>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
                  {featured.difficulty} level
                </span>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <h3 className="font-semibold text-foreground">Make the most of the round</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  "Read each question carefully and give it a real attempt.",
                  "Notice which ideas feel clear and which ones need another look.",
                  "After you finish, review the explanations and choose one takeaway.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
              <Link
                to="/quizzes/$id"
                params={{ id: featured.id }}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start today’s challenge <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">After the quiz</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Take a moment to review your answers. Write down one question that taught you
                something, or one idea you want to revisit later.
              </p>
              <Link
                to="/revision-notes"
                className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                Browse revision notes <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
            <article className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Build a steady routine</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A challenge is a prompt to practise, not a measure of your ability. Return to a
                topic when you have time, and use mistakes as clues about what to review.
              </p>
              <Link
                to="/study-guides"
                className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                See practical study guides <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          </section>
        </>
      ) : (
        <p className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          Challenges are temporarily unavailable. Please try again shortly.
        </p>
      )}

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        The featured topic is selected by the UTC date, so the challenge changes at midnight UTC.
        Starting it opens the regular Quitech quiz flow, where available quiz and progress features
        work as usual.
      </p>

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>
    </div>
  );
}
