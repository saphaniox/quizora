import type {
  Quiz,
  QuizSummary,
  AnswerResult,
  AdminAuditEntry,
  AdminCatalogueSection,
  Difficulty,
  LeaderboardEntry,
  Level,
  Certificate,
} from "@/types/quiz";
import type { SavedProgress } from "@/lib/attempt-store";

export interface AccountUser {
  id: string;
  email: string | null;
  phoneE164: string | null;
  displayName: string;
  role: "user" | "admin";
}

export interface HealthStatus {
  status: string;
  service: string;
}

export interface AccountProgress extends SavedProgress {
  version: number;
  deviceLabel: string | null;
}

export interface CatalogueDraftPayload {
  title: string;
  description: string;
  difficulty: Difficulty;
  published: boolean;
}

export interface AdminUser {
  id: string;
  email: string | null;
  phoneE164: string | null;
  displayName: string;
  role: "user" | "admin";
  createdAt: string;
  leaderboardCount: number;
  certificateCount: number;
  progressCount: number;
}

export interface AdminCertificate {
  code: string;
  playerName: string;
  quizTitle: string;
  levelName: string;
  percentage: number;
  issuedAt: string;
}

const LOCAL_API_BASE = "/api";
const CONTENT_PATHS = [
  "/health",
  "/levels",
  "/quizzes",
  "/submit",
  "/leaderboard",
  "/certificates",
];
const API_BASE = normalizeApiBase(import.meta.env["VITE_API_URL"] as string | undefined);
const USE_DIRECT_API = import.meta.env["VITE_DIRECT_API"] === "true";

function isContentPath(path: string): boolean {
  return CONTENT_PATHS.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  );
}

function normalizeApiBase(value: string | undefined): string {
  const raw = value?.trim().replace(/\/+$/, "");
  if (!raw) return "";
  if (raw.startsWith("/")) return raw;
  const base =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : raw.startsWith("localhost") || raw.startsWith("127.0.0.1")
        ? `http://${raw}`
        : raw.includes(".") || raw.includes(":")
          ? `https://${raw}`
          : "";
  if (!base) return "";
  try {
    const url = new URL(base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function baseFor(_path: string): string {
  return USE_DIRECT_API && API_BASE ? API_BASE : LOCAL_API_BASE;
}

function canUseLocalContentFallback(path: string, attemptedBase: string): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(attemptedBase) &&
    attemptedBase !== LOCAL_API_BASE &&
    isContentPath(path)
  );
}

function requestUrl(base: string, path: string): string {
  return `${base}${path}`;
}

function deviceLabel(): string {
  if (typeof navigator === "undefined") return "This device";
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|Android/i.test(userAgent)) return "Mobile device";
  if (/Mac/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows PC";
  return "This device";
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const requestInit: RequestInit = {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  };
  let response: Response;
  const primaryBase = baseFor(path);

  try {
    response = await fetch(requestUrl(primaryBase, path), requestInit);
  } catch (error) {
    if (!canUseLocalContentFallback(path, primaryBase)) throw error;
    response = await fetch(requestUrl(LOCAL_API_BASE, path), requestInit);
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: "Request failed" }))) as {
      error?: string;
    };
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getLevels(): Promise<{ levels: Level[]; totalQuestions: number }> {
  return fetchJson<{ levels: Level[]; totalQuestions: number }>("/levels");
}

export async function getQuizzes(levelId?: string): Promise<{ quizzes: QuizSummary[] }> {
  return fetchJson<{ quizzes: QuizSummary[] }>(
    `/quizzes${levelId ? `?level=${encodeURIComponent(levelId)}` : ""}`,
  );
}

export async function getQuiz(id: string, limit?: number, seed?: string): Promise<{ quiz: Quiz }> {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  if (seed) params.set("seed", seed);
  const query = params.toString();
  return fetchJson<{ quiz: Quiz }>(`/quizzes/${encodeURIComponent(id)}${query ? `?${query}` : ""}`);
}

export async function submitAnswers(payload: {
  quizId: string;
  playerName: string;
  visitorId?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  questionIds?: string[];
  answers: Record<string, number>;
  timeSpentSeconds: number;
}): Promise<{ result: AnswerResult }> {
  return fetchJson<{ result: AnswerResult }>("/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getLeaderboard(filters?: { quizId?: string; levelId?: string }): Promise<{
  leaderboard: LeaderboardEntry[];
}> {
  const params = new URLSearchParams();
  if (filters?.quizId) params.set("quizId", filters.quizId);
  if (filters?.levelId) params.set("levelId", filters.levelId);
  const query = params.toString();
  return fetchJson<{ leaderboard: LeaderboardEntry[] }>(`/leaderboard${query ? `?${query}` : ""}`);
}

export async function getCertificate(code: string): Promise<{ certificate: Certificate }> {
  return fetchJson<{ certificate: Certificate }>(`/certificates/${encodeURIComponent(code)}`);
}

export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>("/health");
}

export async function getCurrentUser(): Promise<{ user: AccountUser | null }> {
  return fetchJson<{ user: AccountUser | null }>("/auth/me");
}

export async function getMyActivity(): Promise<{
  history: LeaderboardEntry[];
  certificates: Certificate[];
}> {
  return fetchJson<{ history: LeaderboardEntry[]; certificates: Certificate[] }>(
    "/auth/me/activity",
  );
}

export async function getAccountProgress(
  quizId: string,
): Promise<{ progress: AccountProgress | null }> {
  return fetchJson<{ progress: AccountProgress | null }>(
    `/auth/me/progress/${encodeURIComponent(quizId)}`,
  );
}

export async function saveAccountProgress(
  progress: SavedProgress,
): Promise<{ progress: AccountProgress }> {
  return fetchJson<{ progress: AccountProgress }>(
    `/auth/me/progress/${encodeURIComponent(progress.quizId)}`,
    {
      method: "PUT",
      body: JSON.stringify({ ...progress, deviceLabel: deviceLabel() }),
    },
  );
}

export async function deleteAccountProgress(quizId: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/auth/me/progress/${encodeURIComponent(quizId)}`, {
    method: "DELETE",
  });
}

export async function registerAccount(payload: {
  email?: string;
  phoneE164?: string;
  password: string;
  displayName: string;
}): Promise<{ user: AccountUser }> {
  return fetchJson<{ user: AccountUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAccount(payload: {
  identifier: string;
  password: string;
}): Promise<{ user: AccountUser }> {
  return fetchJson<{ user: AccountUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutAccount(): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/logout", { method: "POST" });
}

export async function deleteCurrentAccount(): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/me", { method: "DELETE" });
}

export async function deleteLeaderboardEntry(id: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/admin/leaderboard/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAdminCatalogue(): Promise<{ sections: AdminCatalogueSection[] }> {
  return fetchJson<{ sections: AdminCatalogueSection[] }>("/admin/catalogue");
}

export async function getAdminAuditLog(): Promise<{ auditLog: AdminAuditEntry[] }> {
  return fetchJson<{ auditLog: AdminAuditEntry[] }>("/admin/audit-log");
}

export async function getAdminUsers(search?: string): Promise<{ users: AdminUser[] }> {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return fetchJson<{ users: AdminUser[] }>(`/admin/users${query}`);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export async function getAdminCertificates(): Promise<{ certificates: AdminCertificate[] }> {
  return fetchJson<{ certificates: AdminCertificate[] }>("/admin/certificates");
}

export async function deleteAdminCertificate(code: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/admin/certificates/${encodeURIComponent(code)}`, {
    method: "DELETE",
  });
}

export async function saveCatalogueDraft(
  sectionId: string,
  draft: CatalogueDraftPayload,
): Promise<{ section: AdminCatalogueSection }> {
  return fetchJson<{ section: AdminCatalogueSection }>(
    `/admin/catalogue/${encodeURIComponent(sectionId)}`,
    {
      method: "PUT",
      body: JSON.stringify(draft),
    },
  );
}

export async function publishCatalogueSection(
  sectionId: string,
): Promise<{ section: AdminCatalogueSection }> {
  return fetchJson<{ section: AdminCatalogueSection }>(
    `/admin/catalogue/${encodeURIComponent(sectionId)}/publish`,
    { method: "POST" },
  );
}
