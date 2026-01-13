"use server";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

const getCachedStats = unstable_cache(
    async () => {
        // Use stateless client for caching to avoid cookies() error
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Run queries in parallel
        const [
            { count: buildCount },
            { count: userCount },
            { count: voteCount }
        ] = await Promise.all([
            // Use count: 'exact' or 'estimated'. Estimated might return null for small tables in postgres sometimes?
            // Safer to just handle null result
            supabase.from("builds").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("build_votes").select("*", { count: "exact", head: true })
        ]);

        return {
            totalBuilds: buildCount || 0,
            activeUsers: userCount || 0,
            weapons: 70,
            totalVotes: voteCount || 0,
        };
    },
    ["site-stats"],
    {
        revalidate: 3600,
        tags: ["stats"]
    }
);

export async function getSiteStats() {
    try {
        const data = await getCachedStats();
        return data;
    } catch (error) {
        console.error("Stats fetch error:", error);
        // Fallback to zeros if something explodes
        return {
            totalBuilds: 0,
            activeUsers: 0,
            weapons: 70,
            totalVotes: 0
        };
    }
}
