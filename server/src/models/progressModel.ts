import { pool } from "../db.js";
import type { AccountProgress } from "../types.js";

type ProgressRow = {
  quiz_id: string;
  mode: string;
  seed: string;
  answers: Record<string, number>;
  flagged: string[];
  current_index: number;
  elapsed_seconds: number;
  version: number;
  device_label: string | null;
  updated_at: Date;
};

function toProgress(row: ProgressRow): AccountProgress {
  return {
    quizId: row.quiz_id,
    mode: row.mode === "full" ? "full" : Number(row.mode),
    seed: row.seed,
    answers: row.answers ?? {},
    flagged: row.flagged ?? [],
    currentIndex: row.current_index,
    elapsedSeconds: row.elapsed_seconds,
    savedAt: row.updated_at.toISOString(),
    version: row.version,
    deviceLabel: row.device_label,
  };
}

export async function find(
  userId: string,
  quizId: string,
): Promise<AccountProgress | null> {
  const result = await pool.query<ProgressRow>(
    `SELECT quiz_id, mode, seed, answers, flagged, current_index, elapsed_seconds, version, device_label, updated_at
     FROM quiz_progress
     WHERE user_id = $1 AND quiz_id = $2`,
    [userId, quizId],
  );
  return result.rows[0] ? toProgress(result.rows[0]) : null;
}

export async function save(
  userId: string,
  progress: Omit<AccountProgress, "savedAt" | "version">,
): Promise<AccountProgress> {
  const result = await pool.query<ProgressRow>(
    `INSERT INTO quiz_progress (user_id, quiz_id, mode, seed, answers, flagged, current_index, elapsed_seconds, device_label)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id, quiz_id) DO UPDATE SET
       mode = EXCLUDED.mode,
       seed = EXCLUDED.seed,
       answers = EXCLUDED.answers,
       flagged = EXCLUDED.flagged,
       current_index = EXCLUDED.current_index,
       elapsed_seconds = EXCLUDED.elapsed_seconds,
       device_label = EXCLUDED.device_label,
       version = quiz_progress.version + 1,
       updated_at = NOW()
     RETURNING quiz_id, mode, seed, answers, flagged, current_index, elapsed_seconds, version, device_label, updated_at`,
    [
      userId,
      progress.quizId,
      String(progress.mode),
      progress.seed,
      JSON.stringify(progress.answers),
      JSON.stringify(progress.flagged),
      progress.currentIndex,
      progress.elapsedSeconds,
      progress.deviceLabel,
    ],
  );
  return toProgress(result.rows[0]);
}

export async function remove(userId: string, quizId: string): Promise<void> {
  await pool.query(
    "DELETE FROM quiz_progress WHERE user_id = $1 AND quiz_id = $2",
    [userId, quizId],
  );
}
