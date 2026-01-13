-- Add 'can_post_as_streamer' column to profiles table
-- Default is FALSE, so no one gets it automatically.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS can_post_as_streamer BOOLEAN DEFAULT FALSE;

-- Optional: You can immediately grant this to a specific user if you know their username/email
-- UPDATE public.profiles SET can_post_as_streamer = TRUE WHERE username = 'TARGET_USERNAME';
