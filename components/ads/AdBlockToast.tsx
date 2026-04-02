"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

export default function AdBlockToast() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay the check slightly to give AdBlockers time to run and block the script
        const checkTimeout = setTimeout(() => {
            // Look for the Google AdSense script tag or the window.adsbygoogle object
            const isAdsbygooglePresent = (window as any).adsbygoogle !== undefined;

            // We can also check if a bait element with ad classes is hidden
            const testAd = document.createElement("div");
            testAd.className = "adsbox ad-placement pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links";
            testAd.style.position = "absolute";
            testAd.style.top = "-1000px";
            testAd.style.left = "-1000px";
            document.body.appendChild(testAd);

            // Give DOM time to update rendering
            setTimeout(() => {
                let isBlocked = false;
                const computedStyle = window.getComputedStyle(testAd);

                if (testAd.offsetHeight === 0 || computedStyle.display === "none") {
                    isBlocked = true;
                }

                // If AdSense didn't load OR the bait div is hidden
                if (!isAdsbygooglePresent || isBlocked) {
                    setIsVisible(true);
                }

                // Clean up bait
                if (testAd.parentNode) {
                    testAd.parentNode.removeChild(testAd);
                }
            }, 100);

        }, 2000); // 2 seconds delay

        return () => clearTimeout(checkTimeout);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm w-[calc(100%-3rem)]">
            <div className="relative glass-elevated border border-primary/30 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-start gap-4">
                {/* Decorative Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl pointer-events-none" />

                <div className="flex-shrink-0 mt-1 bg-primary/20 p-2 rounded-full">
                    <Heart className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 text-sm text-text-secondary leading-relaxed pt-1">
                    <strong className="text-white block font-display text-lg mb-1 leading-none">Support ABI Builder</strong>
                    It looks like you're using an AdBlocker. If you find our tools useful, please consider whitelisting us. It helps keep the site running! 💛
                </div>

                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1.5 text-text-secondary/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors -mt-1 -mr-1"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
