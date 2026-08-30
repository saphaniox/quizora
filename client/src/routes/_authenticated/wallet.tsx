/* import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Check, Copy, Download, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { loadCertificates } from "@/lib/attempt-store";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";
import type { Certificate } from "@/types/quiz";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "Certificate wallet - Quitech" },
      {
        name: "description",
        content: "Every Quitech certificate you've earned, with a shareable verification link and a downloadable PDF.",
      },
      { property: "og:title", content: "Certificate wallet - Quitech" },
      { property: "og:description", content: "Share verifiable certificate links and download PDFs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletPage,
});

interface Row {
  code: string;
  player_name: string;
  quiz_id: string;
  quiz_title: string;
  level_name: string;
  category: string;
  score: number;
  max_score: number;
  percentage: number;
  issued_at: string;
} */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { loadCertificates } from "@/lib/attempt-store";
import type { Certificate } from "@/types/quiz";

export const Route = createFileRoute("/_authenticated/wallet")({ component: WalletPage });

function WalletPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  useEffect(() => setCertificates(loadCertificates()), []);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Certificate wallet</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Certificates earned on this device.</p>
      {certificates.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <Award className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No certificates yet</p>
          <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Browse sections</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate) => (
            <Link key={certificate.code} to="/certificate/$code" params={{ code: certificate.code }} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{certificate.levelName}</p>
              <h2 className="mt-1 font-semibold text-card-foreground">{certificate.quizTitle}</h2>
              <p className="mt-3 font-mono text-xs text-muted-foreground">{certificate.code}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* const toCertificate = (row: Row): Certificate => ({
  code: row.code,
  playerName: row.player_name,
  quizId: row.quiz_id,
  quizTitle: row.quiz_title,

        local.map((item) => ({
          quiz_id: item.quizId ?? "unknown",
  }, []);
  const share = async (code: string) => {
        await navigator.share({ title: "My Quitech certificate", url });
      setCopied(code);
          </p>
  export const Route = createFileRoute("/_authenticated/wallet")({
    component: WalletPage,
  });

  function WalletPage() {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Certificate wallet</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything you've earned, saved to your account and verifiable by anyone with the link.
            </p>
          </div>
        </div>
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
      </div>
    );
  }
        </div>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : certificates.length === 0 ? (
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
            <div key={certificate.code} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {certificate.levelName}
                  </p>
                  <h2 className="mt-1 font-semibold text-card-foreground">{certificate.quizTitle}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{certificate.category}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {certificate.percentage}%
                </span>
              </div>

              <p className="mt-4 font-mono text-xs text-muted-foreground">{certificate.code}</p>
              <p className="text-xs text-muted-foreground">
                Issued {new Date(certificate.issuedAt).toLocaleDateString()} - {certificate.score}/
                {certificate.maxScore} correct
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/certificate/$code"
                  params={{ code: certificate.code }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => void share(certificate.code)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                  {copied === certificate.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === certificate.code ? "Link copied" : "Share link"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCertificatePdf(certificate, `${window.location.origin}/certificate/${certificate.code}`)
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} */
