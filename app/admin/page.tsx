import { getStreamersAction } from "@/app/actions/admin";
import Link from "next/link";
import StreamerAvatarEditor from "@/components/admin/StreamerAvatarEditor";
import StreamerLinker from "@/components/admin/StreamerLinker";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function AdminPage() {
    // Strict Admin Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Using notFound() to hide existence of admin panel
    if (!user) notFound();

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) notFound();

    const streamers = await getStreamersAction();

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display font-bold text-3xl mb-2">
                            Super Admin <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className="text-text-secondary">
                            System Management & Streamer Tools
                        </p>
                    </div>
                    <Link
                        href="/moderator"
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <span>Go to Moderator Panel</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded text-sm">Review Builds</span>
                    </Link>
                </div>

                {/* Streamer Editors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <StreamerAvatarEditor streamers={streamers} />
                    <StreamerLinker streamers={streamers} />
                </div>
            </div>
        </main>
    );
}
