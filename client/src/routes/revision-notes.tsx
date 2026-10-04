import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, Check, Lightbulb } from "lucide-react";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";
import { revisionNoteGroups } from "@/lib/learning-pages";

export const Route = createFileRoute("/revision-notes")({
  head: () => ({
    meta: [
      { title: "Revision notes - Quitech" },
      {
        name: "description",
        content: "Quick revision reminders for maths, science, English, and problem solving.",
      },
      { property: "og:title", content: "Revision notes - Quitech" },
      {
        property: "og:description",
        content: "Review key formulas and learning reminders, then practise with a quiz.",
      },
    ],
  }),
  component: RevisionNotesPage,
});

function RevisionNotesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <BookOpenCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Revision notes</h1>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
        Keep key ideas close at hand. Each section includes a concise reminder, a worked example,
        and a check to help you spot common slips.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Use these notes actively</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cover the answer, try the example yourself, then compare your steps. These are
              revision prompts—not a replacement for the methods or notation required by your
              course.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {revisionNoteGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{group.introduction}</p>
            <dl className="mt-4 divide-y divide-border">
              {group.notes.map(([label, note]) => (
                <div
                  key={label}
                  className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-3"
                >
                  <dt className="text-sm font-medium text-foreground">{label}</dt>
                  <dd className="text-sm text-muted-foreground">{note}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Worked example
              </p>
              <p className="mt-2 text-sm font-medium leading-5 text-foreground">
                {group.workedExample.question}
              </p>
              <ol className="mt-3 space-y-2">
                {group.workedExample.steps.map((step, index) => (
                  <li key={step} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-semibold text-foreground">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-3 flex gap-2 border-t border-border pt-3 text-sm font-medium leading-5 text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {group.workedExample.answer}
              </p>
            </div>
            <p className="mt-3 rounded-md bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
              <span className="font-semibold text-foreground">Check:</span> {group.reminder}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">Turn a reminder into practice</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Pick a related quiz section, work through a short round, and review the explanations for
          any answers you want to strengthen. You can return to these notes whenever you need a
          refresher.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse quiz sections
        </Link>
      </div>

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>
    </div>
  );
}
