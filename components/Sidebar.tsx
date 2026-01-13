"use client";

import { useState } from "react";
import { Filter, ChevronDown, DollarSign, Target, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedWeaponTypes, setSelectedWeaponTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const weaponTypes = [
    "Assault Rifle",
    "SMG",
    "Sniper Rifle",
    "DMR",
    "Shotgun",
    "Pistol",
    "LMG",
  ];

  const tags = ["Meta", "Budget", "PvP", "PvE", "Beginner", "Advanced", "Experimental"];

  const toggleWeaponType = (type: string) => {
    setSelectedWeaponTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-xl">Filters</h2>
      </div>

      {/* Price Range */}
      <div className="glass-elevated rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-4 h-4 text-accent" />
          <h3 className="font-display font-semibold">Price Range</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Min</span>
            <span className="font-bold text-accent">${priceRange[0].toLocaleString()}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Max</span>
            <span className="font-bold text-accent">${priceRange[1].toLocaleString()}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>

      {/* Weapon Types */}
      <div className="glass-elevated rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Weapon Type</h3>
        </div>

        <div className="space-y-2">
          {weaponTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedWeaponTypes.includes(type)}
                onChange={() => toggleWeaponType(type)}
                className="w-4 h-4 rounded border-2 border-primary/30 bg-surface checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="glass-elevated rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="w-4 h-4 text-accent" />
          <h3 className="font-display font-semibold">Tags</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                selectedTags.includes(tag)
                  ? "bg-primary text-background"
                  : "glass hover:glow-border-hover"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="glass-elevated rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Sort By</h3>
        <select className="w-full px-4 py-2.5 rounded-lg glass border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all cursor-pointer">
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="votes">Most Voted</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button className="w-full px-4 py-3 rounded-lg glass hover:glow-border-hover transition-all duration-300 font-medium">
        Clear All Filters
      </button>
    </aside>
  );
}
