import { pool } from "../db.js";

export interface AppUpdateSettings {
  enabled: boolean;
  minimumVersion: string;
  latestVersion: string;
  required: boolean;
  storeUrl: string | null;
  message: string;
  updatedBy: string | null;
  updatedAt: string;
}

interface AppUpdateRow {
  enabled: boolean;
  minimum_version: string;
  latest_version: string;
  required: boolean;
  store_url: string | null;
  message: string;
  updated_by: string | null;
  updated_at: string;
}

const defaultSettings: AppUpdateSettings = {
  enabled: false,
  minimumVersion: "1.1.0",
  latestVersion: "1.1.0",
  required: true,
  storeUrl: null,
  message: "A new app update is available. Please update to continue using Quitech.",
  updatedBy: null,
  updatedAt: new Date().toISOString(),
};

function normalizeVersion(version: string): string {
  const trimmed = version.trim();
  return trimmed || "1.1.0";
}

export async function getSettings(): Promise<AppUpdateSettings> {
  const result = await pool.query<AppUpdateRow>(
    `SELECT enabled, minimum_version, latest_version, required, store_url, message, updated_by, updated_at
     FROM app_update_settings
     ORDER BY id DESC
     LIMIT 1`,
  );

  const row = result.rows[0];
  if (!row) return defaultSettings;

  return {
    enabled: row.enabled,
    minimumVersion: normalizeVersion(row.minimum_version),
    latestVersion: normalizeVersion(row.latest_version),
    required: row.required,
    storeUrl: row.store_url?.trim() || null,
    message: row.message?.trim() || defaultSettings.message,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at,
  };
}

export async function upsertSettings(input: {
  enabled: boolean;
  minimumVersion: string;
  latestVersion: string;
  required: boolean;
  storeUrl: string | null;
  message: string;
  updatedBy: string | null;
}): Promise<AppUpdateSettings> {
  const current = await getSettings();
  const nextMinimumVersion = normalizeVersion(input.minimumVersion);
  const nextLatestVersion = normalizeVersion(input.latestVersion);
  const nextMessage = input.message?.trim() || defaultSettings.message;
  const nextStoreUrl = input.storeUrl?.trim() || null;

  const result = current.enabled || current.latestVersion !== "1.1.0" || current.minimumVersion !== "1.1.0"
    ? await pool.query<AppUpdateRow>(
        `UPDATE app_update_settings
         SET enabled = $1,
             minimum_version = $2,
             latest_version = $3,
             required = $4,
             store_url = $5,
             message = $6,
             updated_by = $7,
             updated_at = NOW()
         WHERE id = (SELECT id FROM app_update_settings ORDER BY id DESC LIMIT 1)
         RETURNING enabled, minimum_version, latest_version, required, store_url, message, updated_by, updated_at`,
        [input.enabled, nextMinimumVersion, nextLatestVersion, input.required, nextStoreUrl, nextMessage, input.updatedBy],
      )
    : await pool.query<AppUpdateRow>(
        `INSERT INTO app_update_settings (enabled, minimum_version, latest_version, required, store_url, message, updated_by, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING enabled, minimum_version, latest_version, required, store_url, message, updated_by, updated_at`,
        [input.enabled, nextMinimumVersion, nextLatestVersion, input.required, nextStoreUrl, nextMessage, input.updatedBy],
      );

  const row = result.rows[0];
  return {
    enabled: row.enabled,
    minimumVersion: normalizeVersion(row.minimum_version),
    latestVersion: normalizeVersion(row.latest_version),
    required: row.required,
    storeUrl: row.store_url?.trim() || null,
    message: row.message?.trim() || defaultSettings.message,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at,
  };
}
