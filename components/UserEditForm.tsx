"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserBuildAction } from "@/app/actions/builds";
import { Loader2, Upload } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const availableTags = ["META", "Budget", "Zero Recoil", "Hip Fire Build", "Troll Build"];

export default function UserEditForm({ build }: { build: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [buildImage, setBuildImage] = useState<string | null>(build.weaponImage || build.image_url || null);

    const [formData, setFormData] = useState({
        title: build.title || "",
        description: build.description || "",
        build_code: build.buildCode || build.build_code || "",
        price: build.price || 0,
        // Stats
        v_recoil_control: build.stats?.v_recoil_control || 0,
        h_recoil_control: build.stats?.h_recoil_control || 0,
        ergonomics: build.stats?.ergonomics || 0,
        weapon_stability: build.stats?.weapon_stability || 0,
        accuracy: build.stats?.accuracy || 0,
        hipfire_stability: build.stats?.hipfire_stability || 0,
        effective_range: build.stats?.effective_range || 0,
        muzzle_velocity: build.stats?.muzzle_velocity || 0,
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

    const toggleTag = (tag: string) => {
        setFormData(prev => {
            const currentTags = prev.tags || [];
            if (currentTags.includes(tag)) {
                return { ...prev, tags: currentTags.filter((t: string) => t !== tag) };
            } else {
                return { ...prev, tags: [...currentTags, tag] };
            }
        });
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.build_code.trim()) {
            toast.error("Please fill in all required fields. Title and Build Code cannot be empty.");
            return;
        }

        if (formData.description.split('\n').length > 10) {
            toast.error("Description cannot exceed 10 lines.");
            return;
        }

        if (formData.price <= 0) {
            toast.error("Please enter a valid price greater than 0.");
            return;
        }

        setLoading(true);
        // Trim specifically before payload creation
        const payload = { 
            ...formData, 
            title: formData.title.trim(),
            build_code: formData.build_code.trim(),
            description: formData.description.trim(),
            image_url: buildImage 
        };
        const res = await updateUserBuildAction(build.id, payload);
        setLoading(false);

        if (res.success) {
            toast.success("Build updated and sent for review!");
            // Redirect back to the homepage since it's pending now
            router.push(`/`);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update build.");
        }
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
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.8,
                format: 'image/webp'
            });

            const supabase = createClient();
            const fileName = `builds/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

            const { error: uploadError } = await supabase.storage
                .from('build-images')
                .upload(fileName, compressedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('build-images')
                .getPublicUrl(fileName);

            setBuildImage(publicUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-surface/30 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Image Upload Area */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Build Screenshot</label>
                    <div className="relative border-2 border-dashed border-white/10 rounded-xl bg-black/20 group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden max-w-2xl mx-auto aspect-video flex flex-col items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            disabled={uploading}
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center gap-4 text-text-secondary z-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="font-semibold tracking-wider">UPLOADING...</span>
                            </div>
                        ) : buildImage ? (
                            <div className="relative w-full h-full z-10">
                                <Image
                                    src={buildImage}
                                    alt="Build preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white font-semibold">
                                    <Upload className="w-8 h-8 mb-2" />
                                    Click to change image
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-text-secondary z-10 group-hover:text-primary transition-colors">
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-primary/10">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <span className="font-semibold tracking-wider text-sm md:text-base px-4 text-center">
                                    DRAG & DROP OR BROWSE
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Core Edit Fields */}
                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Build Code <span className="text-red-500">*</span></label>
                            <input
                                name="build_code"
                                value={formData.build_code}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-primary/50 focus:outline-none font-mono text-sm"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Price ($) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="1"
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
                            maxLength={200}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <p className="text-sm font-semibold mb-3">Select tags that describe your build:</p>
                        <div className="flex flex-wrap gap-3">
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags?.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${isSelected
                                            ? 'bg-primary/20 text-primary border-2 border-primary'
                                            : 'bg-black/20 hover:border-primary/50 border-2 border-transparent'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
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
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                <button
                    onClick={() => router.back()}
                    disabled={loading}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors disabled:opacity-50 text-text-secondary"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-[2] py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
