import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use - Quitech" },
      {
        name: "description",
        content:
          "Quitech terms of use for learners 13 and older, including accounts, acceptable use, certificates, and support.",
      },
      { property: "og:title", content: "Terms of Use - Quitech" },
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
    body: "Quitech is designed for learners 13 and older. If you are under the age of digital consent in your country, use Quitech only with permission from a parent or guardian.",
  },
  {
    title: "Accounts",
    body: "Keep your login details private and use accurate information when creating an account or certificate. You are responsible for activity that happens through your account.",
  },
  {
    title: "Learning content",
    body: "Quitech provides educational practice, feedback, scores, and certificates. It does not replace formal school, college, professional, or legal certification.",
  },
  {
    title: "Fair use",
    body: "Do not attack the service, scrape content at scale, submit fake results, abuse leaderboards, impersonate another person, or use Quitech for unlawful activity.",
  },
  {
    title: "Ads and third-party services",
    body: "Quitech may show ads or use third-party services for hosting, analytics, security, and support. Ads must be appropriate for the app rating and disclosed in the app store listing.",
  },
  {
    title: "Changes",
    body: "Quitech may update features, content, pricing, legal pages, or service availability. The latest terms on this page apply when you continue using the app.",
  },
] as const;

function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <HeartHandshake className="h-3.5 w-3.5 text-primary" />
          Terms of Use
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Clear rules for a better learning space.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Last updated: August 30, 2026. These terms explain how learners 13 and older can use
          Quitech online to learn, challenge themselves, track progress, and verify certificates.
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
            Certificates are proof of completion inside Quitech. They include the learner name, quiz
            name, score, and verification code. Do not edit or present a certificate in a way that
            misrepresents your result.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Need help?
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For account, content, privacy, or safety questions, contact support. We may remove
            content, accounts, or results that break these terms.
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
