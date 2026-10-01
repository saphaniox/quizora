import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, BookOpenCheck, CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import {
  getPublicEmailPreferences,
  savePublicEmailPreferences,
  type EmailPreferences,
} from "@/lib/api";

export const Route = createFileRoute("/email-preferences")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [
      { title: "Email preferences - Quitech" },
      {
        name: "description",
        content: "Choose which optional Quitech emails you would like to receive.",
      },
    ],
  }),
  component: EmailPreferencesPage,
});

const initialPreferences: EmailPreferences = {
  learningUpdates: true,
  reminders: true,
  productUpdates: true,
};

function EmailPreferencesPage() {
  const { token } = Route.useSearch();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!token) {
      setError("This email preference link is incomplete.");
      setLoading(false);
      return;
    }
    void getPublicEmailPreferences(token)
      .then(({ preferences: loaded }) => {
        if (active) {
          setPreferences(loaded);
          setReady(true);
        }
      })
      .catch((failure) => {
        if (active) {
          setError(
            failure instanceof Error ? failure.message : "We could not load your email choices.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || saving) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const result = await savePublicEmailPreferences(token, preferences);
      setPreferences(result.preferences);
      setSaved(true);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "We could not save your email choices.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Emails that suit you</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep the useful messages and leave the rest.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 border-t border-border py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your choices...
        </div>
      ) : error && !ready ? (
        <p className="mt-8 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <form onSubmit={(event) => void save(event)} className="mt-8 border-t border-border pt-6">
          <PreferenceChoice
            icon={BookOpenCheck}
            title="Learning updates"
            description="Quiz results, personal bests, certificates, and progress worth celebrating."
            checked={preferences.learningUpdates}
            onChange={(checked) =>
              setPreferences((current) => ({ ...current, learningUpdates: checked }))
            }
          />
          <PreferenceChoice
            icon={Bell}
            title="Gentle reminders"
            description="Saved quiz reminders and an occasional note when your learning has been quiet."
            checked={preferences.reminders}
            onChange={(checked) =>
              setPreferences((current) => ({ ...current, reminders: checked }))
            }
          />
          <PreferenceChoice
            icon={Mail}
            title="Quitech news"
            description="New topics, meaningful app updates, and service announcements."
            checked={preferences.productUpdates}
            onChange={(checked) =>
              setPreferences((current) => ({ ...current, productUpdates: checked }))
            }
          />

          <div className="mt-6 flex items-start gap-3 rounded-md border border-border bg-secondary/30 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              Important account and security messages stay on so you can notice changes to your
              account.
            </p>
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Your email choices are saved.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || !ready}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save choices
            </button>
            <Link to="/" className="text-sm font-medium text-primary hover:underline">
              Return to Quitech
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}

function PreferenceChoice({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 border-b border-border py-5 last:border-b-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-2 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}
