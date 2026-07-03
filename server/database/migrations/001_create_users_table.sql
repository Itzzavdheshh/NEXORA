-- ==========================================================
-- TABLE: users
-- Description:
-- Stores application-specific user information.
-- Authentication is managed by Supabase Auth (auth.users).
-- ==========================================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    auth_id UUID NOT NULL UNIQUE
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT NOT NULL UNIQUE,

    full_name TEXT NOT NULL,

    role TEXT NOT NULL
        CHECK (role IN ('student', 'mentor', 'admin')),

    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),

    avatar_url TEXT,

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX idx_users_auth_id
ON public.users(auth_id);

CREATE INDEX idx_users_email
ON public.users(email);

CREATE INDEX idx_users_role
ON public.users(role);

CREATE INDEX idx_users_status
ON public.users(status);

-- ==========================================================
-- FUNCTION: Automatically update updated_at
-- ==========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- TRIGGER
-- ==========================================================

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();