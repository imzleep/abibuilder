"use client";

import { Slider } from "@/components/ui/slider";
import AdBanner from "@/components/ads/AdBanner";
import { SlidersHorizontal } from "lucide-react";

// Weapon categories
const weaponCategories = [
    { value: "all", label: "All Weapons" },
    { value: "assault-rifle", label: "Assault Rifles" },
    { value: "smg", label: "SMGs" },
    { value: "carbine", label: "Carbines" },
    { value: "marksman-rifle", label: "Marksman Rifles" },
    { value: "bolt-action-rifle", label: "Bolt-Action Rifles" },
    { value: "shotgun", label: "Shotguns" },
    { value: "lmg", label: "LMGs" },
    { value: "pistol", label: "Pistols" },
];

const sortOptions = [
    { value: "most-voted", label: "Most Voted" },
    { value: "recent", label: "Most Recent" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

interface BuildFiltersProps {
    selectedCategory: string;
    updateUrl: (key: string, value: string | null) => void;
    selectedWeapons: string[];
    weaponSearchQuery: string;
    setWeaponSearchQuery: (val: string) => void;
    filteredWeapons: { value: string; label: string; category: string }[];
    toggleWeapon: (val: string) => void;
    selectedStreamer: string;
    streamerOptions: { value: string; label: string }[];
    sortBy: string;
    clearFilters: () => void;
}

export default function BuildFilters({
    selectedCategory,
    updateUrl,
    selectedWeapons,
    weaponSearchQuery,
    setWeaponSearchQuery,
    filteredWeapons,
    toggleWeapon,
    selectedStreamer,
    streamerOptions,
    sortBy,
    clearFilters
}: BuildFiltersProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-3">Weapon Type</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => updateUrl('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                    style={{ colorScheme: 'dark' }}
                >
                    {weaponCategories.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-neutral-900 text-white">
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-3">
                    Specific Weapons ({selectedWeapons.length} selected)
                </label>
                <input
                    type="text"
                    value={weaponSearchQuery}
                    onChange={(e) => setWeaponSearchQuery(e.target.value)}
                    placeholder="Search weapons..."
                    className="w-full px-3 py-2 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors text-sm mb-3"
                />
                <div
                    className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {filteredWeapons.length > 0 ? (
                        filteredWeapons.map((weapon) => (
                            <label
                                key={weapon.value}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedWeapons.includes(weapon.value)}
                                    onChange={() => toggleWeapon(weapon.value)}
                                    className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-sm">{weapon.label}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-xs text-text-secondary text-center py-4">No weapons found in this category</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-3">Streamer</label>
                <select
                    value={selectedStreamer}
                    onChange={(e) => updateUrl('streamer', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                    style={{ colorScheme: 'dark' }}
                >
                    {streamerOptions.map((streamer) => (
                        <option key={streamer.value} value={streamer.value} className="bg-neutral-900 text-white">
                            {streamer.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-3">Sort By</label>
                <select
                    value={sortBy}
                    onChange={(e) => updateUrl('sortBy', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                    style={{ colorScheme: 'dark' }}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-neutral-900 text-white">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="pt-6 border-t border-white/5">
                <p className="text-xs font-bold text-text-secondary/50 mb-2 uppercase tracking-wider">Sponsored</p>
                <AdBanner
                    format="rectangle"
                    className="rounded-xl"
                    imageUrl="/ads/square.png"
                    linkUrl="https://buffbuff.com/top-up/arena-breakout-infinite?utm_media=zleep&utm_source=zleep"
                />
            </div>
        </div>
    );
}
