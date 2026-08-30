import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { deleteCurrentAccount, getCurrentUser, type AccountUser } from "@/lib/api";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "Delete Account - Quitech" },
      {
        name: "description",
        content: "Delete your Quitech account and request removal of associated account data.",
      },
      { property: "og:title", content: "Delete Account - Quitech" },
      {
        property: "og:description",
        content: "Request deletion of your Quitech account and associated account data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteAccountPage,
});

function DeleteAccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void getCurrentUser()
      .then(({ user }) => {
        if (alive) setUser(user);
      })
      .catch((failure) => {
        const message =
          failure instanceof Error && failure.message === "Failed to fetch"
            ? "Account services are not reachable right now. You can still request deletion by email."
            : "We could not check your current sign-in status.";
        if (alive) setError(message);
      })
      .finally(() => {
        if (alive) setLoadingUser(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const canDelete =
    Boolean(user) && confirmation.trim().toLowerCase() === "delete my account" && !busy;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canDelete) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await deleteCurrentAccount();
      setUser(null);
      setConfirmation("");
      setMessage("Your account deletion request was completed for the signed-in account.");
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "Account deletion failed";
      setError(
        message === "Failed to fetch"
          ? "Account services are not reachable right now. Please email privacy@quitech.online from your account email."
          : message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <Trash2 className="h-3.5 w-3.5 text-primary" />
          Account deletion
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Delete your Quitech account.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          You can delete the signed-in account from this page. Deletion removes your login account
          and active sessions. If you need help removing leaderboard or certificate entries, contact
          privacy support from the same email address.
        </p>
      </div>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Signed-in deletion
          </div>

          {loadingUser ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking your account...
            </div>
          ) : user ? (
            <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Signed in as <span className="font-medium text-card-foreground">{user.email}</span>.
                Type <span className="font-medium text-card-foreground">delete my account</span> to
                confirm.
              </p>
              <label htmlFor="confirmation" className="block text-sm font-medium text-foreground">
                Confirmation
              </label>
              <input
                id="confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="delete my account"
              />
              <button
                type="submit"
                disabled={!canDelete}
                className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete account
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                You are not signed in. Sign in first if you want to delete your account immediately.
              </p>
              <a
                href="/auth?next=/delete-account"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in to delete
              </a>
            </div>
          )}

          {message && (
            <p className="mt-4 flex items-start gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {message}
            </p>
          )}
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-card-foreground">External deletion request</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you cannot sign in, email{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:privacy@quitech.online"
            >
              privacy@quitech.online
            </a>{" "}
            from the email connected to your Quitech account. Include "Delete my Quitech account" in
            the subject.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We may ask for limited information to confirm account ownership before deleting data.
            Some records may be retained only when needed for security, abuse prevention, legal
            compliance, or certificate verification.
          </p>
          <Link
            to="/privacy"
            className="mt-5 inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Read the privacy policy
          </Link>
        </div>
      </section>
    </div>
  );
}
