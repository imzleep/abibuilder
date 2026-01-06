"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmarkAction(buildId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Please login to bookmark." };
    }

    // Check if exists
    const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("build_id", buildId)
        .single();

    if (existing) {
        // Remove
        await supabase.from("bookmarks").delete().eq("id", existing.id);
    } else {
        // Add
        await supabase.from("bookmarks").insert({
            user_id: user.id,
            build_id: buildId,
        });
    }

    revalidatePath("/");
    revalidatePath("/profile");
    return { success: true };
}
