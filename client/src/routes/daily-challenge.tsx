import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
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
      <p className="mt-2 text-sm text-muted-foreground">
        One focused practice session to keep your learning moving. Today’s featured topic is the
        same for everyone and changes each day.
      </p>

      {featured ? (
        <section className="mt-6 rounded-xl border border-primary/25 bg-card p-5 shadow-sm sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "long",
              timeZone: "UTC",
            }).format(new Date(`${day}T12:00:00Z`))}
          </span>
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            {featured.levelName} · {featured.category}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">{featured.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{featured.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Try a 10-question round, then review the explanations and note one idea you want to
            practise again.
          </p>
          <Link
            to="/quizzes/$id"
            params={{ id: featured.id }}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Start today’s challenge <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <p className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          Challenges are temporarily unavailable. Please try again shortly.
        </p>
      )}

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        The daily topic is selected using the UTC date. Your quiz result and progress are saved
        through the usual quiz flow.
      </p>

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>
    </div>
  );
}
