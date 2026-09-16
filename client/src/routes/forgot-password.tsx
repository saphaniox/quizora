import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "quitech@saptechug.com";
const SUPPORT_WHATSAPP = "256706564628";
const WHATSAPP_MESSAGE = "Hi Quitech team, I forgot my password and need help getting back into my account.";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password - Quitech" },
      {
        name: "description",
        content: "Get help recovering access to your Quitech account.",
      },
      { property: "og:title", content: "Forgot password - Quitech" },
      { property: "og:description", content: "Get help recovering access to your Quitech account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Account access
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Need help getting back in?
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          We can help you recover your Quitech account. Contact the team using one of the options
          below and include the email address or phone number connected to your account.
        </p>
      </div>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Quitech%20password%20help`}
          className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-card-foreground">Email the team</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Send your account email or phone number to {SUPPORT_EMAIL} and explain that you need
            password help.
          </p>
          <span className="mt-5 inline-flex text-sm font-medium text-primary">Start an email</span>
        </a>

        <a
          href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-emerald-500/50 hover:bg-accent"
        >
          <MessageCircle className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 text-lg font-semibold text-card-foreground">Message us on WhatsApp</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Send a message to the Quitech team with the contact details on your account.
          </p>
          <span className="mt-5 inline-flex text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Open WhatsApp
          </span>
        </a>
      </section>

      <p className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground">
        For your security, never send your current or previous password. The team may ask questions
        to confirm that the account belongs to you.
      </p>

      <Link to="/auth" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
