import { Fragment, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileQuestion,
  Gauge,
  History,
  Layers3,
  Loader2,
  LockKeyhole,
  LogIn,
  PencilLine,
  Server,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Trophy,
  Trash2,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  deleteLeaderboardEntry,
  deleteAdminUser,
  deleteAdminCertificate,
  getAdminAuditLog,
  getAdminCatalogue,
  getCurrentUser,
  getHealth,
  getAdminUsers,
  getAdminCertificates,
  getLeaderboard,
  getLevels,
  publishCatalogueSection,
  saveCatalogueDraft,
  type AdminUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  AdminAuditEntry,
  AdminCatalogueSection,
  Difficulty,
  LeaderboardEntry,
  Level,
  QuizSummary,
} from "@/types/quiz";

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

interface CatalogueDraftForm {
  title: string;
  description: string;
  difficulty: Difficulty;
  published: boolean;
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

function draftFromSection(section: AdminCatalogueSection): CatalogueDraftForm {
  return {
    title: section.draftTitle,
    description: section.draftDescription,
    difficulty: section.draftDifficulty,
    published: section.draftPublished,
  };
}

function isEditableSection(section: QuizSummary): section is AdminCatalogueSection {
  return "draftTitle" in section;
}

function auditActionLabel(action: string): string {
  if (action === "catalogue.draft_saved") return "Draft saved";
  if (action === "catalogue.published") return "Published";
  return action;
}

function auditDetail(entry: AdminAuditEntry): string {
  const title =
    typeof entry.metadata["title"] === "string" ? entry.metadata["title"] : entry.entityId;
  const difficulty =
    typeof entry.metadata["difficulty"] === "string" ? entry.metadata["difficulty"] : null;
  const visible = typeof entry.metadata["visible"] === "boolean" ? entry.metadata["visible"] : null;
  return [title, difficulty, visible === null ? null : visible ? "Visible" : "Hidden"]
    .filter(Boolean)
    .join(" / ");
}

function AdminPage() {
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [confirmingLeaderboardId, setConfirmingLeaderboardId] = useState<string | null>(null);
  const [confirmingUserId, setConfirmingUserId] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [confirmingCertificateCode, setConfirmingCertificateCode] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [catalogueDraft, setCatalogueDraft] = useState<CatalogueDraftForm | null>(null);
  const [catalogueAction, setCatalogueAction] = useState<{
    tone: StatusTone;
    message: string;
  } | null>(null);
  const [leaderboardAction, setLeaderboardAction] = useState<{
    tone: StatusTone;
    message: string;
  } | null>(null);

  const accountQuery = useQuery({ queryKey: ["auth", "me"], queryFn: () => getCurrentUser() });
  const account = accountQuery.data?.user ?? null;
  const isAdmin = account?.role === "admin";

  const levelsQuery = useQuery({
    queryKey: ["admin", "levels"],
    queryFn: () => getLevels(),
    enabled: isAdmin,
  });
  const catalogueQuery = useQuery({
    queryKey: ["admin", "catalogue"],
    queryFn: () => getAdminCatalogue(),
    enabled: isAdmin,
  });
  const auditQuery = useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: () => getAdminAuditLog(),
    enabled: isAdmin,
  });
  const leaderboardQuery = useQuery({
    queryKey: ["admin", "leaderboard"],
    queryFn: () => getLeaderboard(),
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", userQuery],
    queryFn: () => getAdminUsers(userQuery),
    enabled: isAdmin,
  });
  const certificatesQuery = useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: () => getAdminCertificates(),
    enabled: isAdmin,
  });
  const healthQuery = useQuery({
    queryKey: ["admin", "health"],
    queryFn: () => getHealth(),
    enabled: isAdmin,
  });
  const deleteLeaderboardMutation = useMutation({
    mutationFn: deleteLeaderboardEntry,
    onSuccess: () => {
      setConfirmingLeaderboardId(null);
      setLeaderboardAction({ tone: "ready", message: "Ranking record deleted." });
      void leaderboardQuery.refetch();
    },
    onError: (error) => {
      setLeaderboardAction({
        tone: "blocked",
        message: error instanceof Error ? error.message : "Could not delete ranking record.",
      });
    },
  });
  const deleteAdminUserMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      setConfirmingUserId(null);
      void usersQuery.refetch();
      void certificatesQuery.refetch();
      setLeaderboardAction({ tone: "ready", message: "User and linked account data deleted." });
    },
    onError: (error) => {
      setLeaderboardAction({
        tone: "blocked",
        message: error instanceof Error ? error.message : "Could not delete user data.",
      });
    },
  });
  const deleteAdminCertificateMutation = useMutation({
    mutationFn: deleteAdminCertificate,
    onSuccess: () => {
      setConfirmingCertificateCode(null);
      void certificatesQuery.refetch();
      setLeaderboardAction({ tone: "ready", message: "Certificate revoked." });
    },
    onError: (error) => {
      setLeaderboardAction({
        tone: "blocked",
        message: error instanceof Error ? error.message : "Could not revoke certificate.",
      });
    },
  });
  const saveCatalogueMutation = useMutation({
    mutationFn: ({ sectionId, draft }: { sectionId: string; draft: CatalogueDraftForm }) =>
      saveCatalogueDraft(sectionId, draft),
    onSuccess: ({ section }) => {
      setCatalogueDraft(draftFromSection(section));
      setCatalogueAction({ tone: "ready", message: "Draft saved." });
      void catalogueQuery.refetch();
      void levelsQuery.refetch();
    },
    onError: (error) => {
      setCatalogueAction({
        tone: "blocked",
        message: error instanceof Error ? error.message : "Could not save catalogue draft.",
      });
    },
  });
  const publishCatalogueMutation = useMutation({
    mutationFn: async ({ sectionId, draft }: { sectionId: string; draft: CatalogueDraftForm }) => {
      await saveCatalogueDraft(sectionId, draft);
      return publishCatalogueSection(sectionId);
    },
    onSuccess: ({ section }) => {
      setCatalogueDraft(draftFromSection(section));
      setCatalogueAction({ tone: "ready", message: "Catalogue section published." });
      void catalogueQuery.refetch();
      void levelsQuery.refetch();
    },
    onError: (error) => {
      setCatalogueAction({
        tone: "blocked",
        message: error instanceof Error ? error.message : "Could not publish catalogue section.",
      });
    },
  });

  const loadedLevels = levelsQuery.data?.levels;
  const levels = useMemo(() => loadedLevels ?? [], [loadedLevels]);
  const loadedCatalogueSections = catalogueQuery.data?.sections;
  const sections = useMemo(() => loadedCatalogueSections ?? [], [loadedCatalogueSections]);
  const loadedAuditLog = auditQuery.data?.auditLog;
  const auditLog = useMemo(() => loadedAuditLog ?? [], [loadedAuditLog]);
  const fallbackSections = useMemo(() => flattenSections(levels), [levels]);
  const sectionSource = sections.length ? sections : fallbackSections;
  const loadedLeaderboard = leaderboardQuery.data?.leaderboard;
  const leaderboard = useMemo(() => loadedLeaderboard ?? [], [loadedLeaderboard]);
  const visibleSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sectionSource.filter((section) => {
      const inLevel = selectedLevel === "all" || section.levelId === selectedLevel;
      const matches =
        !term ||
        section.title.toLowerCase().includes(term) ||
        section.description.toLowerCase().includes(term) ||
        section.category.toLowerCase().includes(term) ||
        section.levelName.toLowerCase().includes(term);
      return inLevel && matches;
    });
  }, [query, sectionSource, selectedLevel]);

  const totalQuestions = sectionSource.reduce((sum, section) => sum + section.questionCount, 0);
  const totalSections = sectionSource.length;
  const publishedSections = sections.filter((section) => section.published).length;
  const draftSections = sections.filter((section) => section.hasDraftChanges).length;
  const averageQuestions = totalSections ? Math.round(totalQuestions / totalSections) : 0;

  const difficultyCounts = useMemo(() => {
    return difficultyOrder.map((difficulty) => ({
      difficulty,
      count: sectionSource.filter((section) => section.difficulty === difficulty).length,
    }));
  }, [sectionSource]);

  const largestSections = useMemo(() => {
    return sectionSource
      .slice()
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, 5);
  }, [sectionSource]);

  const qaFlags = useMemo(() => {
    const shortDescriptions = sectionSource.filter(
      (section) => section.description.trim().length < 80,
    );
    const nonStandardRuns = sectionSource.filter((section) => section.questionCount !== 500);
    const repeatedTitles = sectionSource.filter((section, index, list) => {
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
        label: "Certificate length",
        value: nonStandardRuns.length,
        detail: "Full certificate sections should use the 500-question standard.",
        tone: nonStandardRuns.length ? "warning" : "ready",
      },
      {
        label: "Repeated titles",
        value: repeatedTitles.length,
        detail: "Duplicate section names can confuse search, analytics, and certificates.",
        tone: repeatedTitles.length ? "blocked" : "ready",
      },
    ] satisfies Array<{ label: string; value: number; detail: string; tone: StatusTone }>;
  }, [sectionSource]);

  const activity = useMemo(() => summarizeActivity(leaderboard), [leaderboard]);

  const refreshedAt = Math.max(
    levelsQuery.dataUpdatedAt,
    leaderboardQuery.dataUpdatedAt,
    healthQuery.dataUpdatedAt,
  );
  const refreshedLabel = refreshedAt ? new Date(refreshedAt).toLocaleString() : "Waiting for data";

  const readiness: ReadinessItem[] = [
    {
      label: "Question delivery",
      detail:
        "Quiz payloads are generated by server handlers and public quiz responses omit answer keys.",
      tone: "ready",
    },
    {
      label: "Admin authorization",
      detail:
        "The dashboard checks the signed-in session and only opens for accounts with the admin role.",
      tone: "ready",
    },
    {
      label: "Account deletion",
      detail:
        "Signed-in users can open account actions and delete their account after typing a confirmation phrase.",
      tone: "ready",
    },
    {
      label: "Legal pages",
      detail:
        "Privacy Policy, Terms of Service, Support, and the external deletion request page exist.",
      tone: "ready",
    },
    {
      label: "Catalogue governance",
      detail:
        "Admins can save drafts, publish section updates, control visibility, and keep audit records in the API database.",
      tone: "ready",
    },
  ];

  const loading =
    accountQuery.isLoading ||
    (isAdmin &&
      (levelsQuery.isLoading ||
        catalogueQuery.isLoading ||
        auditQuery.isLoading ||
        leaderboardQuery.isLoading ||
        usersQuery.isLoading ||
        certificatesQuery.isLoading ||
        healthQuery.isLoading));
  const hasLoadError =
    levelsQuery.isError ||
    catalogueQuery.isError ||
    auditQuery.isError ||
    leaderboardQuery.isError ||
    usersQuery.isError ||
    certificatesQuery.isError ||
    healthQuery.isError;
  const apiHealthy = healthQuery.data?.status === "ok";
  const accountContact =
    account?.email ?? account?.phoneE164 ?? account?.displayName ?? "Signed-in admin";
  const systemStatus = [
    {
      icon: UserRoundCheck,
      label: "Access",
      value: "Admin verified",
      detail: accountContact,
      tone: "ready",
    },
    {
      icon: Server,
      label: "API health",
      value: apiHealthy ? "Online" : "Check",
      detail: healthQuery.data?.service ?? "Waiting for health response",
      tone: apiHealthy ? "ready" : "warning",
    },
    {
      icon: Database,
      label: "Data endpoints",
      value:
        levelsQuery.isSuccess && catalogueQuery.isSuccess && leaderboardQuery.isSuccess
          ? "Responding"
          : "Loading",
      detail: `${formatNumber(totalSections)} sections, ${formatNumber(publishedSections)} published, ${formatNumber(leaderboard.length)} best score entries`,
      tone:
        levelsQuery.isError || catalogueQuery.isError || leaderboardQuery.isError
          ? "blocked"
          : levelsQuery.isSuccess && catalogueQuery.isSuccess && leaderboardQuery.isSuccess
            ? "ready"
            : "warning",
    },
    {
      icon: UsersRound,
      label: "Learner controls",
      value: "Account-safe",
      detail: "Deletion requires sign-in and typed confirmation",
      tone: "ready",
    },
  ] satisfies Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    detail: string;
    tone: StatusTone;
  }>;

  if (accountQuery.isLoading) {
    return (
      <AdminAccessState
        icon={ShieldCheck}
        title="Checking admin access"
        copy="Give us a moment while we confirm your signed-in account."
      />
    );
  }

  if (!account) {
    return (
      <AdminAccessState
        icon={LogIn}
        title="Sign in to continue"
        copy="Use your Quitech account before opening the admin dashboard."
        actionHref="/auth?next=/admin"
        actionLabel="Sign in"
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminAccessState
        icon={LockKeyhole}
        title="Admin access required"
        copy={`${accountContact} is signed in, but this account is not marked as an admin.`}
        actionHref="/"
        actionLabel="Back to quizzes"
      />
    );
  }

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
              Monitor catalogue coverage, learner activity, content quality, access control, and
              production readiness from one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="min-w-0 wrap-break-word rounded-md border border-border bg-background px-2.5 py-1">
                Signed in as <span className="font-medium text-foreground">{accountContact}</span>
              </span>
              <span className="rounded-md border border-border bg-background px-2.5 py-1">
                Last refreshed {refreshedLabel}
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent sm:py-2"
            >
              View site
            </a>
            <button
              type="button"
              onClick={() => {
                void healthQuery.refetch();
                void levelsQuery.refetch();
                void catalogueQuery.refetch();
                void auditQuery.refetch();
                void leaderboardQuery.refetch();
                void usersQuery.refetch();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent sm:py-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {hasLoadError && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">
                  We couldn't load part of the dashboard.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please try refreshing. If the problem continues, check that the API and database
                  are online.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {systemStatus.map((status) => (
            <StatusCard key={status.label} {...status} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            detail={`${formatNumber(publishedSections)} published, ${formatNumber(draftSections)} drafts`}
          />
          <MetricCard
            icon={FileQuestion}
            label="Questions"
            value={formatNumber(totalQuestions)}
            detail={`${formatNumber(averageQuestions)} average per section`}
          />
          <MetricCard
            icon={Trophy}
            label="Best score entries"
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
                  <label className="relative block w-full sm:w-64">
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
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
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Section</th>
                    <th className="px-5 py-3 font-medium">Level</th>
                    <th className="px-5 py-3 font-medium">Difficulty</th>
                    <th className="px-5 py-3 text-right font-medium">Questions</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleSections.slice(0, 12).map((section) => {
                    const editable = isEditableSection(section) ? section : null;
                    const isEditing = editingSectionId === section.id && Boolean(editable);
                    const isSaving =
                      saveCatalogueMutation.isPending &&
                      saveCatalogueMutation.variables?.sectionId === section.id;
                    const isPublishing =
                      publishCatalogueMutation.isPending &&
                      publishCatalogueMutation.variables?.sectionId === section.id;
                    const actionDisabled = isSaving || isPublishing || !catalogueDraft;

                    return (
                      <Fragment key={section.id}>
                        <tr>
                          <td className="px-5 py-4">
                            <p className="font-medium text-card-foreground">{section.title}</p>
                            <p className="mt-1 line-clamp-1 max-w-md text-xs text-muted-foreground">
                              {section.description}
                            </p>
                            {editable?.hasDraftChanges && (
                              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                                Draft waiting to publish
                              </p>
                            )}
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
                            <div className="flex flex-wrap gap-1.5">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
                                  editable?.published === false
                                    ? statusClass("warning")
                                    : statusClass("ready"),
                                )}
                              >
                                {editable?.published === false ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                {editable?.published === false ? "Hidden" : "Published"}
                              </span>
                              {editable?.hasDraftChanges && (
                                <span
                                  className={cn(
                                    "rounded-md border px-2 py-1 text-xs font-medium",
                                    statusClass("warning"),
                                  )}
                                >
                                  Draft
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!editable) return;
                                  setEditingSectionId(section.id);
                                  setCatalogueDraft(draftFromSection(editable));
                                  setCatalogueAction(null);
                                }}
                                disabled={!editable}
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isEditing && catalogueDraft && (
                          <tr>
                            <td colSpan={6} className="bg-muted/20 px-5 py-5">
                              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-foreground">
                                    Section title
                                    <input
                                      value={catalogueDraft.title}
                                      onChange={(event) =>
                                        setCatalogueDraft({
                                          ...catalogueDraft,
                                          title: event.target.value,
                                        })
                                      }
                                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                  </label>
                                  <label className="block text-sm font-medium text-foreground">
                                    Description
                                    <textarea
                                      value={catalogueDraft.description}
                                      onChange={(event) =>
                                        setCatalogueDraft({
                                          ...catalogueDraft,
                                          description: event.target.value,
                                        })
                                      }
                                      rows={4}
                                      className="mt-1 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm font-normal leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                  </label>
                                </div>
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-foreground">
                                    Difficulty
                                    <select
                                      value={catalogueDraft.difficulty}
                                      onChange={(event) =>
                                        setCatalogueDraft({
                                          ...catalogueDraft,
                                          difficulty: event.target.value as Difficulty,
                                        })
                                      }
                                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                      {difficultyOrder.map((difficulty) => (
                                        <option key={difficulty} value={difficulty}>
                                          {difficulty}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                  <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground">
                                    <span className="inline-flex items-center gap-2">
                                      {catalogueDraft.published ? (
                                        <Eye className="h-4 w-4 text-primary" />
                                      ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      Visible to learners
                                    </span>
                                    <input
                                      type="checkbox"
                                      checked={catalogueDraft.published}
                                      onChange={(event) =>
                                        setCatalogueDraft({
                                          ...catalogueDraft,
                                          published: event.target.checked,
                                        })
                                      }
                                      className="h-4 w-4 accent-primary"
                                    />
                                  </label>
                                  <div className="flex flex-col gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveCatalogueMutation.mutate({
                                          sectionId: section.id,
                                          draft: catalogueDraft,
                                        })
                                      }
                                      disabled={actionDisabled}
                                      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                      {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Save className="h-4 w-4" />
                                      )}
                                      Save draft
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        publishCatalogueMutation.mutate({
                                          sectionId: section.id,
                                          draft: catalogueDraft,
                                        })
                                      }
                                      disabled={actionDisabled}
                                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                      {isPublishing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Send className="h-4 w-4" />
                                      )}
                                      Publish
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingSectionId(null);
                                        setCatalogueDraft(null);
                                      }}
                                      disabled={isSaving || isPublishing}
                                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {catalogueAction && (
              <div className="border-t border-border px-5 py-3">
                <div
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    statusClass(catalogueAction.tone),
                  )}
                >
                  {catalogueAction.message}
                </div>
              </div>
            )}

            {visibleSections.length > 0 && (
              <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                Showing {formatNumber(Math.min(visibleSections.length, 12))} of{" "}
                {formatNumber(visibleSections.length)} matching sections.
              </div>
            )}

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
                value="Scores, certificates, sessions, and account records belong in the deployed API database"
                tone={leaderboardQuery.isSuccess ? "ready" : "warning"}
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-card-foreground">
                  Certificate moderation
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Review and revoke issued certificates.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {certificatesQuery.data?.certificates.length ?? 0} recent
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Holder</th>
                  <th className="px-5 py-3 font-medium">Quiz</th>
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(certificatesQuery.data?.certificates ?? []).map((certificate) => {
                  const confirming = confirmingCertificateCode === certificate.code;
                  const deleting =
                    deleteAdminCertificateMutation.isPending &&
                    deleteAdminCertificateMutation.variables === certificate.code;
                  return (
                    <tr key={certificate.code}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-card-foreground">{certificate.playerName}</p>
                        <p className="text-xs text-muted-foreground">{certificate.percentage}%</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{certificate.quizTitle}</td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {certificate.code}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {confirming ? (
                          <button
                            type="button"
                            onClick={() => deleteAdminCertificateMutation.mutate(certificate.code)}
                            disabled={deleting}
                            className="rounded-md bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground disabled:opacity-70"
                          >
                            Confirm revoke
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingCertificateCode(certificate.code)}
                            className="rounded-md border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-card-foreground">User management</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Search accounts and permanently remove their linked progress, scores, and
                certificates.
              </p>
            </div>
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder="Search users"
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 text-right font-medium">Linked data</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(usersQuery.data?.users ?? []).map((adminUser) => {
                  const isConfirming = confirmingUserId === adminUser.id;
                  const isDeleting =
                    deleteAdminUserMutation.isPending &&
                    deleteAdminUserMutation.variables === adminUser.id;
                  return (
                    <tr key={adminUser.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-card-foreground">{adminUser.displayName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {adminUser.email ?? adminUser.phoneE164 ?? "No contact"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{adminUser.role}</td>
                      <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                        {adminUser.progressCount} progress / {adminUser.leaderboardCount} scores /{" "}
                        {adminUser.certificateCount} certificates
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {isConfirming ? (
                            <>
                              <button
                                type="button"
                                onClick={() => deleteAdminUserMutation.mutate(adminUser.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-70"
                              >
                                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                Confirm delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmingUserId(null)}
                                disabled={isDeleting}
                                className="rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-70"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingUserId(adminUser.id)}
                              disabled={adminUser.role === "admin"}
                              className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/30 bg-background px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete data
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(usersQuery.data?.users ?? []).length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">No matching users.</p>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-card-foreground">Ranking records</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Review public leaderboard entries and remove test or incorrect records.
              </p>
            </div>
            <span className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {formatNumber(leaderboard.length)} visible records
            </span>
          </div>

          {leaderboardAction && (
            <div className="border-b border-border px-5 py-3">
              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  statusClass(leaderboardAction.tone),
                )}
              >
                {leaderboardAction.message}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Learner</th>
                  <th className="px-5 py-3 font-medium">Quiz</th>
                  <th className="px-5 py-3 font-medium">Level</th>
                  <th className="px-5 py-3 text-right font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Completed</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((entry) => {
                  const isConfirming = confirmingLeaderboardId === entry.id;
                  const isDeleting =
                    deleteLeaderboardMutation.isPending &&
                    deleteLeaderboardMutation.variables === entry.id;

                  return (
                    <tr key={entry.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-card-foreground">{entry.playerName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.countryName ?? "No country"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="line-clamp-1 max-w-xs font-medium text-foreground">
                          {entry.quizTitle}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{entry.quizId}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{entry.levelName}</td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-semibold text-foreground">{entry.percentage}%</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.score}/{entry.maxScore} in {formatNumber(entry.timeSpentSeconds)}s
                        </p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(entry.completedAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {isConfirming ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setLeaderboardAction(null);
                                  deleteLeaderboardMutation.mutate(entry.id);
                                }}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmingLeaderboardId(null)}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setLeaderboardAction(null);
                                setConfirmingLeaderboardId(entry.id);
                              }}
                              className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/30 bg-background px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {leaderboard.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium text-foreground">No ranking records yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Scores will appear here after learners submit quizzes.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-card-foreground">Recent admin changes</h2>
            </div>
            <span className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {formatNumber(auditLog.length)} events
            </span>
          </div>
          <div className="mt-4 divide-y divide-border">
            {auditLog.map((entry) => (
              <div
                key={entry.id}
                className="grid gap-2 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)_180px]"
              >
                <p className="font-medium text-foreground">{auditActionLabel(entry.action)}</p>
                <p className="text-muted-foreground">{auditDetail(entry)}</p>
                <p className="text-muted-foreground sm:text-right">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          {auditLog.length === 0 && (
            <div className="py-8 text-center">
              <p className="font-medium text-foreground">No admin changes yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Draft saves and publishes will appear here.
              </p>
            </div>
          )}
        </section>

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

function AdminAccessState({
  icon: Icon,
  title,
  copy,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 py-16 text-center sm:px-6">
      <div>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
        {actionHref && actionLabel && (
          <a
            href={actionHref}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
          <p className="mt-2 text-base font-semibold text-card-foreground">{value}</p>
        </div>
        <span className={cn("rounded-md border p-2", statusClass(tone))}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{detail}</p>
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
