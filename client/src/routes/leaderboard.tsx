import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { getLeaderboard, getLevels } from "@/lib/api";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard - Quitech" },
      {
        name: "description",
        content: "See the top Quitech scores across every learning level and subject section.",
      },
      { property: "og:title", content: "Leaderboard - Quitech" },
      {
        property: "og:description",
        content: "Top Quitech scores across every learning level and subject section.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [levelId, setLevelId] = useState<string>("");

  const { data: levelsData } = useQuery({ queryKey: ["levels"], queryFn: () => getLevels() });
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "all", levelId || "any"],
    queryFn: () => getLeaderboard(levelId ? { levelId } : undefined),
  });

  const entries = useMemo(() => data?.leaderboard ?? [], [data]);
  const levels = levelsData?.levels ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leaderboard</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Ranked by each learner's best score, then by fastest completion time. Add a country before
        your attempt if you want it shown.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          onClick={() => setLevelId("")}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            levelId === ""
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          All levels
        </button>
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => setLevelId(level.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              levelId === level.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {level.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-lg border border-border bg-muted/40" />
        ) : entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center sm:p-12">
            <p className="font-medium text-foreground">No scores here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to complete a section on this level.
            </p>
          </div>
        ) : (
          <LeaderboardTable entries={entries} />
        )}
      </div>
    </div>
  );
}
