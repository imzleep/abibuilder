import React from "react";

interface AdBannerProps {
    slotId?: string;
    format?: "horizontal" | "rectangle" | "vertical";
    className?: string;
    imageUrl?: string;
    linkUrl?: string;
}

export default function AdBanner({ slotId, format = "horizontal", className = "", imageUrl, linkUrl }: AdBannerProps) {
    // Custom Image Ad
    if (imageUrl && linkUrl) {
        return (
            <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block relative overflow-hidden bg-black/40 border border-white/5 group ${className}`}
                style={{
                    height: format === "horizontal" ? "120px" : format === "rectangle" ? "300px" : "600px",
                    width: "100%"
                }}
            >
                {/* Badge */}
                <span className="absolute top-0 right-0 bg-black/60 text-[10px] font-mono text-white/50 px-1.5 py-0.5 z-10 pointer-events-none">
                    AD
                </span>

                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="Advertisement"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </a>
        );
    }

    // Placeholder for Google AdSense or Custom Ad
    // When live, replace this with actual ad script logic
    return (
        <div
            className={`relative overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center text-text-secondary ${className}`}
            style={{
                height: format === "horizontal" ? "120px" : format === "rectangle" ? "300px" : "600px",
                width: "100%"
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
                <span className="text-xs font-mono border border-white/20 px-2 py-1 rounded">
                    ADVERTISEMENT SPACE
                </span>
            </div>
        </div>
    );
}
