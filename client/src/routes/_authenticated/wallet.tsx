import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { loadCertificates } from "@/lib/attempt-store";
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
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setCertificates(loadCertificates());
  }, []);

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
