"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
        const supabase = await createClient();

        // Normalize username (lowercase)
        const normalized = username.toLowerCase();

        // Check availability in profiles table
        // Use maybeSingle() to handle 0 rows gracefully without error
        const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", normalized)
            .maybeSingle();

        if (error) {
            console.error("Error checking username availability:", error);
            // In case of DB error, return false (unavailable) to prevent registration with potentially conflicting name
            return false;
        }

        // If data exists, username is taken (return false). If null, it's available (return true).
        return !data;
    } catch (e) {
        console.error("Unexpected error in checkUsernameAvailability:", e);
        return false;
    }
}
