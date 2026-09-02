import { Medal } from "lucide-react";
import type { LeaderboardEntry } from "@/types/quiz";
import { countryFlag } from "@/lib/countries";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
}

const medalColor = ["text-amber-500", "text-slate-400", "text-amber-700"];

function countryDisplay(entry: LeaderboardEntry): string {
  if (!entry.countryName) return "-";
  return `${countryFlag(entry.countryCode ?? "")} ${entry.countryName}`.trim();
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div>
      <div className="grid gap-3 md:hidden">
        {entries.map((entry, index) => (
          <article key={entry.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {index < 3 ? <Medal className={cn("h-4 w-4", medalColor[index])} /> : null}
                  Rank {index + 1}
                </p>
                <p className="mt-2 break-words text-base font-semibold text-card-foreground">
                  {entry.playerName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{countryDisplay(entry)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-semibold tabular-nums text-foreground">
                  {entry.percentage}%
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {entry.score}/{entry.maxScore}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <p className="break-words text-sm font-medium text-foreground">{entry.quizTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {entry.levelName} - {formatTime(entry.timeSpentSeconds)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
        <caption className="sr-only">Top quiz scores</caption>
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Rank
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Player
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Country
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Section
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Score
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.id}
              className="border-b border-border/60 last:border-0 hover:bg-accent/50"
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  {index < 3 ? <Medal className={cn("h-4 w-4", medalColor[index])} /> : null}
                  {index + 1}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">{entry.playerName}</td>
              <td className="px-4 py-3 text-muted-foreground">{countryDisplay(entry)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <span className="block">{entry.quizTitle}</span>
                <span className="text-xs">{entry.levelName}</span>
              </td>
              <td className="px-4 py-3 tabular-nums text-foreground">
                {entry.score}/{entry.maxScore}
                <span className="ml-2 text-xs text-muted-foreground">{entry.percentage}%</span>
              </td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground">
                {formatTime(entry.timeSpentSeconds)}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
