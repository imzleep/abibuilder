"use client";

import { useState } from "react";
import { linkStreamerAccount, searchUsersAction } from "@/app/actions/admin";
import { toast } from "sonner";
import { Search, Link as LinkIcon, AlertTriangle } from "lucide-react";

interface StreamerLinkerProps {
    streamers: { id: string; username: string }[];
}

export default function StreamerLinker({ streamers }: StreamerLinkerProps) {
    const [selectedStreamer, setSelectedStreamer] = useState("");
    const [realUserId, setRealUserId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLinking, setIsLinking] = useState(false);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            const results = await searchUsersAction(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleLink = async () => {
        if (!selectedStreamer || !realUserId) {
            toast.error("Please select a streamer and provide a Real User ID.");
            return;
        }

        if (!confirm(`Are you sure you want to MERGE accounts?\n\nPlaceholder: ${selectedStreamer}\nReal User ID: ${realUserId}\n\nThis cannot be undone!`)) {
            return;
        }

        setIsLinking(true);
        const result = await linkStreamerAccount(selectedStreamer, realUserId);
        setIsLinking(false);

        if (result.success) {
            toast.success("Accounts linked successfully!");
            setSelectedStreamer("");
            setRealUserId("");
            setSearchQuery("");
            setSearchResults([]);
        } else {
            toast.error(result.error || "Failed to link accounts.");
        }
    };

    return (
        <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Link Streamer Accounts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Select Placeholder */}
                <div>
                    <label className="block text-sm text-text-secondary mb-2">1. Select Placeholder Streamer</label>
                    <div className="relative">
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none appearance-none"
                            value={selectedStreamer}
                            onChange={(e) => setSelectedStreamer(e.target.value)}
                        >
                            <option value="">-- Select Placeholder --</option>
                            {streamers.map(s => (
                                <option key={s.id} value={s.username}>{s.username}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-text-secondary">
                            ▼
                        </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                        This account will be <strong>DELETED</strong> after merging.
                    </p>
                </div>

                {/* 2. Find Real User */}
                <div>
                    <label className="block text-sm text-text-secondary mb-2">2. Find Real User (Target)</label>

                    {/* Search Input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 p-3 text-white focus:border-primary outline-none"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-h-40 overflow-y-auto mb-3">
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    className="p-2 hover:bg-white/5 cursor-pointer flex justify-between items-center text-sm"
                                    onClick={() => {
                                        setRealUserId(user.id);
                                        setSearchQuery(user.username); // Visual feedback
                                        setSearchResults([]); // Close list
                                    }}
                                >
                                    <span className="text-white">{user.username}</span>
                                    <span className="text-xs text-text-secondary font-mono">{user.id.slice(0, 8)}...</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-text-secondary font-mono text-sm"
                            placeholder="User UUID will appear here"
                            value={realUserId}
                            readOnly
                        />
                        <button
                            onClick={handleLink}
                            disabled={isLinking || !selectedStreamer || !realUserId}
                            className="px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isLinking ? "Linking..." : "Link Accounts"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200/80">
                    <strong>Warning:</strong> This action will transfer all builds from the Placeholder to the Real User,
                    rename the Real User to the Placeholder's name, and DELETE the Placeholder profile.
                    Ensure the real user has verified their identity.
                </p>
            </div>
        </div>
    );
}
