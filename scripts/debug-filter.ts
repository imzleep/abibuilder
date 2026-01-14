
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function debugFilter() {
    console.log("--- DEBUGGING WEAPON FILTER 'ZC807' ---");

    // 1. Fetch All Weapons
    const { data: allWeapons, error: wError } = await supabase.from("weapons").select("id, name");
    if (wError) { console.error("Weapon Fetch Error:", wError); return; }

    console.log(`Fetched ${allWeapons.length} weapons.`);

    // 2. Simulate Filter Logic
    const targetSlug = "zc807";
    console.log(`Target Slug: '${targetSlug}'`);

    const matched = allWeapons.find((w: any) => {
        const slug = w.name.toLowerCase().replace(/\s+/g, '-');
        if (slug === targetSlug) {
            console.log(`MATCH FOUND! Name: '${w.name}' -> Slug: '${slug}' -> ID: ${w.id}`);
            return true;
        }
        return false;
    });

    if (!matched) {
        console.log("NO MATCH found in weapons list.");
        // Print close matches?
        allWeapons.forEach((w: any) => {
            if (w.name.toLowerCase().includes('zc') || w.name.toLowerCase().includes('807')) {
                const s = w.name.toLowerCase().replace(/\s+/g, '-');
                console.log(`Close Match candidate: '${w.name}' (${s})`);
            }
        });
        return;
    }

    // 3. Check Builds with this ID
    const { count, error: bError } = await supabase
        .from("builds")
        .select("*", { count: 'exact', head: true })
        .eq("weapon_id", matched.id);

    if (bError) { console.error("Build Query Error:", bError); return; }

    console.log(`Builds found with weapon_id '${matched.id}': ${count}`);
}

debugFilter();
