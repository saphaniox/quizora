import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck } from "lucide-react";
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
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        A quick refresher for common ideas. Check the units and methods your teacher or course
        expects, and use these notes alongside worked practice.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {revisionNoteGroups.map((group) => (
          <section key={group.title} className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
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
            <p className="mt-3 rounded-md bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
              {group.reminder}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5">
        <h2 className="font-semibold text-foreground">Turn a reminder into practice</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a quiz section, try a short round, and review the explanations for any answers you
          want to strengthen.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
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
