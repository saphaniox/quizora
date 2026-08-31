CREATE TABLE IF NOT EXISTS catalogue_section_edits (
  section_id TEXT PRIMARY KEY,
  draft_title TEXT NOT NULL CHECK (char_length(trim(draft_title)) BETWEEN 2 AND 120),
  draft_description TEXT NOT NULL CHECK (char_length(trim(draft_description)) BETWEEN 40 AND 500),
  draft_difficulty TEXT NOT NULL CHECK (draft_difficulty IN ('Easy', 'Medium', 'Hard')),
  draft_is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  published_title TEXT NOT NULL CHECK (char_length(trim(published_title)) BETWEEN 2 AND 120),
  published_description TEXT NOT NULL CHECK (char_length(trim(published_description)) BETWEEN 40 AND 500),
  published_difficulty TEXT NOT NULL CHECK (published_difficulty IN ('Easy', 'Medium', 'Hard')),
  published_is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS catalogue_section_edits_updated_idx
  ON catalogue_section_edits (updated_at DESC);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_recent_idx
  ON admin_audit_log (created_at DESC);
