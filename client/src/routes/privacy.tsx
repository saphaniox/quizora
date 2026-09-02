import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Quitech" },
      {
        name: "description",
        content:
          "A plain-English guide to the information Quitech collects, why we use it, and how to ask us to delete your account.",
      },
      { property: "og:title", content: "Privacy Policy - Quitech" },
      {
        property: "og:description",
        content: "How Quitech handles account, quiz, certificate, support, and advertising data.",
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
    body: "When you make an account, we keep the email address or phone number you provide, your display name, a secure password hash, session records, and the dates connected to your account.",
  },
  {
    title: "Quiz activity",
    body: "We keep your quiz submissions, scores, time spent, optional country choice, best leaderboard scores, retakes, and certificate details. We need these records to show your results and let people verify certificates.",
  },
  {
    title: "Device and usage data",
    body: "The app may use cookies, local storage, a visitor ID for leaderboard retakes made without an account, hosting logs, error reports, and basic analytics. This helps us keep Quitech working and understand what needs improvement.",
  },
  {
    title: "Support messages",
    body: "When you contact support, we use your contact details and the information in your message to understand the problem and reply to you.",
  },
  {
    title: "Advertising data",
    body: "If advertising is enabled, advertising partners may receive identifiers, approximate location, device details, and information about ad interactions. What they receive depends on your consent choices and the settings of their software.",
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
          Last updated: August 31, 2026. This policy explains how Quitech ("we", "us", or "our")
          collects, uses, shares, protects, and deletes information for learners 13 and above.
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
            We do not sell your personal information. We may share the information needed with
            companies that host our service, run our database, provide analytics, handle support,
            protect against abuse, or deliver advertising. They may use it only to provide those
            services, unless you separately agree to something else.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Security, retention, and deletion
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We use HTTPS, secure production cookies, password hashing, and restricted access to
            protect account data. We keep account and quiz records while your account is active, or
            for as long as they are needed for security, support, certificate verification, legal
            obligations, or abuse prevention. You can delete your account from the certificate
            wallet while signed in. If you cannot sign in, email support with the email address or
            phone number connected to your account.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Contact</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For privacy questions, corrections, or deletion help, contact{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:quitech@saptechug.com"
            >
              quitech@saptechug.com
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
