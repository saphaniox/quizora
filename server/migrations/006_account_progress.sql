CREATE TABLE IF NOT EXISTS quiz_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  seed TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  flagged JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_index INTEGER NOT NULL CHECK (current_index >= 0),
  elapsed_seconds INTEGER NOT NULL CHECK (elapsed_seconds >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  device_label TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, quiz_id)
);

ALTER TABLE quiz_progress
  DROP CONSTRAINT IF EXISTS quiz_progress_mode_check;

ALTER TABLE quiz_progress
  ADD CONSTRAINT quiz_progress_mode_check
    CHECK (mode = 'full' OR mode ~ '^[0-9]+$');

ALTER TABLE quiz_progress
  DROP CONSTRAINT IF EXISTS quiz_progress_answers_check;

ALTER TABLE quiz_progress
  ADD CONSTRAINT quiz_progress_answers_check
    CHECK (jsonb_typeof(answers) = 'object');

ALTER TABLE quiz_progress
  DROP CONSTRAINT IF EXISTS quiz_progress_flagged_check;

ALTER TABLE quiz_progress
  ADD CONSTRAINT quiz_progress_flagged_check
    CHECK (jsonb_typeof(flagged) = 'array');

CREATE INDEX IF NOT EXISTS quiz_progress_updated_idx
  ON quiz_progress (user_id, updated_at DESC);
