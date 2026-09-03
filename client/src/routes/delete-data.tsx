import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";

const CONTACT_EMAIL = "quitech@saptechug.com";

export const Route = createFileRoute("/delete-data")({
  head: () => ({
    meta: [
      { title: "Delete your data - Quitech" },
      {
        name: "description",
        content:
          "Learn how to ask Quitech to delete some or all of the personal data linked to your account.",
      },
      { property: "og:title", content: "Delete your data - Quitech" },
      {
        property: "og:description",
        content: "Learn how to ask Quitech to delete your account and quiz data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteDataPage,
});

const deletedData = [
  "Account email address or phone number and display name.",
  "Saved quiz progress, quiz attempts, scores, and time records.",
  "Optional country information linked to your account.",
  "Saved certificates and account session records, when eligible for deletion.",
] as const;

const retainedData = [
  "Information required for legal compliance, security, or abuse prevention.",
  "Certificate verification records needed to keep previously issued certificates verifiable.",
] as const;

function DeleteDataPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Your data, your choice
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Want us to delete your data?
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          You can ask us to remove some or all of the personal data connected to your Quitech
          account without closing the account itself. You do not need to sign in to use this page.
        </p>
      </div>

      <section className="mt-10 rounded-lg border border-primary/40 bg-primary/5 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Here is how to make a request</h2>
        <ol className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              1
            </span>
            <span>
              Email{" "}
              <a
                className="font-medium text-primary hover:underline"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              2
            </span>
            <span>
              Use the subject line{" "}
              <strong className="font-semibold text-foreground">Delete my Quitech data</strong> and
              state whether you want some data or all data deleted.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              3
            </span>
            <span>
              Tell us the email address or phone number connected to your account. This helps us
              confirm that we are changing the right account.
            </span>
          </li>
        </ol>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20Quitech%20data`}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="h-4 w-4" />
          Start an email request
        </a>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            What we can remove
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {deletedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">What we may need to keep</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {retainedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            We keep these records only for as long as we need them for the reasons above. Once we
            have verified your request, we aim to process it within 30 days. We will explain it if
            anything needs to be kept for longer.
          </p>
        </article>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        For full details, read the{" "}
        <Link className="font-medium text-primary hover:underline" to="/privacy">
          Privacy Policy
        </Link>{" "}
        or visit the{" "}
        <Link className="font-medium text-primary hover:underline" to="/delete-account">
          account deletion page
        </Link>
        .
      </p>
    </div>
  );
}
