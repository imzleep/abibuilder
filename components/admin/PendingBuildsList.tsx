"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface PendingBuildsListProps {
    builds: any[];
}

export default function PendingBuildsList({ builds }: PendingBuildsListProps) {
    if (builds.length === 0) {
        return (
            <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold mb-2">All Caught Up! 🎉</h3>
                <p className="text-text-secondary">No pending builds to review.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {builds.map((build: any) => (
                <div
                    key={build.id}
                    className="bg-surface/30 border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-colors"
                >
                    <div className="flex items-center gap-6">
                        {/* Thumbnail */}
                        <div className="w-24 h-16 bg-black/40 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                            {build.image_url ? (
                                <img
                                    src={build.image_url}
                                    alt={build.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                                    No img
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="font-bold text-lg text-white mb-1">{build.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                                <span className="flex items-center gap-1">
                                    🛠️ {build.weapon_name}
                                </span>
                                <span className="flex items-center gap-1">
                                    👤 {build.profiles?.username || "Unknown"}
                                </span>
                                <span className="flex items-center gap-1">
                                    🕒{" "}
                                    {formatDistanceToNow(new Date(build.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <Link
                        href={`/moderator/build/${build.id}`}
                        className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Review
                    </Link>
                </div>
            ))}
        </div>
    );
}
