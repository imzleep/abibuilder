
import { getAdminBuild } from "@/app/actions/admin";
import AdminEditForm from "@/components/AdminEditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const build = await getAdminBuild(id);

    if (!build) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Build Not Found</h1>
                <Link href="/admin" className="text-primary hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="font-display font-bold text-3xl">
                        Review <span className="text-gradient">Build</span>
                    </h1>
                </div>

                <AdminEditForm build={build} />
            </div>
        </main>
    );
}
