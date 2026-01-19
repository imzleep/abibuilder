-- SECURITY FIX: LOG_VISIT SQL INJECTION
-- This script secures the 'log_visit' function by removing Dynamic SQL (EXECUTE).

-- 1. Redefine the function using Safe Parameterized Queries
-- 'CREATE OR REPLACE' will overwrite the existing vulnerable version.
CREATE OR REPLACE FUNCTION log_visit(
  p_user_agent TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with owner privileges (ensure owner is trusted)
AS $$
BEGIN
  -- OLD/VULNERABLE WAY (DO NOT USE):
  -- EXECUTE 'INSERT INTO visits (user_agent) VALUES (''' || p_user_agent || ''')';
  
  -- NEW/SECURE WAY:
  -- PL/pgSQL automatically handles sanitization and quoting for variables.
  -- Even if p_user_agent contains "' OR 1=1", it is treated as a literal string.
  INSERT INTO public.visits (user_agent)
  VALUES (p_user_agent);
  
END;
$$;

-- 2. Verify Table Permissions (Principle of Least Privilege)
-- Revoke dangerous permissions from public/anon users
REVOKE ALL ON FUNCTION log_visit(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION log_visit(TEXT) FROM anon;

-- Only allow execution (if needed explicitly, otherwise RLS is better)
GRANT EXECUTE ON FUNCTION log_visit(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_visit(TEXT) TO service_role;

-- 3. Ensure Visits Table exists
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS on the table itself for extra safety
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
