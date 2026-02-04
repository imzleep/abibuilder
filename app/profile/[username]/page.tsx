import { getProfileByUsername, getUserBuilds, getUserBookmarkedBuilds } from "@/app/actions/profile";
import ProfileClient from "./ProfileClient";
import { Button } from "@/components/ui/button";

export default async function ProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ username: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { username } = await params;
  const { edit } = await searchParams;
  const shouldAutoOpen = edit === 'true';

  // 1. Fetch Profile on Server
  const profileRes = await getProfileByUsername(username);

  // Handle Not Found
  if (!profileRes.success || !profileRes.data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-text-secondary">We couldn't find a user with the username <strong>@{username}</strong>.</p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Return Home
        </a>
      </div>
    );
  }

  // 2. Get Current User for Ownership Check
  const supabase = await import("@/lib/supabase/server").then(m => m.createClient());
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === profileRes.data.id;

  // 3. Get Pagination, Tab & Filter Info
  const sp = await searchParams; // Unwrap promise
  const currentPage = parseInt((sp.page as string) || "1");
  const currentTab = (sp.tab as string) || "uploaded";

  // Construct Filters
  const filters = {
    category: (sp.category as string) || 'all',
    query: (sp.query as string) || '',
    priceRange: [
      sp.minPrice ? parseInt(sp.minPrice as string) : undefined,
      sp.maxPrice ? parseInt(sp.maxPrice as string) : undefined
    ].filter(x => x !== undefined) as [number, number] | undefined,
    weapons: sp.weapons ? (typeof sp.weapons === 'string' ? [sp.weapons] : sp.weapons) : [],
    sortBy: (sp.sortBy as string) || 'created_at',
    streamer: (sp.streamer as string) || 'all'
  };

  // 4. Fetch Builds Data on Server (Parallel)
  const [uploadedRes, savedRes] = await Promise.all([
    getUserBuilds(profileRes.data.id, filters, currentTab === 'uploaded' ? currentPage : 1, 9),
    getUserBookmarkedBuilds(profileRes.data.id, filters, currentTab === 'saved' ? currentPage : 1, 9)
  ]);

  // 5. Render Client Component with Data
  return (
    <ProfileClient
      profile={profileRes.data}
      isOwner={isOwner}
      uploadedBuilds={uploadedRes.builds}
      totalUploaded={uploadedRes.totalCount}
      savedBuilds={savedRes.builds}
      totalSaved={savedRes.totalCount}
      autoOpenEdit={shouldAutoOpen && isOwner}
      initialTab={currentTab as 'uploaded' | 'saved'}
      currentPage={currentPage}
      initialFilters={filters}
    />
  );
}

// Metadata Generation
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params;
  const profileRes = await getProfileByUsername(username);

  if (!profileRes.success || !profileRes.data) {
    return {
      title: "User Not Found | ABI Builder"
    };
  }

  const profile = profileRes.data;
  const description = profile.bio || `Check out ${profile.username}'s weapon builds on ABI Builder.`;

  const isStreamer = profile.is_streamer;
  const title = isStreamer
    ? `${profile.username} Arena Breakout Infinite Streamer Builds & Loadouts | ABI Builder`
    : `${profile.username}'s Arena Breakout Infinite Builds & Loadouts | ABI Builder`;

  return {
    title: title,
    description: description.substring(0, 160),
    openGraph: {
      title: title,
      description: description,
      images: [{ url: profile.avatar_url || "/logo.png" }]
    },
    twitter: {
      card: "summary",
      title: title,
      description: description,
      images: [profile.avatar_url || "/logo.png"],
    }
  };
}
