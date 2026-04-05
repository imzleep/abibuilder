"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mission } from "@/lib/missions";
import { cn } from "@/lib/utils";

interface MissionDialogProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function MissionDialog({ mission, isOpen, onClose }: MissionDialogProps) {
  if (!mission) return null;

  const colors = LOCATION_COLORS[mission.location] || { text: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", accent: "bg-zinc-500" };

  // Split description into paragraphs if it has multiple lines
  const descriptionLines = mission.description.split('\n').filter(l => l.trim() !== '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-[#080808] border-white/5 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Colorful Header Block */}
        <div className={cn("w-full h-1.5", colors.accent)} />
        
        {/* Tactical Background Patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-grid bg-[size:30px_30px]" />
        <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-[0.05]">
           <div className="text-[60px] font-display font-black leading-none">INTEL</div>
        </div>

        <div className="relative p-10 space-y-10">
          <DialogHeader className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="sr-only">Mission Details - {mission.location}</DialogTitle>
                <DialogDescription className="sr-only">
                  Detailed view of the mission objective and strategic tips.
                </DialogDescription>
                
                <span className={cn(
                  "px-4 py-1 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] border",
                  colors.bg, colors.text, colors.border
                )}>
                  {mission.location}
                </span>
              </div>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </DialogHeader>

          <div className="grid gap-8">
            {/* Description Block */}
               <div className="space-y-6">
                  {descriptionLines.map((line, idx) => {
                    const isTeamLine = line.toLowerCase().includes('team mission:');
                    const cleanLine = line.replace(/team mission:/i, '').trim();
                    
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        {isTeamLine && (
                          <div className="flex items-center gap-1">
                             <span className="text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-sm w-fit">
                                TEAM MISSION
                             </span>
                          </div>
                        )}
                        <div className="flex gap-3 group/line">
                          <span className="text-primary/40 font-mono text-xs mt-1">[{String(idx+1).padStart(2, '0')}]</span>
                          <p className="text-zinc-200 text-[15px] leading-relaxed font-medium">
                            {cleanLine.startsWith('-') ? cleanLine.substring(1).trim() : cleanLine}
                          </p>
                        </div>
                      </div>
                    );
                  })}
               </div>

            {/* Strategic Tips Block */}
            {mission.tips && (
              <div className="relative group/intel overflow-hidden">
                 {/* Decorative Corner Brackets */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-sm" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-sm" />
                 
                 <div className="bg-primary/[0.03] border border-primary/10 rounded-lg p-8 space-y-5 backdrop-blur-md transition-all duration-500 group-hover/intel:bg-primary/[0.05] group-hover/intel:border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-primary">TIPS / TRICKS</span>
                      <span className="text-[8px] font-mono text-primary/30 font-bold tracking-widest uppercase">Classified</span>
                    </div>
                    
                    <div className="relative">
                       <span className="absolute -left-4 text-primary/20 text-4xl font-serif leading-none">"</span>
                       <p className="text-zinc-300 text-[14px] italic leading-loose font-medium pl-2">
                         {mission.tips}
                       </p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Footer / Action */}
          <div className="pt-6 flex items-center justify-between border-t border-white/5">
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-zinc-800" />)}
             </div>
             <button 
               onClick={onClose}
               className="group/close flex items-center gap-4 px-8 py-2.5 bg-white/5 hover:bg-primary text-white hover:text-black font-display font-black text-[11px] uppercase tracking-[0.3em] rounded-sm border border-white/10 hover:border-primary transition-all duration-300"
             >
                <span className="opacity-70 group-hover/close:opacity-100">Exit Manual</span>
                <svg className="w-4 h-4 transform group-hover/close:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
             </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
