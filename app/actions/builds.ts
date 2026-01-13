"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WeaponBuild } from "@/types";

export async function getWeaponsAction() {
    const supabase = await createClient();

    // Check if table exists and has data (resilience)
    const { data, error } = await supabase
        .from("weapons")
        .select("*")
        .order("name");

    if (error) {
        console.error("Fetch Weapons Error:", error);
        return [];
    }

    const mappedWeapons = data.map((w: any) => ({
        id: w.id, // Add ID
        label: w.name,
        value: w.name.toLowerCase().replace(/\s+/g, '-'),
        category: w.category
    }));

    // Deduplicate by label/name
    const uniqueWeapons = mappedWeapons.filter((weapon: any, index: number, self: any[]) =>
        index === self.findIndex((w: any) => w.label === weapon.label)
    );

    return uniqueWeapons;
}


// CREATE BUILD
export async function createBuildAction(formData: any) {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to upload a build." };
    }

    // 2. Validate Data (Basic)
    const {
        buildName,
        weaponName, // This might need mapping to weapon_id
        buildCode,
        avgPrice,
        description,
        imageUrl, // New
        tags,
        stats,
        authorId, // NEW: Optional author ID for admin impersonation
    } = formData;

    if (!buildName || !weaponName || !buildCode) {
        return { success: false, error: "Missing required fields." };
    }

    // 2.5 Admin Impersonation Check
    let targetUserId = user.id;

    if (authorId) {
        // Verify current user is admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

        if (profile?.is_admin) {
            targetUserId = authorId;
        } else {
            // Silently fail or warn? Let's just ignore and use own ID to be safe, or throw error.
            // Throwing error is better to prevent confusion.
            return { success: false, error: "Unauthorized: only admins can post as other users." };
        }
    }

    // 2.6 Auto-Add "Streamer Build" tag if author is a streamer
    const { data: authorProfile } = await supabase
        .from("profiles")
        .select("is_streamer")
        .eq("id", targetUserId)
        .single();

    console.log(`[CreateBuild] TargetUser: ${targetUserId}, IsStreamer: ${authorProfile?.is_streamer}`);

    let processedTags = Array.isArray(tags) ? [...tags] : [];
    if (authorProfile?.is_streamer) {
        if (!processedTags.includes("Streamer Build")) {
            processedTags.push("Streamer Build");
        }
    }

    // 3. Find Weapon ID (since database uses ID relation)
    // 3. Find Weapon (Prefer ID, Fallback to Name)


    let query = supabase.from("weapons").select("id, name");

    if (formData.weaponId) {
        query = query.eq("id", formData.weaponId);
    } else {
        query = query.eq("name", weaponName).limit(1);
    }

    const { data: weaponData, error: weaponError } = await query.single();

    if (weaponError || !weaponData) {
        console.error("Weapon Lookup Error:", weaponError);
        return { success: false, error: `Invalid weapon selected: ${weaponName} (ID: ${formData.weaponId || 'None'}). DB Error: ${weaponError?.message}` };
    }

    // 4. Insert Build
    // 4. Insert Build
    const { data, error } = await supabase
        .from("builds")
        .insert({
            user_id: targetUserId,
            // Core
            title: buildName,
            description,
            build_code: buildCode,
            price: parseInt(avgPrice) || 0,
            image_url: imageUrl, // Save uploaded image URL

            // Relation
            weapon_id: weaponData.id,
            weapon_name: weaponData.name, // Denormalized
            weapon_image: null, // Weapon table has no image_url column currently

            // Stats (Flattened)
            v_recoil_control: stats.v_recoil_control,
            h_recoil_control: stats.h_recoil_control,
            ergonomics: stats.ergonomics,
            weapon_stability: stats.weapon_stability,
            accuracy: stats.accuracy,
            hipfire_stability: stats.hipfire_stability,
            effective_range: stats.effective_range,
            muzzle_velocity: stats.muzzle_velocity,

            // Meta
            tags: processedTags,
            status: "pending", // Default to pending for Admin review
            // Let's set 'verified' for MVP, or 'pending' if Admin flow exists. 
            // Admin flow existed! Let's keep 'pending'.
        })
        .select()
        .single();

    if (error) {
        console.error("Create Build Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/builds");
    return { success: true, buildId: data.id };
}

// GET BUILDS (with filters)
export async function getBuildsAction(filters: any = {}, page: number = 1, limit: number = 9) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Prepare Base Query
    let query = supabase
        .from("builds")
        .select(`
            *,
            profiles:user_id (username, is_streamer)
        `, { count: 'exact' })
        .eq("status", "verified"); // Only verified

    // 2. Handle Text Search (Title, Weapon, Author)
    if (filters.query && filters.query.length > 0) {
        const searchTerm = filters.query.trim();

        // A. Find users matching the search term
        const { data: matchedUsers } = await supabase
            .from("profiles")
            .select("id")
            .ilike("username", `%${searchTerm}%`);

        const matchedUserIds = matchedUsers?.map(u => u.id) || [];

        // B. Construct OR filter
        // Logic: Title matches OR Weapon Name matches OR Author ID is in matchedUserIds
        let orConditions = `title.ilike.%${searchTerm}%,weapon_name.ilike.%${searchTerm}%`;

        if (matchedUserIds.length > 0) {
            // Note: Supabase 'in' filter inside 'or' string syntax: column.in.(val1,val2)
            // But 'in' with a long list inside 'or' string can be tricky.
            // Safer syntax: `user_id.in.(${matchedUserIds.join(',')})`
            orConditions += `,user_id.in.(${matchedUserIds.join(',')})`;
        }

        query = query.or(orConditions);
    }

    // 3. Category Filter
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

        // Query for either slug or label to be safe
        const { data: weaponsInCategory } = await supabase
            .from("weapons")
            .select("id")
            .or(`category.eq.${slug},category.eq.${mappedLabel}`);

        if (weaponsInCategory && weaponsInCategory.length > 0) {
            const weaponIds = weaponsInCategory.map(w => w.id);
            query = query.in("weapon_id", weaponIds);
        } else {
            // If no weapons found in category, return empty
            // or just force a condition that fails
            query = query.eq("id", "00000000-0000-0000-0000-000000000000");
        }
    }

    // 4. Streamer Filter (Placeholder - assuming is_streamer on profile)
    // If we want builds by streamers, we filter by author's 'is_streamer' status
    if (filters.streamer && filters.streamer !== 'all') {
        // Specific streamer username? or all streamers?
        // If filter.streamer is a specific username like 'shroud'
        if (filters.streamer !== 'all-streamers') { // Assuming 'all' means all builds, specific val means specific user
            // Wait, the UI has 'all' and specific names.
            // If filter is specific username
            const { data: streamerUser } = await supabase.from("profiles").select("id").ilike("username", filters.streamer).single();
            if (streamerUser) {
                query = query.eq("user_id", streamerUser.id);
            } else {
                query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // Not found
            }
        }
    }

    // 4.5 Specific Weapons Filter (Server-Side)
    if (filters.weapons && filters.weapons.length > 0) {
        // filters.weapons is an array of slugs (e.g. ['ak-47', 'm4a1'])
        // We need to map these slugs back to weapon IDs.

        // Fetch all weapons to resolve slugs (efficient enough for <100 items)
        const { data: allWeapons } = await supabase.from("weapons").select("id, name");

        if (allWeapons && allWeapons.length > 0) {
            const targetSlugs = Array.isArray(filters.weapons) ? filters.weapons : [filters.weapons];

            const matchedIds = allWeapons
                .filter((w: any) => {
                    const slug = w.name.toLowerCase().replace(/\s+/g, '-');
                    return targetSlugs.includes(slug);
                })
                .map((w: any) => w.id);

            if (matchedIds.length > 0) {
                query = query.in("weapon_id", matchedIds);
            } else {
                query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // No weapons matched
            }
        }
    }


    // 5. Tag Filter
    if (filters.tag && filters.tag !== 'all') {
        if (filters.tag === 'streamer') {
            // Special handling for Streamer Builds: Filter by author role "is_streamer"
            // Fetch all streamer IDs first
            const { data: streamers } = await supabase
                .from("profiles")
                .select("id")
                .eq("is_streamer", true);

            if (streamers && streamers.length > 0) {
                const streamerIds = streamers.map(s => s.id);
                query = query.in("user_id", streamerIds);
            } else {
                query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // No streamers found
            }
        } else {
            let searchTag = filters.tag;
            // Simple mapping from slug to likely Display Name stored in DB
            switch (filters.tag) {
                case 'zero-recoil': searchTag = 'Zero Recoil'; break;
                case 'meta': searchTag = 'META'; break;
                case 'budget': searchTag = 'Budget'; break;
                case 'hipfire': searchTag = 'Hip Fire Build'; break;
                case 'troll': searchTag = 'Troll Build'; break;
                // case 'streamer': handled above
            }
            // Use 'contains' operator for array column
            query = query.contains('tags', [searchTag]);
        }
    }

    // 6. Sort
    if (filters.sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
    } else if (filters.sortBy === 'most-voted') {
        query = query.order('upvotes', { ascending: false })
            .order('created_at', { ascending: false });
    } else if (filters.sortBy === 'price-low') {
        query = query.order('price', { ascending: true })
            .order('upvotes', { ascending: false });
    } else if (filters.sortBy === 'price-high') {
        query = query.order('price', { ascending: false })
            .order('upvotes', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false }); // default
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Apply range
    const { data, error, count } = await query.range(from, to);

    if (error) {
        console.error("Get Builds Error:", error);
        return { builds: [], totalCount: 0 };
    }

    // Fetch user specific interactions if logged in
    let userVotes: any[] = [];
    let userBookmarks: any[] = [];

    if (user && data && data.length > 0) {
        const buildIds = data.map((b: any) => b.id);
        const votesRes = await supabase.from("build_votes").select("build_id, vote_type").eq("user_id", user.id).in("build_id", buildIds);
        const booksRes = await supabase.from("bookmarks").select("build_id").eq("user_id", user.id).in("build_id", buildIds);
        userVotes = votesRes.data || [];
        userBookmarks = booksRes.data || [];
    }

    // 6. Check User Role for Permissions (Admin/Mod)
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

    const builds = (data || []).map((b: any) => {
        const myVote = userVotes.find(v => v.build_id === b.id)?.vote_type || null;
        const isBookmarked = userBookmarks.some(bk => bk.build_id === b.id);
        const canDelete = user ? (user.id === b.user_id || isAdmin || isMod) : false;

        // Dynamic Tag Injection for Streamers
        let displayTags = b.tags || [];
        if (b.profiles?.is_streamer && !displayTags.includes("Streamer Build")) {
            displayTags = [...displayTags, "Streamer Build"];
        }

        return {
            id: b.id,
            title: b.title || b.weapon_name,
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
            upvotes: b.upvotes || 0,
            downvotes: b.downvotes || 0,
            author: b.profiles?.username || "Unknown",
            created_at: b.created_at,
            is_bookmarked: isBookmarked,
            user_vote: myVote,
            can_delete: canDelete
        };
    });

    return { builds, totalCount: count || 0 };
}

export async function deleteBuildAction(buildId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to delete a build." };
    }

    // 1. Fetch Build to check ownership
    const { data: build, error: fetchError } = await supabase
        .from("builds")
        .select("user_id")
        .eq("id", buildId)
        .single();

    if (fetchError || !build) {
        return { success: false, error: "Build not found." };
    }

    // 2. Check Permissions (Owner OR Admin OR Mod)
    let isAuthorized = build.user_id === user.id;

    if (!isAuthorized) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin, is_moderator")
            .eq("id", user.id)
            .single();

        if (profile?.is_admin || profile?.is_moderator) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        return { success: false, error: "Unauthorized to delete this build." };
    }

    // 3. Delete
    const { error: deleteError, count } = await supabase
        .from("builds")
        .delete({ count: 'exact' })
        .eq("id", buildId);

    if (deleteError) {
        return { success: false, error: deleteError.message };
    }

    if (count === 0) {
        return { success: false, error: "Failed to delete: Access denied by RLS policy." };
    }

    // 4. Revalidate
    revalidatePath("/builds");
    revalidatePath("/");
    revalidatePath("/profile", "layout"); // Revalidate all profiles roughly

    return { success: true };
}
