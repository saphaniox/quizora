import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
  running: boolean;
  className?: string;
}

export function Timer({ totalSeconds, onExpire, running, className }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;
  const isLow = remaining <= 10;

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-muted"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className={cn("transition-all duration-1000 ease-linear", isLow ? "text-destructive" : "text-primary")}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <Clock className={cn("absolute h-4 w-4", isLow ? "text-destructive" : "text-primary")} />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Time remaining</p>
        <p className={cn("text-lg font-semibold tabular-nums tracking-tight", isLow && "text-destructive")}>
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>
      {isLow && <AlertCircle className="ml-auto h-5 w-5 text-destructive" />}
    </div>
  );
}
