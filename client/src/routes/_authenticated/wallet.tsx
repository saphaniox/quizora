import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { loadCertificates } from "@/lib/attempt-store";
import { deleteCurrentAccount, getCurrentUser, type AccountUser } from "@/lib/api";
import type { Certificate } from "@/types/quiz";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "Certificate wallet - Quitech" },
      {
        name: "description",
        content:
          "Every Quitech certificate saved on this device, with a shareable verification link.",
      },
      { property: "og:title", content: "Certificate wallet - Quitech" },
      { property: "og:description", content: "View and verify certificates earned on Quitech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setCertificates(loadCertificates());
    let alive = true;
    void getCurrentUser()
      .then(({ user }) => {
        if (alive) setUser(user);
      })
      .catch(() => {
        if (alive) setDeleteError("We could not load your account details right now.");
      })
      .finally(() => {
        if (alive) setLoadingUser(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const canDelete =
    Boolean(user) && confirmation.trim().toLowerCase() === "delete my account" && !deleting;

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canDelete) return;
    setDeleting(true);
    setDeleteError(null);
    setDeleteMessage(null);
    try {
      await deleteCurrentAccount();
      setUser(null);
      setConfirmation("");
      setDeleteMessage("Your account has been deleted. You are being signed out.");
      window.setTimeout(() => {
        void navigate({ to: "/", replace: true });
      }, 900);
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "Account deletion failed";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Certificate wallet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Certificates earned on this device.</p>
        </div>
      </div>

      {user && (
        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <UserRound className="h-4 w-4 text-primary" />
                Account
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Signed in as <span className="font-medium text-card-foreground">{user.email}</span>.
                Account deletion removes your login account and active sessions. Certificate and
                leaderboard records that were submitted separately can be reviewed by privacy
                support.
              </p>
            </div>

            <form onSubmit={(event) => void handleDelete(event)} className="w-full max-w-sm">
              <label
                htmlFor="wallet-delete-confirmation"
                className="block text-sm font-medium text-foreground"
              >
                Type "delete my account" to confirm
              </label>
              <input
                id="wallet-delete-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={!canDelete}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete account
              </button>
            </form>
          </div>

          {deleteMessage && (
            <p className="mt-4 flex items-start gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {deleteMessage}
            </p>
          )}
          {deleteError && (
            <p className="mt-4 flex items-start gap-2 text-sm text-destructive">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {deleteError}
            </p>
          )}
        </section>
      )}

      {loadingUser && (
        <div className="mt-8 flex items-center gap-2 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading account details...
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <Award className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No certificates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a full section and score 80% or higher to earn your first one.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse sections
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate) => (
            <Link
              key={certificate.code}
              to="/certificate/$code"
              params={{ code: certificate.code }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {certificate.levelName}
              </p>
              <h2 className="mt-1 font-semibold text-card-foreground">{certificate.quizTitle}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {certificate.category} - {certificate.percentage}% score
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">{certificate.code}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
