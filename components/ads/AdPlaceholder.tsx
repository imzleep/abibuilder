import React from "react";

interface AdPlaceholderProps {
    format?: "horizontal" | "rectangle" | "vertical" | "fluid";
    className?: string;
    text?: string;
}

export default function AdPlaceholder({
    format = "horizontal",
    className = "",
    text = "ADVERTISEMENT SPACE"
}: AdPlaceholderProps) {

    // Determine height based on format
    let heightStyle = "120px";
    if (format === "rectangle") heightStyle = "300px";
    if (format === "vertical") heightStyle = "600px";
    if (format === "fluid") heightStyle = "auto";

    return (
        <div
            className={`relative overflow-hidden bg-black/20 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary/50 backdrop-blur-sm ${className}`}
            style={{
                height: heightStyle,
                width: "100%",
                minHeight: format === "fluid" ? "100px" : undefined
            }}
        >
            {/* Subtle animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            <div className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-xs font-mono font-bold tracking-widest border border-white/10 px-3 py-1.5 rounded-md bg-black/40">
                    {text}
                </span>
                <span className="text-[10px] mt-2 opacity-50">Google AdSense Integration Pending</span>
            </div>
        </div>
    );
}
