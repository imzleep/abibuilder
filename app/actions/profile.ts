"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { WeaponBuild } from "@/types";

export interface UserProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    is_verified: boolean;
    is_supporter: boolean;
    is_streamer: boolean;
    is_admin: boolean;
    is_moderator: boolean;
    created_at: string;
    last_username_change?: string; // New field
    stats: {
        totalBuilds: number;
        totalUpvotes: number;
    };
}

export async function getProfileByUsername(username: string): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    const supabase = await createClient();

    // 1. Get Profile
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !profile) {
        console.error("Profile fetch error:", error);
        return { success: false, error: "User not found" };
    }

    // 2. Get Stats (This could be optimized with a database view or function later)
    // Count builds
    const { count: buildCount } = await supabase
        .from("builds")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id);

    // Sum upvotes (A bit expensive for heavy users, but fine for MVP)
    // We can fetch all builds and reduce in JS for now, or use a customized query.
    // For MVP: Fetch just upvotes column
    const { data: builds } = await supabase
        .from("builds")
        .select("upvotes")
        .eq("user_id", profile.id);

    const totalUpvotes = builds?.reduce((sum, b) => sum + (b.upvotes || 0), 0) || 0;

    return {
        success: true,
        data: {
            ...profile,
            stats: {
                totalBuilds: buildCount || 0,
                totalUpvotes,
            },
        },
    };
}

// Search for users for the dropdown
export async function searchUsers(query: string): Promise<Partial<UserProfile>[]> {
    if (!query || query.length < 2) return [];

    const supabase = await createClient();
    const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, is_verified, is_streamer")
        .ilike("username", `%${query}%`)
        .order("is_streamer", { ascending: false })
        .order("username", { ascending: true })
        .limit(5);

    return data || [];
}

// Updated return type: Promise<{ builds: WeaponBuild[], totalCount: number }>
export async function getUserBuilds(userId: string, page: number = 1, limit: number = 9): Promise<{ builds: WeaponBuild[], totalCount: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("builds")
        .select("*, profiles:user_id(username, is_streamer)", { count: 'exact' })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("User builds error:", error);
        return { builds: [], totalCount: 0 };
    }

    // Fetch user specific interactions if logged in
    let userVotes: any[] = [];
    let userBookmarks: any[] = [];

    if (user && data.length > 0) {
        const buildIds = data.map((b: any) => b.id);
        const votesRes = await supabase.from("build_votes").select("build_id, vote_type").eq("user_id", user.id).in("build_id", buildIds);
        const booksRes = await supabase.from("bookmarks").select("build_id").eq("user_id", user.id).in("build_id", buildIds);
        userVotes = votesRes.data || [];
        userBookmarks = booksRes.data || [];
    }

    // Check User Role for Permissions
    let isAdmin = false;
    let isMod = false;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin, is_moderator")
            .eq("id", user.id)
            .single();
        isAdmin = profile?.is_admin || false;
        isMod = profile?.is_moderator || false;
    }

    const builds = data.map((b: any) => {
        const myVote = userVotes.find(v => v.build_id === b.id)?.vote_type || null;
        const isBookmarked = userBookmarks.some(bk => bk.build_id === b.id);
        const canDelete = user ? (user.id === userId || isAdmin || isMod) : false;

        // Dynamic Tag Injection for Streamers
        let displayTags = b.tags || [];
        // Handle array vs object response from Supabase just in case, though :user_id usually returns object
        const profileData = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;

        if (profileData?.is_streamer && !displayTags.includes("Streamer Build")) {
            displayTags = [...displayTags, "Streamer Build"];
        }

        return {
            id: b.id,
            title: b.title,
            weaponName: b.weapon_name,
            weaponImage: b.weapon_image || b.image_url,
            price: b.price,
            buildCode: b.build_code,
            stats: {
                v_recoil_control: b.v_recoil_control,
                h_recoil_control: b.h_recoil_control,
                ergonomics: b.ergonomics,
                weapon_stability: b.weapon_stability,
                accuracy: b.accuracy,
                hipfire_stability: b.hipfire_stability,
                effective_range: b.effective_range,
                muzzle_velocity: b.muzzle_velocity,
            },
            tags: displayTags,
            upvotes: b.upvotes,
            downvotes: b.downvotes,
            author: profileData?.username || "Unknown",
            created_at: b.created_at,
            is_bookmarked: isBookmarked,
            user_vote: myVote,
            can_delete: canDelete
        }
    });

    return { builds, totalCount: count || 0 };
}

export async function getUserBookmarkedBuilds(userId: string, page: number = 1, limit: number = 9): Promise<{ builds: WeaponBuild[], totalCount: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("bookmarks")
        .select(`
            build_id,
            builds (
                *,
                profiles:user_id(username, is_streamer)
            )
        `, { count: 'exact' })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("User bookmarks error:", error);
        return { builds: [], totalCount: 0 };
    }

    // Fetch user specific interactions for these bookmarked builds (specifically votes)
    let userVotes: any[] = [];

    // Check Permissions
    let isAdmin = false;
    let isMod = false;
    if (user) {
        // Re-fetch profile for admin check
        const { data: profile } = await supabase.from("profiles").select("is_admin, is_moderator").eq("id", user.id).single();
        isAdmin = profile?.is_admin || false;
        isMod = profile?.is_moderator || false;

        if (data.length > 0) {
            const buildIds = data.map((item: any) => item.builds.id);
            const votesRes = await supabase.from("build_votes").select("build_id, vote_type").eq("user_id", user.id).in("build_id", buildIds);
            userVotes = votesRes.data || [];
        }
    }

    // Map nested build data
    const builds = data.map((item: any) => {
        const b = item.builds;
        const myVote = userVotes.find(v => v.build_id === b.id)?.vote_type || null;
        const canDelete = user ? (user.id === b.user_id || isAdmin || isMod) : false;

        // Dynamic Tag Injection for Streamers
        let displayTags = b.tags || [];
        const profileData = Array.isArray(b.profiles) ? b.profiles[0] : b.profiles;

        if (profileData?.is_streamer && !displayTags.includes("Streamer Build")) {
            displayTags = [...displayTags, "Streamer Build"];
        }

        return {
            id: b.id,
            title: b.title,
            weaponName: b.weapon_name,
            weaponImage: b.weapon_image || b.image_url,
            price: b.price,
            buildCode: b.build_code,
            stats: {
                v_recoil_control: b.v_recoil_control,
                h_recoil_control: b.h_recoil_control,
                ergonomics: b.ergonomics,
                weapon_stability: b.weapon_stability,
                accuracy: b.accuracy,
                hipfire_stability: b.hipfire_stability,
                effective_range: b.effective_range,
                muzzle_velocity: b.muzzle_velocity,
            },
            tags: displayTags,
            upvotes: b.upvotes,
            downvotes: b.downvotes,
            author: profileData?.username || "Unknown",
            created_at: b.created_at,
            is_bookmarked: true, // It is in bookmarks list
            user_vote: myVote,
            can_delete: canDelete
        };
    });

    return { builds, totalCount: count || 0 };
}

export async function updateProfileAction(username: string, avatarUrl: string, bio: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // 1. Check if username is taken (if changed)
    const currentProfile = await supabase.from("profiles").select("username, last_username_change").eq("id", user.id).single();

    if (currentProfile.data?.username !== username) {
        // Enforce 30-day cooldown
        if (currentProfile.data?.last_username_change) {
            const lastChange = new Date(currentProfile.data.last_username_change);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays < 30) {
                return { success: false, error: `You can change your username again in ${30 - diffDays} days.` };
            }
        }

        const { data: existing } = await supabase.from("profiles").select("id").eq("username", username).single();
        if (existing) {
            return { success: false, error: "Username is already taken." };
        }
    }

    // 2. Update Profile Table
    const updateData: any = {
        username,
        avatar_url: avatarUrl,
        bio,
    };

    // Update timestamp if username changed
    if (currentProfile.data?.username !== username) {
        updateData.last_username_change = new Date().toISOString();
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

    if (profileError) {
        return { success: false, error: profileError.message };
    }

    // 3. Sync to Auth Metadata (Important for Middleware/Client checks without fetching DB)
    const { error: authError } = await supabase.auth.updateUser({
        data: { username: username, avatar_url: avatarUrl }
    });

    if (authError) {
        console.error("Failed to sync auth metadata", authError);
        // Don't fail the whole request, profile table is more important source of truth
    }

    revalidatePath("/", "layout"); // Refresh navbar and everything
    return { success: true };
}
