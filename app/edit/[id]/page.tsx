import { getBuildAction } from "@/app/actions/builds";
import UserEditForm from "@/components/UserEditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EditBuildPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Check auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login"); // or whatever their login path is, or maybe just return Unauthorized
    }

    const { success, build } = await getBuildAction(id);

    if (!success || !build) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Build Not Found</h1>
                <Link href="/builds" className="text-primary hover:underline">
                    Back to Builds
                </Link>
            </div>
        );
    }

    // Verify ownership
    if (build.user_id !== user.id) {
        return (
            <div className="min-h-screen pt-24 text-center flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized</h1>
                <p className="text-text-secondary mb-4">You can only edit your own builds.</p>
                <Link href={`/builds/${id}`} className="text-primary hover:underline bg-white/10 px-4 py-2 rounded-lg">
                    Back to Build
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 pl-1">
                    <Link
                        href={`/builds/${build.short_code || build.id}`}
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Build
                    </Link>
                    <h1 className="font-display font-bold text-3xl">
                        Edit <span className="text-gradient">Build</span>
                    </h1>
                </div>

                <UserEditForm build={build} />
            </div>
        </main>
    );
}
