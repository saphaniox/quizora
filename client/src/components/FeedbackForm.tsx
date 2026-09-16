import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createFeedback, type FeedbackType } from "@/lib/api";

const feedbackTypes: Record<string, FeedbackType> = {
  "Feature idea": "feature",
  "Missing quiz topic": "topic",
  "Bug report": "bug",
  "General feedback": "general",
};

export function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState("Feature idea");
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackState("sending");
    try {
      await createFeedback({
        type: feedbackTypes[feedbackType] ?? "general",
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
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-6 sm:p-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Help shape Quitech</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Have an idea for a new feature, a quiz topic we are missing, or a suggestion that would
          make the app better? We would love to hear it. You do not need to sign in.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
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
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Mail className="h-4 w-4" />
          {feedbackState === "sending" ? "Sending..." : "Send feedback"}
        </button>
        {feedbackState === "sent" && (
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Thanks. Your feedback has been sent to the Quitech team.</p>
        )}
        {feedbackState === "error" && (
          <p className="text-sm text-destructive">We could not send that right now. Please try again later.</p>
        )}
      </form>
    </section>
  );
}
