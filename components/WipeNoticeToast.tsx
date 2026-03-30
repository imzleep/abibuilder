"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";

export default function WipeNoticeToast() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Sadece kullanıcının aktif sekme oturumunda durumunu hatırlar (Sekme kapanana kadar)
        const isDismissed = sessionStorage.getItem("wipe-notice-dismissed");
        if (!isDismissed) {
            // Sayfa açıldıktan 1.5 saniye sonra animasyonlu şekilde belirir.
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Oturum boyunca bir daha sorulmaması için sessionStorage'a kaydedilir
        sessionStorage.setItem("wipe-notice-dismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-24 right-6 z-50 animate-fade-in max-w-sm w-[calc(100%-3rem)]">
            <div className="relative glass-elevated border border-primary/50 p-5 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-start gap-4 transition-all duration-500">
                {/* Dekoratif Gradient Arkaplan Glow (Nefes alan parlama) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl pointer-events-none animate-pulse" />

                <div className="flex-shrink-0 mt-1 bg-primary/20 p-2 rounded-full relative z-10">
                    <Info className="w-5 h-5 text-primary" />
                </div>

                <div className="relative z-10 flex-1 text-sm text-text-secondary leading-relaxed pt-1">
                    <strong className="text-white block font-display text-lg mb-1 leading-none">Season Update Notice</strong>
                    Season 5 drops on April 2nd! All build codes will be wiped. You'll need to generate and submit new codes once the update is live.
                    <div className="mt-3">
                        <button
                            onClick={handleDismiss}
                            className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 font-medium py-1.5 px-4 rounded-md transition-all text-xs"
                        >
                            Got it!
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleDismiss}
                    className="relative z-10 flex-shrink-0 p-1.5 text-text-secondary/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors -mt-1 -mr-1 cursor-pointer"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
