"use client";

import { useEffect, useState, useRef } from "react";
import { Download, AlertTriangle, Play } from "lucide-react";
import {
    maps, helmets, bodyArmors, weapons, tierWeights, RandomizerItem
} from "@/lib/randomizer-data";
import { cn } from "@/lib/utils";

// --- CONSTANTS ---
import RandomizerFilters from "@/components/randomizer/RandomizerFilters";

// --- CONSTANTS ---
const CARD_HEIGHT = 80;
const TOTAL_CARDS = 60; // Strip length
const VISUAL_OFFSET = -5; // Fine-tune centering

export default function RandomizerPage() {
    // --- STATE ---
    const [isSpinning, setIsSpinning] = useState(false);
    const [alarmMode, setAlarmMode] = useState(false);
    const [zthChance, setZthChance] = useState(5);
    const [history, setHistory] = useState<string[]>([]);
    const [lastMap, setLastMap] = useState<string | null>(null);

    // Filtered Data State
    const [activeMaps, setActiveMaps] = useState<RandomizerItem[]>(maps);
    const [activeWeapons, setActiveWeapons] = useState<RandomizerItem[]>(weapons);
    const [activeArmors, setActiveArmors] = useState<RandomizerItem[]>(bodyArmors);
    const [activeHelmets, setActiveHelmets] = useState<RandomizerItem[]>(helmets);

    // --- REFS for Strips ---
    const mapStripRef = useRef<HTMLDivElement>(null);
    const helmetStripRef = useRef<HTMLDivElement>(null);
    const armorStripRef = useRef<HTMLDivElement>(null);
    const weaponStripRef = useRef<HTMLDivElement>(null);

    // Filter Handler
    const handleFilterChange = (filters: any, validWeapons: RandomizerItem[]) => {
        // Update Weapons (if valid list provided, else fallback to static)
        if (validWeapons.length > 0) setActiveWeapons(validWeapons);

        // Map Tiers: t0=1, t1=2, t2=3, t3=4, t4=5, t5=6
        const tierMap: Record<string, number> = { t0: 1, t1: 2, t2: 3, t3: 4, t4: 5, t5: 6 };

        // Filter Armors
        const newArmors = bodyArmors.filter(a => {
            const tier = tierMap[a.type];
            return !filters.excludedArmorTiers.includes(tier);
        });
        setActiveArmors(newArmors.length > 0 ? newArmors : bodyArmors);

        // Filter Helmets
        const newHelmets = helmets.filter(h => {
            const tier = tierMap[h.type];
            return !filters.excludedHelmetTiers.includes(tier);
        });
        setActiveHelmets(newHelmets.length > 0 ? newHelmets : helmets);

        // Filter Maps
        if (filters.excludedMaps) {
            const newMaps = maps.filter(m => !filters.excludedMaps.includes(m.name));
            setActiveMaps(newMaps.length > 0 ? newMaps : maps);
        }
    };

    // Initial Strip Content (State to force re-render if needed, but we mostly manipulate DOM for per-spin randomness)
    // We will generate random strips on every spin, similar to the original code.

    useEffect(() => {
        // Load history
        const saved = localStorage.getItem('weaponHistory');
        if (saved) setHistory(JSON.parse(saved));

        // Initial Draw (Using default statics until filters load, effectively)
        drawStrip(mapStripRef.current, maps);
        drawStrip(helmetStripRef.current, helmets, true);
        drawStrip(armorStripRef.current, bodyArmors, true);
        drawStrip(weaponStripRef.current, weapons, true);
    }, []);

    // Effect to redraw strips when data changes
    useEffect(() => {
        drawStrip(mapStripRef.current, activeMaps);
        drawStrip(helmetStripRef.current, activeHelmets, true);
        drawStrip(armorStripRef.current, activeArmors, true);
        drawStrip(weaponStripRef.current, activeWeapons, true);
    }, [activeMaps, activeHelmets, activeArmors, activeWeapons]);

    // Keep Refs to current data for Spin function (closures issue)
    // Actually handleSpin accesses state directly? No, closure will have old state if handleSpin isn't recreated.
    // But handleSpin is created each render? Yes.
    // But it's used in onClick.
    // It should be fine.

    // --- HELPERS ---

    const getWeightedRandom = (items: RandomizerItem[]) => {
        let totalWeight = 0;
        const weightedItems = items.map(item => {
            const w = item.weight ?? tierWeights[item.type] ?? 10;
            return { item, weight: w };
        });

        weightedItems.forEach(wi => totalWeight += wi.weight);
        let randomVal = Math.random() * totalWeight;

        for (const wi of weightedItems) {
            randomVal -= wi.weight;
            if (randomVal <= 0) return wi.item;
        }
        return weightedItems[weightedItems.length - 1].item;
    };

    const drawStrip = (element: HTMLDivElement | null, items: RandomizerItem[], addHiddenZTH = false) => {
        if (!element) return;

        let html = "";
        let lastItemName = "";

        for (let i = 0; i < TOTAL_CARDS; i++) {
            let item: RandomizerItem;
            let attempts = 0;

            // Avoid visual duplicates
            do {
                item = items[Math.floor(Math.random() * items.length)];
                attempts++;
            } while (item.name === lastItemName && attempts < 10);

            lastItemName = item.name;
            html += generateCardHtml(item);
        }

        if (addHiddenZTH) {
            html += `<div class="flex items-center justify-center h-[80px] w-full border-b border-white/5 bg-gradient-to-b from-red-900/50 to-black text-red-500 font-display font-bold text-lg shadow-[0_0_20px_red] z-20 relative">ZERO TO HERO</div>`;
        }

        element.innerHTML = html;
        // Reset Position
        element.style.transition = "none";
        element.style.transform = `translateY(${80 + VISUAL_OFFSET}px)`;
    };

    const generateCardHtml = (item: RandomizerItem) => {
        if (!item) return "";
        // Map types to colors
        const colors: Record<string, string> = {
            t0: "text-zinc-500",
            t1: "text-green-500",
            t2: "text-blue-500",
            t3: "text-purple-500",
            t4: "text-yellow-400 text-shadow-yellow",
            t5: "text-red-500 text-shadow-red",
        };
        const colorClass = colors[item.type] || "text-zinc-500";
        const shadowStyle = item.type === 't4' ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' :
            item.type === 't5' ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' : '';

        return `<div class="flex items-center justify-center h-[80px] w-full border-b border-white/5 bg-transparent ${colorClass} font-display font-bold uppercase text-center text-lg md:text-xl tracking-wide px-2 leading-none ${shadowStyle}">${item.name}</div>`;
    };

    const spinColumn = (element: HTMLDivElement | null, dataset: RandomizerItem[], delay: number, winnerItem: RandomizerItem | null, forceZTH = false) => {
        if (!element) return;

        let targetIndex;
        if (forceZTH) {
            targetIndex = TOTAL_CARDS; // Point to the appended ZTH card
        } else {
            targetIndex = Math.floor(Math.random() * 15) + 40; // Random deep spot

            // MAGIC: Force the winner to appear at targetIndex
            if (winnerItem) {
                const cardNode = element.children[targetIndex] as HTMLElement;
                if (cardNode) {
                    cardNode.outerHTML = generateCardHtml(winnerItem);

                    // Anti-duplicate neighbor check
                    const prevNode = element.children[targetIndex - 1] as HTMLElement;
                    const nextNode = element.children[targetIndex + 1] as HTMLElement;

                    const getDiff = () => {
                        const pool = dataset.filter(x => x.name !== winnerItem.name);
                        if (pool.length === 0) return winnerItem;
                        return pool[Math.floor(Math.random() * pool.length)];
                    };

                    if (prevNode && prevNode.textContent === winnerItem.name) prevNode.outerHTML = generateCardHtml(getDiff());
                    if (nextNode && nextNode.textContent === winnerItem.name) nextNode.outerHTML = generateCardHtml(getDiff());
                }
            }
        }

        // Reset
        element.style.transition = "none";
        element.style.transform = `translateY(${80 + VISUAL_OFFSET}px)`;
        element.offsetHeight; // Force reflow

        const targetPos = -(targetIndex * CARD_HEIGHT) + 80 + VISUAL_OFFSET;

        setTimeout(() => {
            element.style.transition = "transform 3s cubic-bezier(0.15, 0.9, 0.35, 1)";
            element.style.transform = `translateY(${targetPos}px)`;
        }, 50 + delay);
    };


    const getRandomItem = (items: RandomizerItem[]) => {
        if (!items || items.length === 0) return { name: "None", type: "t0" } as RandomizerItem;
        return items[Math.floor(Math.random() * items.length)];
    };

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setAlarmMode(false);

        // 1. Redraw fresh strips
        drawStrip(mapStripRef.current, activeMaps);
        drawStrip(helmetStripRef.current, activeHelmets, true);
        drawStrip(armorStripRef.current, activeArmors, true);
        drawStrip(weaponStripRef.current, activeWeapons, true);

        // 2. Determine Winners
        const isZeroToHero = Math.random() < (zthChance / 100);

        // Map Logic (Uniform + Anti-Repeat)
        let mapWinner: RandomizerItem;
        let mapAttempts = 0;
        do {
            mapWinner = getRandomItem(activeMaps);
            mapAttempts++;
        } while (mapWinner.name === lastMap && activeMaps.length > 1 && mapAttempts < 20);
        setLastMap(mapWinner.name);

        const helmetWinner = getRandomItem(activeHelmets); // Uniform chance
        const armorWinner = getRandomItem(activeArmors);   // Uniform chance

        // Weapon Logic (History)
        let weaponWinner: RandomizerItem;
        let attempts = 0;
        do {
            weaponWinner = getRandomItem(activeWeapons); // Uniform chance
            attempts++;
        } while (history.includes(weaponWinner.name) && attempts < 50);

        // Update History
        const newHistory = [weaponWinner.name, ...history].slice(0, 3);
        setHistory(newHistory);
        localStorage.setItem('weaponHistory', JSON.stringify(newHistory));

        // 3. Trigger Animations
        if (isZeroToHero) {
            setTimeout(() => {
                setAlarmMode(true);
            }, 500);

            spinColumn(mapStripRef.current, activeMaps, 0, mapWinner);
            spinColumn(helmetStripRef.current, activeHelmets, 400, null, true);
            spinColumn(armorStripRef.current, activeArmors, 800, null, true);
            spinColumn(weaponStripRef.current, activeWeapons, 1200, null, true);
        } else {
            spinColumn(mapStripRef.current, activeMaps, 0, mapWinner);
            spinColumn(helmetStripRef.current, activeHelmets, 400, helmetWinner);
            spinColumn(armorStripRef.current, activeArmors, 800, armorWinner);
            spinColumn(weaponStripRef.current, activeWeapons, 1200, weaponWinner);
        }

        setTimeout(() => {
            setIsSpinning(false);
        }, 4500);
    };

    return (
        <main className="min-h-screen pt-24 pb-20 flex flex-col items-center overflow-hidden bg-background">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url('/grid.svg')` }} />

            {/* Alarm Overlay */}
            {alarmMode && (
                <div className="fixed inset-0 z-0 pointer-events-none animate-pulse bg-red-900/10 shadow-[inset_0_0_100px_rgba(255,0,0,0.2)]" />
            )}

            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center gap-8">

                {/* Header */}
                <div className="text-center space-y-6 w-full max-w-3xl">
                    <h1 className={cn(
                        "text-5xl md:text-7xl font-display font-bold uppercase tracking-widest transition-all duration-500",
                        alarmMode ? "text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] scale-105" : "text-primary drop-shadow-[0_0_15px_rgba(212,160,23,0.4)]"
                    )}>
                        {alarmMode ? "ZERO TO HERO" : "RNG LOADOUTS"}
                    </h1>

                    <RandomizerFilters onFilterChange={handleFilterChange} disabled={isSpinning} />

                    {/* Rules Box */}
                    <div className="bg-[#111] border border-white/10 rounded-xl p-6 text-left shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:h-full transition-all duration-500" />

                        <h3 className="text-white font-display font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Mission Parameters
                        </h3>

                        <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                            <span className="text-white font-display font-bold block mb-1">Are you looking for a challenge?</span>
                            Randomizes loadouts for your next raid.
                            <span className="text-primary font-bold ml-1">Weapon builds are up to you.</span>
                        </p>

                        <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                            <span className="text-white font-display font-bold block mb-1">Customize your odds.</span>
                            You can filter specific items from the pool using the Advanced Filters menu above.
                        </p>

                        {alarmMode && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 font-bold text-center animate-pulse flex flex-col">
                                <span className="text-lg">⚠ ZERO TO HERO PROTOCOL ACTIVE ⚠</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Slot Machine Frame */}
                <div className={cn(
                    "relative p-6 rounded-xl border-[3px] bg-[#151515] shadow-2xl transition-all duration-500 w-full max-w-4xl",
                    alarmMode ? "border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.4)]" : "border-white/10 border-t-primary shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
                )}>
                    {/* Payline */}
                    <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[80px] border-[3px] rounded z-20 pointer-events-none transition-all duration-500",
                        alarmMode ? "border-red-500 bg-red-500/10 shadow-[inset_0_0_20px_rgba(255,0,0,0.3)]" : "border-primary bg-primary/5 shadow-[inset_0_0_15px_rgba(212,160,23,0.2)]"
                    )}>
                        <div className="absolute top-1/2 -translate-y-1/2 -left-8 text-2xl text-white/50">►</div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-2xl text-white/50">◄</div>
                    </div>

                    {/* Columns Grid */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4">
                        {/* Map */}
                        <Column label="Map" stripRef={mapStripRef} />
                        {/* Helmet */}
                        <Column label="Helmet" stripRef={helmetStripRef} />
                        {/* Armor */}
                        <Column label="Armor" stripRef={armorStripRef} />
                        {/* Weapon */}
                        <Column label="Weapon" stripRef={weaponStripRef} />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-6 mt-4 w-full">

                    <button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className={cn(
                            "relative group px-16 py-6 font-display font-bold text-3xl text-black clip-path-tactical transition-all duration-200",
                            isSpinning ? "bg-zinc-700 cursor-not-allowed text-zinc-500" :
                                alarmMode ? "bg-gradient-to-r from-red-600 to-red-500 hover:scale-105 shadow-[0_0_30px_red]" :
                                    "bg-gradient-to-r from-primary to-yellow-500 hover:scale-105 shadow-[0_0_25px_rgba(212,160,23,0.4)]"
                        )}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                    >
                        {isSpinning ? (alarmMode ? "RUNNING..." : "SHUFFLING...") : "DEPLOY"}
                    </button>

                    <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-full px-6 py-2">
                        <span className="font-display text-text-secondary text-sm">ZERO TO HERO CHANCE %:</span>
                        <input
                            type="number"
                            min="5"
                            max="100"
                            value={zthChance}
                            onChange={(e) => setZthChance(Math.min(100, Math.max(5, Number(e.target.value))))}
                            className="bg-transparent border-b-2 border-primary text-primary font-display text-xl w-12 text-center focus:outline-none"
                        />
                    </div>

                </div>

            </div>
        </main>
    );
}

function Column({ label, stripRef }: { label: string, stripRef: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div className="flex flex-col items-center w-full">
            <span className="font-display text-xs text-text-secondary mb-2 uppercase tracking-wider">{label}</span>
            <div className="w-full h-[240px] overflow-hidden bg-black border border-white/10 rounded shadow-[inset_0_0_30px_black] relative">
                <div ref={stripRef} className="will-change-transform w-full" />
            </div>
        </div>
    );
}
