import type { Quiz, QuizSummary, AnswerResult, LeaderboardEntry, Level, Certificate } from "@/types/quiz";

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
}

const API_BASE = (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "") ?? "";
const LOCAL_CONTENT_API_BASE = "/api";
const CONTENT_PATHS = ["/levels", "/quizzes", "/submit", "/leaderboard", "/certificates"];

function isContentPath(path: string): boolean {
  return CONTENT_PATHS.some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`));
}

function canUseLocalContentFallback(path: string): boolean {
  return import.meta.env.DEV && typeof window !== "undefined" && Boolean(API_BASE) && API_BASE !== LOCAL_CONTENT_API_BASE && isContentPath(path);
}

function requestUrl(base: string, path: string): string {
  return `${base}${path}`;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const requestInit: RequestInit = {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  };
  let response: Response;

  try {
    response = await fetch(requestUrl(API_BASE, path), requestInit);
  } catch (error) {
    if (!canUseLocalContentFallback(path)) throw error;
    response = await fetch(requestUrl(LOCAL_CONTENT_API_BASE, path), requestInit);
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ error: "Request failed" }))) as { error?: string };
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getLevels(): Promise<{ levels: Level[]; totalQuestions: number }> {
  return fetchJson<{ levels: Level[]; totalQuestions: number }>("/levels");
}

export async function getQuizzes(levelId?: string): Promise<{ quizzes: QuizSummary[] }> {
  return fetchJson<{ quizzes: QuizSummary[] }>(`/quizzes${levelId ? `?level=${encodeURIComponent(levelId)}` : ""}`);
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

export async function getCurrentUser(): Promise<{ user: AccountUser | null }> {
  return fetchJson<{ user: AccountUser | null }>("/auth/me");
}

export async function registerAccount(payload: { email: string; password: string; displayName: string }): Promise<{ user: AccountUser }> {
  return fetchJson<{ user: AccountUser }>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function loginAccount(payload: { email: string; password: string }): Promise<{ user: AccountUser }> {
  return fetchJson<{ user: AccountUser }>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function logoutAccount(): Promise<void> {
  await fetchJson<{ ok: true }>("/auth/logout", { method: "POST" });
}
