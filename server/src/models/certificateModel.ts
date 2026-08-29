import type { Certificate } from "../types.js";
import { pool } from "../db.js";
import { randomBytes } from "node:crypto";

export async function issue(certificate: Certificate): Promise<Certificate> {
  await pool.query(
    `INSERT INTO certificates (code, player_name, quiz_id, quiz_title, level_name, category, score, max_score, percentage, issued_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [certificate.code, certificate.playerName, certificate.quizId, certificate.quizTitle, certificate.levelName, certificate.category, certificate.score, certificate.maxScore, certificate.percentage, certificate.issuedAt],
  );
  return certificate;
}

export async function findByCode(code: string): Promise<Certificate | undefined> {
  const result = await pool.query<Certificate>(
    `SELECT code, player_name AS "playerName", quiz_id AS "quizId", quiz_title AS "quizTitle", level_name AS "levelName", category, score, max_score AS "maxScore", percentage, issued_at AS "issuedAt" FROM certificates WHERE code = $1`,
    [code.toUpperCase()],
  );
  return result.rows[0];
}

export async function listAll(): Promise<Certificate[]> {
  const result = await pool.query<Certificate>(
    `SELECT code, player_name AS "playerName", quiz_id AS "quizId", quiz_title AS "quizTitle", level_name AS "levelName", category, score, max_score AS "maxScore", percentage, issued_at AS "issuedAt" FROM certificates ORDER BY issued_at DESC`,
  );
  return result.rows;
}

export function makeCode(quizId: string): string {
  const random = randomBytes(4).toString("hex").toUpperCase();
  const prefix = quizId.split("-")[0]?.slice(0, 4).toUpperCase() ?? "QUIZ";
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}-${random}`;
}
