import React from 'react';
import { getMissions } from "@/lib/missions";
import MissionGuide from "@/components/missions/MissionGuide";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Season 5 Mission Guide: 3x3 Titanium Case - ABI Builder",
  description: "Master the Season 5 missions in Arena Breakout Infinite. Our comprehensive guide covers the 3x3 Titanium Case missions with tactical briefings and strategic tips.",
  keywords: [
    "Season 5", "Season 5 Missions", "Season 5 Mission Guide", "Arena Breakout Infinite", "ABI", "3x3 Titanium Case", "Mission Guide", "3x3 Guide", "Tactical Briefing",
    "3 Tricolor Lights", "Blindsight", "Transcend", "Distorted Valley", "Season 5 Titanium Case", "Season 5 Guide", "3x3 Titanium Case Guide", "ABI Guide", "Arena Breakout Infinite Guide",
    "ABI 3x3", "Arena Breakout 3x3", "Arena 3x3", "ABI Titanium Case", "Arena Breakout Titanium Case", "Arena Titanium Case", "ABI Guide 3x3", "Arena Breakout Guide 3x3",
    "White Wolves", "Sprawling", "Reconstruct", "Lakeside Cave", "Devotion Statue", "Devotion", "Puppets", "Stims", "Bell toll", "resonate", "echo orbs",
    "Grain Trade Center", "Sewage Plant", "Camp Services", "Northridge Hotel", "Radar Station", "Gas Station Armory", "Medical Area Airport", "Freight Elevator TV Station",
    "Ajax Farm", "Hecate Farm", "ABI Boss Guide", "Nom Nom Energy Drink", "Canned Stew", "Mk 2 Frag Grenade", "Signal Jammer", "Rangefinder Binoculars",
    "FAMAS ABI", "T192 ABI", "Arena Breakout PC Guide", "ABI PC Guide", "Extraction Shooter Guide", "Tactical FPS Guide", "ABI Mission Tips", "3x3 Case Guide"
  ],
  openGraph: {
    title: "Season 5 Mission Guide: 3x3 Titanium Case - Arena Breakout Infinite",
    description: "The ultimate guide for the Season 5 3x3 Titanium Case missions in ABI. Tactical tips and full objective walkthroughs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Season 5 Mission Guide: 3x3 Titanium Case - ABI Builder",
    description: "Master the Season 5 3x3 Titanium Case missions with our tactical guide for Arena Breakout Infinite.",
  }
};

export const runtime = 'edge';

export default async function MissionsPage() {
  const parts = await getMissions();

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
        <div className="flex flex-col gap-6 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter text-white">
              3x3 <span className="text-primary italic">Titanium Case</span> Mission Guide
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                Select a Part from the tabs below to view the available mission branches. Click on any mission card to open the tactical briefing, where you'll find tips to help you complete them faster. Skip cards are seasonal, so make sure to use them; you receive one free skip for each Part. If you own the Battlepass (to obtain points more quickly), you can purchase an additional skip for Parts 2 and 3 from the Supply page in the Point Store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="max-w-full mx-auto overflow-x-hidden">
         <MissionGuide parts={parts} />
      </div>

      {/* Floating Action Button (Optional, for quick feedback or back to top) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,160,23,0.5)]">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
           </svg>
        </button>
      </div>
    </main>
  );
}
