-- Fix RLS Policy for 'builds' table to allow authorized users to post on behalf of others

-- 1. Drop the existing strict INSERT policy (assuming it exists and is named 'Enable insert for authenticated users only' or similar)
-- We will try to drop common names, or just create a new one that covers all cases.
-- Safer approach: Create a specific policy for "Proxy Uploads" or update the main one.

-- Let's enable RLS just in case
ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;

-- 2. Create the new policy
-- This policy allows INSERT if:
-- A) You are inserting for yourself (uid = user_id)
-- B) You are an Admin OR have 'can_post_as_streamer' permission
CREATE POLICY "Allow proxy uploads for admins and authorized users"
ON public.builds
FOR INSERT
TO authenticated
WITH CHECK (
  -- Case 1: Posting as yourself
  auth.uid() = user_id
  OR
  -- Case 2: You have permission to post as others
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (is_admin = TRUE OR can_post_as_streamer = TRUE)
  )
);

-- Note: You might need to drop the old policy if it conflicts or is too restrictive (AND logic).
-- If you see "new row violates..." it means ALL policies failed.
-- If there is an existing policy like "auth.uid() = user_id", this NEW policy is an OR condition, so it should enable access.
-- EXCEPT if the old policy was restrictive on UPDATE/DELETE, but here we care about INSERT.

-- 3. Also update DELETE/UPDATE policies to allow Mods/Admins/Authorized to manage these builds
-- (Optional but good for consistency)
CREATE POLICY "Allow delete for admins and mods"
ON public.builds
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (is_admin = TRUE OR is_moderator = TRUE)
  )
);
