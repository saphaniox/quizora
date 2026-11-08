ALTER TABLE push_devices
  ALTER COLUMN user_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS push_devices_guest_enabled_idx
  ON push_devices (enabled, updated_at DESC)
  WHERE user_id IS NULL;
