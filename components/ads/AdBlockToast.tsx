"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

export default function AdBlockToast() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Delay the check to give AdBlockers time to run and the script time to initialize
        const checkTimeout = setTimeout(() => {
            // 1. Check if Adsense object exists (it can be an array [] or object {})
            const isAdsbygooglePresent = typeof (window as any).adsbygoogle !== "undefined";

            // 2. Check if the script tag itself exists in the DOM
            const isScriptInDom = !!document.querySelector('script[src*="adsbygoogle.js"]');

            // 3. Use a simpler bait element to avoid generic tracking protection false positives
            const testAd = document.createElement("div");
            testAd.className = "adsbox ad-placement pub_300x250";
            testAd.style.position = "absolute";
            testAd.style.top = "-1000px";
            testAd.style.left = "-1000px";
            document.body.appendChild(testAd);

            // Give DOM time to update rendering
            setTimeout(() => {
                let isBaitBlocked = false;
                const computedStyle = window.getComputedStyle(testAd);

                if (testAd.offsetHeight === 0 || computedStyle.display === "none" || computedStyle.visibility === "hidden") {
                    isBaitBlocked = true;
                }

                // If the script is missing from DOM OR 
                // the bait is blocked AND (the script exists but the object is undefined)
                // This reduces false positives for slow-loading scripts.
                if (!isScriptInDom || (isBaitBlocked && !isAdsbygooglePresent)) {
                    setIsVisible(true);
                }

                // Clean up bait
                if (testAd.parentNode) {
                    testAd.parentNode.removeChild(testAd);
                }
            }, 500); // 0.5s for DOM check

        }, 3000); // Increased initial delay to 3s for slower connections

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
