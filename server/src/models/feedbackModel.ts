import { randomUUID } from "node:crypto";
import { pool } from "../db.js";

export type FeedbackType = "feature" | "topic" | "bug" | "general";
export type FeedbackStatus = "new" | "reviewing" | "planned" | "resolved" | "dismissed";

export interface Feedback {
  id: string;
  userId: string | null;
  type: FeedbackType;
  message: string;
  contact: string | null;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

type FeedbackRow = Omit<Feedback, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const columns = `id, user_id AS "userId", type, message, contact, status,
                 created_at AS "createdAt", updated_at AS "updatedAt"`;

function mapRow(row: FeedbackRow): Feedback {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
}

export async function create(input: {
  userId?: string | null;
  type: FeedbackType;
  message: string;
  contact?: string | null;
}): Promise<Feedback> {
  const result = await pool.query<FeedbackRow>(
    `INSERT INTO feedback (id, user_id, type, message, contact)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${columns}`,
    [randomUUID(), input.userId ?? null, input.type, input.message.trim(), input.contact?.trim() || null],
  );
  return mapRow(result.rows[0]);
}

export async function list(status?: FeedbackStatus, limit = 100): Promise<Feedback[]> {
  const result = await pool.query<FeedbackRow>(
    `SELECT ${columns} FROM feedback
     WHERE ($1::text IS NULL OR status = $1)
     ORDER BY created_at DESC LIMIT $2`,
    [status ?? null, Math.min(Math.max(limit, 1), 200)],
  );
  return result.rows.map(mapRow);
}

export async function updateStatus(id: string, status: FeedbackStatus): Promise<Feedback | null> {
  const result = await pool.query<FeedbackRow>(
    `UPDATE feedback SET status = $2, updated_at = NOW()
     WHERE id = $1 RETURNING ${columns}`,
    [id, status],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}