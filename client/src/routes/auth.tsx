import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { CountrySelect } from "@/components/CountrySelect";
import { loginAccount, loginWithGoogle, registerAccount } from "@/lib/api";
import { COUNTRIES, findCountryByIso, type CountryDialCode } from "@/lib/countries";
import { syncPushNotifications } from "@/lib/native-services";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in or create an account - Quitech" }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup";
type Method = "email" | "phone" | null;

function safeNext(raw: string | null) {
  return raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

function initialMode(): Mode {
  return typeof window !== "undefined" &&
    new URLSearchParams(location.search).get("mode") === "signup"
    ? "signup"
    : "signin";
}

function initialCountry(): CountryDialCode {
  const region = typeof navigator !== "undefined" ? navigator.language.split("-").pop() : "UG";
  return findCountryByIso(region ?? "UG") ?? COUNTRIES[0]!;
}

function phoneE164(country: CountryDialCode, value: string) {
  const compact = value.trim().replace(/[().\s-]/g, "");
  if (compact.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : "";
  let digits = compact.replace(/\D/g, "").replace(/^0+/, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  if (digits.startsWith(dialDigits) && digits.length > dialDigits.length + 3)
    digits = digits.slice(dialDigits.length);
  return digits.length >= 4 && digits.length + dialDigits.length <= 15
    ? `${country.dialCode}${digits}`
    : "";
}

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [method, setMethod] = useState<Method>(null);
  const [country, setCountry] = useState(initialCountry);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next =
    typeof window === "undefined"
      ? "/"
      : safeNext(new URLSearchParams(location.search).get("next"));

  const finish = (user: Awaited<ReturnType<typeof loginAccount>>["user"]) => {
    queryClient.setQueryData(["auth", "me"], { user });
    void syncPushNotifications();
    toast.success(mode === "signup" ? "Welcome to Quitech" : "Welcome back");
    void navigate({ to: user.mustChangePassword ? "/wallet" : next, replace: true });
  };

  const submitCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!method) return;
    const contact = method === "email" ? email.trim() : phoneE164(country, phone);
    if (!contact) {
      setError(
        method === "email"
          ? "Enter a valid email address."
          : "Choose a country code and enter a valid phone number.",
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        finish((await loginAccount({ identifier: contact, password })).user);
      } else {
        const fallback =
          method === "email"
            ? email.split("@")[0]!
            : `Learner ${phone.replace(/\D/g, "").slice(-4)}`;
        finish(
          (
            await registerAccount({
              ...(method === "email" ? { email: contact } : { phoneE164: contact }),
              password,
              displayName: name.trim() || fallback,
            })
          ).user,
        );
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not complete that request.");
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = async () => {
    const webClientId = import.meta.env["VITE_GOOGLE_WEB_CLIENT_ID"] as string | undefined;
    const configuredRedirectUrl = import.meta.env["VITE_GOOGLE_REDIRECT_URL"] as string | undefined;
    if (!webClientId) {
      setError("Google sign-in is being configured. Please use email or phone for now.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const redirectUrl = configuredRedirectUrl || `${window.location.origin}/auth`;
      await SocialLogin.initialize({ google: { webClientId, mode: "online", redirectUrl } });
      const response = await SocialLogin.login({
        provider: "google",
        options: { scopes: ["email", "profile"] },
      });
      const credential = "idToken" in response.result ? response.result.idToken : null;
      if (!credential) throw new Error("Google did not return a sign-in credential.");
      finish((await loginWithGoogle(credential)).user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google sign-in was not completed.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setMethod(null);
    setError(null);
    setPassword("");
  };

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-8 sm:py-14">
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-lg shadow-slate-200/50 dark:shadow-none">
        <div className="border-b border-border bg-emerald-50/70 px-6 py-4 dark:bg-emerald-950/20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> Secure member access
          </p>
        </div>
        <div className="p-6 sm:p-8">
          {method && (
            <button
              type="button"
              onClick={() => {
                setMethod(null);
                setError(null);
              }}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Choose another method
            </button>
          )}
          <h1 className="text-3xl font-bold text-card-foreground sm:text-4xl">
            {mode === "signin" ? "Welcome back" : "Join Quitech"}
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {method
              ? mode === "signin"
                ? "Enter your details and continue where you left off."
                : "Create your account and keep every achievement in one place."
              : `Choose how you would like to ${mode === "signin" ? "sign in" : "create your account"}.`}
          </p>

          {!method ? (
            <div className="mt-8 space-y-3">
              <AuthChoice
                icon={<Mail className="h-6 w-6 text-rose-700" />}
                tone="bg-rose-50"
                title="Continue with email"
                copy="Use your email address and password"
                onClick={() => setMethod("email")}
              />
              <AuthChoice
                icon={<Phone className="h-6 w-6 text-emerald-700" />}
                tone="bg-emerald-50"
                title="Continue with phone number"
                copy="Use your country code and phone number"
                onClick={() => setMethod("phone")}
              />
              <AuthChoice
                icon={<FcGoogle className="h-6 w-6" />}
                tone="bg-slate-50"
                title="Continue with Google"
                copy="Use the Google account on your device"
                onClick={() => void googleLogin()}
                disabled={busy}
              />
            </div>
          ) : (
            <form onSubmit={(event) => void submitCredentials(event)} className="mt-7 space-y-5">
              {mode === "signup" && (
                <Field label="Your name" icon={<UserRound className="h-4 w-4" />}>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="How your certificate should read"
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </Field>
              )}
              {method === "email" ? (
                <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </Field>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-foreground">Phone number</label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[190px_1fr]">
                    <CountrySelect
                      id="auth-country"
                      value={country}
                      onChange={(value) => value && setCountry(value)}
                      showDialCode
                      buttonClassName="min-h-[48px]"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="700 000 000"
                      className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              )}
              <Field label="Password" icon={<LockKeyhole className="h-4 w-4" />}>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                />
              </Field>
              {mode === "signin" && (
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                disabled={busy}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in securely" : "Create my account"}
              </button>
            </form>
          )}

          {!method && error && (
            <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-primary hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="font-medium underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-medium underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function AuthChoice({
  icon,
  tone,
  title,
  copy,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  tone: string;
  title: string;
  copy: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-28 w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent disabled:opacity-60"
    >
      <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-lg ${tone}`}>
        {icon}
      </span>
      <span>
        <span className="block text-lg font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{copy}</span>
      </span>
    </button>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
