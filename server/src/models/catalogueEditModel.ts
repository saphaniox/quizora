import { pool } from "../db.js";
import type { Difficulty } from "../types.js";

export interface CatalogueDraftInput {
  title: string;
  description: string;
  difficulty: Difficulty;
  published: boolean;
}

export interface CatalogueBaseInput {
  title: string;
  description: string;
  difficulty: Difficulty;
}

export interface CatalogueEditRow {
  sectionId: string;
  draftTitle: string;
  draftDescription: string;
  draftDifficulty: Difficulty;
  draftPublished: boolean;
  publishedTitle: string;
  publishedDescription: string;
  publishedDifficulty: Difficulty;
  published: boolean;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface AdminAuditEntry {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

type RawCatalogueEditRow = {
  sectionId: string;
  draftTitle: string;
  draftDescription: string;
  draftDifficulty: string;
  draftPublished: boolean;
  publishedTitle: string;
  publishedDescription: string;
  publishedDifficulty: string;
  published: boolean;
  updatedAt: Date | string | null;
  publishedAt: Date | string | null;
};

type RawAuditEntry = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: Date | string;
};

const columns = `
  section_id AS "sectionId",
  draft_title AS "draftTitle",
  draft_description AS "draftDescription",
  draft_difficulty AS "draftDifficulty",
  draft_is_visible AS "draftPublished",
  published_title AS "publishedTitle",
  published_description AS "publishedDescription",
  published_difficulty AS "publishedDifficulty",
  published_is_visible AS "published",
  updated_at AS "updatedAt",
  published_at AS "publishedAt"
`;

function toIso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function toDifficulty(value: string): Difficulty {
  return value === "Easy" || value === "Medium" || value === "Hard" ? value : "Medium";
}

function toEdit(row: RawCatalogueEditRow): CatalogueEditRow {
  return {
    sectionId: row.sectionId,
    draftTitle: row.draftTitle,
    draftDescription: row.draftDescription,
    draftDifficulty: toDifficulty(row.draftDifficulty),
    draftPublished: row.draftPublished,
    publishedTitle: row.publishedTitle,
    publishedDescription: row.publishedDescription,
    publishedDifficulty: toDifficulty(row.publishedDifficulty),
    published: row.published,
    updatedAt: toIso(row.updatedAt),
    publishedAt: toIso(row.publishedAt),
  };
}

function toAuditEntry(row: RawAuditEntry): AdminAuditEntry {
  return {
    id: row.id,
    actorId: row.actorId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    metadata: row.metadata,
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
  };
}

async function audit(
  actorId: string,
  action: string,
  entityId: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  await pool.query(
    `INSERT INTO admin_audit_log (actor_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, 'catalogue_section', $3, $4)`,
    [actorId, action, entityId, metadata],
  );
}

export async function list(): Promise<CatalogueEditRow[]> {
  const result = await pool.query<RawCatalogueEditRow>(
    `SELECT ${columns}
     FROM catalogue_section_edits`,
  );
  return result.rows.map(toEdit);
}

export async function find(sectionId: string): Promise<CatalogueEditRow | null> {
  const result = await pool.query<RawCatalogueEditRow>(
    `SELECT ${columns}
     FROM catalogue_section_edits
     WHERE section_id = $1`,
    [sectionId],
  );
  return result.rows[0] ? toEdit(result.rows[0]) : null;
}

export async function saveDraft(
  sectionId: string,
  draft: CatalogueDraftInput,
  base: CatalogueBaseInput,
  actorId: string,
): Promise<CatalogueEditRow> {
  const result = await pool.query<RawCatalogueEditRow>(
    `INSERT INTO catalogue_section_edits (
       section_id,
       draft_title,
       draft_description,
       draft_difficulty,
       draft_is_visible,
       published_title,
       published_description,
       published_difficulty,
       published_is_visible,
       updated_by
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)
     ON CONFLICT (section_id) DO UPDATE SET
       draft_title = EXCLUDED.draft_title,
       draft_description = EXCLUDED.draft_description,
       draft_difficulty = EXCLUDED.draft_difficulty,
       draft_is_visible = EXCLUDED.draft_is_visible,
       updated_by = EXCLUDED.updated_by,
       updated_at = NOW()
     RETURNING ${columns}`,
    [
      sectionId,
      draft.title,
      draft.description,
      draft.difficulty,
      draft.published,
      base.title,
      base.description,
      base.difficulty,
      actorId,
    ],
  );
  await audit(actorId, "catalogue.draft_saved", sectionId, {
    title: draft.title,
    difficulty: draft.difficulty,
    visible: draft.published,
  });
  return toEdit(result.rows[0]);
}

export async function publishDraft(
  sectionId: string,
  actorId: string,
): Promise<CatalogueEditRow | null> {
  const result = await pool.query<RawCatalogueEditRow>(
    `UPDATE catalogue_section_edits
     SET published_title = draft_title,
         published_description = draft_description,
         published_difficulty = draft_difficulty,
         published_is_visible = draft_is_visible,
         published_by = $2,
         published_at = NOW()
     WHERE section_id = $1
     RETURNING ${columns}`,
    [sectionId, actorId],
  );
  const row = result.rows[0] ? toEdit(result.rows[0]) : null;
  if (row) {
    await audit(actorId, "catalogue.published", sectionId, {
      title: row.publishedTitle,
      difficulty: row.publishedDifficulty,
      visible: row.published,
    });
  }
  return row;
}

export async function listAudit(limit = 30): Promise<AdminAuditEntry[]> {
  const result = await pool.query<RawAuditEntry>(
    `SELECT
       id::text,
       actor_id AS "actorId",
       action,
       entity_type AS "entityType",
       entity_id AS "entityId",
       metadata,
       created_at AS "createdAt"
     FROM admin_audit_log
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows.map(toAuditEntry);
}
