"use server";

import { createClient } from "@/lib/supabase/server";

const getAdminClient = async () => {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

export async function checkEmailAvailability(email: string): Promise<boolean> {
    try {
        const supabase = await getAdminClient();

        // Create a user with a random password to check if email is taken.
        // If email is taken, it will throw a specific error.
        // If success, we delete the dummy user immediately.

        const tempPassword = "ProbePassword123!" + Math.random().toString(36);
        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { is_probe: true }
        });

        if (error) {
            // If error says "already registered", then return false (unavailable)
            if (error.message.includes("registered") || error.status === 422) {
                return false;
            }
            // Other errors? Allow retry.
            console.error("Probe error:", error);
            return true;
        }

        if (data.user) {
            // User didn't exist, we just created it. Delete it immediately.
            await supabase.auth.admin.deleteUser(data.user.id);
            return true; // Was available
        }

        return true;
    } catch (e) {
        console.error("Check email error:", e);
        return true; // Default to allow
    }
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
        const supabase = await createClient();

        // Normalize username (lowercase)
        const normalized = username.toLowerCase();

        // Check availability in profiles table
        const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", normalized)
            .maybeSingle();

        if (error) {
            console.error("Error checking username availability:", error);
            return false;
        }

        return !data;
    } catch (e) {
        console.error("Unexpected error in checkUsernameAvailability:", e);
        return false;
    }
}
