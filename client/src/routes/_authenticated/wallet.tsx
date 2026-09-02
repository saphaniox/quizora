import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  CheckCircle2,
  Loader2,
  LogOut,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { loadCertificates } from "@/lib/attempt-store";
import {
  deleteCurrentAccount,
  getCurrentUser,
  getMyActivity,
  logoutAccount,
  type AccountUser,
} from "@/lib/api";
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
  const queryClient = useQueryClient();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const localCertificates = loadCertificates();
    setCertificates(localCertificates);
    let alive = true;
    void getCurrentUser()
      .then(({ user }) => {
        if (!alive) return;
        setUser(user);
        if (!user) return;
        void getMyActivity()
          .then(({ certificates }) => {
            if (alive) setCertificates(mergeCertificates(certificates, localCertificates));
          })
          .catch(() => {
            if (alive) setDeleteError("We could not load saved account certificates right now.");
          });
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
  const accountContact = user?.email ?? user?.phoneE164 ?? "No contact saved";

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canDelete) return;
    setDeleting(true);
    setDeleteError(null);
    setDeleteMessage(null);
    try {
      await deleteCurrentAccount();
      setUser(null);
      queryClient.setQueryData(["auth", "me"], { user: null });
      setDeleteOpen(false);
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

  const handleSignOut = async () => {
    setSigningOut(true);
    setDeleteError(null);
    try {
      await logoutAccount();
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "Sign out failed";
      setDeleteError(message);
    } finally {
      setUser(null);
      queryClient.setQueryData(["auth", "me"], { user: null });
      setSigningOut(false);
      void navigate({ to: "/", replace: true });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Account &amp; certificate wallet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and certificates earned on this device.
          </p>
        </div>
      </div>

      {user && (
        <section className="mt-8 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Settings className="h-4 w-4 text-primary" />
                Account settings
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <UserRound className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-card-foreground">
                    {user.displayName}
                  </p>
                  <p className="break-all text-sm text-muted-foreground">{accountContact}</p>
                </div>
                {user.role === "admin" && (
                  <span className="w-fit rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Admin
                  </span>
                )}
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                Manage the account attached to this certificate wallet. Deleting your account
                removes your login account and active sessions; submitted certificate and
                leaderboard records can be reviewed through privacy support.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-48">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sign out
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen((open) => !open);
                  setDeleteError(null);
                  setDeleteMessage(null);
                  setConfirmation("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/30 bg-background px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </div>

          {deleteOpen && (
            <form
              onSubmit={(event) => void handleDelete(event)}
              className="mt-5 rounded-lg border border-destructive/25 bg-destructive/5 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Confirm account deletion</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    This permanently removes your login account and active sessions. Type the phrase
                    below to unlock the final delete button.
                  </p>
                  <label
                    htmlFor="wallet-delete-confirmation"
                    className="mt-4 block text-sm font-medium text-foreground"
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
                  <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
                    <button
                      type="submit"
                      disabled={!canDelete}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Permanently delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteOpen(false);
                        setConfirmation("");
                      }}
                      className="rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

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
        <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-center sm:p-10">
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
              className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-sm hover:border-primary/40"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {certificate.levelName}
              </p>
              <h2 className="mt-1 break-words font-semibold text-card-foreground">
                {certificate.quizTitle}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {certificate.category} - {certificate.percentage}% score
              </p>
              <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
                {certificate.code}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function mergeCertificates(accountCertificates: Certificate[], localCertificates: Certificate[]) {
  const seen = new Set<string>();
  return [...accountCertificates, ...localCertificates]
    .filter((certificate) => {
      if (seen.has(certificate.code)) return false;
      seen.add(certificate.code);
      return true;
    })
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 50);
}
