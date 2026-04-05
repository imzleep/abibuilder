"use client";

import React from 'react';
import { Mission } from "@/lib/missions";
import MissionCard from "./MissionCard";

interface MissionLaneProps {
  missions: Mission[];
  laneIndex: number;
  onMissionClick?: (mission: Mission) => void;
}

export default function MissionLane({ missions, laneIndex, onMissionClick }: MissionLaneProps) {
  if (!missions || missions.length === 0) return null;

  return (
    <div className="relative flex items-center gap-8 py-8 group/lane overflow-x-auto overflow-y-hidden custom-scrollbar">
      {/* Horizontal Progress Line Background */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2 z-0 hidden md:block" />
      
      {missions.map((mission, index) => (
        <React.Fragment key={mission.id}>
          {/* Connector Line (except for the first one) */}
          {index > 0 && (
            <div className="absolute h-[2px] bg-gradient-to-r from-primary/20 to-primary/40 z-0 hidden md:block shadow-[0_0_10px_rgba(212,160,23,0.1)]"
                 style={{
                   left: `${index * (170 + 32) + 16 - 32}px`, // 170 is card width, 32 is gap, 16 is padding
                   width: '32px',
                   top: '50%',
                   transform: 'translateY(-50%)'
                 }} 
            />
          )}

          <div className="relative z-10 shrink-0">
            <MissionCard 
                mission={mission} 
                isLocked={false} 
                isFirst={index === 0}
                onClick={onMissionClick}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
