CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  player_name TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  level_name TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score > 0),
  percentage INTEGER NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  time_spent_seconds INTEGER NOT NULL CHECK (time_spent_seconds >= 0),
  completed_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS leaderboard_quiz_rank_idx
  ON leaderboard (quiz_id, percentage DESC, time_spent_seconds ASC, completed_at ASC);

CREATE TABLE IF NOT EXISTS certificates (
  code TEXT PRIMARY KEY,
  player_name TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  level_name TEXT NOT NULL,
  category TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score > 0),
  percentage INTEGER NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  issued_at TIMESTAMPTZ NOT NULL
);