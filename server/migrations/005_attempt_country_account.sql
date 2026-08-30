ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS country_code TEXT;

ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS country_name TEXT;

ALTER TABLE leaderboard
  DROP CONSTRAINT IF EXISTS leaderboard_user_id_fkey;

ALTER TABLE leaderboard
  ADD CONSTRAINT leaderboard_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE leaderboard
  DROP CONSTRAINT IF EXISTS leaderboard_country_code_check;

ALTER TABLE leaderboard
  ADD CONSTRAINT leaderboard_country_code_check
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$');

ALTER TABLE leaderboard
  DROP CONSTRAINT IF EXISTS leaderboard_country_name_check;

ALTER TABLE leaderboard
  ADD CONSTRAINT leaderboard_country_name_check
    CHECK (country_name IS NULL OR char_length(country_name) BETWEEN 1 AND 80);

CREATE INDEX IF NOT EXISTS leaderboard_user_completed_idx
  ON leaderboard (user_id, completed_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS leaderboard_country_idx
  ON leaderboard (country_code)
  WHERE country_code IS NOT NULL;

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS country_code TEXT;

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS country_name TEXT;

ALTER TABLE certificates
  DROP CONSTRAINT IF EXISTS certificates_user_id_fkey;

ALTER TABLE certificates
  ADD CONSTRAINT certificates_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE certificates
  DROP CONSTRAINT IF EXISTS certificates_country_code_check;

ALTER TABLE certificates
  ADD CONSTRAINT certificates_country_code_check
    CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$');

ALTER TABLE certificates
  DROP CONSTRAINT IF EXISTS certificates_country_name_check;

ALTER TABLE certificates
  ADD CONSTRAINT certificates_country_name_check
    CHECK (country_name IS NULL OR char_length(country_name) BETWEEN 1 AND 80);

CREATE INDEX IF NOT EXISTS certificates_user_issued_idx
  ON certificates (user_id, issued_at DESC)
  WHERE user_id IS NOT NULL;
