ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS visitor_id TEXT;

ALTER TABLE leaderboard
  DROP CONSTRAINT IF EXISTS leaderboard_visitor_id_check;

ALTER TABLE leaderboard
  ADD CONSTRAINT leaderboard_visitor_id_check
    CHECK (visitor_id IS NULL OR char_length(visitor_id) BETWEEN 12 AND 100);

CREATE INDEX IF NOT EXISTS leaderboard_quiz_user_best_idx
  ON leaderboard (quiz_id, user_id, percentage DESC, time_spent_seconds ASC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS leaderboard_quiz_visitor_best_idx
  ON leaderboard (quiz_id, visitor_id, percentage DESC, time_spent_seconds ASC)
  WHERE visitor_id IS NOT NULL;
