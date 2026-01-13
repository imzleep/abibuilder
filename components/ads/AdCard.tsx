import React from "react";

export default function AdCard() {
    return (
        <div className="relative group rounded-2xl bg-black/40 border border-white/5 overflow-hidden h-full min-h-[400px] flex px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <span className="text-2xl opacity-50">📢</span>
                </div>
                <div>
                    <h3 className="font-display font-bold text-lg text-white/80">Sponsored Content</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-[200px] mx-auto">
                        Check out our partners or relevant gaming gear.
                    </p>
                </div>

                {/* Placeholder Button */}
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10">
                    Learn More
                </button>
            </div>

            <div className="absolute top-2 right-2 text-[10px] text-text-secondary uppercase tracking-widest opacity-50">
                Ad
            </div>
        </div>
    );
}
