import { getAdminBuild, verifyBuildAction } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminBuildEditor from "@/components/admin/AdminBuildEditor";
import ReviewControls from "@/components/admin/ReviewControls";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReviewBuildPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const build = await getAdminBuild(resolvedParams.id);

    if (!build) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Build Not Found</h1>
                <Link href="/moderator" className="text-primary hover:underline">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    // Map DB to Component Props
    const formattedBuild = {
        id: build.id,
        title: build.title || build.weapon_name,
        weaponName: build.weapon_name,
        weaponImage: build.weapon_image || build.image_url,
        price: build.price,
        buildCode: build.build_code,
        stats: {
            v_recoil_control: build.v_recoil_control,
            h_recoil_control: build.h_recoil_control,
            ergonomics: build.ergonomics,
            weapon_stability: build.weapon_stability,
            accuracy: build.accuracy,
            hipfire_stability: build.hipfire_stability,
            effective_range: build.effective_range,
            muzzle_velocity: build.muzzle_velocity,
        },
        tags: build.tags || [],
        upvotes: build.upvotes || 0,
        downvotes: build.downvotes || 0,
        author: "Unknown Author", // Fetching author name requires join or separate query if not included in getAdminBuild
        // stats prop needs to be properly structured
        created_at: build.created_at,
        is_bookmarked: false,
        user_vote: null,
        can_delete: false
    };

    // Need to fetch author username separately since getAdminBuild is basic select *
    // Optimally getAdminBuild should join, but for now I'll do a quick fetch
    const supabase = await createClient();
    const { data: author } = await supabase.from("profiles").select("username").eq("id", build.user_id).single();
    if (author) formattedBuild.author = author.username;


    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/moderator" className="text-text-secondary hover:text-white flex items-center gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Queue
                    </Link>
                    <h1 className="font-display font-bold text-3xl mb-2">Review Build</h1>
                    <p className="text-text-secondary">
                        Reviewing submission by <span className="text-primary">{formattedBuild.author}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Admin Editor */}
                    <div>
                        <AdminBuildEditor build={build} />
                    </div>

                    {/* Right: Controls */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Moderation Actions</h2>
                        <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl sticky top-24">
                            <div className="space-y-4 mb-8">
                                <div>
                                    <div className="text-sm text-text-secondary mb-1">Status</div>
                                    <div className="inline-flex px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-sm border border-yellow-500/30">
                                        {build.status.toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-text-secondary mb-1">Submitted</div>
                                    <div className="text-white text-sm">
                                        {new Date(build.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <ReviewControls buildId={build.id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
