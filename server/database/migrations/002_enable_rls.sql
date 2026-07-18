-- ==========================================================
-- MIGRATION: Enable Row Level Security (RLS) and Access Policies
-- Description:
-- Secures all tables from unauthorized anonymous read/write access.
-- ==========================================================

-- ── 1. USERS TABLE ────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- ── 2. BOOKINGS TABLE ─────────────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  student_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR mentor_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
);

-- ── 3. STUDENT PROFILES TABLE ─────────────────────────────
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authorized users to read student profiles"
ON public.student_profiles
FOR SELECT
TO authenticated
USING (
  user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.student_id = student_profiles.user_id
    AND b.mentor_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  )
);

CREATE POLICY "Allow students to update their own profile"
ON public.student_profiles
FOR UPDATE
TO authenticated
USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- ── 4. MENTOR PROFILES TABLE ──────────────────────────────
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read mentor profiles"
ON public.mentor_profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow mentors to update their own profile"
ON public.mentor_profiles
FOR UPDATE
TO authenticated
USING (
  user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
);

-- ── 5. AVAILABILITY SLOTS TABLE ───────────────────────────
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read availability slots"
ON public.availability_slots
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow mentors to manage their own availability slots"
ON public.availability_slots
FOR ALL
TO authenticated
USING (
  mentor_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
);

-- ── 6. Notifications TABLE ────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read and update their own notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (
  user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
);
