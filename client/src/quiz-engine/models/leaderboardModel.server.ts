import type { LeaderboardEntry } from "../types.server";

const entries: LeaderboardEntry[] = [];

interface LeaderboardFilters {
  levelId?: string | undefined;
  quizId?: string | undefined;
  limit?: number | undefined;
}

interface BestEntryResult {
  entry: LeaderboardEntry;
  improved: boolean;
}

function participantKey(entry: LeaderboardEntry): string {
  if (entry.visitorId) return `${entry.quizId}:visitor:${entry.visitorId}`;
  return `${entry.quizId}:entry:${entry.id}`;
}

function isBetterEntry(next: LeaderboardEntry, current: LeaderboardEntry): boolean {
  if (next.percentage !== current.percentage) return next.percentage > current.percentage;
  if (next.score !== current.score) return next.score > current.score;
  if (next.timeSpentSeconds !== current.timeSpentSeconds) {
    return next.timeSpentSeconds < current.timeSpentSeconds;
  }
  return false;
}

function sortEntries(): void {
  entries.sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    if (a.timeSpentSeconds !== b.timeSpentSeconds) return a.timeSpentSeconds - b.timeSpentSeconds;
    return a.completedAt.localeCompare(b.completedAt);
  });
}

export function recordBestEntry(entry: LeaderboardEntry): BestEntryResult {
  const key = participantKey(entry);
  const existingIndex = entries.findIndex((candidate) => participantKey(candidate) === key);

  if (existingIndex === -1) {
    entries.push(entry);
    sortEntries();
    return { entry, improved: true };
  }

  const existing = entries[existingIndex]!;
  if (isBetterEntry(entry, existing)) {
    const updated = { ...entry, id: existing.id };
    entries[existingIndex] = updated;
    sortEntries();
    return { entry: updated, improved: true };
  }

  const displayUpdated = {
    ...existing,
    playerName: entry.playerName,
    quizTitle: entry.quizTitle,
    levelName: entry.levelName,
    countryCode: entry.countryCode ?? null,
    countryName: entry.countryName ?? null,
  };
  entries[existingIndex] = displayUpdated;
  sortEntries();
  return { entry: displayUpdated, improved: false };
}

export function addEntry(entry: LeaderboardEntry): LeaderboardEntry {
  entries.push(entry);
  sortEntries();
  return entry;
}

export function rankOf(id: string, options: LeaderboardFilters = {}): number {
  return list(options).findIndex((entry) => entry.id === id) + 1;
}

export function list(options: LeaderboardFilters = {}): LeaderboardEntry[] {
  let result = entries;
  if (options.quizId) result = result.filter((entry) => entry.quizId === options.quizId);
  if (options.levelId) result = result.filter((entry) => entry.levelId === options.levelId);
  return result.slice(0, options.limit ?? 100);
}

export function count(options: LeaderboardFilters = {}): number {
  return list({ ...options, limit: Number.MAX_SAFE_INTEGER }).length;
}
