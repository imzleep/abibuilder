"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


// Access Control Helper
// Access Control Helper
async function checkPermissions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { authorized: false, isAdmin: false, isModerator: false, user: null, supabase };

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, is_moderator")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.is_admin || false;
    const isModerator = profile?.is_moderator || false;

    return {
        authorized: isAdmin || isModerator,
        isAdmin,
        isModerator,
        user,
        supabase
    };
}

export async function getPendingBuilds() {
    const { authorized, supabase } = await checkPermissions();
    if (!authorized) return [];

    const { data, error } = await supabase
        .from("builds")
        .select(`
            *,
            profiles:user_id (username)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Admin Fetch Error:", error);
        return [];
    }

    return data;
}

export async function getAdminBuild(id: string) {
    const { authorized, supabase } = await checkPermissions();
    if (!authorized) return null;

    const { data, error } = await supabase
        .from("builds")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

export async function updateAdminBuild(id: string, updates: any) {
    const { authorized, supabase } = await checkPermissions();
    if (!authorized) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("builds")
        .update(updates)
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath(`/admin/${id}`);
    revalidatePath("/");
    revalidatePath("/builds");

    return { success: true };
}

export async function verifyBuildAction(buildId: string, status: "verified" | "rejected") {
    const { authorized, supabase } = await checkPermissions();

    if (!authorized) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("builds")
        .update({ status })
        .eq("id", buildId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/builds");
    return { success: true };
}

export async function getStreamersAction() {
    const supabase = await createClient();

    // Check if user is admin (optional, but good practice to hide list if not needed)
    // Actually, getting a list of streamers might be public info? 
    // But this action is specifically for the dropdown. 

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("is_streamer", true)
        .order("username");

    if (error) {
        console.error("Fetch Streamers Error:", error);
        return [];
    }

    return data || [];
}

// Link Placeholder Streamer to Real User
export async function linkStreamerAccount(placeholderUsername: string, realUserId: string) {
    const { isAdmin, supabase } = await checkPermissions();
    if (!isAdmin) return { success: false, error: "Unauthorized: Admins only" };

    try {
        // 1. Fetch Placeholder
        const { data: placeholder, error: fetchError } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", placeholderUsername)
            .eq("is_streamer", true)
            .single();

        if (fetchError || !placeholder) {
            return { success: false, error: `Placeholder streamer '${placeholderUsername}' not found.` };
        }

        const placeholderId = placeholder.id;

        // 2. Rename Placeholder to Release Username
        // We append a random suffix to ensure uniqueness just in case
        const tempName = `${placeholderUsername}_OLD_${Date.now()}`;
        const { error: renameError } = await supabase
            .from("profiles")
            .update({ username: tempName })
            .eq("id", placeholderId);

        if (renameError) throw new Error(`Failed to rename placeholder: ${renameError.message}`);

        // 3. Update Real User to Target Username & Set Streamer Status
        const { error: updateUserError } = await supabase
            .from("profiles")
            .update({
                username: placeholderUsername,
                is_streamer: true
            })
            .eq("id", realUserId);

        if (updateUserError) {
            // ROLLBACK attempts (manual)
            console.error("Link failed at update step. Needs manual intervention or rollback logic.");
            // Revert placeholder name logic could go here
            await supabase.from("profiles").update({ username: placeholderUsername }).eq("id", placeholderId);
            return { success: false, error: `Failed to update real user: ${updateUserError.message}` };
        }

        // 4. Move Builds from Placeholder to Real User
        const { error: moveBuildsError } = await supabase
            .from("builds")
            .update({ user_id: realUserId })
            .eq("user_id", placeholderId);

        if (moveBuildsError) {
            console.error("Failed to move builds:", moveBuildsError);
            return { success: false, error: "Profile updated but failed to transfer builds." };
        }

        // 5. Delete Placeholder Profile
        const { error: deleteError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", placeholderId);

        if (deleteError) {
            console.error("Failed to delete placeholder:", deleteError);
            // Not critical, but annoying
        }

        revalidatePath("/admin");
        revalidatePath("/builds");
        revalidatePath("/"); // Homepage

        return { success: true };

    } catch (err: any) {
        console.error("Link Streamer Exception:", err);
        return { success: false, error: err.message };
    }
}

// Search Users for Admin Tools
export async function searchUsersAction(query: string) {
    const { authorized, supabase } = await checkPermissions();
    if (!authorized) return [];

    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${query}%`)
        .limit(5);

    if (error) {
        console.error("Search Users Error:", error);
        return [];
    }

    return data || [];
}

export async function updateStreamerAvatarAction(streamerId: string, avatarUrl: string) {
    const { isAdmin, supabase } = await checkPermissions();
    if (!isAdmin) return { success: false, error: "Unauthorized: Admins only" };



    const { error } = await supabase
        .from("profiles")
        .update({
            avatar_url: avatarUrl
        })
        .eq("id", streamerId);

    if (error) {
        console.error("Update Avatar Error:", error);
        return { success: false, error: error.message };
    }



    // Need to revalidate the specific profile page if possible, but "/" covers the streamer list.
    // Fetch username to revalidate profile page
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", streamerId).single();

    revalidatePath("/admin", "layout");
    revalidatePath("/", "layout");

    if (profile?.username) {
        revalidatePath(`/profile/${profile.username}`, "layout");
    }

    return { success: true };
}
