import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BadgeCheck, Gem } from "lucide-react";

const samples = [
  {
    tier: "Gold",
    questions: 100,
    score: "88/100",
    title: "English Language",
    level: "Secondary Education",
    style: "gold",
    icon: Award,
    requirement: "Complete 100 questions and score at least 80%.",
    className: "border-amber-400 bg-amber-50 text-amber-900",
    accent: "text-amber-700",
    border: "border-amber-300",
    badge: "bg-amber-100 text-amber-900",
  },
  {
    tier: "Platinum",
    questions: 200,
    score: "176/200",
    title: "Digital Literacy",
    level: "Professional",
    style: "platinum",
    icon: Award,
    requirement: "Complete 200 questions and score at least 80%.",
    className: "border-slate-400 bg-slate-50 text-slate-900",
    accent: "text-slate-700",
    border: "border-slate-300",
    badge: "bg-slate-200 text-slate-800",
  },
  {
    tier: "Diamond",
    questions: 500,
    score: "450/500",
    title: "World Geography & Global Awareness",
    level: "Core Foundations",
    style: "diamond",
    icon: Gem,
    requirement: "Complete the full 500-question section and score at least 80%.",
    className: "border-sky-400 bg-sky-50 text-sky-950",
    accent: "text-sky-800",
    border: "border-sky-300",
    badge: "bg-sky-100 text-sky-900",
  },
] as const;

export const Route = createFileRoute("/certificate-samples")({
  head: () => ({
    meta: [
      { title: "Certificate samples - Quitech" },
      {
        name: "description",
        content:
          "Preview Quitech Gold, Platinum and Diamond certificates and see how to earn them.",
      },
      { property: "og:title", content: "Certificate samples - Quitech" },
      {
        property: "og:description",
        content: "Preview Quitech Gold, Platinum and Diamond certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificateSamplesPage,
});

function CertificateSamplesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Your progress, recognized
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          See what you can earn
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Explore sample Quitech certificates. Complete the required quiz and score at least 80% to
          earn your own verified award.
        </p>
      </div>

      <div className="mt-9 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-center text-sm text-muted-foreground">
        These are demonstrations only, not real learner credentials. Real certificates have a unique
        verification code and can be checked online.
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {samples.map((sample) => {
          const Icon = sample.icon;
          return (
            <article
              key={sample.tier}
              className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <div
                className={`relative flex min-h-[24rem] flex-col items-center justify-center overflow-hidden border-4 p-5 text-center shadow-inner ${sample.className} ${sample.border}`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-2 border ${sample.border}`}
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-4 border ${sample.border} opacity-60`}
                />
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${sample.badge}`}
                >
                  Sample - demo only
                </span>
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border ${sample.border} bg-white/70`}
                  >
                    <Icon className={`h-6 w-6 ${sample.accent}`} aria-hidden="true" />
                  </div>
                  <p
                    className={`mt-3 text-xs font-semibold uppercase tracking-[0.22em] ${sample.accent}`}
                  >
                    {sample.tier} award
                  </p>
                  <h2 className="mt-2 text-lg font-bold uppercase tracking-wide">
                    Certificate of Achievement
                  </h2>
                  <p className="mt-5 text-sm">Presented with pride to</p>
                  <p className="mt-1 text-2xl font-bold">Sample Learner</p>
                  <p className="mt-4 max-w-xs text-xs leading-5">
                    After successfully completing {sample.questions} Quitech quiz questions
                  </p>
                  <p className="mt-3 max-w-xs text-base font-semibold">{sample.title}</p>
                  <div className={`mt-5 w-full border-t pt-3 text-xs ${sample.border}`}>
                    <span className="font-semibold">{sample.score}</span> questions correct
                    <span className="mx-2">|</span>
                    <span className="font-semibold">{sample.level}</span>
                  </div>
                  <p className="mt-4 max-w-xs text-[10px] italic leading-4">
                    Awarded in recognition of the learner&apos;s focused learning, persistence and
                    achievement.
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col pt-5">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <BadgeCheck className={`h-5 w-5 ${sample.accent}`} />
                  {sample.tier} certificate
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{sample.requirement}</p>
                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Explore quizzes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          Find a quiz <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/certificate"
          className="inline-flex w-full items-center justify-center rounded-md border border-input px-5 py-3 text-sm font-medium text-foreground hover:bg-accent sm:w-auto"
        >
          Verify a real certificate
        </Link>
      </div>
    </main>
  );
}
