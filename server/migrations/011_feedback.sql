CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('feature', 'topic', 'bug', 'general')),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 10 AND 5000),
  contact TEXT CHECK (contact IS NULL OR char_length(trim(contact)) <= 254),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'planned', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS feedback_status_created_at_idx ON feedback (status, created_at DESC);