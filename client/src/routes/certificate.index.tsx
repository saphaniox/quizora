import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/certificate/")({
  head: () => ({
    meta: [
      { title: "Verify a certificate - Quitech" },
      { name: "description", content: "Enter a Quitech certificate code to verify the holder, section and score." },
      { property: "og:title", content: "Verify a certificate - Quitech" },
      { property: "og:description", content: "Verify a Quitech certificate code in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <BadgeCheck className="h-7 w-7 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-card-foreground">Verify a certificate</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every Quitech certificate carries a unique code. Enter it below to confirm it is genuine.
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = code.trim().toUpperCase();
            if (trimmed) void navigate({ to: "/certificate/$code", params: { code: trimmed } });
          }}
        >
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="e.g. ELEC-1A2B3-XY9Z1"
            aria-label="Certificate code"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm uppercase text-foreground placeholder:font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
