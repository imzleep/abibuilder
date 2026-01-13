-- Backfill script to generate short codes for existing builds

-- Update all builds that have no short_code
-- using a 7-character slice of the MD5 hash of a random number.
-- This is statistically unique enough for a backfill of existing rows.

UPDATE public.builds
SET short_code = SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 7)
WHERE short_code IS NULL;
