import { getPendingBuilds } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PendingBuildsList from "@/components/admin/PendingBuildsList";

async function checkModerator() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, is_moderator")
        .eq("id", user.id)
        .single();

    return profile?.is_moderator || profile?.is_admin;
}

export default async function ModeratorPage() {
    const isAuthorized = await checkModerator();
    if (!isAuthorized) {
        // Hide page from unauthorized users
        notFound();
    }

    const pendingBuilds = await getPendingBuilds();

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-display font-bold text-3xl mb-2">
                        Moderator <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-text-secondary">
                        {pendingBuilds.length} builds waiting for review
                    </p>
                </div>

                <div className="glass-elevated rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Build Queue</h2>
                    <PendingBuildsList builds={pendingBuilds} />
                </div>
            </div>
        </main>
    );
}
