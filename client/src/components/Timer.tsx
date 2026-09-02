import { useEffect, useRef, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
  running: boolean;
  startedAtMs: number;
  className?: string;
}

function secondsLeft(totalSeconds: number, startedAtMs: number): number {
  const deadline = startedAtMs + totalSeconds * 1000;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export function Timer({ totalSeconds, onExpire, running, startedAtMs, className }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(secondsLeft(totalSeconds, startedAtMs));
  }, [startedAtMs, totalSeconds]);

  useEffect(() => {
    if (!running || totalSeconds <= 0) return;

    const sync = () => {
      const nextRemaining = secondsLeft(totalSeconds, startedAtMs);
      setRemaining(nextRemaining);
      if (nextRemaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    sync();
    const interval = window.setInterval(sync, 250);

    return () => window.clearInterval(interval);
  }, [running, startedAtMs, totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;
  const isLow = remaining <= 10;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:w-auto sm:min-w-56",
        className,
      )}
    >
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
            className={cn(
              "transition-all duration-1000 ease-linear",
              isLow ? "text-destructive" : "text-primary",
            )}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <Clock className={cn("absolute h-4 w-4", isLow ? "text-destructive" : "text-primary")} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">Time remaining</p>
        <p
          className={cn(
            "w-16 text-lg font-semibold tabular-nums tracking-tight",
            isLow && "text-destructive",
          )}
        >
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>
      {isLow && <AlertCircle className="ml-auto h-5 w-5 text-destructive" />}
    </div>
  );
}
