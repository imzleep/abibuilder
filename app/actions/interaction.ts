"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleVoteAction(buildId: string, type: 'up' | 'down') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Must be logged in to vote" };
    }

    // 1. Check existing vote
    const { data: existingVote } = await supabase
        .from("build_votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("build_id", buildId)
        .single();

    if (existingVote) {
        if (existingVote.vote_type === type) {
            // Remove vote (toggle off)
            await supabase.from("build_votes").delete().eq("id", existingVote.id);
        } else {
            // Change vote (swap)
            await supabase.from("build_votes").update({ vote_type: type }).eq("id", existingVote.id);
        }
    } else {
        // New vote
        await supabase.from("build_votes").insert({ user_id: user.id, build_id: buildId, vote_type: type });
    }

    // Sync counts
    await updateBuildCounts(supabase, buildId);

    revalidatePath("/builds");
    revalidatePath("/");
    return { success: true };
}

// Helper for RPC calls (assuming we might need them, or manual update)
// Actually, manual update is safer without specific RPCs setup.
// Let's rewrite using direct UPDATE for simplicity if RPCs don't exist.
// Since we didn't create RPCs in the SQL, let's do direct SQL updates or fetch-calculate-update (less safe but OK for now)
// Better: Use `increment` if Supabase client supported it, but it doesn't directly.
// Best approach without RPC: Just rely on COUNT(*) from build_votes table to display, OR update columns manually.
// For performance, let's update columns manually.

async function updateBuildCounts(supabase: any, buildId: string) {
    // Recalculate directly from votes table
    const { count: up } = await supabase.from("build_votes").select("*", { count: 'exact', head: true }).eq("build_id", buildId).eq("vote_type", "up");
    const { count: down } = await supabase.from("build_votes").select("*", { count: 'exact', head: true }).eq("build_id", buildId).eq("vote_type", "down");

    await supabase.from("builds").update({ upvotes: up || 0, downvotes: down || 0 }).eq("id", buildId);
}

// Redefining Export with safer logic
export async function handleVote(buildId: string, type: 'up' | 'down') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Login required" };

    const { data: existing } = await supabase.from("build_votes").select("*").eq("user_id", user.id).eq("build_id", buildId).single();

    if (existing) {
        if (existing.vote_type === type) {
            await supabase.from("build_votes").delete().eq("id", existing.id);
        } else {
            await supabase.from("build_votes").update({ vote_type: type }).eq("id", existing.id);
        }
    } else {
        await supabase.from("build_votes").insert({ user_id: user.id, build_id: buildId, vote_type: type });
    }

    // Sync counts
    await updateBuildCounts(supabase, buildId);

    revalidatePath("/");
    revalidatePath("/builds");
    return { success: true };
}


export async function toggleBookmarkAction(buildId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Login required" };

    const { data: existing } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).eq("build_id", buildId).single();

    if (existing) {
        await supabase.from("bookmarks").delete().eq("id", existing.id);
    } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, build_id: buildId });
    }

    revalidatePath("/");
    revalidatePath("/builds");
    revalidatePath("/profile");
    return { success: true };
}
