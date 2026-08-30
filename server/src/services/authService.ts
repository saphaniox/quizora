import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { pool } from "../db.js";

const scrypt = promisify(scryptCallback);
const SESSION_DAYS = 30;

export type UserRole = "user" | "admin";
export type User = {
  id: string;
  email: string | null;
  phoneE164: string | null;
  displayName: string;
  role: UserRole;
};

type UserRow = {
  id: string;
  email: string | null;
  phone_e164: string | null;
  display_name: string;
  role: string;
};

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    phoneE164: row.phone_e164,
    displayName: row.display_name,
    role: row.role === "admin" ? "admin" : "user",
  };
}

function normalizePhone(value: string): string | null {
  const phone = value.trim().replace(/[().\s-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, value] = stored.split(":");
  if (!salt || !value) return false;
  const expected = Buffer.from(value, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function register(
  contact: { email?: string | undefined; phoneE164?: string | undefined },
  password: string,
  displayName: string,
): Promise<{ user: User; token: string }> {
  const passwordHash = await hashPassword(password);
  const id = randomUUID();
  const email = contact.email?.trim().toLowerCase() || null;
  const phoneE164 = contact.phoneE164
    ? normalizePhone(contact.phoneE164)
    : null;
  const result = await pool.query<UserRow>(
    "INSERT INTO users (id, email, phone_e164, password_hash, display_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, phone_e164, display_name, role",
    [id, email, phoneE164, passwordHash, displayName],
  );
  return createSession(toUser(result.rows[0]));
}

export async function login(
  identifier: string,
  password: string,
): Promise<{ user: User; token: string } | null> {
  const trimmedIdentifier = identifier.trim();
  const email = trimmedIdentifier.includes("@")
    ? trimmedIdentifier.toLowerCase()
    : null;
  const phoneE164 = normalizePhone(trimmedIdentifier);
  const result = await pool.query<UserRow & { password_hash: string }>(
    "SELECT id, email, phone_e164, password_hash, display_name, role FROM users WHERE ($1::text IS NOT NULL AND email = $1) OR ($2::text IS NOT NULL AND phone_e164 = $2)",
    [email, phoneE164],
  );
  const row = result.rows[0];
  if (!row || !(await verifyPassword(password, row.password_hash))) return null;
  return createSession(toUser(row));
}

async function createSession(
  user: User,
): Promise<{ user: User; token: string }> {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await pool.query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [hashToken(token), user.id, expires],
  );
  return { user, token };
}

export async function getUser(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const result = await pool.query<UserRow>(
    "SELECT u.id, u.email, u.phone_e164, u.display_name, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > NOW()",
    [hashToken(token)],
  );
  const row = result.rows[0];
  return row ? toUser(row) : null;
}

export async function logout(token: string | undefined): Promise<void> {
  if (token)
    await pool.query("DELETE FROM sessions WHERE token_hash = $1", [
      hashToken(token),
    ]);
}

export async function deleteCurrentUser(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const result = await pool.query<{ id: string }>(
    "DELETE FROM users WHERE id = (SELECT user_id FROM sessions WHERE token_hash = $1 AND expires_at > NOW()) RETURNING id",
    [hashToken(token)],
  );
  return Boolean(result.rowCount);
}
