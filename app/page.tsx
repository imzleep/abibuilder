import { createClient } from "@/lib/supabase/server";
import { BuildCard } from "@/components/shared/BuildCard";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { FilterBar } from "@/components/features/feed/FilterBar";
import { AdBanner } from "@/components/features/monetization/AdBanner";

export const revalidate = 60; // Revalidate every minute

interface HomeProps {
  searchParams: { category?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Verified Builds + Related Data
  let query = supabase
    .from("builds")
    .select(`
      *,
      weapons!inner (id, name, category),
      profiles!builds_user_id_fkey (id, display_name, avatar_url)
    `)
    .eq("status", "verified") // Only show verified builds
    .order("created_at", { ascending: false });

  // Apply Filter
  if (searchParams.category) {
    query = query.eq("weapons.category", searchParams.category);
  }

  const { data: builds, error } = await query;

  if (error) {
    console.error("Error fetching builds:", error);
    return <div className="p-8 text-center text-red-500">Failed to load builds.</div>;
  }

  // Fetch User's Bookmarks to check status
  const myBookmarkIds = new Set<string>();
  if (user) {
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("build_id")
      .eq("user_id", user.id);

    bookmarks?.forEach((b) => myBookmarkIds.add(b.build_id));
  }

  return (
    <div className="container py-8 px-4">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent drop-shadow-sm">
            Latest Builds
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-light">
            Discover verified, community-tested weapon configurations dominating the meta.
          </p>
        </div>
        <Button asChild className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
          <Link href="/builder">
            <PlusSquare className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
            SHARE YOUR BUILD
          </Link>
        </Button>
      </div>

      <div className="mb-8 space-y-6">
        <FilterBar />
        {/* Top Ad Slot */}
        <div className="glass-card rounded-xl p-1">
          <AdBanner slot="feed_top" />
        </div>
      </div>

      {/* Grid */}
      {builds && builds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {builds.map((build) => (
            <BuildCard
              key={build.id}
              build={{ ...build, bookmarks: myBookmarkIds.has(build.id) ? [true] : [] }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-primary/20 rounded-3xl bg-card/20 backdrop-blur-sm animate-in zoom-in-95 duration-500">
          <div className="p-4 rounded-full bg-primary/10 mb-4 animate-pulse">
            <PlusSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No verified builds yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            The database is currently empty. Be the first to publish a meta-defining weapon build!
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/10">
            <Link href="/builder">Create First Build</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
