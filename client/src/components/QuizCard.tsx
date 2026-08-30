import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Clock, ListChecks } from "lucide-react";
import type { QuizSummary } from "@/types/quiz";
import { cn } from "@/lib/utils";

const difficultyStyles: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function QuizCard({ quiz }: { quiz: QuizSummary }) {
  return (
    <Link
      to="/quizzes/$id"
      params={{ id: quiz.id }}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {quiz.levelName}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            difficultyStyles[quiz.difficulty] ?? "bg-muted text-muted-foreground",
          )}
        >
          {quiz.difficulty}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">
        {quiz.title}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{quiz.description}</p>

      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5" />
          {quiz.questionCount} questions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {quiz.timeLimitSeconds > 0
            ? `${Math.ceil(quiz.timeLimitSeconds / 60)} min`
            : "Self-paced"}
        </span>
      </div>

      {quiz.questionCount >= 500 && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Award className="h-3.5 w-3.5" />
          500-question certificate path
        </span>
      )}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Start section
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
