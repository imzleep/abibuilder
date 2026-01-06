"use server";

import { createClient } from "@/lib/supabase/server";
import { Weapon } from "@/types/database";

export async function getWeaponsAction() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("weapons")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching weapons:", error);
        return [];
    }

    return data as Weapon[];
}
