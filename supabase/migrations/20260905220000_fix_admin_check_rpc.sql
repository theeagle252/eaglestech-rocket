-- ============================================================
-- Fix Admin Role Check
-- Adds a SECURITY DEFINER RPC function that bypasses RLS
-- to reliably check if a user has admin role in user_profiles
-- ============================================================

-- Drop existing is_admin_user function and recreate it to also check user_profiles
-- This fixes the case where role is stored in user_profiles but not in auth metadata
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles up
  WHERE up.id = auth.uid()
  AND up.role = 'admin'
)
OR EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (
    au.raw_user_meta_data->>'role' = 'admin'
    OR au.raw_app_meta_data->>'role' = 'admin'
  )
)
$$;

-- New callable RPC: check_user_is_admin(user_id)
-- SECURITY DEFINER means it runs as the function owner (bypasses RLS)
-- This allows the app to check admin status right after sign-in
-- without being blocked by RLS policies on user_profiles
CREATE OR REPLACE FUNCTION public.check_user_is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Check user_profiles table directly (bypasses RLS via SECURITY DEFINER)
  SELECT role::TEXT INTO v_role
  FROM public.user_profiles
  WHERE id = p_user_id
  LIMIT 1;

  IF v_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- Fallback: check auth metadata
  SELECT
    CASE
      WHEN raw_user_meta_data->>'role' = 'admin' THEN TRUE
      WHEN raw_app_meta_data->>'role' = 'admin' THEN TRUE
      ELSE FALSE
    END INTO v_role
  FROM auth.users
  WHERE id = p_user_id
  LIMIT 1;

  RETURN v_role::BOOLEAN;

EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
