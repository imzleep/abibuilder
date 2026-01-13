import React from "react";

interface AdBannerProps {
    slotId?: string;
    format?: "horizontal" | "rectangle" | "vertical";
    className?: string;
}

export default function AdBanner({ slotId, format = "horizontal", className = "" }: AdBannerProps) {
    // Placeholder for Google AdSense or Custom Ad
    // When live, replace this with actual ad script logic
    return (
        <div
            className={`relative overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center text-text-secondary ${className}`}
            style={{
                minHeight: format === "horizontal" ? "90px" : format === "rectangle" ? "250px" : "600px",
                width: "100%"
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
                <span className="text-xs font-mono border border-white/20 px-2 py-1 rounded">
                    ADVERTISEMENT SPACE
                </span>
            </div>

            {/* 
        TODO: Insert Ad Script Here
        Example:
        <ins className="adsbygoogle" ... />
      */}
        </div>
    );
}
