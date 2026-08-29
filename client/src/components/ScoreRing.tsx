import { cn } from "@/lib/utils";

interface ScoreRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function ScoreRing({ percentage, size = "md", label }: ScoreRingProps) {
  const sizeClasses = {
    sm: "h-16 w-16 text-sm",
    md: "h-28 w-28 text-xl",
    lg: "h-40 w-40 text-3xl",
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  const ringColor =
    percentage >= 80 ? "text-emerald-500" : percentage >= 60 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative flex items-center justify-center rounded-full", sizeClasses[size])}>
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000", ringColor)}
          />
        </svg>
        <span className={cn("relative font-bold tabular-nums", ringColor)}>{percentage}%</span>
      </div>
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
