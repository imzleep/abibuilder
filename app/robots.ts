import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/moderator/', '/auth/'],
        },
        sitemap: 'https://abibuilder.com/sitemap.xml', // Replace with your actual domain
    };
}
