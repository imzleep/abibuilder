
import { Metadata } from "next";
import BuildsClient from "./BuildsClient";
import React, { Suspense } from "react";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props,
): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const query = searchParams.query as string | undefined;
    const weapons = searchParams.weapons as string | undefined;
    const category = searchParams.category as string | undefined;
    const tag = searchParams.tag as string | undefined;

    let title = "All Builds | ABI Builder";
    let description = "Browse user-submitted weapon builds for Arena Breakout Infinite. Filter by weapon, price, and meta status.";

    // Dynamic SEO Logic per Season 4 Plan
    if (query) {
        const safeQuery = query.charAt(0).toUpperCase() + query.slice(1);
        title = `${safeQuery} Meta Builds | ABI Builder`;
        description = `Find the best ${query} loadouts and weapon builds for Arena Breakout Infinite (ABI). Rated by the community.`;
    } else if (weapons) {
        // Handle comma separated, take first one and pretty it up
        let weaponName = weapons.split(',')[0];
        weaponName = weaponName.charAt(0).toUpperCase() + weaponName.slice(1);

        title = `${weaponName} Meta Builds & Loadouts | ABI Builder`;
        description = `Top rated ${weaponName} builds for Arena Breakout Infinite. Low recoil, high ergonomics, best ammo guides.`;
    } else if (tag === 'meta') {
        title = "Current Meta Builds (Season 4) | ABI Builder";
        description = "The absolute best weapon loadouts in Arena Breakout Infinite (Season 4). Dominate the raid with these meta builds.";
    } else if (tag === 'budget') {
        title = "Best Budget Builds & Loadouts | ABI Builder";
        description = "Effective and cheap weapon builds for Arena Breakout Infinite. Save koen without sacrificing performance.";
    } else if (tag === 'zero-recoil') {
        title = "Zero Recoil Laser Beam Builds | ABI Builder";
        description = "Best low recoil builds for Arena Breakout Infinite. Spray with precision.";
    } else if (category && category !== 'all') {
        // Capitalize category
        const catName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        title = `Best ${catName} Builds | ABI Builder`;
        description = `Top performing ${catName} loadouts in Arena Breakout Infinite.`;
    } else {
        // Default Fallback
        title = "All Builds | ABI Builder";
        description = "Browse user-submitted weapon builds for Arena Breakout Infinite (ABI). Filter by weapon, price, and meta status.";
    }

    return {
        title,
        description,
        alternates: {
            canonical: '/builds'
        },
        openGraph: {
            title,
            description,
            images: ['/logo.png'], // Default fallback
        }
    };
}

export default async function BuildsPage(props: Props) {
    // We don't need to pass searchParams to Client Component, it reads from URL.
    // But strictly waiting for searchParams in Server Component is good practice for Next.js 15+
    await props.searchParams;

    return (
        <Suspense fallback={<div className="min-h-screen bg-background pt-32 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary animate-pulse">Loading builds...</p>
        </div>}>
            <BuildsClient />
        </Suspense>
    );
}
