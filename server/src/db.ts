import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
  host: process.env["PGHOST"],
  port: process.env["PGPORT"] ? Number(process.env["PGPORT"]) : undefined,
  database: process.env["PGDATABASE"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
  max: Number(process.env["PGPOOL_MAX"] ?? 20),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env["PGSSL"] === "true" ? { rejectUnauthorized: false } : undefined,
});

export async function checkDatabase(): Promise<void> {
  await pool.query("SELECT 1");
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}