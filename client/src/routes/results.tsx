import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, RotateCcw, Share2, Trophy } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { QuestionCard } from "@/components/QuestionCard";
import { getLeaderboard } from "@/lib/api";
import { loadAttempt, type StoredAttempt } from "@/lib/attempt-store";
import { countryFlag } from "@/lib/countries";

export const Route = createFileRoute("/results")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your results - Quitech" },
      {
        name: "description",
        content: "Review your score, answer breakdown, explanations and certificate status.",
      },
      { property: "og:title", content: "Your results - Quitech" },
      {
        property: "og:description",
        content: "Review your score, explanations and certificate status on Quitech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAttempt(loadAttempt());
    setLoaded(true);
  }, []);

  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard", attempt?.quizId ?? "none"],
    queryFn: () => getLeaderboard(attempt ? { quizId: attempt.quizId } : undefined),
    enabled: Boolean(attempt),
  });

  const topEntries = useMemo(
    () => (leaderboardData?.leaderboard ?? []).slice(0, 5),
    [leaderboardData],
  );

  useEffect(() => {
    if (loaded && !attempt) void navigate({ to: "/" });
  }, [loaded, attempt, navigate]);

  if (!attempt) return null;

  const { result } = attempt;
  const certificate = result.certificate;
  const leaderboardBestPercentage = result.leaderboardBestPercentage ?? result.percentage;
  const leaderboardImproved = result.leaderboardImproved !== false;

  const share = async () => {
    const text = `I scored ${result.percentage}% on ${attempt.quizTitle} (${attempt.levelName}) on Quitech!`;
    try {
      if (navigator.share) await navigator.share({ title: "Quitech result", text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {attempt.levelName}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-card-foreground">
              {attempt.quizTitle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Well done, {attempt.playerName}. You answered {result.score} of {result.maxScore}{" "}
              correctly in {Math.floor(attempt.timeSpentSeconds / 60)}m{" "}
              {attempt.timeSpentSeconds % 60}s.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {leaderboardImproved
                ? `Leaderboard best: rank #${result.leaderboardRank} of ${result.totalEntries} learners on this section.`
                : `Your leaderboard best remains ${leaderboardBestPercentage}% at rank #${result.leaderboardRank} of ${result.totalEntries} learners.`}
            </p>
            {attempt.countryName && (
              <p className="mt-1 text-sm text-muted-foreground">
                {countryFlag(attempt.countryCode ?? "")} {attempt.countryName}
              </p>
            )}
          </div>
          <ScoreRing percentage={result.percentage} size="lg" label="Final score" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/quizzes/$id"
            params={{ id: attempt.quizId }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" /> Retake quiz
          </Link>
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <Share2 className="h-4 w-4" /> {copied ? "Copied!" : "Share result"}
          </button>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <Trophy className="h-4 w-4" /> Leaderboard
          </Link>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Only your highest score is used on the leaderboard; fastest time breaks ties.
        </p>
      </div>

      {certificate ? (
        <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Certificate earned</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {certificate.playerName}, you passed with {certificate.percentage}%. Your
                verification code is{" "}
                <span className="font-mono font-semibold text-foreground">{certificate.code}</span>.
              </p>
              <Link
                to="/certificate/$code"
                params={{ code: certificate.code }}
                className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                View & print certificate
              </Link>
            </div>
          </div>
        </div>
      ) : (
        result.certificateMessage && (
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            {result.certificateMessage}
          </div>
        )
      )}

      {topEntries.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Top scores here
          </h2>
          <ol className="mt-3 space-y-2">
            {topEntries.map((entry, position) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 text-foreground">
                  <span className="font-medium">
                    {position + 1}. {entry.playerName}
                  </span>
                  {entry.countryName && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {countryFlag(entry.countryCode ?? "")} {entry.countryName}
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-muted-foreground">{entry.percentage}%</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">Answer review</h2>
      <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-emerald-500" /> Correct
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-destructive" /> Wrong
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-muted" /> Skipped
          </span>
        </div>
        <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-16">
          {attempt.questions.map((question, questionIndex) => {
            const answered = attempt.answers[question.id] !== undefined;
            const correct = result.correctAnswers[question.id];
            return (
              <a
                key={question.id}
                href={`#question-${questionIndex + 1}`}
                title={`Question ${questionIndex + 1}: ${!answered ? "skipped" : correct ? "correct" : "wrong"}`}
                className={`flex h-8 items-center justify-center gap-0.5 rounded text-[11px] font-semibold ${
                  !answered
                    ? "bg-muted text-muted-foreground"
                    : correct
                      ? "bg-emerald-500 text-white"
                      : "bg-destructive text-destructive-foreground"
                }`}
              >
                {questionIndex + 1}
                {answered ? (correct ? "✓" : "×") : ""}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {attempt.questions.map((question, questionIndex) => (
          <div key={question.id} id={`question-${questionIndex + 1}`} className="scroll-mt-24">
            <QuestionCard
              question={{ id: question.id, text: question.text, options: question.options }}
              questionNumber={questionIndex + 1}
              totalQuestions={attempt.questions.length}
              selectedOption={attempt.answers[question.id] ?? null}
              onSelect={() => undefined}
              showFeedback
              isCorrect={result.correctAnswers[question.id]}
              correctOptionIndex={result.correctOptionIndices[question.id]}
              explanation={result.explanations[question.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
