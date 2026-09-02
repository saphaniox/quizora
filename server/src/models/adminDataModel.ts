import { pool } from "../db.js";

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
}

export interface AdminCertificate {
  code: string;
  playerName: string;
  quizTitle: string;
  levelName: string;
  percentage: number;
  issuedAt: string;
}

export async function listUsers(search = "", limit = 50, offset = 0): Promise<AdminUser[]> {
  const result = await pool.query<AdminUser>(
    `SELECT u.id,
            u.email,
            u.phone_e164 AS "phoneE164",
            u.display_name AS "displayName",
            u.role,
            u.created_at AS "createdAt",
            (SELECT COUNT(*) FROM leaderboard l WHERE l.user_id = u.id)::int AS "leaderboardCount",
            (SELECT COUNT(*) FROM certificates c WHERE c.user_id = u.id)::int AS "certificateCount",
            (SELECT COUNT(*) FROM quiz_progress p WHERE p.user_id = u.id)::int AS "progressCount"
     FROM users u
     WHERE ($1::text = '' OR u.display_name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%' OR u.phone_e164 ILIKE '%' || $1 || '%')
     ORDER BY u.created_at DESC
     LIMIT $2 OFFSET $3`,
    [search.trim(), limit, offset],
  );
  return result.rows;
}

export async function deleteUserData(userId: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM certificates WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM leaderboard WHERE user_id = $1", [userId]);
    const result = await client.query("DELETE FROM users WHERE id = $1", [userId]);
    await client.query("COMMIT");
    return result.rowCount === 1;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listCertificates(limit = 100): Promise<AdminCertificate[]> {
  const result = await pool.query<AdminCertificate>(
    `SELECT code, player_name AS "playerName", quiz_title AS "quizTitle",
            level_name AS "levelName", percentage, issued_at AS "issuedAt"
     FROM certificates ORDER BY issued_at DESC LIMIT $1`,
    [limit],
  );
  return result.rows;
}

export async function deleteCertificate(code: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM certificates WHERE code = $1", [code.toUpperCase()]);
  return result.rowCount === 1;
}
