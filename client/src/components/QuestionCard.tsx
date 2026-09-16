import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, Flag } from "lucide-react";
import type { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
  showFeedback?: boolean | undefined;
  isCorrect?: boolean | undefined;
  correctOptionIndex?: number | undefined;
  explanation?: string | undefined;
  onReport?: (() => void) | undefined;
  reported?: boolean | undefined;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
  showFeedback = false,
  isCorrect,
  correctOptionIndex,
  explanation,
  onReport,
  reported = false,
}: QuestionCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="font-medium text-foreground">
          {Math.round((questionNumber / totalQuestions) * 100)}% complete
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
      <h2 className="mt-5 wrap-break-word text-lg font-semibold leading-snug text-card-foreground sm:mt-6 sm:text-xl lg:text-2xl">
        {question.text}
      </h2>
      <div className="mt-6 grid gap-3 sm:mt-8">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrectOption = showFeedback && correctOptionIndex === index;
          const isWrongSelection = showFeedback && isSelected && !isCorrectOption;
          const disabled = showFeedback;

          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "flex min-h-12 items-start justify-between gap-3 rounded-lg border px-3 py-3 text-left transition-all sm:px-4 sm:py-3.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isCorrectOption && "border-emerald-500 bg-emerald-50 text-emerald-900",
                isWrongSelection && "border-rose-500 bg-rose-50 text-rose-900",
                !isCorrectOption &&
                  !isWrongSelection &&
                  isSelected &&
                  "border-primary bg-primary/5 text-foreground",
                !isCorrectOption &&
                  !isWrongSelection &&
                  !isSelected &&
                  hoveredIndex === index &&
                  "border-primary/50 bg-accent",
                !isCorrectOption &&
                  !isWrongSelection &&
                  !isSelected &&
                  "border-border bg-background hover:border-primary/50 hover:bg-accent",
              )}
            >
              <span className="min-w-0 wrap-break-word font-medium">{option}</span>
              {isCorrectOption && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />}
              {isWrongSelection && <XCircle className="h-5 w-5 shrink-0 text-rose-600" />}
              {!showFeedback && isSelected && (
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
              )}
            </button>
          );
        })}
      </div>
      {showFeedback && explanation && (
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Explanation: </span>
          {explanation}
        </div>
      )}
      {onReport && (
        <button
          type="button"
          onClick={onReport}
          disabled={reported}
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:cursor-default disabled:opacity-70"
        >
          <Flag className="h-3.5 w-3.5" />
          {reported ? "Thanks, we received your report" : "Something wrong with this question?"}
        </button>
      )}
    </div>
  );
}
