import type { AnswerResult, Certificate } from "@/types/quiz";

const ATTEMPT_KEY = "quizora-current-attempt";
const HISTORY_KEY = "quizora-history";
const PROFILE_KEY = "quizora-player-name";
const PROGRESS_PREFIX = "quizora-progress-";
const CERTS_KEY = "quizora-certificates";

export interface StoredQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface StoredAttempt {
  quizId: string;
  quizTitle: string;
  quizDescription: string;
  quizCategory: string;
  quizDifficulty: string;
  levelName: string;
  timeLimitSeconds: number;
  playerName: string;
  answers: Record<string, number>;
  timeSpentSeconds: number;
  result: AnswerResult;
  questions: StoredQuestion[];
  completedAt: string;
}

export interface HistoryItem {
  quizId: string;
  quizTitle: string;
  levelName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  certificateCode?: string;
}

const browser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!browser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!browser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

/* ---------- current attempt ---------- */

export function saveAttempt(attempt: StoredAttempt): void {
  write(ATTEMPT_KEY, attempt);
  addHistory({
    quizId: attempt.quizId,
    quizTitle: attempt.quizTitle,
    levelName: attempt.levelName,
    score: attempt.result.score,
    maxScore: attempt.result.maxScore,
    percentage: attempt.result.percentage,
    timeSpentSeconds: attempt.timeSpentSeconds,
    completedAt: attempt.completedAt,
    ...(attempt.result.certificate ? { certificateCode: attempt.result.certificate.code } : {}),
  });
  if (attempt.result.certificate) saveCertificate(attempt.result.certificate);
}

export function loadAttempt(): StoredAttempt | null {
  return read<StoredAttempt | null>(ATTEMPT_KEY, null);
}

export function clearAttempt(): void {
  if (browser()) localStorage.removeItem(ATTEMPT_KEY);
}

/* ---------- history ---------- */

export function addHistory(item: HistoryItem): void {
  const items = [item, ...loadHistory()].slice(0, 100);
  write(HISTORY_KEY, items);
}

export function loadHistory(): HistoryItem[] {
  return read<HistoryItem[]>(HISTORY_KEY, []);
}

export function clearHistory(): void {
  if (browser()) localStorage.removeItem(HISTORY_KEY);
}

/* ---------- player profile ---------- */

export function savePlayerName(name: string): void {
  if (browser()) localStorage.setItem(PROFILE_KEY, name);
}

export function loadPlayerName(): string {
  if (!browser()) return "";
  return localStorage.getItem(PROFILE_KEY) ?? "";
}

/* ---------- in-progress quiz (resume) ---------- */

export interface SavedProgress {
  quizId: string;
  mode: number | "full";
  seed: string;
  answers: Record<string, number>;
  flagged: string[];
  currentIndex: number;
  elapsedSeconds: number;
  savedAt: string;
}

export function saveProgress(progress: SavedProgress): void {
  write(`${PROGRESS_PREFIX}${progress.quizId}`, progress);
}

export function loadProgress(quizId: string): SavedProgress | null {
  return read<SavedProgress | null>(`${PROGRESS_PREFIX}${quizId}`, null);
}

export function clearProgress(quizId: string): void {
  if (browser()) localStorage.removeItem(`${PROGRESS_PREFIX}${quizId}`);
}

/* ---------- certificates issued on this device ---------- */

export function saveCertificate(certificate: Certificate): void {
  const all = loadCertificates().filter((item) => item.code !== certificate.code);
  write(CERTS_KEY, [certificate, ...all].slice(0, 50));
}

export function loadCertificates(): Certificate[] {
  return read<Certificate[]>(CERTS_KEY, []);
}

export function findLocalCertificate(code: string): Certificate | undefined {
  return loadCertificates().find((item) => item.code.toUpperCase() === code.toUpperCase());
}
