"use client";

import { useState, useEffect } from "react";
import { X, Trophy } from "lucide-react";

export default function AdBlockToast() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a delay for better UX
        const showTimeout = setTimeout(() => {
            // Check if dismissed before
            const isDismissed = localStorage.getItem("mission-guide-dismissed");
            if (!isDismissed) {
                setIsVisible(true);
            }
        }, 5000); 

        return () => clearTimeout(showTimeout);
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsVisible(false);
        localStorage.setItem("mission-guide-dismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <a 
            href="/guides/missions"
            className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm w-[calc(100%-3rem)] group"
        >
            <div className="relative glass-elevated border border-primary/40 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-start gap-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary">
                {/* Decorative Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl pointer-events-none" />

                <div className="flex-shrink-0 mt-1 bg-primary p-2 rounded-xl shadow-[0_0_15px_rgba(212,160,23,0.4)]">
                    <Trophy className="w-5 h-5 text-black" />
                </div>

                <div className="flex-1 text-sm text-zinc-300 leading-relaxed pt-1">
                    <strong className="text-white block font-display text-lg mb-1 leading-none group-hover:text-primary transition-colors">3x3 Titanium Case Guide</strong>
                    Get the 3x3 Titanium Case with our brand new guide and tactical tips! Click here to check it out. ⚔️
                </div>

                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors -mt-1 -mr-1"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </a>
    );
}
