"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BuildCard from "@/components/BuildCard";
import Pagination from "@/components/Pagination";
import AdBanner from "@/components/ads/AdBanner";
import { Slider } from "@/components/ui/slider";
import { WeaponBuild } from "@/types";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import { getBuildsAction, getWeaponsAction } from "@/app/actions/builds";
import { getStreamersAction } from "@/app/actions/admin"; // Added import
import { toast } from "sonner";

// Weapon categories
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

export default function BuildsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialCategory = searchParams.get('category') || "all";
  const initialStreamer = searchParams.get('streamer') || "all";
  const initialSort = searchParams.get('sortBy') || "most-voted";
  const initialQuery = searchParams.get('query') || "";
  const initialTag = searchParams.get('tag') || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStreamer, setSelectedStreamer] = useState(initialStreamer);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [sortBy, setSortBy] = useState(initialSort);
  const [buildSearchQuery, setBuildSearchQuery] = useState(initialQuery);
  const [weaponSearchQuery, setWeaponSearchQuery] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [builds, setBuilds] = useState<WeaponBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [allWeapons, setAllWeapons] = useState<{ value: string; label: string; category: string }[]>([]);
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>([]);
  const [streamerOptions, setStreamerOptions] = useState<{ value: string; label: string }[]>([
    { value: "all", label: "All Streamers" }
  ]);

  // Budget filters (stubs for now as requested removed/disabled)
  // const [minBudget, setMinBudget] = useState(0);
  // const [maxBudget, setMaxBudget] = useState(5000000);

  // Update URL helper
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page to 1 when filtering
    if (key !== 'page') {
      params.delete('page');
    }
    router.push(`/builds?${params.toString()}`);
  };

  // Fetch data when URL params change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentCategory = searchParams.get('category') || "all";
        const currentStreamer = searchParams.get('streamer') || "all";
        const currentSort = searchParams.get('sortBy') || "most-voted";
        const currentQuery = searchParams.get('query') || "";
        const currentTag = searchParams.get('tag') || "all";

        setSelectedCategory(currentCategory);
        setSelectedStreamer(currentStreamer);
        setSortBy(currentSort);
        setBuildSearchQuery(currentQuery);
        setSelectedTag(currentTag);

        const filters = {
          query: currentQuery,
          sortBy: currentSort,
          category: currentCategory,
          streamer: currentStreamer,
          tag: currentTag
        };

        const currentPage = parseInt(searchParams.get('page') || "1");

        const [buildsResult, weaponsData, streamersData] = await Promise.all([
          getBuildsAction(filters, currentPage, 9),
          getWeaponsAction(),
          getStreamersAction()
        ]);

        setBuilds(buildsResult.builds);
        setTotalItems(buildsResult.totalCount);

        const uniqueWeapons = weaponsData.filter((weapon: any, index: number, self: any[]) =>
          index === self.findIndex((w: any) => w.value === weapon.value)
        );
        setAllWeapons(uniqueWeapons);

        if (streamersData) {
          setStreamerOptions([
            { value: "all", label: "All Streamers" },
            ...streamersData.map((s: any) => ({ value: s.username, label: s.username }))
          ]);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleVote = (buildId: string, type: 'up' | 'down') => {
    // Ideally this optimization updates local state immediately
    // TODO: Implement optimistic vote update
    // console.log(`${type}voted build:`, buildId);
  };

  const handleBookmark = (buildId: string) => {
    // console.log("Bookmarked:", buildId);
  };

  const handleCopy = (buildId: string) => {
    toast.success("Build code copied!");
  };

  const toggleWeapon = (weaponValue: string) => {
    setSelectedWeapons(prev =>
      prev.includes(weaponValue)
        ? prev.filter(w => w !== weaponValue)
        : [...prev, weaponValue]
    );
  };

  const clearFilters = () => {
    setSelectedWeapons([]);
    setWeaponSearchQuery("");
    router.push('/builds');
  };

  // Client-side filtering for specific weapons only
  const filteredBuilds = builds.filter(build => {
    // 1. Search Query: handled by server mostly, but we can double check or filter newly typed input
    const query = buildSearchQuery.toLowerCase();
    const matchesSearch =
      build.title.toLowerCase().includes(query) ||
      build.weaponName?.toLowerCase().includes(query) ||
      build.author?.toLowerCase().includes(query);

    // 2. Specific Weapons Filter ('selectedWeapons' state - client side)
    const matchesSpecificWeapon = selectedWeapons.length === 0 || selectedWeapons.some(sw => {
      return allWeapons.find(w => w.value === sw)?.label === build.weaponName;
    });

    return matchesSearch && matchesSpecificWeapon;
  });

  const filteredWeapons = allWeapons.filter(w => {
    // Robust category matching: check raw value OR normalized kebab-case value
    const normalizedCategory = w.category.toLowerCase().replace(/\s+/g, '-');
    const matchesCategory = selectedCategory === "all" ||
      w.category === selectedCategory ||
      normalizedCategory === selectedCategory;
    const matchesSearch = w.label.toLowerCase().includes(weaponSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const SidebarContent = () => (
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
        <AdBanner format="rectangle" className="rounded-xl" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 glass-elevated rounded-2xl p-6 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
              <SidebarContent />
            </div>
          </aside>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg"
          >
            <Filter className="w-6 h-6 text-background" />
          </button>

          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="absolute inset-y-0 left-0 w-80 glass-elevated p-6 overflow-y-auto animate-slide-in custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarContent />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-background font-bold mt-6"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "all", label: "All" },
                  { value: "meta", label: "🔥 Meta" },
                  { value: "budget", label: "💰 Budget" },
                  { value: "zero-recoil", label: "🎯 Zero Recoil" },
                  { value: "hipfire", label: "🔫 Hipfire" },
                  { value: "troll", label: "🤡 Troll" },
                  { value: "streamer", label: "📺 Streamer" }
                ].map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => updateUrl('tag', tag.value)}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${selectedTag === tag.value
                      ? "bg-primary text-background shadow-lg shadow-primary/25 scale-105"
                      : "glass hover:border-primary/50 hover:bg-primary/10"
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={buildSearchQuery}
                  onChange={(e) => setBuildSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateUrl('query', buildSearchQuery.trim());
                    }
                  }}
                  placeholder="Search builds... (Press Enter)"
                  className="w-full px-5 py-3.5 rounded-xl glass border border-white/10 focus:border-primary/50 focus:outline-none transition-colors pl-12"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                {buildSearchQuery !== (searchParams.get('query') || "") && (
                  <button
                    onClick={() => updateUrl('query', buildSearchQuery.trim())}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-primary/20 text-primary text-xs font-bold px-2 hover:bg-primary/30"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>

            {/* Top Ad Banner */}
            <AdBanner className="mb-8 rounded-xl" />

            <div className="mb-8">
              <h1 className="font-display font-bold text-4xl mb-2">
                All <span className="text-gradient">Builds</span>
              </h1>
              <p className="text-text-secondary">
                {totalItems > 0 ? (
                  <>
                    Showing <span className="font-medium text-white">{(parseInt(searchParams.get('page') || "1") - 1) * 9 + 1}-{Math.min(parseInt(searchParams.get('page') || "1") * 9, totalItems)}</span> of <span className="font-medium text-white">{totalItems}</span> community builds
                  </>
                ) : (
                  "No builds found"
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-20 text-text-secondary">Loading builds...</div>
              ) : filteredBuilds.length > 0 ? (
                filteredBuilds.map((build) => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    onVote={handleVote}
                    onBookmark={handleBookmark}
                    onCopy={handleCopy}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-text-secondary">No builds found matching your filters.</div>
              )}
            </div>

            <div className="mt-8">
              <Pagination
                totalItems={totalItems}
                itemsPerPage={9}
                currentPage={parseInt(searchParams.get('page') || "1")}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
