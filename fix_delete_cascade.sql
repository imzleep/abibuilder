-- Enable ON DELETE CASCADE for all user-related tables
-- This ensures that when a user is deleted from auth.users, all their data is automatically removed.

-- 1. Profiles (Usually already set, but double checking)
-- Note: You might need to check your exact constraint names if these fail.
-- You can find constraint names in Table Editor > [Table] > Columns > [Relation Icon] (or passing over foreign key icon)

BEGIN;

-- ADJUST PROFILES
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;


-- ADJUST BUILDS
ALTER TABLE public.builds
DROP CONSTRAINT IF EXISTS builds_user_id_fkey;

ALTER TABLE public.builds
ADD CONSTRAINT builds_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;


-- ADJUST BUILD_VOTES (User Deletion)
ALTER TABLE public.build_votes
DROP CONSTRAINT IF EXISTS build_votes_user_id_fkey;

ALTER TABLE public.build_votes
ADD CONSTRAINT build_votes_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- ADJUST BUILD_VOTES (Build Deletion)
ALTER TABLE public.build_votes
DROP CONSTRAINT IF EXISTS build_votes_build_id_fkey;

ALTER TABLE public.build_votes
ADD CONSTRAINT build_votes_build_id_fkey
    FOREIGN KEY (build_id)
    REFERENCES public.builds(id)
    ON DELETE CASCADE;


-- ADJUST BOOKMARKS (User Deletion)
ALTER TABLE public.bookmarks
DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;

ALTER TABLE public.bookmarks
ADD CONSTRAINT bookmarks_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- ADJUST BOOKMARKS (Build Deletion)
ALTER TABLE public.bookmarks
DROP CONSTRAINT IF EXISTS bookmarks_build_id_fkey;

ALTER TABLE public.bookmarks
ADD CONSTRAINT bookmarks_build_id_fkey
    FOREIGN KEY (build_id)
    REFERENCES public.builds(id)
    ON DELETE CASCADE;

COMMIT;
