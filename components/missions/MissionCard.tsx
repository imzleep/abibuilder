"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Mission } from "@/lib/missions";

interface MissionCardProps {
  mission: Mission;
  isLocked?: boolean;
  isFirst?: boolean;
  onClick?: (mission: Mission) => void;
}

const LOCATION_COLORS: Record<string, { text: string; bg: string; border: string; accent: string }> = {
  "Farm": { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", accent: "bg-green-500" },
  "Northridge": { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", accent: "bg-blue-500" },
  "Armory": { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", accent: "bg-yellow-500" },
  "TV": { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", accent: "bg-red-500" },
  "TV Station": { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", accent: "bg-red-500" },
  "Airport": { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", accent: "bg-purple-500" },
  "Valley": { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", accent: "bg-cyan-500" },
  "Northridge Hotel": { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", accent: "bg-orange-500" },
  "Multiple": { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", accent: "bg-zinc-500" },
  "ALL": { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", accent: "bg-zinc-500" },
};

export default function MissionCard({ mission, isLocked = false, isFirst = false, onClick }: MissionCardProps) {
  const colors = LOCATION_COLORS[mission.location] || { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", accent: "bg-zinc-500" };

  return (
    <div 
      onClick={() => onClick?.(mission)}
      className={cn(
        "group relative flex flex-col w-[170px] h-[120px] bg-[#111111] border rounded-md transition-shadow duration-300 overflow-hidden shrink-0 cursor-pointer shadow-sm",
        isLocked 
          ? "opacity-30 grayscale border-white/5" 
          : "border-white/10 hover:border-white/20"
      )}
    >
      {/* Top Map Header Block */}
      <div className={cn(
        "w-full h-5 flex items-center justify-center font-display font-black italic uppercase tracking-widest text-[8px] border-b border-white/5 relative overflow-hidden",
        colors.bg, colors.text
      )}>
        <span className="relative z-10">{mission.location}</span>
      </div>

      {/* Recommended to Skip - High Visibility Corner Tag with Glow */}
      {mission.isRecommendedToSkip && (
        <div className="absolute top-0 right-0 z-30 pointer-events-none overflow-hidden w-16 h-16">
          <div className="absolute top-[12px] -right-[18px] w-[80px] py-0.5 bg-red-600 text-white text-[7px] font-black uppercase text-center rotate-45 shadow-[0_0_15px_rgba(220,38,38,0.6)] border-y border-white/20">
            SKIP
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className="p-2.5 flex flex-col flex-grow relative overflow-hidden">
        {/* Small Tactical Number in background */}
        <div className="absolute top-1 right-2 text-[24px] font-display font-black text-white/[0.03] italic pointer-events-none select-none">
          {mission.column + 1}
        </div>

        <div className="text-zinc-300 text-[10px] leading-relaxed font-medium line-clamp-4 relative z-10 pt-1">
          {mission.description.split('\n').map((line, idx) => (
            <p key={idx} className={idx > 0 ? "mt-1" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Static Accent Bottom Bar */}
      <div className={cn("h-[2px] w-full shrink-0", colors.accent || "bg-primary/20")} />
    </div>
  );
}
