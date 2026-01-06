"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface SaveBuildParams {
    weapon_id: string;
    title: string;
    build_code: string;
    stats: { [key: string]: number };
}

export async function saveBuildAction(params: SaveBuildParams) {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to save a build." };
    }

    // 2. Insert Build
    const { data, error } = await supabase
        .from("builds")
        .insert({
            user_id: user.id,
            weapon_id: params.weapon_id,
            title: params.title,
            build_code: params.build_code,
            stats: params.stats,
            status: "pending", // Default status
        })
        .select("id")
        .single();

    if (error) {
        console.error("Error saving build:", error);
        return { success: false, error: "Database error. Please try again." };
    }

    // 3. Revalidate & Return (Ideally redirect)
    revalidatePath("/");
    return { success: true, buildId: data.id };
}
