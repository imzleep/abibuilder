import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://abibuilder.com';
    const supabase = await createClient();

    // 1. Static Routes
    const routes: MetadataRoute.Sitemap = [
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
    ];

    try {
        // 2. Fetch Recent Builds (Limit to 100 to avoid Edge Timeout)
        const { data: builds } = await supabase
            .from('builds')
            .select('id, created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        const buildRoutes: MetadataRoute.Sitemap = (builds || []).map((build) => ({
            url: `${baseUrl}/builds/${build.id}`,
            lastModified: new Date(build.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 3. Fetch Active Profiles (Limit to 50)
        const { data: profiles } = await supabase
            .from('profiles')
            .select('username, created_at')
            .limit(50);

        const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
            url: `${baseUrl}/profile/${profile.username}`,
            lastModified: new Date(profile.created_at),
            changeFrequency: 'daily',
            priority: 0.7,
        }));

        return [...routes, ...buildRoutes, ...profileRoutes];
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        // Fallback to static routes if DB fails (prevents 500 Error)
        return routes;
    }
}
