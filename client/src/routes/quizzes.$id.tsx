import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Award, Flag, Loader2, ShieldCheck } from "lucide-react";
import { getQuiz, submitAnswers } from "@/lib/api";
import { QuestionCard } from "@/components/QuestionCard";
import { Timer } from "@/components/Timer";
import {
  clearProgress,
  loadProgress,
  loadPlayerName,
  saveAttempt,
  savePlayerName,
  saveProgress,
  type SavedProgress,
} from "@/lib/attempt-store";
import { cn } from "@/lib/utils";

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

function QuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<Mode>(10);
  const [seed, setSeed] = useState("start");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const [resumeState, setResume] = useState<SavedProgress | null>(null);

  useEffect(() => {
    setPlayerName(loadPlayerName());
  }, []);

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
        answers,
        timeSpentSeconds,
      });
      saveAttempt({
        quizId: quiz.id,
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        quizCategory: quiz.category,
        quizDifficulty: quiz.difficulty,
        levelName: quiz.levelName,
        timeLimitSeconds: quiz.timeLimitSeconds,
        playerName,
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

      void navigate({ to: "/results" });
    } catch (submitFailure) {
      setSubmitError((submitFailure as Error).message);
      setSubmitting(false);
    }
  }, [quiz, submitting, playerName, answers, questions, navigate]);

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
  }, [started, quiz, mode, seed, answers, flagged, index, elapsed]);

  useEffect(() => {
    if (!started) return;
    const tick = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(tick);
  }, [started]);

  // Look for a resumable attempt on this device.
  useEffect(() => {
    let active = true;
    void Promise.resolve({ best: loadProgress(id) }).then((choice) => {
      if (!active) return;
      setResume(choice.best);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const beginQuiz = (selectedMode: Mode) => {
    setMode(selectedMode);
    setSeed(Date.now().toString(36));
    setAnswers({});
    setFlagged([]);
    setIndex(0);
    setElapsed(0);
    startedAt.current = Date.now();
    savePlayerName(playerName.trim());
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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All sections
        </Link>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Before you begin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your name so we can score your attempt, place you on the leaderboard and issue a
            certificate if you pass.
          </p>

          <label htmlFor="player-name" className="mt-6 block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="player-name"
            value={playerName}
            maxLength={50}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="e.g. Amina Yusuf"
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <p className="mt-6 text-sm font-medium text-foreground">Choose how you want to take it</p>
          <div className="mt-3 grid gap-3">
            {(
              [
                {
                  value: 10,
                  title: "Quick practice",
                  copy: "10 shuffled questions. Great for a warm-up.",
                },
                {
                  value: 25,
                  title: "Focused practice",
                  copy: "25 shuffled questions to build confidence.",
                },
                {
                  value: 50,
                  title: "Extended practice",
                  copy: "50 shuffled questions for serious revision.",
                },
                {
                  value: "full",
                  title: "Full section (certificate eligible)",
                  copy: "All 300-500 questions, untimed and self-paced. Save and rest any time; score 80%+ to earn a certificate.",
                },
              ] as { value: Mode; title: string; copy: string }[]
            ).map((option) => (
              <button
                key={String(option.value)}
                type="button"
                disabled={!playerName.trim()}
                onClick={() => beginQuiz(option.value)}
                className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
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
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-medium text-foreground">We couldn't load this section.</p>
        <p className="mt-1 text-sm text-muted-foreground">{(error as Error)?.message}</p>
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {quiz.levelName}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {quiz.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
            {quiz.certificateEligible ? " - certificate eligible" : " - practice run"}
          </p>
        </div>
        {quiz.timeLimitSeconds > 0 ? (
          <Timer
            totalSeconds={quiz.timeLimitSeconds}
            running
            onExpire={() => void handleSubmit()}
          />
        ) : (
          <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_220px]">
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
                disabled={index === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40"
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
                  "inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium",
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
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
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

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Question map
          </p>
          <div className="mt-3 grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {questions.map((question, questionIndex) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setIndex(questionIndex)}
                aria-label={`Go to question ${questionIndex + 1}`}
                className={cn(
                  "h-8 rounded text-xs font-medium transition-colors",
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
            className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
          >
            Finish now
          </button>
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
          >
            Save &amp; rest
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            "Your answers are saved automatically on this device - resume this section any time."
          </p>
        </aside>
      </div>
    </div>
  );
}
