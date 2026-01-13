"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, User, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image-compression";
import { uploadStreamerAvatar } from "@/app/actions/admin";

import { useRouter } from "next/navigation";

interface Streamer {
    id: string;
    username: string;
    avatar_url?: string;
}

interface StreamerAvatarEditorProps {
    streamers: Streamer[];
}

export default function StreamerAvatarEditor({ streamers }: StreamerAvatarEditorProps) {
    const [selectedId, setSelectedId] = useState("");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedId) {
            toast.error("Please select a streamer first");
            e.target.value = ""; // Reset
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file.");
            return;
        }

        setUploading(true);
        try {
            // 1. Client-side Compression
            const compressedFile = await compressImage(file, {
                maxWidth: 400,
                maxHeight: 400,
                maxSizeBytes: 200 * 1024,
                quality: 0.85,
                format: 'image/webp'
            });

            // 2. Upload via Server Action (Bypasses RLS)
            const formData = new FormData();
            formData.append("file", compressedFile);
            formData.append("streamerId", selectedId);

            const result = await uploadStreamerAvatar(formData);

            if (result.success) {
                toast.success("Avatar updated successfully!");
                // Clear state AND Refresh Server Data
                setPreviewUrl(null);
                setSelectedId("");
                // Force hard reload to ensure image cache is busted and server data is fresh
                window.location.reload();
            } else {
                toast.error("Failed to update profile: " + result.error);
            }

        } catch (error: any) {
            console.error("Upload process error:", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-surface/30 border border-white/5 p-6 rounded-2xl mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Manage Streamer Avatars
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold mb-2 text-text-secondary">
                        Select Placeholder Streamer
                    </label>
                    <select
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            setPreviewUrl(null);
                        }}
                        className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors bg-black/50"
                    >
                        <option value="">-- Select Streamer --</option>
                        {streamers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 w-full relative">
                    <label className="block text-sm font-semibold mb-2 text-text-secondary">
                        Upload New Avatar
                    </label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={!selectedId || uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                        />
                        <div className={`w-full px-4 py-3 rounded-lg border ${!selectedId ? 'border-white/5 bg-white/5 opacity-50' : 'border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5'} transition-all flex items-center justify-center gap-2`}>
                            {uploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-text-secondary" />
                                    <span>{selectedId ? "Click to Upload" : "Select Streamer First"}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview of selected streamer's current or new avatar */}
            {selectedId && (
                <div className="mt-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="text-sm text-text-secondary">Current / New Preview:</div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-black/50 relative">
                        {(() => {
                            // Show preview if just uploaded, otherwise show current from list
                            const current = streamers.find(s => s.id === selectedId);
                            const displayUrl = previewUrl || current?.avatar_url;

                            if (displayUrl) {
                                return <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />;
                            } else {
                                return (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-text-secondary">
                                        {current?.username[0]?.toUpperCase()}
                                    </div>
                                );
                            }
                        })()}
                    </div>
                    {previewUrl && <div className="text-xs text-green-400 font-bold flex items-center gap-1"><Save className="w-3 h-3" /> Saved!</div>}
                </div>
            )}
        </div>
    );
}
