ALTER TABLE users
  ALTER COLUMN push_notifications_enabled SET DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS quitech_migration_markers (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM quitech_migration_markers
    WHERE name = '017_push_notifications_default_on'
  ) THEN
    UPDATE users
    SET push_notifications_enabled = TRUE
    WHERE push_notifications_enabled = FALSE;

    INSERT INTO quitech_migration_markers (name)
    VALUES ('017_push_notifications_default_on');
  END IF;
END
$$;
