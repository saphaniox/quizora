CREATE TABLE IF NOT EXISTS email_provider_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  provider TEXT NOT NULL CHECK (provider IN ('smtp', 'resend')),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO email_provider_settings (id, provider)
VALUES (1, 'smtp')
ON CONFLICT (id) DO NOTHING;
