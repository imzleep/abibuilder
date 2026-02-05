import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600; // 1 Hour Cache

// Limit per sitemap chunk (Safe margin below 50k Google limit)
const PER_SITEMAP_LIMIT = 20000;

export async function generateSitemaps() {
    const supabase = await createClient();
    // Head request to get total count
    const { count } = await supabase
        .from('builds')
        .select('*', { count: 'exact', head: true });

    const totalBuilds = count || 0;
    const numSitemaps = Math.max(1, Math.ceil(totalBuilds / PER_SITEMAP_LIMIT));

    // Return array of IDs: [{ id: 0 }, { id: 1 }, ...]
    return Array.from({ length: numSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://abibuilder.com';
    const supabase = await createClient();

    // 1. Static Routes (Only included in first sitemap chunk)
    let routes: MetadataRoute.Sitemap = [];

    if (id === 0) {
        routes = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/builds`,
                lastModified: new Date(),
                changeFrequency: 'hourly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/login`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/randomizer`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/media-kit`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
        ];

        // 1.5 Profiles (Only in first chunk for now, limit 10k to be safe)
        try {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('username, created_at')
                .order('is_streamer', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(10000);

            const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
                url: `${baseUrl}/profile/${profile.username}`,
                lastModified: new Date(profile.created_at),
                changeFrequency: 'daily',
                priority: 0.7,
            }));

            routes = [...routes, ...profileRoutes];
        } catch (e) {
            console.error("Profile Sitemap Error:", e);
        }
    }

    // 2. Paginated Builds
    try {
        const from = id * PER_SITEMAP_LIMIT;
        const to = from + PER_SITEMAP_LIMIT - 1;

        // Lightweight Query: Select ONLY needed columns
        const { data: builds } = await supabase
            .from('builds')
            .select('id, short_code, created_at')
            .range(from, to)
            .order('created_at', { ascending: false });

        const buildRoutes: MetadataRoute.Sitemap = (builds || []).map((build) => ({
            url: `${baseUrl}/builds/${build.short_code || build.id}`,
            lastModified: new Date(build.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...routes, ...buildRoutes];
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        // Fallback to static routes
        return routes;
    }
}
