ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

UPDATE sessions
SET last_seen_at = created_at
WHERE last_seen_at IS NULL;

ALTER TABLE sessions
  ALTER COLUMN last_seen_at SET DEFAULT NOW(),
  ALTER COLUMN last_seen_at SET NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

UPDATE users AS u
SET last_seen_at = activity.last_seen_at
FROM (
  SELECT user_id, MAX(last_seen_at) AS last_seen_at
  FROM sessions
  GROUP BY user_id
) AS activity
WHERE u.id = activity.user_id
  AND u.last_seen_at IS NULL;

CREATE INDEX IF NOT EXISTS sessions_presence_idx
  ON sessions (last_seen_at DESC);
