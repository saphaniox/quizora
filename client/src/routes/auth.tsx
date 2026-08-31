import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, Mail, Phone, UserPlus } from "lucide-react";
import { CountrySelect } from "@/components/CountrySelect";
import { loginAccount, registerAccount } from "@/lib/api";
import { COUNTRIES, findCountryByIso, type CountryDialCode } from "@/lib/countries";

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
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

function initialAuthMode(): "signin" | "signup" {
  if (typeof window === "undefined") return "signin";
  return new URLSearchParams(window.location.search).get("mode") === "signup" ? "signup" : "signin";
}

type ContactMethod = "email" | "phone";

function initialCountry(): CountryDialCode {
  if (typeof window !== "undefined") {
    const localeRegion = window.navigator.language.split("-").pop();
    if (localeRegion) {
      const country = findCountryByIso(localeRegion);
      if (country) return country;
    }
  }
  return findCountryByIso("UG") ?? COUNTRIES[0]!;
}

function nationalDigits(value: string): string {
  return value.replace(/\D/g, "").replace(/^0+/, "");
}

function phoneE164(country: CountryDialCode, value: string): string {
  const compact = value.trim().replace(/[().\s-]/g, "");
  if (compact.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : "";

  let digits = nationalDigits(value);
  const countryDigitsValue = country.dialCode.replace(/\D/g, "");
  if (digits.startsWith(countryDigitsValue) && digits.length > countryDigitsValue.length + 3) {
    digits = digits.slice(countryDigitsValue.length);
  }

  const countryDigits = country.dialCode.replace(/\D/g, "").length;
  if (digits.length < 4 || digits.length + countryDigits > 15) return "";
  return `${country.dialCode}${digits}`;
}

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"signin" | "signup">(initialAuthMode);
  const [signInMethod, setSignInMethod] = useState<ContactMethod>("email");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [signInCountry, setSignInCountry] = useState<CountryDialCode>(initialCountry);
  const [signInPhoneNumber, setSignInPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<CountryDialCode>(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState("");
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
      : "/";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const loginIdentifier =
      signInMethod === "email" ? identifier.trim() : phoneE164(signInCountry, signInPhoneNumber);
    const signupEmail = email.trim();
    const signupPhone = phoneE164(country, phoneNumber);

    if (mode === "signin" && signInMethod === "email" && !loginIdentifier) {
      setError("Enter your email address.");
      return;
    }

    if (mode === "signin" && signInMethod === "phone" && !loginIdentifier) {
      setError("Choose your country code and enter a valid phone number.");
      return;
    }

    if (mode === "signup" && contactMethod === "email" && !signupEmail) {
      setError("Enter your email address.");
      return;
    }

    if (mode === "signup" && contactMethod === "phone" && !signupPhone) {
      setError("Choose your country code and enter a valid phone number.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const phoneTail = nationalDigits(phoneNumber).slice(-4);
        const displayNameFallback =
          displayName.trim() ||
          signupEmail.split("@")[0] ||
          (phoneTail ? `Learner ${phoneTail}` : "Learner");
        const { user } = await registerAccount({
          ...(contactMethod === "email" ? { email: signupEmail } : { phoneE164: signupPhone }),
          password,
          displayName: displayNameFallback,
        });
        queryClient.setQueryData(["auth", "me"], { user });
        void navigate({ to: next, replace: true });
      } else {
        const { user } = await loginAccount({ identifier: loginIdentifier, password });
        queryClient.setQueryData(["auth", "me"], { user });
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

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </button>
        </div>

        <form onSubmit={(event) => void submit(event)} className="mt-5 space-y-4">
          {mode === "signin" ? (
            <>
              <ContactMethodTabs
                label="Sign in with"
                value={signInMethod}
                onChange={setSignInMethod}
              />
              {signInMethod === "email" ? (
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="identifier"
                    type="email"
                    required
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
              ) : (
                <PhoneNumberField
                  id="signin-phone-number"
                  country={signInCountry}
                  onCountryChange={setSignInCountry}
                  value={signInPhoneNumber}
                  onChange={setSignInPhoneNumber}
                  preview={phoneE164(signInCountry, signInPhoneNumber)}
                  intent="signin"
                />
              )}
            </>
          ) : (
            <>
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

              <ContactMethodTabs
                label="Sign up with"
                value={contactMethod}
                onChange={setContactMethod}
              />

              {contactMethod === "email" ? (
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
                    placeholder="you@example.com"
                  />
                </div>
              ) : (
                <PhoneNumberField
                  id="signup-phone-number"
                  country={country}
                  onCountryChange={setCountry}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  preview={phoneE164(country, phoneNumber)}
                  intent="signup"
                />
              )}
            </>
          )}
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
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signup" ? (
              <UserPlus className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
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
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          By using Quitech, you agree to the{" "}
          <Link to="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
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

function ContactMethodTabs({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ContactMethod;
  onChange: (value: ContactMethod) => void;
}) {
  return (
    <div>
      <p className="block text-sm font-medium text-foreground">{label}</p>
      <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => onChange("email")}
          className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            value === "email"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => onChange("phone")}
          className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            value === "phone"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Phone className="h-4 w-4" />
          Phone
        </button>
      </div>
    </div>
  );
}

function PhoneNumberField({
  id,
  country,
  onCountryChange,
  value,
  onChange,
  preview,
  intent,
}: {
  id: string;
  country: CountryDialCode;
  onCountryChange: (country: CountryDialCode) => void;
  value: string;
  onChange: (value: string) => void;
  preview: string;
  intent: "signin" | "signup";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        Phone number
      </label>
      <div className="mt-1.5 grid gap-2 sm:grid-cols-[190px_1fr]">
        <CountrySelect
          id={`${id}-country`}
          value={country}
          onChange={(nextCountry) => {
            if (nextCountry) onCountryChange(nextCountry);
          }}
          showDialCode
          buttonClassName="min-h-[46px]"
        />
        <input
          id={id}
          type="tel"
          inputMode="tel"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="700 000 000"
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {preview
          ? intent === "signin"
            ? `We will sign you in with ${preview}.`
            : `This will be saved as ${preview}.`
          : "Select a country code and enter the number without the country code."}
      </p>
    </div>
  );
}
