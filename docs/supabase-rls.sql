-- =============================================================================
-- Supabase RLS (Row Level Security) Setup for CaseHub
-- =============================================================================
-- Copy and paste this entire script into your Supabase SQL editor
-- https://app.supabase.com -> SQL Editor -> New Query
--
-- This script:
-- 1. Adds owner_id column to cases and clients tables
-- 2. Enables RLS on both tables
-- 3. Creates policies to ensure users can only access their own data
-- 4. Sets default owner_id to the authenticated user's ID
--
-- Prerequisites:
-- - auth.users table must exist (Supabase creates this by default)
-- - cases and clients tables must exist
--
-- =============================================================================

-- =============================================================================
-- 1. ALTER cases TABLE
-- =============================================================================

-- Add owner_id column to cases table if it doesn't exist
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS owner_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key constraint to auth.users (if not already exists)
-- Note: This step may require commenting out if it already exists
-- ALTER TABLE cases
-- ADD CONSTRAINT cases_owner_id_fk FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================================
-- 2. ALTER clients TABLE
-- =============================================================================

-- Add owner_id column to clients table if it doesn't exist
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS owner_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key constraint to auth.users (if not already exists)
-- Note: This step may require commenting out if it already exists
-- ALTER TABLE clients
-- ADD CONSTRAINT clients_owner_id_fk FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================================
-- 3. ENABLE RLS ON cases TABLE
-- =============================================================================

-- Enable Row Level Security on cases
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT only their own cases
CREATE POLICY "Users can view their own cases"
  ON cases
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Allow users to INSERT cases as themselves
CREATE POLICY "Users can create their own cases"
  ON cases
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Allow users to UPDATE only their own cases
CREATE POLICY "Users can update their own cases"
  ON cases
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Allow users to DELETE only their own cases
CREATE POLICY "Users can delete their own cases"
  ON cases
  FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================================================
-- 4. ENABLE RLS ON clients TABLE
-- =============================================================================

-- Enable Row Level Security on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT only their own clients
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Allow users to INSERT clients as themselves
CREATE POLICY "Users can create their own clients"
  ON clients
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Allow users to UPDATE only their own clients
CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Allow users to DELETE only their own clients
CREATE POLICY "Users can delete their own clients"
  ON clients
  FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================================================
-- 5. VERIFICATION QUERIES (Optional - run after setup)
-- =============================================================================

-- Verify RLS is enabled on cases
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE tablename IN ('cases', 'clients')
-- AND schemaname = 'public';

-- Verify policies exist
-- SELECT tablename, policyname, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('cases', 'clients');

-- =============================================================================
-- NOTES
-- =============================================================================
--
-- 1. OWNER_ID DEFAULT VALUE:
--    The owner_id column uses DEFAULT auth.uid() which means:
--    - When inserting via API: new rows automatically get the authenticated user's ID
--    - When inserting via Supabase UI: you might need to manually set owner_id
--
-- 2. POLICIES:
--    - RLS blocks ALL access by default
--    - The policies above allow:
--      * Users to SELECT their own data
--      * Users to INSERT/UPDATE/DELETE only their own data
--    - Anonymous/unauthenticated users cannot access any data
--
-- 3. EXISTING DATA:
--    If you already have data without owner_id:
--    - The DEFAULT auth.uid() only applies to NEW inserts
--    - For existing rows, manually update them:
--      UPDATE cases SET owner_id = '<user-uuid>' WHERE owner_id IS NULL;
--
-- 4. TESTING:
--    To verify RLS works correctly:
--    - Create case as User A
--    - Try to SELECT all cases as User B
--    - User B should see 0 results
--    - User A should see their own case
--
-- 5. SUPABASE ANON KEY:
--    RLS policies apply to all authenticated users
--    The ANON key (used in browser) is still subject to RLS
--    Only users logged in via supabase.auth can bypass based on policies
--
-- =============================================================================
