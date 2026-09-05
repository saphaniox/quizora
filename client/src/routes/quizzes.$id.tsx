import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Award, Flag, Loader2, ShieldCheck } from "lucide-react";
import { CountrySelect } from "@/components/CountrySelect";
import {
  deleteAccountProgress,
  getAccountProgress,
  getCurrentUser,
  getQuiz,
  saveAccountProgress,
  submitAnswers,
} from "@/lib/api";
import { QuestionCard } from "@/components/QuestionCard";
import { Timer } from "@/components/Timer";
import {
  clearProgress,
  getVisitorId,
  loadProgress,
  loadPlayerCountry,
  loadPlayerName,
  saveAttempt,
  savePlayerCountry,
  savePlayerName,
  saveProgress,
  type PlayerCountry,
  type SavedProgress,
} from "@/lib/attempt-store";
import { findCountryByIso, type CountryDialCode } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/quizzes/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Take a quiz - Quitech" },
      {
        name: "description",
        content: "Timed multiple-choice quiz with instant scoring, explanations and certificates.",
      },
      { property: "og:title", content: "Take a quiz - Quitech" },
      {
        property: "og:description",
        content: "Timed multiple-choice quiz with instant scoring and explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

type Mode = 10 | 25 | 50 | "full";

function storedCountryToOption(country: PlayerCountry | null): CountryDialCode | null {
  if (!country) return null;
  return findCountryByIso(country.iso) ?? { iso: country.iso, name: country.name, dialCode: "" };
}

function progressAnswerCount(progress: SavedProgress): number {
  return Object.keys(progress.answers).length;
}

function chooseBestProgress(
  local: SavedProgress | null,
  remote: SavedProgress | null,
): SavedProgress | null {
  if (!local) return remote;
  if (!remote) return local;
  const localCount = progressAnswerCount(local);
  const remoteCount = progressAnswerCount(remote);
  if (remoteCount !== localCount) return remoteCount > localCount ? remote : local;
  return remote.savedAt > local.savedAt ? remote : local;
}

function progressSaveKey(progress: SavedProgress): string {
  const answerKey = Object.entries(progress.answers)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([questionId, answer]) => `${questionId}:${answer}`)
    .join(",");
  return [
    progress.quizId,
    progress.mode,
    progress.seed,
    progress.currentIndex,
    progress.flagged.join(","),
    answerKey,
  ].join("|");
}

function QuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [attemptCountry, setAttemptCountry] = useState<CountryDialCode | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>(10);
  const [seed, setSeed] = useState("start");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const lastAccountSaveAt = useRef(0);
  const lastAccountSaveKey = useRef("");
  const [resumeState, setResume] = useState<SavedProgress | null>(null);

  const { data: accountData } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getCurrentUser(),
    retry: false,
  });
  const account = accountData?.user ?? null;

  useEffect(() => {
    setPlayerName(loadPlayerName());
    setAttemptCountry(storedCountryToOption(loadPlayerCountry()));
    setProfileLoaded(true);
  }, []);

  useEffect(() => {
    if (!profileLoaded || playerName.trim() || !account?.displayName) return;
    setPlayerName(account.displayName);
  }, [account?.displayName, playerName, profileLoaded]);

  const limit = mode === "full" ? undefined : mode;
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["quiz", id, String(mode), seed],
    queryFn: () => getQuiz(id, limit, seed),
    enabled: started,
  });

  const quiz = data?.quiz;
  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
  const current = questions[index];
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    try {
      const { result } = await submitAnswers({
        quizId: quiz.id,
        playerName,
        visitorId: getVisitorId(),
        countryCode: attemptCountry?.iso ?? null,
        countryName: attemptCountry?.name ?? null,
        questionIds: questions.map((question) => question.id),
        answers,
        timeSpentSeconds,
      });
      const savedPlayerName = result.playerName || playerName.trim() || "Anonymous";
      saveAttempt({
        quizId: quiz.id,
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        quizCategory: quiz.category,
        quizDifficulty: quiz.difficulty,
        levelName: quiz.levelName,
        countryCode: result.countryCode ?? attemptCountry?.iso ?? null,
        countryName: result.countryName ?? attemptCountry?.name ?? null,
        timeLimitSeconds: quiz.timeLimitSeconds,
        playerName: savedPlayerName,
        answers,
        timeSpentSeconds,
        result,
        questions: questions.map((question) => ({
          id: question.id,
          text: question.text,
          options: question.options,
        })),
        completedAt: new Date().toISOString(),
      });
      clearProgress(quiz.id);
      toast.success("Quiz submitted", {
        description: `You scored ${result.percentage}% and your result is ready.`,
      });
      if (account?.id) await deleteAccountProgress(quiz.id).catch(() => undefined);

      void navigate({ to: "/results" });
    } catch (submitFailure) {
      const message =
        submitFailure instanceof Error ? submitFailure.message : "Could not submit quiz";
      setSubmitError(message);
      toast.error("Your answers weren't submitted", { description: message });
      setSubmitting(false);
    }
  }, [quiz, submitting, playerName, attemptCountry, answers, questions, account?.id, navigate]);

  // Persist in-progress state locally on every change.
  useEffect(() => {
    if (!started || !quiz) return;
    const snapshot: SavedProgress = {
      quizId: quiz.id,
      mode,
      seed,
      answers,
      flagged,
      currentIndex: index,
      elapsedSeconds: elapsed,
      savedAt: new Date().toISOString(),
    };
    saveProgress(snapshot);
    if (!account?.id) return;
    const now = Date.now();
    const saveKey = progressSaveKey(snapshot);
    const meaningfulChange = saveKey !== lastAccountSaveKey.current;
    if (!meaningfulChange && now - lastAccountSaveAt.current < 15000) return;
    lastAccountSaveAt.current = now;
    lastAccountSaveKey.current = saveKey;
    void saveAccountProgress(snapshot).catch(() => undefined);
  }, [started, quiz, mode, seed, answers, flagged, index, elapsed, account?.id]);

  useEffect(() => {
    if (!started) return;
    const syncElapsed = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt.current) / 1000)));
    };
    syncElapsed();
    const tick = window.setInterval(syncElapsed, 1000);
    return () => clearInterval(tick);
  }, [seed, started]);

  // Look for a resumable attempt locally and in the signed-in account.
  useEffect(() => {
    let active = true;
    const local = loadProgress(id);
    setResume(local);
    if (!account?.id) {
      return () => {
        active = false;
      };
    }

    void getAccountProgress(id)
      .then(({ progress }) => {
        if (!active) return;
        const best = chooseBestProgress(local, progress);
        if (best) saveProgress(best);
        setResume(best);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [account?.id, id]);

  const beginQuiz = (selectedMode: Mode) => {
    const savedName = playerName.trim() || account?.displayName || "Anonymous";
    setMode(selectedMode);
    setSeed(Date.now().toString(36));
    setAnswers({});
    setFlagged([]);
    setIndex(0);
    setElapsed(0);
    startedAt.current = Date.now();
    setPlayerName(savedName);
    savePlayerName(savedName);
    savePlayerCountry(
      attemptCountry ? { iso: attemptCountry.iso, name: attemptCountry.name } : null,
    );
    setStarted(true);
  };

  const resumeSaved = () => {
    if (!resumeState) return;
    setMode(resumeState.mode as Mode);
    setSeed(resumeState.seed);
    setAnswers(resumeState.answers);
    setFlagged(resumeState.flagged);
    setIndex(resumeState.currentIndex);
    setElapsed(resumeState.elapsedSeconds);
    startedAt.current = Date.now() - resumeState.elapsedSeconds * 1000;
    setStarted(true);
  };

  const savedProgress = resumeState;

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All sections
        </Link>

        <div className="mt-6 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Set up your practice
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the name you want on your score. You can add a country too, or leave it blank.
          </p>

          <label htmlFor="player-name" className="mt-6 block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="player-name"
            value={playerName}
            maxLength={50}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="e.g. Kamanzi Delvin"
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <div className="mt-5">
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex gap-3">
                <Flag className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <CountrySelect
                    id="attempt-country"
                    label="Country (optional)"
                    value={attemptCountry}
                    onChange={setAttemptCountry}
                    placeholder="Choose a country or leave blank"
                    allowEmpty
                  />
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    If you choose one, it can appear beside your name on leaderboards and
                    certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-foreground">Choose how you want to take it</p>
          <div className="mt-3 grid gap-3">
            {(
              [
                {
                  value: 10,
                  title: "Quick practice",
                  copy: "10 shuffled questions. A small start still counts.",
                },
                {
                  value: 25,
                  title: "Focused practice",
                  copy: "25 shuffled questions when you want a real rhythm.",
                },
                {
                  value: 50,
                  title: "Extended practice",
                  copy: "50 shuffled questions for serious revision.",
                },
                {
                  value: "full",
                  title: "Full section (certificate eligible)",
                  copy: "All 500 questions, untimed and self-paced. Pause any time; score 80%+ to earn a certificate.",
                },
              ] as { value: Mode; title: string; copy: string }[]
            ).map((option) => (
              <button
                key={String(option.value)}
                type="button"
                disabled={!playerName.trim()}
                onClick={() => beginQuiz(option.value)}
                className="flex min-h-20 items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{option.copy}</span>
                </span>
                {option.value === "full" ? (
                  <Award className="h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>

          {savedProgress && (
            <div className="mt-4 rounded-lg border border-primary/40 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">
                You have an unfinished attempt - {Object.keys(savedProgress.answers).length}{" "}
                answered, saved {new Date(savedProgress.savedAt).toLocaleString()}.
              </p>
              <button
                type="button"
                onClick={resumeSaved}
                className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Resume where I left off
              </button>
            </div>
          )}

          {!playerName.trim() && (
            <p className="mt-4 text-xs text-muted-foreground">
              Enter your name to unlock the start options.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading || !quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Getting your questions ready...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-medium text-foreground">We could not get this section ready.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The connection failed with {(error as Error)?.message}. Try again in a moment.
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {quiz.levelName}
          </p>
          <h1 className="mt-1 wrap-break-word text-2xl font-semibold tracking-tight text-foreground">
            {quiz.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
            {quiz.certificateEligible ? " - certificate eligible" : " - practice run"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            One question at a time. Flag anything you want to revisit before submitting.
          </p>
        </div>
        {quiz.timeLimitSeconds > 0 ? (
          <Timer
            totalSeconds={quiz.timeLimitSeconds}
            startedAtMs={startedAt.current}
            running
            onExpire={() => void handleSubmit()}
          />
        ) : (
          <div className="w-full rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:w-auto">
            <p className="text-xs font-medium text-muted-foreground">Self-paced - time on task</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
              {Math.floor(elapsed / 3600)
                .toString()
                .padStart(2, "0")}
              :
              {Math.floor((elapsed % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsed % 60).toString().padStart(2, "0")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          {current && (
            <QuestionCard
              question={current}
              questionNumber={index + 1}
              totalQuestions={questions.length}
              selectedOption={answers[current.id] ?? null}
              onSelect={(optionIndex) =>
                setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }))
              }
            />
          )}

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
                disabled={index === 0}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground disabled:opacity-40 sm:py-2"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  current &&
                  setFlagged((prev) =>
                    prev.includes(current.id)
                      ? prev.filter((qid) => qid !== current.id)
                      : [...prev, current.id],
                  )
                }
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-2.5 text-sm font-medium sm:py-2",
                  current && flagged.includes(current.id)
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-input bg-background text-muted-foreground",
                )}
              >
                <Flag className="h-4 w-4" /> Flag
              </button>
            </div>

            {index < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto sm:py-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:py-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Submit answers
              </button>
            )}
          </div>

          {submitError && <p className="mt-3 text-sm text-destructive">{submitError}</p>}
        </div>

        <aside className="rounded-lg border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Question map
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {answeredCount}/{questions.length}
            </p>
          </div>
          <div className="mt-3 grid max-h-56 grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5 overflow-y-auto pr-1 lg:max-h-none">
            {questions.map((question, questionIndex) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setIndex(questionIndex)}
                aria-label={`Go to question ${questionIndex + 1}`}
                className={cn(
                  "h-9 rounded text-xs font-medium tabular-nums transition-colors",
                  questionIndex === index && "ring-2 ring-ring",
                  flagged.includes(question.id)
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    : answers[question.id] !== undefined
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {questionIndex + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60 lg:py-2"
          >
            Submit now
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else void navigate({ to: "/" });
            }}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent lg:py-2"
          >
            Pause and come back
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Your answers are saved automatically on this device.
          </p>
        </aside>
      </div>
    </div>
  );
}
