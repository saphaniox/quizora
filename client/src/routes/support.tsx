import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, FileText, LifeBuoy, Mail, ShieldQuestion } from "lucide-react";

const CONTACT_EMAIL = "quitech@saptechug.com";

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
    body: "Trouble signing in, updating your profile, recovering access, or deleting an account.",
    icon: LifeBuoy,
  },
  {
    title: "Quiz or certificate issue",
    body: "A score looks wrong, a certificate is missing, or a leaderboard entry needs checking.",
    icon: FileText,
  },
  {
    title: "Privacy and safety",
    body: "Questions about your data, ads privacy, account deletion, or keeping the app safe.",
    icon: ShieldQuestion,
  },
  {
    title: "Bug report",
    body: "Something will not load, a button is stuck, or the app is behaving strangely.",
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
          Need a hand? Talk to a real person.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Send us a message in your own words and we will take it from there. It helps to include
          the quiz name, certificate code, account email or phone number, and what you expected to
          happen, when those details are relevant.
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
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Quitech support`}
          className="mt-5 inline-flex w-full items-center gap-3 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
        >
          <Mail className="h-4 w-4 text-primary" />
          {CONTACT_EMAIL}
        </a>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          You can delete your account from the certificate wallet when you are signed in. If you
          cannot sign in, email us from the address connected to your account, or include the phone
          number on the account, and use the subject "Delete my Quitech account".
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
