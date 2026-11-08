import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Download, Eye, Gem, Loader2, X } from "lucide-react";
import type { Certificate, CertificateTier } from "@/types/quiz";
import { notifications } from "@/lib/notifications";
import { Capacitor } from "@capacitor/core";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { NativeCatalogueAd } from "@/components/NativeCatalogueAd";

const samples: {
  tier: Exclude<CertificateTier, "standard">;
  questions: number;
  score: number;
  title: string;
  level: string;
  requirement: string;
  icon: typeof Award;
  accent: string;
  border: string;
  background: string;
}[] = [
  {
    tier: "gold",
    questions: 100,
    score: 88,
    title: "English Language",
    level: "Secondary Education",
    requirement: "Complete a 100-question quiz with a score of at least 80%.",
    icon: Award,
    accent: "text-amber-700",
    border: "border-amber-400",
    background: "bg-amber-500/10",
  },
  {
    tier: "platinum",
    questions: 200,
    score: 176,
    title: "Digital Literacy",
    level: "Professional",
    requirement: "Complete a 200-question quiz with a score of at least 80%.",
    icon: Award,
    accent: "text-slate-600 dark:text-slate-300",
    border: "border-slate-400",
    background: "bg-slate-400/10",
  },
  {
    tier: "diamond",
    questions: 500,
    score: 450,
    title: "World Geography & Global Awareness",
    level: "Core Foundations",
    requirement: "Answer all 500 questions in the full section with a score of at least 80%.",
    icon: Gem,
    accent: "text-sky-700 dark:text-sky-300",
    border: "border-sky-500",
    background: "bg-sky-500/10",
  },
];

export const Route = createFileRoute("/certificate-samples")({
  head: () => ({
    meta: [
      { title: "Certificate samples - Quitech" },
      {
        name: "description",
        content:
          "Preview sample Quitech achievement certificates, distinguished by color and questions completed.",
      },
      { property: "og:title", content: "Certificate samples - Quitech" },
      {
        property: "og:description",
        content: "Preview and download sample Quitech achievement certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificateSamplesPage,
});

function CertificateSamplesPage() {
  const [busyTier, setBusyTier] = useState<CertificateTier | null>(null);
  const [preview, setPreview] = useState<{ tier: CertificateTier; blob: Blob } | null>(null);

  const getSampleCertificate = (sample: (typeof samples)[number]): Certificate => ({
    code: `SAMPLE-${sample.questions}-QUESTIONS-NOT-VALID`,
    awardTier: sample.tier,
    playerName: "Amina Nansubuga",
    quizTitle: sample.title,
    levelName: sample.level,
    category: sample.title,
    countryCode: "UG",
    countryName: "Uganda",
    score: sample.score,
    maxScore: sample.questions,
    percentage: Math.round((sample.score / sample.questions) * 100),
    issuedAt: new Date().toISOString(),
  });

  const viewSample = async (sample: (typeof samples)[number]) => {
    setBusyTier(sample.tier);
    try {
      const { createCertificatePdfBlob } = await import("@/lib/certificate-pdf");
      const blob = await createCertificatePdfBlob(getSampleCertificate(sample), { sample: true });
      setPreview({ tier: sample.tier, blob });
    } catch (error) {
      notifications.error("We couldn’t open the sample certificate", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusyTier(null);
    }
  };

  const downloadSample = async (sample: (typeof samples)[number]) => {
    setBusyTier(sample.tier);
    try {
      const { downloadCertificatePdf } = await import("@/lib/certificate-pdf");
      await downloadCertificatePdf(getSampleCertificate(sample), "", { sample: true });
      notifications.success("Sample certificate is ready", {
        description: "The sample PDF is ready to save or share.",
      });
    } catch (error) {
      notifications.error("We couldn’t download the sample certificate", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusyTier(null);
    }
  };

  const previewSample = preview
    ? samples.find((sample) => sample.tier === preview.tier)
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Your progress, recognized
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          See what you can earn
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Open a sample to see the certificate design, or download a PDF to keep a copy. Each color
          theme reflects the number of questions completed.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-center text-sm text-muted-foreground">
        These examples use fictional details. Every sample is marked{" "}
        <strong>SAMPLE - NOT VALID</strong>; it is only a preview and cannot be verified as an
        earned certificate.
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {samples.map((sample) => {
          const Icon = sample.icon;
          const isBusy = busyTier === sample.tier;
          return (
            <article
              key={sample.tier}
              className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div
                className={`flex min-h-40 flex-col items-center justify-center rounded-lg border-2 p-5 text-center ${sample.border} ${sample.background}`}
              >
                <Icon className={`h-10 w-10 ${sample.accent}`} aria-hidden="true" />
                <p className={`mt-3 text-xs font-bold uppercase tracking-[0.2em] ${sample.accent}`}>
                  Achievement
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {sample.questions} questions answered
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Earn it with a score of 80% or higher
                </p>
              </div>

              <h2 className="mt-5 text-lg font-semibold text-foreground">
                {sample.questions}-question achievement
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {sample.requirement}
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void viewSample(sample)}
                  disabled={busyTier !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  View sample
                </button>
                <button
                  type="button"
                  onClick={() => void downloadSample(sample)}
                  disabled={busyTier !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download PDF
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8">
        <NativeCatalogueAd />
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-preview-title"
            className="flex h-[min(90vh,56rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 id="certificate-preview-title" className="font-semibold text-foreground">
                  {previewSample
                    ? `${previewSample.questions}-question certificate sample`
                    : "Certificate sample"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sample only - not a real or verifiable certificate
                </p>
              </div>
              <button
                type="button"
                aria-label="Close certificate preview"
                onClick={() => setPreview(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-muted p-3 sm:p-6">
              <SamplePdfPreview blob={preview.blob} />
            </div>
            <div className="flex justify-end gap-2 border-t border-border p-3">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (previewSample) void downloadSample(previewSample);
                }}
                disabled={busyTier !== null}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </section>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          Explore quizzes <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/certificate"
          className="inline-flex w-full items-center justify-center rounded-md border border-input px-5 py-3 text-sm font-medium text-foreground hover:bg-accent sm:w-auto"
        >
          Verify a real certificate
        </Link>
      </div>
    </main>
  );
}

function SamplePdfPreview({ blob }: { blob: Blob }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let cancelRender: (() => void) | undefined;

    async function renderPdf() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        const pdf = await pdfjs.getDocument({ data: await blob.arrayBuffer() }).promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!active || !canvas || !container) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          container.clientWidth / baseViewport.width,
          container.clientHeight / baseViewport.height,
        );
        if (!Number.isFinite(scale) || scale <= 0) {
          throw new Error("The preview area is not ready. Please close and reopen the sample.");
        }
        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * pixelRatio });
        const context = canvas.getContext("2d");
        if (!context) throw new Error("This device could not prepare the certificate preview.");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / pixelRatio}px`;
        canvas.style.height = `${viewport.height / pixelRatio}px`;
        const renderTask = page.render({ canvas, canvasContext: context, viewport });
        cancelRender = () => renderTask.cancel();
        await renderTask.promise;
        if (active) setIsLoading(false);
      } catch (renderError) {
        if (!active) return;
        setIsLoading(false);
        setError(
          renderError instanceof Error
            ? renderError.message
            : "Please download the PDF to view this certificate.",
        );
      }
    }

    void renderPdf();
    return () => {
      active = false;
      cancelRender?.();
    };
  }, [blob]);

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-52 w-full items-center justify-center"
      aria-label="Certificate PDF preview"
    >
      {error ? (
        <p role="alert" className="max-w-md text-center text-sm text-muted-foreground">
          {error}{" "}
          {Capacitor.isNativePlatform() && "You can also download the sample PDF to view it."}
        </p>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing certificate preview…
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="max-h-full max-w-full bg-white shadow-lg"
            aria-label="Rendered certificate sample"
          />
        </div>
      )}
    </div>
  );
}
