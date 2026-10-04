import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";
import { getLevels } from "@/lib/api";
import { offlineCatalogue } from "@/lib/offline-catalogue";
import { studyGuides } from "@/lib/learning-pages";

export const Route = createFileRoute("/study-guides")({
  head: () => ({
    meta: [
      { title: "Study guides - Quitech" },
      {
        name: "description",
        content: "Practical, learner-friendly study strategies and guided practice topics.",
      },
      { property: "og:title", content: "Study guides - Quitech" },
      {
        property: "og:description",
        content: "Build a steady study routine with practical guides and quiz practice.",
      },
    ],
  }),
  component: StudyGuidesPage,
});

function StudyGuidesPage() {
  const { data } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
    initialData: offlineCatalogue,
    staleTime: 0,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Study guides</h1>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Simple strategies for focused practice, better recall, and calmer revision. Use the guides
        with any topic in the Quitech catalogue.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {studyGuides.map((guide, index) => (
          <article key={guide.title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">
                  {index + 1}. {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.copy}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
        <h2 className="text-lg font-semibold text-foreground">Choose a topic to practise</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a section that matches what you are learning today.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.levels.flatMap((level) =>
            level.sections.slice(0, 3).map((section) => (
              <Link
                key={section.id}
                to="/quizzes/$id"
                params={{ id: section.id }}
                className="rounded-md border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary/50"
              >
                {section.title}
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  {level.name}
                </span>
              </Link>
            )),
          )}
        </div>
      </section>

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>
    </div>
  );
}
