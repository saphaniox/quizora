import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { clearHistory, loadCertificates, loadHistory, type HistoryItem } from "@/lib/attempt-store";
import type { Certificate } from "@/types/quiz";

export const Route = createFileRoute("/history")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My progress — Quizora" },
      { name: "description", content: "Track every quiz attempt, your best scores and the certificates you earned." },
      { property: "og:title", content: "My progress — Quizora" },
      { property: "og:description", content: "Track your quiz attempts, best scores and earned certificates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setItems(loadHistory());
    setCertificates(loadCertificates());
  }, []);

  const attempts = items.length;
  const best = attempts ? Math.max(...items.map((item) => item.percentage)) : 0;
  const average = attempts ? Math.round(items.reduce((sum, item) => sum + item.percentage, 0) / attempts) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <HistoryIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">My progress</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Saved privately on this device — no account needed.</p>

      <dl className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Attempts", value: attempts },
          { label: "Best score", value: `${best}%` },
          { label: "Average", value: `${average}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-card-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {certificates.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-foreground">Certificates</h2>
          <ul className="mt-3 space-y-2">
            {certificates.map((certificate) => (
              <li
                key={certificate.code}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="text-foreground">
                  {certificate.quizTitle} — {certificate.percentage}%
                </span>
                <Link
                  to="/certificate/$code"
                  params={{ code: certificate.code }}
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  {certificate.code}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent attempts</h2>
        {attempts > 0 && (
          <button
            type="button"
            onClick={() => {
              clearHistory();
              setItems([]);
            }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      {attempts === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-medium text-foreground">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Complete a section and your results will show up here.</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Browse sections
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.quizId}-${item.completedAt}-${index}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.quizTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {item.levelName} · {new Date(item.completedAt).toLocaleString()}
                </p>
              </div>
              <span className="tabular-nums text-sm font-semibold text-foreground">{item.percentage}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
