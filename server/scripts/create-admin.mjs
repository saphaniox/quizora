import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import pg from "pg";

const { Client } = pg;
const scrypt = promisify(scryptCallback);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

await loadEnv(path.join(root, ".env"));

const email = (process.env.ADMIN_EMAIL || "saptechug@gmail.com")
  .trim()
  .toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const displayName = (process.env.ADMIN_NAME || "Saptech Admin").trim();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required to create an admin account.");
  process.exit(1);
}

if (!password) {
  console.error(
    "ADMIN_PASSWORD is required. Use a strong password with at least 8 characters.",
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error(
    "ADMIN_PASSWORD must be at least 8 characters. Do not use weak passwords like 1234.",
  );
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});

await client.connect();

try {
  const passwordHash = await hashPassword(password);
  const result = await client.query(
    `INSERT INTO users (id, email, password_hash, display_name, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       display_name = EXCLUDED.display_name,
       role = 'admin'
     RETURNING email, display_name, role`,
    [randomUUID(), email, passwordHash, displayName],
  );
  const admin = result.rows[0];
  console.log(`Admin account ready: ${admin.email} (${admin.role})`);
} catch (error) {
  if (error?.code === "42703") {
    console.error(
      "The users.role column does not exist yet. Run `npm run migrate` first.",
    );
  } else {
    console.error(error);
  }
  process.exitCode = 1;
} finally {
  await client.end();
}

async function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(value, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

async function loadEnv(filePath) {
  let content = "";
  try {
    content = await readFile(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = unquote(rawValue.trim());
  }
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
