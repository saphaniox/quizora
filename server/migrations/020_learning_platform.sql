CREATE TABLE IF NOT EXISTS learning_lessons (
  slug TEXT PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  draft_content JSONB NOT NULL CHECK (jsonb_typeof(draft_content) = 'object'),
  published_content JSONB CHECK (
    published_content IS NULL OR jsonb_typeof(published_content) = 'object'
  ),
  built_in BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS learning_lessons_catalogue_idx
  ON learning_lessons (updated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS learning_lessons_quiz_section_idx
  ON learning_lessons ((draft_content ->> 'quizSectionId'))
  WHERE draft_content ->> 'quizSectionId' IS NOT NULL;

CREATE TABLE IF NOT EXISTS learning_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed')),
  last_opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_slug),
  CHECK (
    (status = 'started' AND completed_at IS NULL)
    OR (status = 'completed' AND completed_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS learning_progress_recent_idx
  ON learning_progress (user_id, updated_at DESC);
