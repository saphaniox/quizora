import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, FileText, LifeBuoy, Mail, ShieldQuestion } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support - Quitech" },
      {
        name: "description",
        content:
          "Contact Quitech support for account, quiz, certificate, privacy, and safety questions.",
      },
      { property: "og:title", content: "Support - Quitech" },
      {
        property: "og:description",
        content: "Get help with Quitech accounts, quizzes, certificates, and privacy requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportPage,
});

const helpOptions = [
  {
    title: "Account help",
    body: "Sign-in problems, profile questions, password issues, and deletion requests.",
    icon: LifeBuoy,
  },
  {
    title: "Quiz or certificate issue",
    body: "Wrong answer feedback, missing certificate records, leaderboard concerns, or verification issues.",
    icon: FileText,
  },
  {
    title: "Privacy and safety",
    body: "Data access, correction, deletion, ads privacy, and user safety questions.",
    icon: ShieldQuestion,
  },
  {
    title: "Bug report",
    body: "Broken pages, failed requests, loading problems, or anything that feels off in the app.",
    icon: Bug,
  },
] as const;

function SupportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <LifeBuoy className="h-3.5 w-3.5 text-primary" />
          Support
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          We are here when something needs a human.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Tell us what happened, which quiz or certificate was involved, and the email address or
          phone number on your account if you have one. We aim to respond as quickly as possible.
        </p>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {helpOptions.map(({ title, body, icon: Icon }) => (
          <article key={title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Icon className="h-4 w-4 text-primary" />
              {title}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
          Contact Quitech
        </h2>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <a
            href="mailto:support@quitech.online"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Mail className="h-4 w-4 text-primary" />
            support@quitech.online
          </a>
          <a
            href="mailto:privacy@quitech.online"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Mail className="h-4 w-4 text-primary" />
            privacy@quitech.online
          </a>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Signed-in users can delete their account from the certificate wallet. If you cannot sign
          in, email privacy support with the email address or phone number connected to your
          account.
        </p>
        <Link
          to="/wallet"
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open certificate wallet
        </Link>
      </section>
    </div>
  );
}
