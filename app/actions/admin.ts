"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
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

export async function getStreamersAction(randomize: boolean = false) {
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

    if (randomize && data) {
        // Fisher-Yates Shuffle
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }
    }

    return data || [];
}

// Link Placeholder Streamer to Real User
export async function linkStreamerAccount(placeholderUsername: string, realUserId: string) {
    const { isAdmin } = await checkPermissions();
    if (!isAdmin) return { success: false, error: "Unauthorized: Admins only" };

    const supabaseAdmin = await getAdminClient(); // Use Service Role Client

    try {
        // 1. Fetch Placeholder
        const { data: placeholder, error: fetchError } = await supabaseAdmin
            .from("profiles")
            .select("id, avatar_url")
            .eq("username", placeholderUsername)
            .eq("is_streamer", true)
            .single();

        if (fetchError || !placeholder) {
            return { success: false, error: `Placeholder streamer '${placeholderUsername}' not found.` };
        }

        const placeholderId = placeholder.id;

        // 2. Rename Placeholder to Release Username
        const tempName = `${placeholderUsername}_OLD_${Date.now()}`;
        const { error: renameError } = await supabaseAdmin
            .from("profiles")
            .update({ username: tempName })
            .eq("id", placeholderId);

        if (renameError) throw new Error(`Failed to rename placeholder: ${renameError.message}`);

        // 3. Update Real User to Target Username & Set Streamer Status
        // Also sync avatar if desired (optional)
        const { error: updateUserError } = await supabaseAdmin
            .from("profiles")
            .update({
                username: placeholderUsername,
                is_streamer: true,
                avatar_url: placeholder.avatar_url // Transfer avatar
            })
            .eq("id", realUserId);

        if (updateUserError) {
            // ROLLBACK attempts (manual)
            console.error("Link failed at update step.");
            await supabaseAdmin.from("profiles").update({ username: placeholderUsername }).eq("id", placeholderId);
            return { success: false, error: `Failed to update real user: ${updateUserError.message}` };
        }

        // 4. Move Builds from Placeholder to Real User
        const { error: moveBuildsError } = await supabaseAdmin
            .from("builds")
            .update({ user_id: realUserId })
            .eq("user_id", placeholderId);

        if (moveBuildsError) {
            console.error("Failed to move builds:", moveBuildsError);
            return { success: false, error: "Profile updated but failed to transfer builds." };
        }

        // 5. Delete Placeholder User (Auth + Profile)
        // Using auth.admin.deleteUser deletes the user from auth.users, which cascades to profiles
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(placeholderId);

        if (deleteError) {
            console.error("Failed to delete placeholder user (Auth):", deleteError);
            // Fallback: try deleting profile manually if auth deletion fails (unlikely with service role)
            await supabaseAdmin.from("profiles").delete().eq("id", placeholderId);
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

export async function uploadStreamerAvatar(formData: FormData) {
    const { isAdmin } = await checkPermissions();
    if (!isAdmin) return { success: false, error: "Unauthorized: Admins only" };

    const file = formData.get("file") as File;
    const streamerId = formData.get("streamerId") as string;

    if (!file || !streamerId) {
        return { success: false, error: "Missing file or streamer ID" };
    }

    const supabaseAdmin = await getAdminClient();

    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${streamerId}/${Date.now()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin.storage
            .from('avatars')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error("Admin Upload Error:", uploadError);
            return { success: false, error: uploadError.message };
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;

        // Update Profile
        const { error: dbError } = await supabaseAdmin
            .from("profiles")
            .update({ avatar_url: cacheBustedUrl })
            .eq("id", streamerId);

        if (dbError) {
            return { success: false, error: dbError.message };
        }

        revalidatePath("/admin");
        revalidatePath("/");

        // Try to revalidate profile page if we can get username, but not critical
        // We can fetch it if needed
        const { data: profile } = await supabaseAdmin.from("profiles").select("username").eq("id", streamerId).single();
        if (profile?.username) {
            revalidatePath(`/profile/${profile.username}`);
        }

        return { success: true };

    } catch (error: any) {
        console.error("Upload Action Error:", error);
        return { success: false, error: error.message };
    }
}
