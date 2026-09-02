import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Quitech" },
      {
        name: "description",
        content:
          "The rules for using Quitech, including accounts, quizzes, certificates, fair use, and support, for learners 13 and above.",
      },
      { property: "og:title", content: "Terms of Service - Quitech" },
      { property: "og:description", content: "Rules for using Quitech quizzes and certificates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const terms = [
  {
    title: "Who can use Quitech",
    body: "Quitech is for learners 13 and above. If your country requires parental permission for your age group, please use the service with a parent or guardian's permission.",
  },
  {
    title: "Accounts",
    body: "Keep your sign-in details private and give us accurate information when you create an account or earn a certificate. If you add a country, it may appear beside your name on the public leaderboard. You can retake quizzes, but only your best score counts toward your ranking.",
  },
  {
    title: "Learning content",
    body: "Quitech offers practice, feedback, scores, and certificates for learning. A Quitech certificate is not a replacement for formal school, college, professional, or legal certification.",
  },
  {
    title: "Fair use",
    body: "Please do not attack or overload the service, scrape large amounts of content, submit made-up results, manipulate the leaderboard, impersonate someone else, or use Quitech for anything unlawful.",
  },
  {
    title: "Ads and third-party services",
    body: "We may show ads and use trusted services for hosting, analytics, security, and support. Any ads shown in the app should be suitable for its store rating and described in the relevant store listing.",
  },
  {
    title: "Changes",
    body: "Quitech will change over time. We may update features, content, pricing, these terms, or availability. When you keep using the service after an update, the latest version of these terms applies.",
  },
] as const;

function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <HeartHandshake className="h-3.5 w-3.5 text-primary" />
          Terms of Service
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Clear rules for a better learning space.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Last updated: August 31, 2026. These terms explain how learners 13 and above can use
          Quitech to learn, challenge themselves, track progress, and verify certificates.
        </p>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {terms.map((item) => (
          <article key={item.title} className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Certificates
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A certificate records what you completed on Quitech. It includes your name, the quiz
            name, your score, and a verification code. Please do not edit it or present it in a way
            that makes your result look different from what you achieved.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Need help?
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Have a question about your account, content, privacy, or safety? Contact support and we
            will help where we can. We may remove content, accounts, or results that seriously break
            these terms.
          </p>
          <Link
            to="/support"
            className="mt-4 inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Contact support
          </Link>
        </div>
      </section>
    </div>
  );
}
