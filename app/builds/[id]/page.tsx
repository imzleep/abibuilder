import { getBuildAction } from "@/app/actions/builds";
import BuildCard from "@/components/BuildCard";
import BuildActions from "@/components/BuildActions";
import ShareButton from "@/components/ShareButton";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const runtime = "edge";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. Dynamic Metadata Generation
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { id } = await params;
    const result = await getBuildAction(id);

    if (!result.success || !result.build) {
        return {
            title: "Build Not Found | ABI Builder",
        };
    }

    const build = result.build;

    return {
        title: `${build.weaponName} Meta Build: ${build.title} by ${build.author} | Arena Breakout Infinite`,
        description: build.description || `Best ${build.weaponName} loadout for Arena Breakout Infinite. Stats: V.Recoil ${build.stats.v_recoil_control}, Ergonomics ${build.stats.ergonomics}.`,
        keywords: [
            build.weaponName,
            `${build.weaponName} build`,
            `${build.weaponName} meta`,
            `${build.weaponName} meta build`,
            `${build.weaponName} budget build`,
            `${build.weaponName} loadout`,
            `${build.weaponName} best attachment`,
            `${build.author} ${build.weaponName} build`,
            `${build.author} ${build.weaponName}`,
            `${build.author} meta`,
            "Arena Breakout Infinite",
            "ABI",
            "Meta Loadout",
            "Gunsmith",
            build.title,
            build.author
        ],
        openGraph: {
            title: `${build.weaponName} Meta Build: ${build.title} | ABI Builder`,
            description: `Check out this ${build.weaponName} loadout by ${build.author}. Price: $${build.price.toLocaleString()}`,
            images: [
                {
                    url: build.image_url || "/logo.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${build.weaponName} Build: ${build.title}`,
            description: `Check out this ${build.weaponName} loadout by ${build.author}.`,
            images: [build.image_url || "/logo.png"],
        },
    };
}

// 2. Page Component
export default async function BuildDetailPage({ params }: Props) {
    const { id } = await params;
    const result = await getBuildAction(id);

    if (!result.success || !result.build) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold mb-2">Build Not Found</h1>
                <Link href="/builds" className="text-primary hover:underline">
                    Return to Builds
                </Link>
            </div>
        );
    }

    const build = result.build;

    return (
        <main className="min-h-screen bg-background pb-20 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/builds"
                    className="inline-flex items-center text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Builds
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: The Card (We reuse the component for consistency and features) */}
                    <div className="lg:col-span-2">
                        <BuildCard build={build} />

                        {/* Description Box (Separate since Card might truncate or doesn't show full desc) */}
                        {build.description && (
                            <div className="mt-6 glass-elevated rounded-xl p-6 border border-white/5">
                                <h3 className="font-display font-bold text-lg mb-2 text-white">Author's Notes</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{build.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Meta Info / Share / CTA */}
                    <div className="space-y-6">
                        {/* Admin/User Actions (Edit/Delete) */}
                        <BuildActions
                            buildId={build.id}
                            buildTitle={build.title}
                            canEdit={build.can_edit}
                            canDelete={build.can_delete}
                        />

                        <div className="glass-elevated rounded-xl p-6 border border-white/5">
                            <h3 className="font-display font-bold text-lg mb-4 text-white">About this Build</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-text-secondary">Author</span>
                                    <Link href={`/profile/${build.author}`} className="text-primary hover:underline font-medium">
                                        {build.author}
                                    </Link>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-text-secondary">Weapon</span>
                                    <span className="text-white">{build.weaponName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-text-secondary">Est. Price</span>
                                    <span className="text-accent font-bold">${build.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-text-secondary">Created</span>
                                    <span className="text-white">{new Date(build.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <ShareButton />
                    </div>
                </div>
            </div>
        </main>
    );
}
