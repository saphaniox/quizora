import type { LeaderboardEntry } from "../types.js";
import { pool } from "../db.js";

export async function addEntry(
  entry: LeaderboardEntry,
): Promise<LeaderboardEntry> {
  await pool.query(
    `INSERT INTO leaderboard (id, player_name, quiz_id, level_id, quiz_title, level_name, user_id, country_code, country_name, score, max_score, percentage, time_spent_seconds, completed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      entry.id,
      entry.playerName,
      entry.quizId,
      entry.levelId,
      entry.quizTitle,
      entry.levelName,
      entry.userId ?? null,
      entry.countryCode ?? null,
      entry.countryName ?? null,
      entry.score,
      entry.maxScore,
      entry.percentage,
      entry.timeSpentSeconds,
      entry.completedAt,
    ],
  );
  return entry;
}

export async function rankOf(id: string): Promise<number> {
  const result = await pool.query<{ rank: string }>(
    `SELECT rank FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC) AS rank FROM leaderboard) ranked WHERE id = $1`,
    [id],
  );
  return result.rows[0] ? Number(result.rows[0].rank) : 0;
}

export async function list(
  options: { levelId?: string; quizId?: string; limit?: number } = {},
): Promise<LeaderboardEntry[]> {
  const result = await pool.query<LeaderboardEntry>(
    `SELECT id, player_name AS "playerName", quiz_id AS "quizId", level_id AS "levelId", quiz_title AS "quizTitle", level_name AS "levelName", country_code AS "countryCode", country_name AS "countryName", score, max_score AS "maxScore", percentage, time_spent_seconds AS "timeSpentSeconds", completed_at AS "completedAt"
     FROM leaderboard WHERE ($1::text IS NULL OR quiz_id = $1) AND ($2::text IS NULL OR level_id = $2)
     ORDER BY percentage DESC, time_spent_seconds ASC, completed_at ASC LIMIT $3`,
    [options.quizId ?? null, options.levelId ?? null, options.limit ?? 100],
  );
  return result.rows;
}

export async function listByUser(
  userId: string,
  limit = 100,
): Promise<LeaderboardEntry[]> {
  const result = await pool.query<LeaderboardEntry>(
    `SELECT id, player_name AS "playerName", quiz_id AS "quizId", level_id AS "levelId", quiz_title AS "quizTitle", level_name AS "levelName", country_code AS "countryCode", country_name AS "countryName", score, max_score AS "maxScore", percentage, time_spent_seconds AS "timeSpentSeconds", completed_at AS "completedAt"
     FROM leaderboard
     WHERE user_id = $1
     ORDER BY completed_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows;
}

export async function count(): Promise<number> {
  const result = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM leaderboard",
  );
  return Number(result.rows[0]?.count ?? 0);
}
