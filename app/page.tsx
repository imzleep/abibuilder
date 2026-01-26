
import Link from "next/link";
import Hero from "@/components/Hero";
import BuildCard from "@/components/BuildCard";
import StreamerRow from "@/components/StreamerRow";
import CategoryGrid from "@/components/CategoryGrid";
import AdBanner from "@/components/ads/AdBanner";
import { TrendingUp } from "lucide-react";

import { getBuildsAction } from "@/app/actions/builds";
import { getStreamersAction } from "@/app/actions/admin";
import { getSiteStats } from "@/app/actions/stats";
import type { Metadata } from "next";

// Reusing this action for public fetch

export const metadata: Metadata = {
  title: "ABI Builder - Arena Breakout Infinite Tools & Randomizer",
  description: "The #1 Tool for Arena Breakout Infinite. Features: ABI Randomizer, Weapon Meta Builds, Gun Builder, and Streamer Loadouts.",
  keywords: ["abibuilder", "abi builder", "arena breakout tools", "abi randomizer", "abi meta builds", "arena breakout infinite randomizer"],
  alternates: {
    canonical: 'https://abibuilder.com',
  },
};

export default async function Home() {

  // Fetch real data
  const [mostPlayedResult, latestResult, streamers, stats] = await Promise.all([
    getBuildsAction({ sortBy: 'most-voted' }),
    getBuildsAction({ sortBy: 'recent' }),
    getStreamersAction(true),
    getSiteStats()
  ]);

  // Slice top 3
  const topBuilds = mostPlayedResult.builds.slice(0, 3);

  // Slice latest 6
  const recentBuilds = latestResult.builds.slice(0, 6);

  // No longer need client-side handlers here, BuildCard handles it internally now.

  return (
    <main className="min-h-screen bg-background relative">
      {/* Minimal Ambient Glow (reduced opacity) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar is in layout */}
      <Hero stats={stats} />

      {/* Streamer Spotlight - Linking to Profiles */}
      <StreamerRow streamers={streamers} />

      {/* Most Played Section (renamed from Current Meta) */}
      <section className="relative py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="font-display font-bold text-3xl">
                  Most <span className="text-gradient">Played</span>
                </h2>
              </div>
              <p className="text-text-secondary">
                Top voted builds this week
              </p>
            </div>
          </div>

          {/* Most Played Builds Grid (reduced glow) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topBuilds.map((build: any, index: number) => (
              <div key={build.id} className="relative">
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-bold text-xl text-background shadow-lg">
                  #{index + 1}
                </div>

                {/* Card with subtle border (no glow) */}
                <div className="relative border border-primary/30 rounded-2xl overflow-hidden">
                  <BuildCard
                    build={build}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display font-bold text-2xl mb-6">
            Browse by <span className="text-gradient">Category</span>
          </h3>

          <CategoryGrid />
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner
          imageUrl="/ads/horizontal.png"
          linkUrl="https://buffbuff.com/top-up/arena-breakout-infinite?utm_media=zleep&utm_source=zleep"
        />
      </div>

      {/* Latest Community Builds */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-3xl mb-2">
                Latest <span className="text-gradient">Community Builds</span>
              </h2>
              <p className="text-text-secondary">
                Fresh builds from the community
              </p>
            </div>
            <Link href="/builds" className="text-primary hover:text-accent transition-colors text-sm font-semibold">
              View All →
            </Link>
          </div>

          {/* Builds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBuilds.map((build: any) => (
              <BuildCard
                key={build.id}
                build={build}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Link
              href="/builds"
              className="inline-block px-8 py-4 rounded-xl glass hover:border-primary/50 transition-all duration-300 font-bold"
            >
              Load More Builds
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
