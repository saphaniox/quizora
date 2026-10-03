import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/lib/api";
import { notifications } from "@/lib/notifications";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset your password - Quitech" },
      { name: "description", content: "Recover access to your Quitech account securely." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const token =
    typeof window === "undefined" ? "" : (new URLSearchParams(location.search).get("token") ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (token && password !== confirmPassword) {
      notifications.warning("Check your passwords", {
        description: "The passwords do not match.",
      });
      return;
    }
    setBusy(true);
    try {
      if (token) {
        await resetPassword(token, password);
        setComplete(true);
        setMessage("Your password has been changed. You can sign in now.");
      } else {
        const response = await requestPasswordReset(email);
        setComplete(true);
        setMessage(response.message);
      }
    } catch (cause) {
      notifications.error("We couldn’t complete that request", {
        description: cause instanceof Error ? cause.message : "Please try again in a little while.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
      <section className="rounded-lg border border-border bg-card p-6 shadow-lg shadow-slate-200/50 dark:shadow-none sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure account recovery
        </span>
        <h1 className="mt-5 text-3xl font-bold text-card-foreground">
          {token ? "Choose a new password" : "Let's get you back in"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {token
            ? "Create a strong password you have not used for this account before."
            : "Enter your account email and we'll send you a secure reset link."}
        </p>

        {complete ? (
          <div className="mt-8">
            <div className="flex gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-6 text-foreground">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p>{message}</p>
            </div>
            <Link
              to="/auth"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-5">
            {token ? (
              <>
                <PasswordField label="New password" value={password} onChange={setPassword} />
                <PasswordField
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </>
            ) : (
              <label className="block">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4" /> Email address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {token ? "Save new password" : "Send reset link"}
            </button>
          </form>
        )}

        {!complete && (
          <Link
            to="/auth"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        )}
      </section>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <LockKeyhole className="h-4 w-4" /> {label}
      </span>
      <input
        type="password"
        required
        minLength={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
