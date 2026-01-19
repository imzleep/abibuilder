"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWeaponsAction } from "@/app/actions/builds"; // Assuming this exists or similar action
import { RandomizerItem } from "@/lib/randomizer-data";

// Define Tier Labels
const ARMOR_TIERS = [1, 2, 3, 4, 5, 6];
const HELMET_TIERS = [1, 2, 3, 4, 5, 6];

// Weapon Categories (mapped from DB category slug to Label)
const WEAPON_CATEGORIES: Record<string, string> = {
    "assault-rifle": "Assault Rifles",
    "submachine-gun": "SMGs",
    "marksman-rifle": "Marksman Rifles",
    "bolt-action-rifle": "Bolt-Action",
    "shotgun": "Shotguns",
    "light-machine-gun": "LMGs",
    "pistol": "Pistols",
    "carbine": "Carbines",
};

interface FilterState {
    excludedWeapons: string[]; // Names of excluded weapons
    excludedArmorTiers: number[];
    excludedHelmetTiers: number[];
}

interface RandomizerFiltersProps {
    onFilterChange: (filters: FilterState, weapons: RandomizerItem[]) => void;
    disabled?: boolean;
}

export default function RandomizerFilters({ onFilterChange, disabled }: RandomizerFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingWeapons, setLoadingWeapons] = useState(true);

    // Data
    const [allWeapons, setAllWeapons] = useState<any[]>([]);

    // Filter State
    const [excludedWeapons, setExcludedWeapons] = useState<string[]>([]);
    const [excludedArmorTiers, setExcludedArmorTiers] = useState<number[]>([]);
    const [excludedHelmetTiers, setExcludedHelmetTiers] = useState<number[]>([]);

    // Automatically close if disabled (optional, but good UX if spinning)
    useEffect(() => {
        if (disabled && isOpen) setIsOpen(false);
    }, [disabled, isOpen]);


    // Fetch Weapons
    useEffect(() => {
        const fetchWeapons = async () => {
            try {
                const weapons = await getWeaponsAction();
                // weapons is likely { label, value, category, id }
                // Let's ensure we map it to our format
                setAllWeapons(weapons);

                // Initial broadcast
                broadcastFilters(weapons, [], [], []);
            } catch (error) {
                console.error("Failed to load weapons", error);
            } finally {
                setLoadingWeapons(false);
            }
        };
        fetchWeapons();
    }, []);

    // Broadcast changes
    const broadcastFilters = (
        currentWeapons: any[],
        exclWeapons: string[],
        exclArmor: number[],
        exclHelmet: number[]
    ) => {
        // Map available weapons to RandomizerItem format
        // Filter out excluded ones
        const filteredRandomizerWeapons: RandomizerItem[] = currentWeapons
            .filter(w => !exclWeapons.includes(w.value)) // value is slug or unique id
            .map(w => ({
                name: w.label,
                type: 't3', // Default random tier for now since DB doesn't have tiers? Or randomized?
                // Ideally we assign tier based on price/meta but for now let's just make them colorful.
                // Or randomized type per item to make the slot machine colorful?
                // Let's assign random 't1'...'t5' hash based on name length for consistent colors
                // Or just 't3' (Purple) for all standard guns.
            }));

        // Fix for coloring: Let's distribute types pseudo-randomly for visual flare
        const coloredWeapons = filteredRandomizerWeapons.map((w, i) => ({
            ...w,
            type: `t${(w.name.length % 5) + 1}` as any // t1-t5
        }));

        onFilterChange({
            excludedWeapons: exclWeapons,
            excludedArmorTiers: exclArmor,
            excludedHelmetTiers: exclHelmet
        }, coloredWeapons);
    };

    // Update handlers
    const toggleWeapon = (slug: string) => {
        const newExcluded = excludedWeapons.includes(slug)
            ? excludedWeapons.filter(s => s !== slug)
            : [...excludedWeapons, slug];

        setExcludedWeapons(newExcluded);
        broadcastFilters(allWeapons, newExcluded, excludedArmorTiers, excludedHelmetTiers);
    };

    const toggleCategory = (categorySlug: string) => {
        // Find all weapons in this category
        const weaponsInCat = allWeapons.filter(w => (w.category || 'other') === categorySlug);
        const slugsInCat = weaponsInCat.map(w => w.value);

        // Check if all are currently excluded
        const allExcluded = slugsInCat.every(s => excludedWeapons.includes(s));

        let newExcluded;
        if (allExcluded) {
            // Include all (remove from excluded)
            newExcluded = excludedWeapons.filter(s => !slugsInCat.includes(s));
        } else {
            // Exclude all (add to excluded)
            newExcluded = [...new Set([...excludedWeapons, ...slugsInCat])];
        }

        setExcludedWeapons(newExcluded);
        broadcastFilters(allWeapons, newExcluded, excludedArmorTiers, excludedHelmetTiers);
    };

    const toggleArmorTier = (tier: number) => {
        const newExcluded = excludedArmorTiers.includes(tier)
            ? excludedArmorTiers.filter(t => t !== tier)
            : [...excludedArmorTiers, tier];
        setExcludedArmorTiers(newExcluded);
        broadcastFilters(allWeapons, excludedWeapons, newExcluded, excludedHelmetTiers);
    };

    const toggleHelmetTier = (tier: number) => {
        const newExcluded = excludedHelmetTiers.includes(tier)
            ? excludedHelmetTiers.filter(t => t !== tier)
            : [...excludedHelmetTiers, tier];
        setExcludedHelmetTiers(newExcluded);
        broadcastFilters(allWeapons, excludedWeapons, excludedArmorTiers, newExcluded);
    };


    // Group weapons for UI
    const groupedWeapons = allWeapons.reduce((groups, weapon) => {
        const cat = weapon.category || 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(weapon);
        return groups;
    }, {} as Record<string, any[]>);


    return (
        <div className="w-full max-w-4xl z-20">
            <button
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 mx-auto mb-4 bg-zinc-900 border border-white/10 px-6 py-2 rounded-full text-text-secondary transition-all font-display text-sm tracking-widest uppercase",
                    disabled ? "opacity-30 cursor-not-allowed" : "hover:text-primary hover:border-primary/50"
                )}
            >
                <Filter className="w-4 h-4" />
                Advanced Filters
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out bg-[#0f0f0f] border-x border-b border-white/5 rounded-2xl mx-auto",
                isOpen ? "max-h-[800px] opacity-100 mb-8 p-6 border-t" : "max-h-0 opacity-0 border-none"
            )}>
                {loadingWeapons ? (
                    <div className="flex justify-center p-8 text-text-secondary animate-pulse gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" /> Loading Armory...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* LEFT: WEAPONS */}
                        <div className="space-y-6">
                            <h3 className="font-display font-bold text-lg text-white border-b border-white/10 pb-2">Weapons</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(groupedWeapons).map(([catSlug, catWeapons]: [string, any]) => {
                                    const catLabel = WEAPON_CATEGORIES[catSlug] || catSlug.toUpperCase();
                                    const slugs = catWeapons.map((w: any) => w.value);
                                    const isAllExcluded = slugs.every((s: string) => excludedWeapons.includes(s));
                                    const isSomeExcluded = slugs.some((s: string) => excludedWeapons.includes(s));

                                    return (
                                        <div key={catSlug} className="space-y-2">
                                            {/* Category Header */}
                                            <div className="flex items-center justify-between group">
                                                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                                                    {catLabel}
                                                </span>
                                                <button
                                                    onClick={() => toggleCategory(catSlug)}
                                                    className={cn(
                                                        "text-xs px-2 py-0.5 rounded border transition-colors",
                                                        isAllExcluded
                                                            ? "border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10"
                                                            : "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                                                    )}
                                                >
                                                    {isAllExcluded ? "NONE" : "ALL"}
                                                </button>
                                            </div>

                                            {/* Grid of Weapons */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {catWeapons.map((weapon: any) => {
                                                    const isExcluded = excludedWeapons.includes(weapon.value);
                                                    return (
                                                        <button
                                                            key={weapon.value}
                                                            onClick={() => toggleWeapon(weapon.value)}
                                                            className={cn(
                                                                "flex items-center gap-2 text-xs px-2 py-1.5 rounded border transition-all truncate text-left",
                                                                isExcluded
                                                                    ? "border-white/5 bg-zinc-900/50 text-zinc-600 grayscale decoration-zinc-600"
                                                                    : "border-white/10 bg-zinc-800 text-zinc-300 hover:border-primary/40 hover:text-white"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full shrink-0",
                                                                isExcluded ? "bg-zinc-700" : "bg-primary"
                                                            )} />
                                                            <span className={isExcluded ? "line-through opacity-50" : ""}>
                                                                {weapon.label}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* RIGHT: GEAR */}
                        <div className="space-y-8">
                            {/* ARMOR */}
                            <div>
                                <h3 className="font-display font-bold text-lg text-white border-b border-white/10 pb-2 mb-4">Armor Tier</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {ARMOR_TIERS.map(tier => {
                                        const isExcluded = excludedArmorTiers.includes(tier);
                                        return (
                                            <button
                                                key={`armor-${tier}`}
                                                onClick={() => toggleArmorTier(tier)}
                                                className={cn(
                                                    "h-10 flex items-center justify-center gap-2 rounded border font-medium transition-all text-sm",
                                                    isExcluded
                                                        ? "border-white/5 bg-zinc-900 text-zinc-600"
                                                        : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50"
                                                )}
                                            >
                                                {!isExcluded && <Check className="w-3 h-3" />}
                                                Tier {tier}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* HELMETS */}
                            <div>
                                <h3 className="font-display font-bold text-lg text-white border-b border-white/10 pb-2 mb-4">Helmet Tier</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {HELMET_TIERS.map(tier => {
                                        const isExcluded = excludedHelmetTiers.includes(tier);
                                        return (
                                            <button
                                                key={`helmet-${tier}`}
                                                onClick={() => toggleHelmetTier(tier)}
                                                className={cn(
                                                    "h-10 flex items-center justify-center gap-2 rounded border font-medium transition-all text-sm",
                                                    isExcluded
                                                        ? "border-white/5 bg-zinc-900 text-zinc-600"
                                                        : "border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                                                )}
                                            >
                                                {!isExcluded && <Check className="w-3 h-3" />}
                                                Tier {tier}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
