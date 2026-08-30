import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { loginAccount, registerAccount } from "@/lib/api";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in - Quitech certificate wallet" },
      {
        name: "description",
        content:
          "Sign in to Quitech to sync quiz progress across devices and keep every certificate you earn in one wallet.",
      },
      { property: "og:title", content: "Sign in - Quitech certificate wallet" },
      {
        property: "og:description",
        content: "Sync progress across devices and store your certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/wallet";
  return raw;
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("accountApi") === "offline"
      ? "Account services are offline. Start the API and PostgreSQL before signing in."
      : null;
  });
  const [error, setError] = useState<string | null>(null);

  const next =
    typeof window !== "undefined"
      ? safeNext(new URLSearchParams(window.location.search).get("next"))
      : "/wallet";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        await registerAccount({
          email,
          password,
          displayName: displayName.trim() || email.split("@")[0] || "Player",
        });
        void navigate({ to: next, replace: true });
      } else {
        await loginAccount({ email, password });
        void navigate({ to: next, replace: true });
      }
    } catch (failure) {
      const message = (failure as Error).message;
      setError(
        message === "Failed to fetch"
          ? "Account services are offline. Start the API and PostgreSQL, then try again."
          : message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signing in keeps your progress synced across devices and stores every certificate you
          earn.
        </p>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or use email{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={(event) => void submit(event)} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Display name
              </label>
              <input
                id="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="How your certificate should read"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to Quitech?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        You can keep practising without an account -{" "}
        <Link to="/" className="font-medium text-primary hover:underline">
          browse sections
        </Link>
        .
      </p>
    </div>
  );
}
