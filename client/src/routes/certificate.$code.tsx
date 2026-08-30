import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, BadgeCheck, Download, Loader2, Printer, Share2 } from "lucide-react";
import { getCertificate } from "@/lib/api";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";
import { countryFlag } from "@/lib/countries";
import type { Certificate } from "@/types/quiz";

/** Look the code up through the client-hosted API. */
async function verify(code: string): Promise<{ certificate: Certificate }> {
  return getCertificate(code);
}

export const Route = createFileRoute("/certificate/$code")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Certificate of achievement - Quitech" },
      {
        name: "description",
        content: "A verified Quitech certificate of achievement with holder, section and score.",
      },
      { property: "og:title", content: "Certificate of achievement - Quitech" },
      { property: "og:description", content: "A verified Quitech certificate of achievement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const { code } = Route.useParams();
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["certificate", code],
    queryFn: () => verify(code),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        Checking code...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">We couldn't verify that code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No certificate matches <span className="font-mono">{code}</span>. Check the spelling and
          try again.
        </p>
        <Link
          to="/certificate"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try another code
        </Link>
      </div>
    );
  }

  const certificate = data.certificate;
  const issuedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(certificate.issuedAt));
  const certificateUrl =
    typeof window === "undefined"
      ? `/certificate/${certificate.code}`
      : `${window.location.origin}/certificate/${certificate.code}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadCertificatePdf(certificate, certificateUrl);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const title = `${certificate.playerName}'s Quitech certificate`;
    const text = `${certificate.playerName} earned ${certificate.percentage}% in ${certificate.quizTitle} on Quitech.`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: certificateUrl });
        return;
      }

      await navigator.clipboard.writeText(certificateUrl);
      setShareStatus("Certificate link copied");
      window.setTimeout(() => setShareStatus(""), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("Share was not completed");
      window.setTimeout(() => setShareStatus(""), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-[#fbfcf8] p-5 text-center text-slate-900 shadow-sm sm:p-8 print:border-slate-300 print:shadow-none">
        <div className="pointer-events-none absolute inset-4 rounded-lg border border-slate-200" />
        <img
          src="/logo.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.05]"
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt=""
                className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-300"
              />
              <div>
                <p className="text-base font-semibold text-slate-950">Quitech</p>
                <p className="text-xs text-slate-500">Learn, challenge & progress</p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Verified credential
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <Award className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-5 text-xs font-semibold uppercase text-slate-500">
              Certificate of Achievement
            </p>
            <p className="mt-5 text-sm text-slate-600">This certifies that</p>
            <h1 className="mt-3 break-words text-4xl font-bold text-slate-950">
              {certificate.playerName}
            </h1>
            <p className="mt-5 text-sm text-slate-600">
              has successfully completed the full Quitech section
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{certificate.quizTitle}</p>
            <p className="mt-2 text-sm text-slate-600">
              {certificate.levelName} - {certificate.category}
            </p>
            {certificate.countryName && (
              <p className="mt-2 text-sm text-slate-600">
                {countryFlag(certificate.countryCode ?? "")} {certificate.countryName}
              </p>
            )}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 border-y border-slate-200 py-5 text-left sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Final Score</p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {certificate.score}/{certificate.maxScore} ({certificate.percentage}%)
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Issued</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{issuedDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Credential ID</p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-900">
                {certificate.code}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-6 text-left sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-px w-56 bg-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-900">Quitech Verification</p>
              <p className="text-xs text-slate-500">Digitally issued and publicly verifiable</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-medium uppercase text-slate-500">Verify Online</p>
              <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                {certificateUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </button>
        <button
          type="button"
          onClick={() => void handleShare()}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Back to quizzes
        </Link>
      </div>
      {shareStatus && (
        <p
          className="mt-3 text-center text-sm text-muted-foreground print:hidden"
          aria-live="polite"
        >
          {shareStatus}
        </p>
      )}
    </div>
  );
}
