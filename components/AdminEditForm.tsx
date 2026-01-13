"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateAdminBuild, verifyBuildAction } from "@/app/actions/admin";
import { Upload } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { createClient } from "@/lib/supabase/client";

export default function AdminEditForm({ build }: { build: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initial state with ALL fields
    const [formData, setFormData] = useState({
        title: build.title || "",
        description: build.description || "",
        build_code: build.build_code || "",
        image_url: build.image_url || "",
        price: build.price || 0,
        // Stats
        v_recoil_control: build.v_recoil_control || 0,
        h_recoil_control: build.h_recoil_control || 0,
        ergonomics: build.ergonomics || 0,
        weapon_stability: build.weapon_stability || 0,
        accuracy: build.accuracy || 0,
        hipfire_stability: build.hipfire_stability || 0,
        effective_range: build.effective_range || 0,
        muzzle_velocity: build.muzzle_velocity || 0,
        // Meta
        tags: build.tags || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        setUploading(true);
        try {
            // 1. Client-side Compression
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.8,
                format: 'image/webp'
            });

            // 2. Upload to Supabase
            const supabase = createClient();
            const fileName = `builds/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

            const { error: uploadError } = await supabase.storage
                .from('build-images')
                .upload(fileName, compressedFile);

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('build-images')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const res = await updateAdminBuild(build.id, formData);
        setLoading(false);

        if (res.success) {
            toast.success("Build updated successfully");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update build");
        }
    };

    const handleAction = async (status: "verified" | "rejected") => {
        setLoading(true);
        // First save changes
        await updateAdminBuild(build.id, formData);
        // Then update status
        const res = await verifyBuildAction(build.id, status);

        if (res.success) {
            toast.success(`Build ${status} successfully`);
            router.push("/admin");
        } else {
            setLoading(false);
            toast.error(res.error || "Failed to update status");
        }
    };

    return (
        <div className="bg-surface/30 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Image & Preview */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-text-secondary">Build Screenshot</label>
                        <div className="relative group cursor-pointer aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />

                            {formData.image_url ? (
                                <>
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <p className="text-white font-bold flex items-center gap-2">
                                            <Upload className="w-5 h-5" /> Change Image
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full text-text-secondary pointer-events-none">
                                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                                    <span>Click to Upload</span>
                                </div>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="mt-2 w-full text-xs bg-transparent border-none text-text-secondary focus:ring-0"
                            placeholder="Or paste URL..."
                        />
                    </div>
                </div>

                {/* Right: Core Edit Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Build Code</label>
                            <input
                                name="build_code"
                                value={formData.build_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tags (Comma separated)</label>
                        <input
                            value={formData.tags?.join(", ")}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                            }))}
                            placeholder="Meta, Streamer, Budget..."
                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                        />
                    </div>

                </div>
            </div>

            {/* FULL STATS EDITING */}
            <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="font-bold text-lg text-primary mb-4">Weapon Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { key: "v_recoil_control", label: "V. Recoil" },
                        { key: "h_recoil_control", label: "H. Recoil" },
                        { key: "ergonomics", label: "Ergonomics" },
                        { key: "weapon_stability", label: "Stability" },
                        { key: "accuracy", label: "Accuracy" },
                        { key: "hipfire_stability", label: "Hip-Fire" },
                        { key: "effective_range", label: "Range (m)" },
                        { key: "muzzle_velocity", label: "Velocity" },
                    ].map((stat) => (
                        <div key={stat.key}>
                            <label className="block text-xs font-medium text-text-secondary mb-1">{stat.label}</label>
                            <input
                                type="number"
                                name={stat.key}
                                value={formData[stat.key as keyof typeof formData] as number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                    Save Changes (No Publish)
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleAction('rejected')}
                        disabled={loading}
                        className="py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        Reject ❌
                    </button>
                    <button
                        onClick={() => handleAction('verified')}
                        disabled={loading}
                        className="py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        Approve & Publish ✅
                    </button>
                </div>
            </div>
        </div>
    );
}
