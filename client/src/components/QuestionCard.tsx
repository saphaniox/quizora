import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
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
}: QuestionCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
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
      <h2 className="mt-6 text-xl font-semibold leading-snug text-card-foreground sm:text-2xl">
        {question.text}
      </h2>
      <div className="mt-8 grid gap-3">
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
                "flex items-center justify-between rounded-lg border px-4 py-3.5 text-left transition-all",
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
              <span className="font-medium">{option}</span>
              {isCorrectOption && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {isWrongSelection && <XCircle className="h-5 w-5 text-rose-600" />}
              {!showFeedback && isSelected && <ArrowRight className="h-4 w-4 text-primary" />}
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
    </div>
  );
}
