INSERT INTO users (
    username,
    password_hash,
    role,
    customer_id
)
VALUES (
    COALESCE(NULLIF(:'admin_username', ''), 'admin'),
    crypt(
        COALESCE(NULLIF(:'admin_password', ''), 'admin1234'),
        gen_salt('bf', 10)
    ),
    'admin',
    NULL
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO destinations (name, code)
VALUES
    ('โรงงานไม้ฟืน', 'firewood-factory'),
    ('โรงงานไม้ท่อน', 'log-factory')
ON CONFLICT (code) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, updated_by)
SELECT
    'company_signature_url',
    COALESCE(:'company_signature_url', ''),
    u.user_id
FROM users u
WHERE u.role = 'admin'
ON CONFLICT (setting_key) DO UPDATE
SET
    setting_value = EXCLUDED.setting_value,
    updated_by = EXCLUDED.updated_by,
    updated_at = NOW();
