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
import { loadApiCache, saveApiCache, type SavedProgress } from "@/lib/attempt-store";

export interface AccountUser {
  id: string;
  email: string | null;
  phoneE164: string | null;
  displayName: string;
  role: "user" | "admin";
  mustChangePassword: boolean;
}

export interface HealthStatus {
  status: string;
  service: string;
}
export interface AdminSystemMetrics {
  collectedAt: string;
  host: {
    platform: string;
    nodeVersion: string;
    uptimeSeconds: number;
    cpuCores: number;
    processCpuPercent: number;
    loadAverage1m: number | null;
    memoryTotalBytes: number;
    memoryFreeBytes: number;
    processRssBytes: number;
    processHeapUsedBytes: number;
  };
  database: {
    latencyMs: number;
    sizeBytes: number;
    poolTotal: number;
    poolIdle: number;
    poolWaiting: number;
  };
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
  isOnline: boolean;
  lastSeen: string | null;
}

export interface AdminCertificate {
  code: string;
  playerName: string;
  quizTitle: string;
  levelName: string;
  percentage: number;
  issuedAt: string;
}

export interface AppUpdateSettings {
  enabled: boolean;
  minimumVersion: string;
  latestVersion: string;
  required: boolean;
  storeUrl: string | null;
  message: string;
  updatedBy: string | null;
  updatedAt: string;
}

export type FeedbackType = "feature" | "topic" | "bug" | "general";
export type FeedbackStatus = "new" | "reviewing" | "planned" | "resolved" | "dismissed";

export interface FeedbackItem {
  id: string;
  userId: string | null;
  type: FeedbackType;
  message: string;
  contact: string | null;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

const CONTENT_PATHS = [
  "/health",
  "/levels",
  "/quizzes",
  "/submit",
  "/leaderboard",
  "/certificates",
];
const API_BASE = "https://api.quitech.online";
const NATIVE_API_FALLBACK = "https://api.quitech.online";
const SESSION_TOKEN_KEY = "quitech-session-token";

function sessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveSessionToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(SESSION_TOKEN_KEY, token);
    else window.localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Browser storage may be unavailable; cookie auth still works on the web.
  }
}

function isContentPath(path: string): boolean {
  return CONTENT_PATHS.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  );
}

function apiBases(): readonly string[] {
  if (typeof window !== "undefined") {
    const nativeRuntime =
      window.location?.protocol === "capacitor:" ||
      window.location?.hostname === "localhost" ||
      window.location?.hostname === "127.0.0.1";
    if (nativeRuntime) return [NATIVE_API_FALLBACK, API_BASE];
    return ["/api"];
  }
  return [API_BASE, NATIVE_API_FALLBACK];
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
  const timeoutController = new AbortController();
  const timeout = globalThis.setTimeout(() => timeoutController.abort(), 12000);
  const token = sessionToken();
  const hasBody = options?.body !== undefined && options.body !== null;
  const requestInit: RequestInit = {
    headers: new Headers({
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    credentials: "include",
    signal: timeoutController.signal,
    ...options,
  };
  let response: Response | null = null;
  const cacheable = (!options?.method || options.method === "GET") && isContentPath(path);
  let lastError: unknown;

  for (const base of apiBases()) {
    try {
      response = await fetch(requestUrl(base, path), requestInit);
      if (response.ok) break;
      lastError = new Error(`Request failed with status ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  globalThis.clearTimeout(timeout);

  if (!response || !response.ok) {
    const cached = cacheable ? loadApiCache<T>(path) : null;
    if (cached !== null) return cached;
    if (response) {
      const error = (await response.json().catch(() => ({ error: "Request failed" }))) as {
        error?: string;
      };
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }
    throw lastError;
  }

  let data: T;
  try {
    data = (await response.json()) as T;
  } catch (error) {
    const cached = cacheable ? loadApiCache<T>(path) : null;
    if (cached !== null) return cached;
    throw error;
  }
  if (cacheable) saveApiCache(path, data);
  return data;
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

export async function getLeaderboard(filters?: { quizId?: string; levelId?: string; countryCode?: string }): Promise<{
  leaderboard: LeaderboardEntry[];
}> {
  const params = new URLSearchParams();
  if (filters?.quizId) params.set("quizId", filters.quizId);
  if (filters?.levelId) params.set("levelId", filters.levelId);
  if (filters?.countryCode) params.set("countryCode", filters.countryCode);
  const query = params.toString();
  return fetchJson<{ leaderboard: LeaderboardEntry[] }>(`/leaderboard${query ? `?${query}` : ""}`);
}

export async function getCertificate(code: string): Promise<{ certificate: Certificate }> {
  return fetchJson<{ certificate: Certificate }>(`/certificates/${encodeURIComponent(code)}`);
}

export async function getHealth(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>("/health");
}
export async function getAdminSystemMetrics(): Promise<AdminSystemMetrics> {
  return fetchJson<AdminSystemMetrics>("/admin/system");
}

export async function getAppUpdateSettings(): Promise<{ settings: AppUpdateSettings }> {
  return fetchJson<{ settings: AppUpdateSettings }>("/app-update");
}

export async function createFeedback(payload: {
  type: FeedbackType;
  message: string;
  contact?: string;
}): Promise<{ feedback: FeedbackItem }> {
  return fetchJson<{ feedback: FeedbackItem }>("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAdminFeedback(status?: FeedbackStatus): Promise<{ feedback: FeedbackItem[] }> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return fetchJson<{ feedback: FeedbackItem[] }>(`/admin/feedback${query}`);
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
): Promise<{ feedback: FeedbackItem }> {
  return fetchJson<{ feedback: FeedbackItem }>(`/admin/feedback/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function saveAppUpdateSettings(
  settings: Omit<AppUpdateSettings, "updatedBy" | "updatedAt">,
): Promise<{ settings: AppUpdateSettings }> {
  return fetchJson<{ settings: AppUpdateSettings }>("/app-update", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export async function getCurrentUser(): Promise<{ user: AccountUser | null }> {
  return fetchJson<{ user: AccountUser | null }>("/auth/me");
}

export async function updateCurrentUser(displayName: string): Promise<{ user: AccountUser }> {
  return fetchJson<{ user: AccountUser }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ displayName }),
  });
}

export async function changeCurrentPassword(currentPassword: string, newPassword: string): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/me/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
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

export async function getAccountProgressList(): Promise<{ progress: AccountProgress[] }> {
  return fetchJson<{ progress: AccountProgress[] }>("/auth/me/progress");
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
}): Promise<{ user: AccountUser; token?: string }> {
  const result = await fetchJson<{ user: AccountUser; token?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveSessionToken(result.token ?? null);
  return result;
}

export async function loginAccount(payload: {
  identifier: string;
  password: string;
}): Promise<{ user: AccountUser; token?: string }> {
  const result = await fetchJson<{ user: AccountUser; token?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveSessionToken(result.token ?? null);
  return result;
}

export async function logoutAccount(): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/logout", { method: "POST" });
  saveSessionToken(null);
}

export async function deleteCurrentAccount(): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/me", { method: "DELETE" });
  saveSessionToken(null);
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

export async function updateAdminUser(userId: string, displayName: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify({ displayName }),
  });
}

export async function resetAdminUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
  return fetchJson<{ temporaryPassword: string }>(`/admin/users/${encodeURIComponent(userId)}/reset-password`, {
    method: "POST",
  });
}

export async function updateAdminUserRole(userId: string, role: "user" | "admin"): Promise<void> {
  await fetchJson<{ ok: true }>(`/admin/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
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
