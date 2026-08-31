import type { LeaderboardEntry } from "../types.js";
import { pool } from "../db.js";

interface LeaderboardFilters {
  levelId?: string;
  quizId?: string;
  limit?: number;
}

interface BestEntryResult {
  entry: LeaderboardEntry;
  improved: boolean;
}

const publicColumns = `
  id,
  player_name AS "playerName",
  quiz_id AS "quizId",
  level_id AS "levelId",
  quiz_title AS "quizTitle",
  level_name AS "levelName",
  country_code AS "countryCode",
  country_name AS "countryName",
  score,
  max_score AS "maxScore",
  percentage,
  time_spent_seconds AS "timeSpentSeconds",
  completed_at AS "completedAt"
`;

const internalColumns = `
  ${publicColumns},
  user_id AS "userId",
  visitor_id AS "visitorId"
`;

const participantKeySql = `
  CASE
    WHEN user_id IS NOT NULL THEN 'user:' || user_id::text
    WHEN visitor_id IS NOT NULL THEN 'visitor:' || visitor_id
    ELSE 'entry:' || id
  END
`;

function isBetterEntry(next: LeaderboardEntry, current: LeaderboardEntry): boolean {
  if (next.percentage !== current.percentage) return next.percentage > current.percentage;
  if (next.score !== current.score) return next.score > current.score;
  if (next.timeSpentSeconds !== current.timeSpentSeconds) {
    return next.timeSpentSeconds < current.timeSpentSeconds;
  }
  return false;
}

async function insertEntry(entry: LeaderboardEntry): Promise<void> {
  await pool.query(
    `INSERT INTO leaderboard (id, player_name, quiz_id, level_id, quiz_title, level_name, user_id, visitor_id, country_code, country_name, score, max_score, percentage, time_spent_seconds, completed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      entry.id,
      entry.playerName,
      entry.quizId,
      entry.levelId,
      entry.quizTitle,
      entry.levelName,
      entry.userId ?? null,
      entry.visitorId ?? null,
      entry.countryCode ?? null,
      entry.countryName ?? null,
      entry.score,
      entry.maxScore,
      entry.percentage,
      entry.timeSpentSeconds,
      entry.completedAt,
    ],
  );
}

async function findBestForParticipant(entry: LeaderboardEntry): Promise<LeaderboardEntry | null> {
  if (entry.userId) {
    const result = await pool.query<LeaderboardEntry>(
      `SELECT ${internalColumns}
       FROM leaderboard
       WHERE quiz_id = $1 AND user_id = $2
       ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC
       LIMIT 1`,
      [entry.quizId, entry.userId],
    );
    return result.rows[0] ?? null;
  }

  if (entry.visitorId) {
    const result = await pool.query<LeaderboardEntry>(
      `SELECT ${internalColumns}
       FROM leaderboard
       WHERE quiz_id = $1 AND user_id IS NULL AND visitor_id = $2
       ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC
       LIMIT 1`,
      [entry.quizId, entry.visitorId],
    );
    return result.rows[0] ?? null;
  }

  return null;
}

async function updateScoreEntry(entry: LeaderboardEntry): Promise<void> {
  await pool.query(
    `UPDATE leaderboard
     SET player_name = $2,
         quiz_title = $3,
         level_name = $4,
         country_code = $5,
         country_name = $6,
         score = $7,
         max_score = $8,
         percentage = $9,
         time_spent_seconds = $10,
         completed_at = $11
     WHERE id = $1`,
    [
      entry.id,
      entry.playerName,
      entry.quizTitle,
      entry.levelName,
      entry.countryCode ?? null,
      entry.countryName ?? null,
      entry.score,
      entry.maxScore,
      entry.percentage,
      entry.timeSpentSeconds,
      entry.completedAt,
    ],
  );
}

async function updateDisplayEntry(entry: LeaderboardEntry): Promise<void> {
  await pool.query(
    `UPDATE leaderboard
     SET player_name = $2,
         quiz_title = $3,
         level_name = $4,
         country_code = $5,
         country_name = $6
     WHERE id = $1`,
    [
      entry.id,
      entry.playerName,
      entry.quizTitle,
      entry.levelName,
      entry.countryCode ?? null,
      entry.countryName ?? null,
    ],
  );
}

export async function recordBestEntry(entry: LeaderboardEntry): Promise<BestEntryResult> {
  const existing = await findBestForParticipant(entry);
  if (!existing) {
    await insertEntry(entry);
    return { entry, improved: true };
  }

  if (isBetterEntry(entry, existing)) {
    const updated = { ...entry, id: existing.id };
    await updateScoreEntry(updated);
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
  await updateDisplayEntry(displayUpdated);
  return { entry: displayUpdated, improved: false };
}

export async function rankOf(id: string, options: LeaderboardFilters = {}): Promise<number> {
  const result = await pool.query<{ rank: string }>(
    `WITH filtered AS (
       SELECT *, ${participantKeySql} AS participant_key
       FROM leaderboard
       WHERE ($1::text IS NULL OR quiz_id = $1)
         AND ($2::text IS NULL OR level_id = $2)
     ),
     best_entries AS (
       SELECT DISTINCT ON (quiz_id, participant_key) id, percentage, time_spent_seconds, completed_at
       FROM filtered
       ORDER BY quiz_id, participant_key, percentage DESC, time_spent_seconds ASC, completed_at ASC
     ),
     ranked AS (
       SELECT id, ROW_NUMBER() OVER (ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC) AS rank
       FROM best_entries
     )
     SELECT rank FROM ranked WHERE id = $3`,
    [options.quizId ?? null, options.levelId ?? null, id],
  );
  return result.rows[0] ? Number(result.rows[0].rank) : 0;
}

export async function list(options: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const result = await pool.query<LeaderboardEntry>(
    `WITH filtered AS (
       SELECT *, ${participantKeySql} AS participant_key
       FROM leaderboard
       WHERE ($1::text IS NULL OR quiz_id = $1)
         AND ($2::text IS NULL OR level_id = $2)
     ),
     best_entries AS (
       SELECT DISTINCT ON (quiz_id, participant_key) *
       FROM filtered
       ORDER BY quiz_id, participant_key, percentage DESC, time_spent_seconds ASC, completed_at ASC
     )
     SELECT ${publicColumns}
     FROM best_entries
     ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC
     LIMIT $3`,
    [options.quizId ?? null, options.levelId ?? null, options.limit ?? 100],
  );
  return result.rows;
}

export async function listByUser(userId: string, limit = 100): Promise<LeaderboardEntry[]> {
  const result = await pool.query<LeaderboardEntry>(
    `WITH filtered AS (
       SELECT *, ${participantKeySql} AS participant_key
       FROM leaderboard
       WHERE user_id = $1
     ),
     best_entries AS (
       SELECT DISTINCT ON (quiz_id, participant_key) *
       FROM filtered
       ORDER BY quiz_id, participant_key, percentage DESC, time_spent_seconds ASC, completed_at ASC
     )
     SELECT ${publicColumns}
     FROM best_entries
     ORDER BY completed_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}

export async function count(options: LeaderboardFilters = {}): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `WITH filtered AS (
       SELECT *, ${participantKeySql} AS participant_key
       FROM leaderboard
       WHERE ($1::text IS NULL OR quiz_id = $1)
         AND ($2::text IS NULL OR level_id = $2)
     ),
     best_entries AS (
       SELECT DISTINCT ON (quiz_id, participant_key) id
       FROM filtered
       ORDER BY quiz_id, participant_key, percentage DESC, time_spent_seconds ASC, completed_at ASC
     )
     SELECT COUNT(*)::text AS count FROM best_entries`,
    [options.quizId ?? null, options.levelId ?? null],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function remove(id: string): Promise<boolean> {
  const result = await pool.query<{ count: number }>(
    `WITH target AS (
       SELECT quiz_id, user_id, visitor_id
       FROM leaderboard
       WHERE id = $1
     ),
     deleted AS (
       DELETE FROM leaderboard entry
       USING target
       WHERE (
         target.user_id IS NOT NULL
         AND entry.quiz_id = target.quiz_id
         AND entry.user_id = target.user_id
       )
       OR (
         target.user_id IS NULL
         AND target.visitor_id IS NOT NULL
         AND entry.quiz_id = target.quiz_id
         AND entry.user_id IS NULL
         AND entry.visitor_id = target.visitor_id
       )
       OR (
         target.user_id IS NULL
         AND target.visitor_id IS NULL
         AND entry.id = $1
       )
       RETURNING entry.id
     )
     SELECT COUNT(*)::int AS count FROM deleted`,
    [id],
  );
  return Number(result.rows[0]?.count ?? 0) > 0;
}
