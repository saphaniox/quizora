CREATE TABLE IF NOT EXISTS app_update_settings (
    id SERIAL PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    minimum_version TEXT NOT NULL DEFAULT '1.1.0',
    latest_version TEXT NOT NULL DEFAULT '1.1.0',
    required BOOLEAN NOT NULL DEFAULT TRUE,
    store_url TEXT,
    message TEXT NOT NULL DEFAULT 'A new app update is available. Please update to continue using Quitech.',
    updated_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_update_settings (
    enabled,
    minimum_version,
    latest_version,
    required,
    store_url,
    message,
    updated_by,
    updated_at
)
SELECT
    FALSE,
    '1.1.0',
    '1.1.0',
    TRUE,
    NULL,
    'A new app update is available. Please update to continue using Quitech.',
    NULL,
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM app_update_settings);
