import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BuildCard } from "@/components/shared/BuildCard";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { verifyBuildAction } from "@/app/actions/admin";

export default async function AdminVerifyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Pending Builds
    const { data: pendingBuilds } = await supabase
        .from("builds")
        .select(`
      *,
      weapons (id, name, category),
      profiles!builds_user_id_fkey (id, display_name, avatar_url)
    `)
        .eq("status", "pending")
        .order("created_at", { ascending: true }); // Oldest first

    return (
        <div className="container py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Admin Verification Queue</h1>

            {pendingBuilds && pendingBuilds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingBuilds.map((build) => (
                        <div key={build.id} className="border rounded-xl p-4 space-y-4 bg-card">
                            <BuildCard build={build} />
                            <div className="flex gap-2">
                                <form action={async () => {
                                    "use server";
                                    await verifyBuildAction(build.id, "verified");
                                }} className="flex-1">
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </form>
                                <form action={async () => {
                                    "use server";
                                    await verifyBuildAction(build.id, "rejected");
                                }} className="flex-1">
                                    <Button type="submit" variant="destructive" className="w-full">
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No pending builds to verify.</p>
            )}
        </div>
    );
}
