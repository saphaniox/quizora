import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Mail, ShieldCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Quitech" },
      {
        name: "description",
        content:
          "Quitech privacy policy explaining what data is collected, how it is used, and how users can request account deletion.",
      },
      { property: "og:title", content: "Privacy Policy - Quitech" },
      {
        property: "og:description",
        content: "How Quitech handles account, quiz, certificate, support, and ads data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const collectedData = [
  {
    title: "Account data",
    body: "When you create an account, Quitech stores your email address, display name, password hash, session records, and account timestamps.",
  },
  {
    title: "Quiz activity",
    body: "Quitech stores quiz submissions, scores, time spent, leaderboard entries, and certificate records needed to show results and verify certificates.",
  },
  {
    title: "Device and usage data",
    body: "The app may use cookies, local storage, hosting logs, diagnostics, and basic analytics to keep the service reliable and improve the experience.",
  },
  {
    title: "Support messages",
    body: "If you contact support, Quitech may process your email address and the information you include so the team can respond.",
  },
  {
    title: "Advertising data",
    body: "If ads are enabled, ad partners may process identifiers, approximate location, device details, and ad interaction data according to your consent choices and their SDK settings.",
  },
] as const;

const uses = [
  "Provide quizzes, results, progress history, leaderboards, and certificate verification.",
  "Authenticate accounts, keep sessions secure, prevent abuse, and troubleshoot issues.",
  "Respond to support, privacy, and account deletion requests.",
  "Measure performance and improve quiz content and product quality.",
  "Show and measure ads when advertising is enabled in the app.",
] as const;

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Privacy Policy
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your progress belongs to you.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Last updated: August 30, 2026. This policy explains how Quitech online ("Quitech", "we",
          "us", or "our") collects, uses, shares, protects, and deletes information for learners 13
          and older.
        </p>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {collectedData.map((item) => (
          <article key={item.title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Database className="h-4 w-4 text-primary" />
              {item.title}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            How Quitech uses data
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {uses.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Sharing and processors
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Quitech does not sell personal information. We may share data with service providers
            that help run hosting, databases, analytics, support, security, and ads. These providers
            process data only for the service purposes described here, unless you separately agree
            to another use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Security, retention, and deletion
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Quitech uses HTTPS, secure cookies in production, password hashing, and access-limited
            infrastructure to protect account data. We keep account and quiz records while your
            account is active or while they are needed for security, support, certificate
            verification, legal, or abuse-prevention reasons. You can request deletion from inside
            the app or from the public deletion page.
          </p>
          <Link
            to="/delete-account"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Contact</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For privacy questions, corrections, or deletion help, contact{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:privacy@quitech.online"
            >
              privacy@quitech.online
            </a>
            .
          </p>
          <Link
            to="/support"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Mail className="h-4 w-4" />
            Support center
          </Link>
        </div>
      </section>
    </div>
  );
}
