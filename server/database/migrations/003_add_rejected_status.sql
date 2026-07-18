-- ==========================================================
-- MIGRATION: 003_add_rejected_status.sql
-- Description:
-- Modifies the check constraint on the users table status column
-- to allow the 'rejected' status.
-- ==========================================================

-- 1. Drop the existing check constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check;

-- 2. Add the new check constraint allowing 'rejected' status
ALTER TABLE public.users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'rejected'));
