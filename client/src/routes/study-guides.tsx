import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Clock3, Lightbulb, Target } from "lucide-react";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";
import { getLevels } from "@/lib/api";
import { offlineCatalogue } from "@/lib/offline-catalogue";
import { studyGuides, studySessionSteps } from "@/lib/learning-pages";

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
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
        Make your study time more intentional. Choose one topic, practise it, and finish with a
        clear idea of what to revisit next.
      </p>

      <section className="mt-7 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              A practical session plan
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              Try this 25-minute structure
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Adjust the timing to suit your schedule. The aim is to leave with a useful next step,
              not to race through a timer.
            </p>
          </div>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {studySessionSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-primary">{step.time}</p>
                <h3 className="mt-0.5 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-9 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Habits that make practice count
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick one or two ideas to try in your next session. Small, repeatable steps are easier to
        maintain.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {studyGuides.map((guide, index) => (
          <article
            key={guide.title}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  {index + 1}. {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.copy}</p>
                <p className="mt-3 flex gap-2 rounded-md bg-muted/50 p-3 text-sm leading-5 text-foreground">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-semibold">Try this: </span>
                    {guide.action}
                  </span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-9 rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Put it to work</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Choose a topic to practise</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Select a section that matches what you are learning. After the quiz, review any
          explanations that help you decide what to practise next.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.levels.flatMap((level) =>
            level.sections.slice(0, 2).map((section) => (
              <Link
                key={section.id}
                to="/quizzes/$id"
                params={{ id: section.id }}
                className="rounded-md border border-border bg-card px-3 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
              >
                <span className="block">{section.title}</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {level.name} · {section.category}
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
