import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { History as HistoryIcon, Play, Trash2 } from "lucide-react";
import {
  clearHistory,
  loadAllProgress,
  loadBookmarkedQuizIds,
  loadCertificates,
  loadHistory,
  type HistoryItem,
  type SavedProgress,
} from "@/lib/attempt-store";
import {
  deleteAccountProgress,
  getAccountProgressList,
  getMyActivity,
  getQuizzes,
  setLeaderboardVisibility,
} from "@/lib/api";
import { countryFlag } from "@/lib/countries";
import type { Certificate, LeaderboardEntry } from "@/types/quiz";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/history")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My progress - Quitech" },
      {
        name: "description",
        content: "Track every quiz attempt, your best scores and the certificates you earned.",
      },
      { property: "og:title", content: "My progress - Quitech" },
      {
        property: "og:description",
        content: "Track your quiz attempts, best scores and earned certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [progress, setProgress] = useState<SavedProgress[]>([]);
  const [quizTitles, setQuizTitles] = useState<Record<string, string>>({});
  const [accountSynced, setAccountSynced] = useState(false);
  const [bookmarkedQuizIds, setBookmarkedQuizIds] = useState<string[]>([]);
  const [progressToDrop, setProgressToDrop] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const localHistory = loadHistory();
    const localCertificates = loadCertificates();
    const localProgress = loadAllProgress();
    setItems(localHistory);
    setCertificates(localCertificates);
    setProgress(localProgress);
    setBookmarkedQuizIds(loadBookmarkedQuizIds());

    void getQuizzes()
      .then(({ quizzes }) => {
        if (!active) return;
        setQuizTitles(Object.fromEntries(quizzes.map((quiz) => [quiz.id, quiz.title])));
      })
      .catch(() => undefined);

    void getMyActivity()
      .then(({ history, certificates }) => {
        if (!active) return;
        setAccountSynced(true);
        setItems(mergeHistory(history.map(historyFromEntry), localHistory));
        setCertificates(mergeCertificates(certificates, localCertificates));
      })
      .catch(() => {
        if (active) setAccountSynced(false);
      });

    void getAccountProgressList()
      .then(({ progress: remoteProgress }) => {
        if (!active) return;
        const merged = new Map(localProgress.map((item) => [item.quizId, item]));
        for (const item of remoteProgress) {
          const local = merged.get(item.quizId);
          if (!local || item.savedAt > local.savedAt) merged.set(item.quizId, item);
        }
        setProgress(
          [...merged.values()].sort((left, right) => right.savedAt.localeCompare(left.savedAt)),
        );
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const attempts = items.length;
  const best = attempts ? Math.max(...items.map((item) => item.percentage)) : 0;
  const average = attempts
    ? Math.round(items.reduce((sum, item) => sum + item.percentage, 0) / attempts)
    : 0;
  const activeDays = new Set(items.map((item) => item.completedAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (activeDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const dropProgress = async () => {
    if (!progressToDrop) return;
    const quizId = progressToDrop;
    try {
      if (accountSynced) await deleteAccountProgress(quizId);
      clearProgress(quizId);
      setProgress((current) => current.filter((item) => item.quizId !== quizId));
      setProgressToDrop(null);
      toast.success("Progress dropped");
    } catch (failure) {
      toast.error("Could not drop progress", {
        description: failure instanceof Error ? failure.message : "Try again later.",
      });
    }
  };

  const updateLeaderboardVisibility = async (quizId: string, visible: boolean) => {
    try {
      const item = items.find((candidate) => candidate.quizId === quizId);
      await setLeaderboardVisibility(quizId, visible, item?.visitorId);
      setItems((current) =>
        current.map((item) =>
          item.quizId === quizId ? { ...item, leaderboardVisible: visible } : item,
        ),
      );
      toast.success(
        visible ? "Section shown on the leaderboard" : "Section hidden from the leaderboard",
      );
    } catch (failure) {
      toast.error("Could not update leaderboard visibility", {
        description: failure instanceof Error ? failure.message : "Try again later.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <HistoryIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">My progress</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {accountSynced
          ? "Saved to your Quitech account and available across devices."
          : "Saved privately on this device - no account needed."}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Attempts", value: attempts },
          { label: "Best score", value: `${best}%` },
          { label: "Average", value: `${average}%` },
          { label: "Days in a row", value: streak },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-card-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {bookmarkedQuizIds.length > 0 && (
        <section className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
          <h2 className="text-base font-semibold text-foreground">Topics to come back to</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your saved quizzes are waiting here.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {bookmarkedQuizIds.map((quizId) => (
              <Link
                key={quizId}
                to="/quizzes/$id"
                params={{ id: quizId }}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-primary/50"
              >
                {quizTitles[quizId] ?? quizId}
              </Link>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-foreground">Certificates</h2>
          <ul className="mt-3 space-y-2">
            {certificates.map((certificate) => (
              <li
                key={certificate.code}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="wrap-break-word text-foreground">
                  {certificate.quizTitle} - {certificate.percentage}%
                </span>
                {certificate.countryName && (
                  <span className="text-xs text-muted-foreground">
                    {countryFlag(certificate.countryCode ?? "")} {certificate.countryName}
                  </span>
                )}
                <Link
                  to="/certificate/$code"
                  params={{ code: certificate.code }}
                  className="break-all font-mono text-xs font-semibold text-primary hover:underline"
                >
                  {certificate.code}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Recent attempts</h2>
        {attempts > 0 && !accountSynced && (
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

      {progress.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Saved progress</h2>
          <ul className="space-y-2">
            {progress.map((item) => (
              <li
                key={item.quizId}
                className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="wrap-break-word text-sm font-medium text-foreground">
                    {quizTitles[item.quizId] ?? "Unfinished quiz"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(item.answers).length} answers saved - last opened{" "}
                    {new Date(item.savedAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  to="/quizzes/$id"
                  params={{ id: item.quizId }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="h-4 w-4" /> Resume
                </Link>
                <button
                  type="button"
                  onClick={() => setProgressToDrop(item.quizId)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" /> Drop
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {attempts === 0 && progress.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center sm:p-12">
          <p className="font-medium text-foreground">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a section and your results will show up here.
          </p>
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
              className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="wrap-break-word text-sm font-medium text-foreground">
                  {item.quizTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.levelName} - {new Date(item.completedAt).toLocaleString()}
                </p>
                {item.countryName && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {countryFlag(item.countryCode ?? "")} {item.countryName}
                  </p>
                )}
              </div>
              <span className="tabular-nums text-sm font-semibold text-foreground">
                {item.percentage}%
              </span>
              {(accountSynced || item.visitorId) && (
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground sm:ml-auto">
                  <input
                    type="checkbox"
                    checked={item.leaderboardVisible !== false}
                    onChange={(event) =>
                      void updateLeaderboardVisibility(item.quizId, event.target.checked)
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  Show on leaderboard
                </label>
              )}
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={progressToDrop !== null}
        onOpenChange={(open) => !open && setProgressToDrop(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Drop saved progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the saved quiz from My progress and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep progress</AlertDialogCancel>
            <AlertDialogAction onClick={() => void dropProgress()}>Drop progress</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function historyFromEntry(entry: LeaderboardEntry): HistoryItem {
  return {
    quizId: entry.quizId,
    quizTitle: entry.quizTitle,
    levelName: entry.levelName,
    score: entry.score,
    maxScore: entry.maxScore,
    percentage: entry.percentage,
    leaderboardVisible: entry.leaderboardVisible !== false,
    visitorId: entry.visitorId ?? null,
    ...(entry.countryCode && entry.countryName
      ? { countryCode: entry.countryCode, countryName: entry.countryName }
      : {}),
    timeSpentSeconds: entry.timeSpentSeconds,
    completedAt: entry.completedAt,
  };
}

function mergeHistory(accountItems: HistoryItem[], localItems: HistoryItem[]): HistoryItem[] {
  const seen = new Set<string>();
  return [...accountItems, ...localItems]
    .filter((item) => {
      const key = `${item.quizId}-${item.completedAt}-${item.score}-${item.maxScore}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 100);
}

function mergeCertificates(accountCertificates: Certificate[], localCertificates: Certificate[]) {
  const seen = new Set<string>();
  return [...accountCertificates, ...localCertificates]
    .filter((certificate) => {
      if (seen.has(certificate.code)) return false;
      seen.add(certificate.code);
      return true;
    })
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 50);
}
