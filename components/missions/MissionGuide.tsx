"use client";

import React from 'react';
import { Mission, MissionPart } from "@/lib/missions";
import MissionLane from "./MissionLane";
import MissionDialog from "./MissionDialog";
import { cn } from "@/lib/utils";

interface MissionGuideProps {
  parts: MissionPart[];
}

export default function MissionGuide({ parts }: MissionGuideProps) {
  const [activePartIdx, setActivePartIdx] = React.useState(0);
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(null);
  
  const activePart = parts[activePartIdx];
  
  const currentLane = selectedMission 
    ? activePart.lanes.find(lane => lane.some(m => m.id === selectedMission.id)) 
    : null;
  const currentIndex = currentLane && selectedMission
    ? currentLane.findIndex(m => m.id === selectedMission.id)
    : -1;

  const hasNext = currentLane ? currentIndex < currentLane.length - 1 : false;
  const hasPrev = currentLane ? currentIndex > 0 : false;

  const handleNext = () => {
    if (hasNext && currentLane) {
      setSelectedMission(currentLane[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (hasPrev && currentLane) {
      setSelectedMission(currentLane[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full space-y-12 py-8 px-4 md:px-8">
      {/* Part Selector (Tabs) */}
      <div className="flex flex-wrap justify-center gap-6 mb-16 px-4">
        {parts.map((part, idx) => (
          <button
            key={part.name}
            onClick={() => setActivePartIdx(idx)}
            className={cn(
              "relative group/tab px-12 py-4 transition-all duration-500 overflow-hidden",
              activePartIdx === idx 
                ? "text-black scale-105" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {/* Background Layer */}
            <div className={cn(
              "absolute inset-0 transition-all duration-500",
              activePartIdx === idx 
                ? "bg-primary skew-x-[-12deg] shadow-[0_0_30px_rgba(212,160,23,0.3)]" 
                : "bg-white/5 skew-x-[-12deg] border border-white/10 group-hover/tab:bg-white/10"
            )} />
            
            {/* Glossy Overlay */}
            {activePartIdx === idx && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent skew-x-[-12deg] pointer-events-none" />
            )}

            <span className="relative z-10 font-display font-black uppercase tracking-[0.2em] text-xs">
              {part.name}
            </span>
          </button>
        ))}
      </div>

      <div className="relative group animate-fade-in">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 mb-12 text-center">
          <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent via-primary/40 to-primary/60" />
            <h2 className="text-6xl md:text-8xl font-display font-black italic uppercase tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {activePart.name}
            </h2>
            <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent via-primary/40 to-primary/60" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rotate-45" />
            <span className="font-display font-black text-primary/80 text-[11px] tracking-[0.5em] uppercase">
              Mission Operations
            </span>
            <span className="w-2 h-2 bg-primary rotate-45" />
          </div>
        </div>

        {/* Lanes Container */}
        <div className="flex flex-col gap-4 md:gap-6">
          {activePart.lanes.map((missions, lIdx) => (
            <div key={`${activePart.name}-lane-${lIdx}`} className="w-full overflow-x-auto custom-scrollbar">
              <MissionLane 
                missions={missions} 
                laneIndex={lIdx} 
                onMissionClick={(m) => setSelectedMission(m)} 
              />
            </div>
          ))}
        </div>

        {/* Mission Detail Modal */}
        <MissionDialog 
          mission={selectedMission}
          isOpen={!!selectedMission}
          onClose={() => setSelectedMission(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </div>

      {/* Grid Pattern Integration (Matches ABI Style) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-grid bg-[size:50px_50px]" />
    </div>
  );
}
