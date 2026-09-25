ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS leaderboard_visible BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS leaderboard_visible_idx
  ON leaderboard (quiz_id, leaderboard_visible, percentage DESC, time_spent_seconds ASC);