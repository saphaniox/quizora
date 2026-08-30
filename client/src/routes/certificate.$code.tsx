import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Printer } from "lucide-react";
import { getCertificate } from "@/lib/api";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border-4 border-primary/20 bg-card p-8 text-center shadow-sm sm:p-14 print:border-2 print:shadow-none">
        <Award className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Certificate of achievement
        </p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
          {certificate.playerName}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">has successfully completed</p>
        <p className="mt-2 text-xl font-semibold text-card-foreground">{certificate.quizTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {certificate.levelName} - {certificate.category}
        </p>
        <p className="mt-6 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          Score {certificate.score}/{certificate.maxScore} ({certificate.percentage}%)
        </p>
        <div className="mt-10 flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <span>Issued {new Date(certificate.issuedAt).toLocaleDateString()}</span>
          <span className="font-mono font-semibold text-foreground">{certificate.code}</span>
          <span>Verify at /certificate</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
        <button
          type="button"
          onClick={() =>
            downloadCertificatePdf(
              certificate,
              `${window.location.origin}/certificate/${certificate.code}`,
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Back to quizzes
        </Link>
      </div>
    </div>
  );
}
