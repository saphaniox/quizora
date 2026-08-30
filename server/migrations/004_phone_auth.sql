ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_e164 TEXT;

ALTER TABLE users
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_contact_check;

ALTER TABLE users
  ADD CONSTRAINT users_contact_check CHECK (email IS NOT NULL OR phone_e164 IS NOT NULL);

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_phone_e164_check;

ALTER TABLE users
  ADD CONSTRAINT users_phone_e164_check
    CHECK (phone_e164 IS NULL OR phone_e164 ~ '^\+[1-9][0-9]{7,14}$');

CREATE UNIQUE INDEX IF NOT EXISTS users_phone_e164_unique_idx
  ON users (phone_e164)
  WHERE phone_e164 IS NOT NULL;
