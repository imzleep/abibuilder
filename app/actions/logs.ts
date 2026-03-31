"use server";

import { createClient } from "@/lib/supabase/server";

// Interface for what we pass as "changes"
export interface LogChanges {
    [key: string]: {
        old?: string | number | string[] | null;
        new?: string | number | string[] | null;
    };
}

export async function logBuildAction(
    buildId: string,
    userId: string,
    actionType: "edited" | "verified" | "rejected" | "deleted",
    changes?: LogChanges
) {
    const supabase = await createClient();
    
    // Validate we're not inserting massive JSON objects
    const cleanChanges = changes ? JSON.parse(JSON.stringify(changes)) : null;

    const { error } = await supabase
        .from("build_logs")
        .insert({
            build_id: buildId,
            user_id: userId,
            action_type: actionType,
            changes: cleanChanges
        });

    if (error) {
        console.error("Failed to insert build audit log:", error);
        // We log silently so it doesn't break the main flow if it fails
    }
}

export async function getBuildLogs(buildId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Check permissions
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, is_moderator")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin && !profile?.is_moderator) {
        return { success: false, error: "Access denied. Admin or Moderator required." };
    }

    // Since build_logs references auth.users which isn't easily joined directly via public schema JS query,
    // we query build_logs, then fetch profile usernames manually based on user_ids.
    const { data: logs, error } = await supabase
        .from("build_logs")
        .select("*")
        .eq("build_id", buildId)
        .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    if (!logs || logs.length === 0) return { success: true, logs: [] };

    // Fetch user profiles for display
    const userIds = [...new Set(logs.map(log => log.user_id).filter(Boolean))];
    
    let usersData: any[] = [];
    if (userIds.length > 0) {
        const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, is_admin, is_moderator")
            .in("id", userIds);
        usersData = profilesData || [];
    }

    // Attach usernames to logs
    const detailedLogs = logs.map(log => {
        const userProfile = usersData.find(u => u.id === log.user_id);
        return {
            ...log,
            username: userProfile?.username || "Unknown (ID: " + log.user_id?.substring(0, 8) + "...) ",
            role: userProfile?.is_admin ? "Admin" : (userProfile?.is_moderator ? "Moderator" : "User")
        };
    });

    return { success: true, logs: detailedLogs };
}
