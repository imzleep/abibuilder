"use client";

import { useState } from "react";
import { updateAdminBuild } from "@/app/actions/admin";
import { compressImage } from "@/lib/image-compression";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminBuildEditorProps {
    build: any; // Using any for speed, but ideally type it
}

export default function AdminBuildEditor({ build }: AdminBuildEditorProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState(build.title || build.weapon_name);
    const [buildCode, setBuildCode] = useState(build.build_code);
    const [price, setPrice] = useState(build.price?.toString() || "");
    const [imageUrl, setImageUrl] = useState(build.image_url || build.weapon_image);
    const [tags, setTags] = useState<string[]>(build.tags || []);
    const [newTag, setNewTag] = useState("");

    // Stats State (flattened for easier editing)
    const [stats, setStats] = useState({
        v_recoil_control: build.v_recoil_control,
        h_recoil_control: build.h_recoil_control,
        ergonomics: build.ergonomics,
        weapon_stability: build.weapon_stability,
        accuracy: build.accuracy,
        hipfire_stability: build.hipfire_stability,
        effective_range: build.effective_range,
        muzzle_velocity: build.muzzle_velocity
    });

    // Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            toast.loading("Compressing & Uploading...");

            // 1. Compress
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.8,
                format: 'image/webp'
            });

            // 2. Upload
            const supabase = createClient();
            const fileName = `builds/${Date.now()}-edited.webp`;

            const { error: uploadError } = await supabase.storage
                .from('build-images')
                .upload(fileName, compressedFile);

            if (uploadError) throw uploadError;

            // 3. Get URL
            const { data: { publicUrl } } = supabase.storage
                .from('build-images')
                .getPublicUrl(fileName);

            setImageUrl(publicUrl);
            toast.dismiss();
            toast.success("New image ready!");

        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Upload failed");
        }
    };

    // Tag Handlers
    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Save Handler
    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {
                title,
                build_code: buildCode,
                price: parseInt(price) || 0,
                image_url: imageUrl,
                tags,
                ...stats // stats are top-level columns in DB
            };

            const res = await updateAdminBuild(build.id, updates);

            if (res.success) {
                toast.success("Build updated successfully!");
                router.refresh();
            } else {
                toast.error(res.error || "Update failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleStatChange = (key: string, value: string) => {
        setStats(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    return (
        <div className="bg-surface/30 border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ✏️ Edit Build Details
            </h2>

            {/* Image Section */}
            <div>
                <label className="block text-sm font-semibold mb-2">Build Image</label>
                <div className="relative group aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/10">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-secondary">No Image</div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90">
                            <Upload className="w-4 h-4" /> Change Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-text-secondary mb-1">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm focus:border-primary/50 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs text-text-secondary mb-1">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm focus:border-primary/50 outline-none"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-text-secondary mb-1">Build Code</label>
                    <input
                        value={buildCode}
                        onChange={e => setBuildCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-sm font-mono focus:border-primary/50 outline-none"
                    />
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-xs text-text-secondary mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {["META", "Budget", "Zero Recoil", "Hip Fire Build", "Troll Build", "Streamer Build"].map((tag) => {
                        const isSelected = tags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => {
                                    if (isSelected) {
                                        setTags(tags.filter(t => t !== tag));
                                    } else {
                                        setTags([...tags, tag]);
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected
                                        ? "bg-primary/20 text-primary border-primary"
                                        : "bg-surface border-white/10 text-text-secondary hover:border-white/30"
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div>
                <label className="block text-xs text-text-secondary mb-2">Stats</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(stats).map(([key, val]) => (
                        <div key={key}>
                            <label className="block text-[10px] text-text-secondary uppercase truncate">{key.replace(/_/g, " ")}</label>
                            <input
                                type="number"
                                value={val || 0}
                                onChange={e => handleStatChange(key, e.target.value)}
                                className="w-full px-2 py-1 rounded-md bg-black/20 border border-white/10 text-xs text-center focus:border-primary/50 outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Save Changes
            </button>
        </div>
    );
}
