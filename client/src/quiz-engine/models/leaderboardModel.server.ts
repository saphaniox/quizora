import type { LeaderboardEntry } from "../types.server";

const entries: LeaderboardEntry[] = [];

export function addEntry(entry: LeaderboardEntry): LeaderboardEntry {
  entries.push(entry);
  entries.sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });
  return entry;
}

export function rankOf(id: string): number {
  return entries.findIndex((entry) => entry.id === id) + 1;
}

export function list(
  options: {
    levelId?: string | undefined;
    quizId?: string | undefined;
    limit?: number | undefined;
  } = {},
): LeaderboardEntry[] {
  let result = entries;
  if (options.quizId) result = result.filter((entry) => entry.quizId === options.quizId);
  if (options.levelId) result = result.filter((entry) => entry.levelId === options.levelId);
  return result.slice(0, options.limit ?? 100);
}

export function count(): number {
  return entries.length;
}
