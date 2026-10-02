import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, BadgeCheck, Download, Gem, Loader2, Printer, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { getCertificate } from "@/lib/api";
import { countryFlag } from "@/lib/countries";
import { appLinksText, webAppUrl } from "@/lib/share-links";
import type { Certificate } from "@/types/quiz";
import { toast } from "sonner";

/** Look the code up through the client-hosted API. */
async function verify(code: string): Promise<{ certificate: Certificate }> {
  return getCertificate(code);
}

export const Route = createFileRoute("/certificate/$code")({
  head: ({ params }) => ({
    meta: [
      { title: "Certificate of achievement - Quitech" },
      {
        name: "description",
        content: "A verified Quitech certificate of achievement with holder, section and score.",
      },
      { property: "og:title", content: "Certificate of achievement - Quitech" },
      { property: "og:description", content: "A verified Quitech certificate of achievement." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://quitech.online/certificate/${params.code}` },
      { property: "og:image", content: "https://quitech.online/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://quitech.online/certificate/${params.code}` }],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const { code } = Route.useParams();
  const [downloading, setDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["certificate", code],
    queryFn: () => verify(code),
    retry: false,
  });

  const certificateUrl = data ? webAppUrl(`/certificate/${data.certificate.code}`) : null;

  useEffect(() => {
    if (!certificateUrl) {
      setQrCode(null);
      return;
    }

    let active = true;
    void QRCode.toDataURL(certificateUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 180,
    }).then((dataUrl) => {
      if (active) setQrCode(dataUrl);
    });
    return () => {
      active = false;
    };
  }, [certificateUrl]);

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
  const verificationUrl = webAppUrl(`/certificate/${certificate.code}`);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { downloadCertificatePdf } = await import("@/lib/certificate-pdf");
      await downloadCertificatePdf(certificate, verificationUrl);
      toast.success("Your certificate is ready", {
        description: "It’s been saved to your device.",
      });
    } catch (error) {
      toast.error("We couldn’t download your certificate", {
        description: error instanceof Error ? error.message : "Please try again in a little while.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const title = `${certificate.playerName}'s Quitech certificate`;
    const text = `${certificate.playerName} earned ${certificate.percentage}% in ${certificate.quizTitle} on Quitech.\n\nView the certificate: ${verificationUrl}\n\n${appLinksText()}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: verificationUrl });
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareStatus("Certificate link copied");
      toast.success("Link copied", {
        description: "Your certificate is ready to share.",
      });
      window.setTimeout(() => setShareStatus(""), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("Sharing didn’t go through");
      toast.error("We couldn’t share it just now", {
        description: "Please try again, or copy the certificate link instead.",
      });
      window.setTimeout(() => setShareStatus(""), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-lg border border-slate-300 bg-[#fbfcf8] px-5 py-10 text-center text-slate-900 shadow-xl shadow-slate-200/70 sm:p-16 print:border-slate-300 print:shadow-none">
        <div className="pointer-events-none absolute inset-2 rounded-lg border border-slate-950/70 sm:inset-4.5" />
        <div className="pointer-events-none absolute inset-4 rounded-md border-2 border-blue-700/80 sm:inset-7 sm:border-[3px]" />
        <div className="pointer-events-none absolute inset-6 border border-amber-500/70 sm:inset-10.5" />
        <div className="pointer-events-none absolute inset-8.5 hidden border border-slate-200 sm:block sm:inset-13.5" />
        <div className="pointer-events-none absolute left-1/2 top-4 h-1 w-28 -translate-x-1/2 bg-blue-100 sm:top-7 sm:w-48" />
        <div className="pointer-events-none absolute bottom-4 left-1/2 h-1 w-28 -translate-x-1/2 bg-blue-100 sm:bottom-7 sm:w-48" />
        <div className="pointer-events-none absolute left-1/2 top-6 h-px w-24 -translate-x-1/2 bg-amber-500/70 sm:top-10.5 sm:w-36" />
        <div className="pointer-events-none absolute bottom-6 left-1/2 h-px w-24 -translate-x-1/2 bg-amber-500/70 sm:bottom-10.5 sm:w-36" />
        <div className="pointer-events-none absolute left-12 top-12 hidden h-24 w-24 border-l-[3px] border-t-[3px] border-amber-600 sm:block" />
        <div className="pointer-events-none absolute right-12 top-12 hidden h-24 w-24 border-r-[3px] border-t-[3px] border-amber-600 sm:block" />
        <div className="pointer-events-none absolute bottom-12 left-12 hidden h-24 w-24 border-b-[3px] border-l-[3px] border-amber-600 sm:block" />
        <div className="pointer-events-none absolute bottom-12 right-12 hidden h-24 w-24 border-b-[3px] border-r-[3px] border-amber-600 sm:block" />
        <div className="pointer-events-none absolute right-16 top-16 hidden h-16 w-16 border-r border-t border-blue-700/60 sm:block" />
        <div className="pointer-events-none absolute bottom-16 left-16 hidden h-16 w-16 border-b border-l border-blue-700/60 sm:block" />
        <div className="pointer-events-none absolute bottom-16 right-16 hidden h-16 w-16 border-b border-r border-blue-700/60 sm:block" />
        <Gem
          aria-hidden="true"
          strokeWidth={0.65}
          className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 text-blue-300/20 sm:h-[32rem] sm:w-[32rem]"
        />
        <Gem
          aria-hidden="true"
          strokeWidth={0.55}
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 text-amber-500/10 sm:h-[25rem] sm:w-[25rem]"
        />
        <img
          src="/logo.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.035] sm:h-64 sm:w-64"
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
            <div
              className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-amber-500/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span className="h-px flex-1 bg-amber-500/70" />
            </div>
            <p className="mt-5 text-sm text-slate-600">This certifies that</p>
            <h1 className="mt-3 wrap-break-word text-3xl font-bold text-slate-950 sm:text-4xl">
              {certificate.playerName}
            </h1>
            <p className="mt-5 text-sm text-slate-600">
              has successfully completed the full Quitech section
            </p>
            <p className="mt-3 wrap-break-word text-xl font-semibold text-slate-950 sm:text-2xl">
              {certificate.quizTitle}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {certificate.levelName} - {certificate.category}
            </p>
            {certificate.countryName && (
              <p className="mt-2 text-sm text-slate-600">
                {countryFlag(certificate.countryCode ?? "")} {certificate.countryName}
              </p>
            )}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm italic text-emerald-700">
            Awarded in recognition of focused learning, persistence, and achievement.
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4 border-y border-slate-200 py-5 text-left sm:grid-cols-3">
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
              <p className="text-xs font-medium uppercase text-slate-500">Country</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {certificate.countryName
                  ? `${countryFlag(certificate.countryCode ?? "")} ${certificate.countryName}`
                  : "Not provided"}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-left sm:grid-cols-[1fr_1.2fr_9rem] sm:divide-x sm:divide-slate-200">
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-700">
                <BadgeCheck className="h-4 w-4" /> Verified online
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">Quitech Verification</p>
              <p className="mt-1 text-xs text-slate-500">
                Digitally issued and publicly verifiable
              </p>
            </div>
            <div className="border-t border-slate-200 p-4 sm:border-t-0 sm:p-5 sm:text-center">
              <p className="text-xs font-medium uppercase text-slate-500">Credential ID</p>
              <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                {certificate.code}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Use this ID or scan the code to confirm authenticity
              </p>
            </div>
            <div className="flex min-h-40 items-center justify-center border-t border-slate-200 p-3 sm:min-h-0 sm:border-t-0">
              {qrCode ? (
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src={qrCode}
                    alt="Scan to verify this certificate"
                    className="h-24 w-24 bg-white p-1"
                  />
                  <p className="text-[10px] font-semibold uppercase text-slate-500">
                    Scan to verify
                  </p>
                </div>
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-amber-600/30 pt-4 text-center">
            <p className="text-xs font-semibold text-slate-800">Powered by SAPTech Uganda</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 print:hidden sm:flex sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:py-2"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent sm:py-2"
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
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent sm:py-2"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent sm:py-2"
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
