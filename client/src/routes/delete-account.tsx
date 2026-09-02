import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "Account Deletion Request - Quitech" },
      {
        name: "description",
        content: "Request deletion of a Quitech account and associated account data.",
      },
      { property: "og:title", content: "Account Deletion Request - Quitech" },
      {
        property: "og:description",
        content: "Request deletion of a Quitech account and associated account data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteAccountRequestPage,
});

function DeleteAccountRequestPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Account deletion request
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Need your Quitech account removed?
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          If you are signed in, the quickest option is to open your certificate wallet and delete
          the account there. If you cannot sign in, email quitech@saptechug.com with the email
          address or phone number connected to your Quitech account.
        </p>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <article className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <UserRound className="h-4 w-4 text-primary" />
            Signed-in users
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Open your certificate wallet to check your account details and start deletion while you
            are signed in.
          </p>
          <Link
            to="/wallet"
            className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open certificate wallet
          </Link>
        </article>

        <article className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <Mail className="h-4 w-4 text-primary" />
            Cannot sign in
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Send an email to{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:quitech@saptechug.com"
            >
              quitech@saptechug.com
            </a>{" "}
            with the subject "Delete my Quitech account". We may ask a few questions to make sure we
            are deleting the right account.
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-card-foreground">What happens after deletion</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We remove the login account and its active sessions. Some records may remain when they are
          needed for security, abuse prevention, legal compliance, or certificate verification, as
          explained in the Privacy Policy.
        </p>
      </section>
    </div>
  );
}
