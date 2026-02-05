import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600; // 1 Hour Cache

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://abibuilder.com';
    const supabase = await createClient();

    // 1. Static Routes
    let routes: MetadataRoute.Sitemap = [
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

    try {
        // 2. Fetch Profiles (Prioritize Streamers)
        // Limit to 1000 for now to keep sitemap manageable without pagination
        const { data: profiles } = await supabase
            .from('profiles')
            .select('username, created_at')
            .order('is_streamer', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(1000);

        const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
            url: `${baseUrl}/profile/${profile.username}`,
            lastModified: new Date(profile.created_at),
            changeFrequency: 'daily',
            priority: 0.7,
        }));

        routes = [...routes, ...profileRoutes];

        // 3. Fetch Builds (Lightweight)
        // Limit to 5000 recent builds for single file compatibility
        const { data: builds } = await supabase
            .from('builds')
            .select('id, short_code, created_at')
            .order('created_at', { ascending: false })
            .limit(5000);

        const buildRoutes: MetadataRoute.Sitemap = (builds || []).map((build) => ({
            url: `${baseUrl}/builds/${build.short_code || build.id}`,
            lastModified: new Date(build.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...routes, ...buildRoutes];

    } catch (error) {
        console.error("Sitemap generation failed:", error);
        return routes;
    }
}
