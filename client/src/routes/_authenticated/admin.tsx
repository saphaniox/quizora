import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  FileQuestion,
  Gauge,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { getLeaderboard, getLevels } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Difficulty, LeaderboardEntry, Level, QuizSummary } from "@/types/quiz";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard - Quitech" },
      {
        name: "description",
        content:
          "Monitor Quitech catalogue coverage, learner activity, content quality, and production readiness.",
      },
      { property: "og:title", content: "Admin dashboard - Quitech" },
      {
        property: "og:description",
        content: "Operational dashboard for Quitech catalogue and learning activity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type StatusTone = "ready" | "warning" | "blocked";

interface ReadinessItem {
  label: string;
  detail: string;
  tone: StatusTone;
}

const difficultyOrder: Difficulty[] = ["Easy", "Medium", "Hard"];

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function percent(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

function statusClass(tone: StatusTone): string {
  if (tone === "ready")
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (tone === "warning")
    return "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "border-destructive/25 bg-destructive/10 text-destructive";
}

function flattenSections(levels: Level[]): QuizSummary[] {
  return levels.flatMap((level) => level.sections);
}

function AdminPage() {
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const levelsQuery = useQuery({ queryKey: ["admin", "levels"], queryFn: () => getLevels() });
  const leaderboardQuery = useQuery({
    queryKey: ["admin", "leaderboard"],
    queryFn: () => getLeaderboard(),
  });

  const loadedLevels = levelsQuery.data?.levels;
  const levels = useMemo(() => loadedLevels ?? [], [loadedLevels]);
  const sections = useMemo(() => flattenSections(levels), [levels]);
  const loadedLeaderboard = leaderboardQuery.data?.leaderboard;
  const leaderboard = useMemo(() => loadedLeaderboard ?? [], [loadedLeaderboard]);
  const visibleSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sections.filter((section) => {
      const inLevel = selectedLevel === "all" || section.levelId === selectedLevel;
      const matches =
        !term ||
        section.title.toLowerCase().includes(term) ||
        section.description.toLowerCase().includes(term) ||
        section.category.toLowerCase().includes(term) ||
        section.levelName.toLowerCase().includes(term);
      return inLevel && matches;
    });
  }, [query, sections, selectedLevel]);

  const totalQuestions =
    levelsQuery.data?.totalQuestions ??
    sections.reduce((sum, section) => sum + section.questionCount, 0);
  const totalSections = sections.length;
  const averageQuestions = totalSections ? Math.round(totalQuestions / totalSections) : 0;

  const difficultyCounts = useMemo(() => {
    return difficultyOrder.map((difficulty) => ({
      difficulty,
      count: sections.filter((section) => section.difficulty === difficulty).length,
    }));
  }, [sections]);

  const largestSections = useMemo(() => {
    return sections
      .slice()
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, 5);
  }, [sections]);

  const qaFlags = useMemo(() => {
    const shortDescriptions = sections.filter((section) => section.description.trim().length < 80);
    const longRuns = sections.filter((section) => section.questionCount >= 450);
    const repeatedTitles = sections.filter((section, index, list) => {
      return (
        list.findIndex(
          (candidate) => candidate.title.toLowerCase() === section.title.toLowerCase(),
        ) !== index
      );
    });

    return [
      {
        label: "Short descriptions",
        value: shortDescriptions.length,
        detail: "Sections with descriptions under 80 characters.",
        tone: shortDescriptions.length ? "warning" : "ready",
      },
      {
        label: "Long certificate runs",
        value: longRuns.length,
        detail: "Sections at 450+ questions. Confirm learners can pause and resume.",
        tone: longRuns.length ? "warning" : "ready",
      },
      {
        label: "Repeated titles",
        value: repeatedTitles.length,
        detail: "Duplicate section names can confuse search, analytics, and certificates.",
        tone: repeatedTitles.length ? "blocked" : "ready",
      },
    ] satisfies Array<{ label: string; value: number; detail: string; tone: StatusTone }>;
  }, [sections]);

  const activity = useMemo(() => summarizeActivity(leaderboard), [leaderboard]);

  const readiness: ReadinessItem[] = [
    {
      label: "Question delivery",
      detail:
        "Quiz payloads are generated by server handlers and public quiz responses omit answer keys.",
      tone: "ready",
    },
    {
      label: "Durable persistence",
      detail:
        "Standalone Fastify/PostgreSQL persistence exists, but local Postgres is not running and client server routes keep activity in memory.",
      tone: "blocked",
    },
    {
      label: "Admin authorization",
      detail:
        "User sessions exist, but there is no role table, admin middleware, or permission check for privileged writes yet.",
      tone: "blocked",
    },
    {
      label: "Content management API",
      detail:
        "Wait for authenticated create/update/publish endpoints with audit logs before enabling editing.",
      tone: "warning",
    },
  ];

  const loading = levelsQuery.isLoading || leaderboardQuery.isLoading;
  const hasLoadError = levelsQuery.isError || leaderboardQuery.isError;

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Operator console
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              Admin dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Monitor catalogue coverage, learner activity, content quality, and backend gaps before
              enabling a full content studio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void levelsQuery.refetch();
              void leaderboardQuery.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {hasLoadError && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Some admin data could not be loaded.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check `VITE_API_URL`, the API process, and PostgreSQL availability if this
                  persists.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Layers3}
            label="Learning levels"
            value={formatNumber(levels.length)}
            detail="Published catalogue groups"
          />
          <MetricCard
            icon={BookOpen}
            label="Sections"
            value={formatNumber(totalSections)}
            detail="Queryable quiz sections"
          />
          <MetricCard
            icon={FileQuestion}
            label="Questions"
            value={formatNumber(totalQuestions)}
            detail={`${formatNumber(averageQuestions)} average per section`}
          />
          <MetricCard
            icon={Trophy}
            label="Score entries"
            value={formatNumber(leaderboard.length)}
            detail={`${activity.passRate}% estimated pass rate`}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-card-foreground">
                    Catalogue coverage
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Live section inventory grouped by level and difficulty.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative block sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search catalogue"
                      className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(event) => setSelectedLevel(event.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All levels</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Section</th>
                    <th className="px-5 py-3 font-medium">Level</th>
                    <th className="px-5 py-3 font-medium">Difficulty</th>
                    <th className="px-5 py-3 text-right font-medium">Questions</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleSections.slice(0, 12).map((section) => (
                    <tr key={section.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-card-foreground">{section.title}</p>
                        <p className="mt-1 line-clamp-1 max-w-md text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{section.levelName}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground">
                          {section.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-foreground">
                        {formatNumber(section.questionCount)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Server served
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleSections.length === 0 && (
              <div className="p-10 text-center">
                <p className="font-medium text-foreground">No matching sections</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust the search or level filter.
                </p>
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">Difficulty mix</h2>
              <div className="mt-5 space-y-4">
                {difficultyCounts.map(({ difficulty, count }) => (
                  <div key={difficulty}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{difficulty}</span>
                      <span className="text-muted-foreground">{count} sections</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${percent(count, totalSections)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">Readiness</h2>
              <div className="mt-4 space-y-3">
                {readiness.map((item) => (
                  <div
                    key={item.label}
                    className={cn("rounded-lg border p-3", statusClass(item.tone))}
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 opacity-90">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">Learner activity</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Average score" value={`${activity.averageScore}%`} />
              <MiniStat label="Best score" value={`${activity.bestScore}%`} />
              <MiniStat label="Passed" value={formatNumber(activity.passed)} />
              <MiniStat label="Recent runs" value={formatNumber(activity.recent)} />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">Content QA</h2>
            </div>
            <div className="mt-4 space-y-3">
              {qaFlags.map((flag) => (
                <div
                  key={flag.label}
                  className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{flag.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{flag.detail}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs font-semibold",
                      statusClass(flag.tone),
                    )}
                  >
                    {flag.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">Architecture</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <ArchitectureRow label="Browser" value="React UI only" tone="ready" />
              <ArchitectureRow
                label="Quiz API"
                value="Server routes provide public quiz payloads"
                tone="ready"
              />
              <ArchitectureRow
                label="Answers"
                value="Kept server-side until submission"
                tone="ready"
              />
              <ArchitectureRow
                label="Persistence"
                value="Needs running PostgreSQL for production"
                tone="blocked"
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-card-foreground">Largest sections</h2>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-5">
            {largestSections.map((section) => (
              <div key={section.id} className="rounded-lg border border-border bg-background p-4">
                <p className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground">
                  {section.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{section.levelName}</p>
                <p className="mt-4 text-2xl font-semibold text-foreground">
                  {formatNumber(section.questionCount)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function summarizeActivity(entries: LeaderboardEntry[]) {
  const total = entries.length;
  const averageScore = total
    ? Math.round(entries.reduce((sum, entry) => sum + entry.percentage, 0) / total)
    : 0;
  const bestScore = total ? Math.max(...entries.map((entry) => entry.percentage)) : 0;
  const passed = entries.filter((entry) => entry.percentage >= 80).length;
  const recentThreshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = entries.filter(
    (entry) => new Date(entry.completedAt).getTime() >= recentThreshold,
  ).length;

  return {
    averageScore,
    bestScore,
    passed,
    recent,
    passRate: percent(passed, total),
  };
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-card-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ArchitectureRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: StatusTone;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{value}</p>
      </div>
      <span className={cn("rounded-md border px-2 py-1 text-xs font-semibold", statusClass(tone))}>
        {tone === "ready" ? "OK" : tone === "warning" ? "Watch" : "Blocked"}
      </span>
    </div>
  );
}
