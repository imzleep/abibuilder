import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildCard } from "@/components/shared/BuildCard";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Created Builds
    const { data: createdBuilds } = await supabase
        .from("builds")
        .select(`
      *,
      weapons (id, name, category),
      profiles!builds_user_id_fkey (id, display_name, avatar_url)
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Fetch Bookmarked Builds
    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select(`
      build_id,
      builds (
         *,
         weapons (id, name, category),
         profiles!builds_user_id_fkey (id, display_name, avatar_url)
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Normalize bookmarks data structure to match builds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const savedBuilds = (bookmarks?.map((b) => b.builds) || []) as any[];

    // For Bookmarks check: effectively all displayed here ARE bookmarked by me
    // But BuildCard expects 'bookmarks' array or we pass a prop.
    // We can just pass isBookmarked=true for saved builds.
    // For created builds, we should check if I bookmarked my own build (rare but possible).
    // Let's re-use the set logic for Created Builds tab.
    const myBookmarkIds = new Set<string>();
    if (bookmarks) {
        bookmarks.forEach(b => myBookmarkIds.add(b.build_id));
    }

    return (
        <div className="container py-8 px-4">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-8">
                <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback className="text-2xl">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{user.user_metadata.full_name || "User"}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="created" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="created">Created Builds ({createdBuilds?.length || 0})</TabsTrigger>
                    <TabsTrigger value="saved">Saved Builds ({savedBuilds?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="created">
                    {createdBuilds && createdBuilds.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {createdBuilds.map((build) => (
                                <BuildCard
                                    key={build.id}
                                    build={{ ...build, bookmarks: myBookmarkIds.has(build.id) ? [true] : [] }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">You haven&apos;t created any builds yet.</div>
                    )}
                </TabsContent>

                <TabsContent value="saved">
                    {savedBuilds && savedBuilds.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {savedBuilds.map((build) => (
                                <BuildCard
                                    key={build.id}
                                    build={{ ...build, bookmarks: [true] }} // Always true in saved tab
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">You haven&apos;t bookmarked any builds yet.</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
