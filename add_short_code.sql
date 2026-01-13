-- Add 'short_code' column for shorter URLs
ALTER TABLE public.builds
ADD COLUMN IF NOT EXISTS short_code TEXT;

-- Make it unique to prevent collisions
ALTER TABLE public.builds
ADD CONSTRAINT builds_short_code_key UNIQUE (short_code);

-- Optional: Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_builds_short_code ON public.builds(short_code);
