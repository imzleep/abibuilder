DO $$
DECLARE
    r RECORD;
    new_code TEXT;
    collision BOOLEAN;
BEGIN
    -- Loop through all builds that have NULL short_code
    FOR r IN SELECT id FROM builds WHERE short_code IS NULL LOOP
        LOOP
            -- 1. Generate a random 7-character mixed-case alphanumeric string
            -- (Using md5 substring is easy but only hex, this is slightly better for distribution)
            new_code := substring(
                md5(random()::text || clock_timestamp()::text || r.id::text) 
                from 1 for 7
            );

            -- 2. Check for collision: Does this code already exist?
            -- (The 'EXISTS' check is what makes this robust compared to a raw update)
            SELECT EXISTS(SELECT 1 FROM builds WHERE short_code = new_code) INTO collision;

            -- 3. If no collision, break the loop and use this code
            EXIT WHEN NOT collision;
            
            -- If collision (true), loop repeats and generates a new code
        END LOOP;

        -- 4. Update the record with the verified unique code
        UPDATE builds 
        SET short_code = new_code 
        WHERE id = r.id;
        
    END LOOP;
END $$;
