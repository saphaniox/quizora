import { createFileRoute, Link } from "@tanstack/react-router";
import { Bug, FileText, LifeBuoy, Mail, ShieldQuestion } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createFeedback, type FeedbackType } from "@/lib/api";

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
  const [feedbackType, setFeedbackType] = useState("Feature idea");
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackState("sending");
    try {
      await createFeedback({
        type: ({ "Feature idea": "feature", "Missing quiz topic": "topic", "Bug report": "bug", "General feedback": "general" } as Record<string, FeedbackType>)[feedbackType] ?? "general",
        message: feedback,
        contact,
      });
      setFeedback("");
      setContact("");
      setFeedbackState("sent");
    } catch {
      setFeedbackState("error");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <LifeBuoy className="h-3.5 w-3.5 text-primary" />
          Support
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Need a hand? Talk to Us
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Tell us what is going on in your own words and we will look into it. If it is relevant,
          include the quiz name, certificate code, account email or phone number, and what you
          expected to happen.
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

      <section className="mt-10 rounded-lg border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Help shape Quitech
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Have an idea for a new feature, a quiz topic we are missing, or a suggestion that would
            make the app better? We would love to hear it. You do not need to sign in.
          </p>
        </div>
        <form onSubmit={handleFeedbackSubmit} className="mt-6 max-w-2xl space-y-4">
          <div>
            <label htmlFor="feedback-type" className="block text-sm font-medium text-foreground">
              What kind of feedback is this?
            </label>
            <select
              id="feedback-type"
              value={feedbackType}
              onChange={(event) => setFeedbackType(event.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Feature idea</option>
              <option>Missing quiz topic</option>
              <option>Bug report</option>
              <option>General feedback</option>
            </select>
          </div>
          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-foreground">
              What is on your mind?
            </label>
            <textarea
              id="feedback-message"
              required
              minLength={10}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Tell us what you would like to see, change, or add..."
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="feedback-contact" className="block text-sm font-medium text-foreground">
              Where can we reach you? <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="feedback-contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="you@example.com or +256..."
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={feedbackState === "sending"}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            {feedbackState === "sending" ? "Sending..." : "Send feedback"}
          </button>
          {feedbackState === "sent" && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Thanks. Your feedback has been sent to the Quitech team.</p>
          )}
          {feedbackState === "error" && (
            <p className="text-sm text-destructive">We could not send that right now. You can email {CONTACT_EMAIL} directly.</p>
          )}
        </form>
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
