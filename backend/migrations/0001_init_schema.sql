CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE buy_transaction_status AS ENUM ('pending', 'completed', 'cancelled');

CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type_car VARCHAR(100) NOT NULL,
    model_car VARCHAR(100) NOT NULL,
    color_car VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX customers_license_plate_key ON customers (license_plate);
CREATE INDEX customers_name_idx ON customers (name);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    customer_id UUID UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON DELETE SET NULL,
    CONSTRAINT users_role_customer_check
        CHECK (
            (role = 'admin' AND customer_id IS NULL)
            OR (role = 'user' AND customer_id IS NOT NULL)
        )
);

CREATE UNIQUE INDEX users_single_admin_idx ON users (role) WHERE role = 'admin';

CREATE TABLE wood_types (
    wood_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE destinations (
    destination_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE daily_prices (
    price_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wood_id UUID NOT NULL,
    price_per_kg NUMERIC(12,2) NOT NULL CHECK (price_per_kg >= 0),
    effective_date DATE NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT daily_prices_wood_fk
        FOREIGN KEY (wood_id)
        REFERENCES wood_types (wood_id)
        ON DELETE RESTRICT,
    CONSTRAINT daily_prices_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
);

CREATE UNIQUE INDEX daily_prices_wood_date_key ON daily_prices (wood_id, effective_date);
CREATE INDEX daily_prices_effective_date_idx ON daily_prices (effective_date);

CREATE TABLE buy_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    wood_id UUID NOT NULL,
    before_weight NUMERIC(12,3) NOT NULL CHECK (before_weight > 0),
    after_weight NUMERIC(12,3) CHECK (after_weight IS NULL OR after_weight > 0),
    net_weight NUMERIC(12,3) GENERATED ALWAYS AS (before_weight - after_weight) STORED,
    price_per_kg NUMERIC(12,2) NOT NULL CHECK (price_per_kg >= 0),
    total_price NUMERIC(14,2) GENERATED ALWAYS AS ((before_weight - after_weight) * price_per_kg) STORED,
    status buy_transaction_status NOT NULL DEFAULT 'pending',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT buy_transactions_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON DELETE RESTRICT,
    CONSTRAINT buy_transactions_wood_fk
        FOREIGN KEY (wood_id)
        REFERENCES wood_types (wood_id)
        ON DELETE RESTRICT,
    CONSTRAINT buy_transactions_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users (user_id)
        ON DELETE RESTRICT,
    CONSTRAINT buy_transactions_status_check
        CHECK (
            (status = 'pending' AND after_weight IS NULL)
            OR (status = 'completed' AND after_weight IS NOT NULL AND before_weight > after_weight)
            OR (status = 'cancelled')
        )
);

CREATE INDEX buy_transactions_customer_idx ON buy_transactions (customer_id);
CREATE INDEX buy_transactions_wood_idx ON buy_transactions (wood_id);
CREATE INDEX buy_transactions_status_idx ON buy_transactions (status);
CREATE INDEX buy_transactions_created_at_idx ON buy_transactions (created_at DESC);

CREATE TABLE sell_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wood_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    before_weight NUMERIC(12,3) NOT NULL CHECK (before_weight > 0),
    after_weight NUMERIC(12,3) NOT NULL CHECK (after_weight > 0),
    net_weight NUMERIC(12,3) GENERATED ALWAYS AS (after_weight - before_weight) STORED,
    total_sale_price NUMERIC(14,2) NOT NULL CHECK (total_sale_price >= 0),
    notes TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sell_transactions_wood_fk
        FOREIGN KEY (wood_id)
        REFERENCES wood_types (wood_id)
        ON DELETE RESTRICT,
    CONSTRAINT sell_transactions_destination_fk
        FOREIGN KEY (destination_id)
        REFERENCES destinations (destination_id)
        ON DELETE RESTRICT,
    CONSTRAINT sell_transactions_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users (user_id)
        ON DELETE RESTRICT,
    CONSTRAINT sell_transactions_weight_check
        CHECK (after_weight > before_weight)
);

CREATE INDEX sell_transactions_wood_idx ON sell_transactions (wood_id);
CREATE INDEX sell_transactions_destination_idx ON sell_transactions (destination_id);
CREATE INDEX sell_transactions_created_at_idx ON sell_transactions (created_at DESC);

CREATE TABLE bills (
    bill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL UNIQUE,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    signature_url TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT bills_transaction_fk
        FOREIGN KEY (transaction_id)
        REFERENCES buy_transactions (transaction_id)
        ON DELETE RESTRICT,
    CONSTRAINT bills_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES users (user_id)
        ON DELETE RESTRICT
);

CREATE INDEX bills_created_at_idx ON bills (created_at DESC);

CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT system_settings_updated_by_fk
        FOREIGN KEY (updated_by)
        REFERENCES users (user_id)
        ON DELETE SET NULL
);
