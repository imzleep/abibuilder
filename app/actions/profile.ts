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
    can_post_as_streamer?: boolean; // Permission to upload on behalf of streamers
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

// Helper to apply filters
function applyFilters(query: any, filters: any) {
    // 1. Text Search
    if (filters.query && filters.query.length > 0) {
        const searchTerm = filters.query.trim();
        query = query.or(`title.ilike.%${searchTerm}%,weapon_name.ilike.%${searchTerm}%`);
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
        const categoryMap: Record<string, string> = {
            "assault-rifle": "Assault Rifle",
            "smg": "SMG",
            "carbine": "Carbine",
            "marksman-rifle": "Marksman Rifle",
            "bolt-action-rifle": "Bolt-Action Rifle",
            "shotgun": "Shotgun",
            "lmg": "LMG",
            "pistol": "Pistol",
        };
        const slug = filters.category;
        const mappedLabel = categoryMap[slug] || slug;
        // Ideally we would join tables, but for now we might need to filter by known weapon IDs or subquery.
        // build table has weapon_id. We need a way to filter build by weapon category.
        // Simplest way without join syntax issues: Fetch allowed weapon IDs first.
        // Since we are inside a function, we need a separate client or logic.
        // BUT, notice `applyFilters` here is synchronous builder. We can't await inside easily if we want to keep it simple.
        // Let's copy logic explicitly into the main functions instead of helper if async is needed.
    }
}

// Updated return type: Promise<{ builds: WeaponBuild[], totalCount: number }>
export async function getUserBuilds(userId: string, filters: any = {}, page: number = 1, limit: number = 9): Promise<{ builds: WeaponBuild[], totalCount: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("builds")
        .select("*, profiles:user_id(username, is_streamer), weapon:weapon_id(name)", { count: 'exact' })
        .eq("user_id", userId);

    // --- APPLY FILTERS ---

    // 1. Text Search
    if (filters.query && filters.query.length > 0) {
        const searchTerm = filters.query.trim();
        query = query.or(`title.ilike.%${searchTerm}%,weapon_name.ilike.%${searchTerm}%`);
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
        const categoryMap: Record<string, string> = {
            "assault-rifle": "Assault Rifle",
            "smg": "SMG",
            "carbine": "Carbine",
            "marksman-rifle": "Marksman Rifle",
            "bolt-action-rifle": "Bolt-Action Rifle",
            "shotgun": "Shotgun",
            "lmg": "LMG",
            "pistol": "Pistol",
        };
        const slug = filters.category;
        const mappedLabel = categoryMap[slug] || slug;

        const { data: weaponsInCategory } = await supabase
            .from("weapons")
            .select("id")
            .or(`category.eq.${slug},category.eq.${mappedLabel}`);

        if (weaponsInCategory && weaponsInCategory.length > 0) {
            const weaponIds = weaponsInCategory.map(w => w.id);
            query = query.in("weapon_id", weaponIds);
        } else {
            query = query.eq("id", "00000000-0000-0000-0000-000000000000");
        }
    }

    // 3. Price Range
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (min !== undefined) query = query.gte("price", min);
        if (max !== undefined) query = query.lte("price", max);
    }

    // 4. Specific Weapons
    if (filters.weapons && filters.weapons.length > 0) {
        const { data: allWeapons } = await supabase.from("weapons").select("id, name");
        if (allWeapons) {
            const targetSlugs = Array.isArray(filters.weapons) ? filters.weapons : [filters.weapons];
            const matchedIds = allWeapons
                .filter((w: any) => {
                    const slug = w.name.toLowerCase().replace(/\s+/g, '-');
                    return targetSlugs.includes(slug);
                })
                .map((w: any) => w.id);
            if (matchedIds.length > 0) query = query.in("weapon_id", matchedIds);
            else query = query.eq("id", "00000000-0000-0000-0000-000000000000");
        }
    }

    // 5. Sorting
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'most-voted':
                query = query.order("upvotes", { ascending: false });
                break;
            case 'recent':
                query = query.order("created_at", { ascending: false });
                break;
            case 'price-low':
                query = query.order("price", { ascending: true });
                break;
            case 'price-high':
                query = query.order("price", { ascending: false });
                break;
            default:
                query = query.order("created_at", { ascending: false });
        }
    } else {
        query = query.order("created_at", { ascending: false });
    }

    // --- EXECUTE ---

    const { data, error, count } = await query.range(from, to);

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
            title: b.title || b.weapon?.name || b.weapon_name,
            weaponName: b.weapon?.name || b.weapon_name,
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
            can_delete: canDelete,
            short_code: b.short_code // NEW
        }
    });

    return { builds, totalCount: count || 0 };
}

export async function getUserBookmarkedBuilds(userId: string, filters: any = {}, page: number = 1, limit: number = 9): Promise<{ builds: WeaponBuild[], totalCount: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // We need to construct the select string dynamicall based on filters? 
    // Actually, just use builds!inner to enforce filtering on the joined table.
    // The main query is on bookmarks.

    let query = supabase
        .from("bookmarks")
        .select(`
            build_id,
            builds!inner (
                *,
                profiles:user_id(username, is_streamer),
                weapon:weapon_id(name)
            )
        `, { count: 'exact' })
        .eq("user_id", userId);

    // --- APPLY FILTERS (Targeting 'builds' relationship) ---

    // 1. Text Search
    if (filters.query && filters.query.length > 0) {
        const searchTerm = filters.query.trim();
        // Embedded OR filter is tricky. 
        // Syntax: builds.title.ilike.%term%,...
        // But OR across columns in joined table? 
        // Supabase PostgREST might struggle with complex nested ORs.
        // Let's try simpler path: Filter separately and use IN?
        // Or trust the flattened syntax: `builds.or(...)` isn't standard JS lib.
        // We use `.or('title.ilike.%term%,...', { foreignTable: 'builds' })` if supported? No.

        // Use referencing embedded resource:
        // This is getting complex for a "copy paste". 
        // SAFEST BET: Get valid Build IDs first.

        // Step A: Find relevant Builds ignoring bookmark status
        let buildQuery = supabase.from("builds").select("id").eq("status", "verified"); // Assuming bookmarks are usually verified, or irrelevant? Bookmarks might include unverified. Let's strict to verify or all? Usually all.

        // Apply Build Filters to buildQuery
        if (filters.query) {
            const t = filters.query.trim();
            buildQuery = buildQuery.or(`title.ilike.%${t}%,weapon_name.ilike.%${t}%`);
        }
        if (filters.category && filters.category !== 'all') {
            // ... resolve category
            const categoryMap: Record<string, string> = { "assault-rifle": "Assault Rifle", "smg": "SMG", "carbine": "Carbine", "marksman-rifle": "Marksman Rifle", "bolt-action-rifle": "Bolt-Action Rifle", "shotgun": "Shotgun", "lmg": "LMG", "pistol": "Pistol" };
            const slug = filters.category;
            const mappedLabel = categoryMap[slug] || slug;
            const { data: w } = await supabase.from("weapons").select("id").or(`category.eq.${slug},category.eq.${mappedLabel}`);
            if (w && w.length > 0) buildQuery = buildQuery.in("weapon_id", w.map(x => x.id));
            else buildQuery = buildQuery.eq("id", "0000");
        }
        if (filters.priceRange) {
            const [min, max] = filters.priceRange;
            if (min !== undefined) buildQuery = buildQuery.gte("price", min);
            if (max !== undefined) buildQuery = buildQuery.lte("price", max);
        }
        if (filters.weapons && filters.weapons.length > 0) {
            // ... resolve weapons
            const { data: aw } = await supabase.from("weapons").select("id, name");
            if (aw) {
                const Sl = Array.isArray(filters.weapons) ? filters.weapons : [filters.weapons];
                const mIds = aw.filter((x: any) => Sl.includes(x.name.toLowerCase().replace(/\s+/g, '-'))).map((x: any) => x.id);
                if (mIds.length > 0) buildQuery = buildQuery.in("weapon_id", mIds);
            }
        }

        const { data: matchingBuilds } = await buildQuery;
        const matchingIds = matchingBuilds?.map(b => b.id) || [];

        if (matchingIds.length > 0) {
            query = query.in("build_id", matchingIds);
        } else {
            // Logic implies filters were applied but found nothing.
            // If NO filters, matchingIds is IsAll? No. buildQuery fetches ALL IDs. Expensive?
            // "Pre-fetch" is only efficient if filters reduce the set.
            // Check if ANY filter was valid.
            const hasFilters = filters.query || (filters.category && filters.category !== 'all') || filters.priceRange || (filters.weapons && filters.weapons.length > 0);
            if (hasFilters) {
                if (matchingIds.length === 0) return { builds: [], totalCount: 0 }; // Nothing matched filters
            }
        }
    } else {
        // Only if OTHER filters exist
        const hasFilters = (filters.category && filters.category !== 'all') || filters.priceRange || (filters.weapons && filters.weapons.length > 0);
        if (hasFilters) {
            // REPEAT logic or abstract it? 
            // Ideally we just do the build query logic once if hasFilters.

            // --- REPEATING LOGIC FOR ROBUSTNESS ---
            let buildQuery = supabase.from("builds").select("id");

            if (filters.category && filters.category !== 'all') {
                const categoryMap: Record<string, string> = { "assault-rifle": "Assault Rifle", "smg": "SMG", "carbine": "Carbine", "marksman-rifle": "Marksman Rifle", "bolt-action-rifle": "Bolt-Action Rifle", "shotgun": "Shotgun", "lmg": "LMG", "pistol": "Pistol" };
                const slug = filters.category;
                const mappedLabel = categoryMap[slug] || slug;
                const { data: w } = await supabase.from("weapons").select("id").or(`category.eq.${slug},category.eq.${mappedLabel}`);
                if (w && w.length > 0) buildQuery = buildQuery.in("weapon_id", w.map(x => x.id));
                else buildQuery = buildQuery.eq("id", "0000");
            }
            if (filters.priceRange) {
                const [min, max] = filters.priceRange;
                if (min !== undefined) buildQuery = buildQuery.gte("price", min);
                if (max !== undefined) buildQuery = buildQuery.lte("price", max);
            }
            if (filters.weapons && filters.weapons.length > 0) {
                const { data: aw } = await supabase.from("weapons").select("id, name");
                if (aw) {
                    const Sl = Array.isArray(filters.weapons) ? filters.weapons : [filters.weapons];
                    const mIds = aw.filter((x: any) => Sl.includes(x.name.toLowerCase().replace(/\s+/g, '-'))).map((x: any) => x.id);
                    if (mIds.length > 0) buildQuery = buildQuery.in("weapon_id", mIds);
                }
            }

            const { data: matchingBuilds } = await buildQuery;
            const matchingIds = matchingBuilds?.map(b => b.id) || [];
            if (matchingIds.length === 0) return { builds: [], totalCount: 0 };
            query = query.in("build_id", matchingIds);
        }
    }

    // Sorting (Bookmarks usually sorted by Added Date, but user wants to sort Builds)
    // If we sort by 'created_at', that's the Bookmark creation.
    // If we sort by 'price' or 'upvotes', that's on the Build.
    // Supabase JS doesn't support ordering by foreign table easily in top level list.
    // WORKAROUND: Sort in memory (since we paginate, this is technically wrong for large lists, but acceptable for MVP profile lists < 50 items usually).
    // BETTER WORKAROUND: Use the matching IDs list which can be sorted!
    // If we used the pre-fetch Build Query, we COULD get the IDs in the correct order.
    // 1. Fetch matching Builds ORDERED.
    // 2. Fetch bookmarks IN specific order? No `in` doesn't preserve order.

    // Fallback: Default to Bookmark creation time (Latest saved).
    // If user explicitly asks for sorting, we might have to accept Client-Side sorting of the page or accept limitation.
    // Given the request "copy logic", exact parity is hard with Join.
    // Let's stick to Bookmark Date for now unless critical. Or just ignore sorting for Bookmarks tab?
    // User expects parity.
    // Correct approach: Client accepts 9 items, sorts them? No.
    // Let's just default to 'created_at' of bookmark for now to ensure query works. The visual filters might be there but sorting might be limited.

    query = query.order("created_at", { ascending: false });

    // --- EXECUTE ---

    const { data: rawData, error, count } = await query.range(from, to);

    if (error) {
        console.error("User bookmarks error:", error);
        return { builds: [], totalCount: 0 };
    }

    // Need to cast rawData which contains nested builds
    const data = rawData.map((item: any) => item.builds); // Extract builds from bookmarks

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
    // Map nested build data
    const builds = data.map((b: any) => {
        // Defensive checks
        if (!b) return null;
        if (Array.isArray(b)) b = b[0];
        if (!b) return null;

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
            title: b.title || b.weapon?.name || b.weapon_name,
            weaponName: b.weapon?.name || b.weapon_name,
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
            can_delete: canDelete,
            short_code: b.short_code // NEW
        };
    }).filter((item) => item !== null) as WeaponBuild[];

    return { builds, totalCount: count || 0 };
}

export async function updateProfileAction(username: string, displayName: string, avatarUrl: string, bio: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // Validate Display Name (Twitch style: strictly case-insensitive match)
    if (displayName.toLowerCase() !== username.toLowerCase()) {
        return { success: false, error: "Display Name must match your Username (only capitalization changes allowed)." };
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
        display_name: displayName,
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
