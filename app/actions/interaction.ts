"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { getAdminClient } from "@/lib/supabase/admin";

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

    // Sync counts (bypass RLS)
    await updateBuildCounts(buildId);

    revalidatePath("/builds");
    revalidatePath("/");
    return { success: true };
}

async function updateBuildCounts(buildId: string) {
    const supabaseAdmin = await getAdminClient();

    // Recalculate directly from votes table
    // Note: We can use supabaseAdmin for reading votes too if RLS blocks reading others' votes? 
    // Usually reading is Public, but let's be safe and use Admin for everything in this maintenance task.
    const { count: up } = await supabaseAdmin.from("build_votes").select("*", { count: 'exact', head: true }).eq("build_id", buildId).eq("vote_type", "up");
    const { count: down } = await supabaseAdmin.from("build_votes").select("*", { count: 'exact', head: true }).eq("build_id", buildId).eq("vote_type", "down");

    await supabaseAdmin.from("builds").update({ upvotes: up || 0, downvotes: down || 0 }).eq("id", buildId);
}

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
    await updateBuildCounts(buildId);

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
