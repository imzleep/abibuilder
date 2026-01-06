"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyBuildAction(buildId: string, status: "verified" | "rejected") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // TODO: Add Real Admin Check Here
    // For MVP, assuming any logged in user on /admin/verify is authorized (DANGEROUS logic but fine for dev demo)
    // In production, check user.email === process.env.ADMIN_EMAIL

    const { error } = await supabase
        .from("builds")
        .update({ status })
        .eq("id", buildId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/verify");
    revalidatePath("/");
    return { success: true };
}
