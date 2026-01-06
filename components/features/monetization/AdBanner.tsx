"use client";

import { cn } from "@/lib/utils";

interface AdBannerProps {
    slot: string;
    format?: "horizontal" | "rectangle" | "vertical";
    className?: string;
}

export function AdBanner({ format = "horizontal", className }: AdBannerProps) {
    // Dimensions map to prevent CLS
    const dimensions = {
        horizontal: "h-[100px] w-full max-w-[728px]", // Mobile Banner / Leaderboard
        rectangle: "h-[250px] w-[300px]", // MPU
        vertical: "h-[600px] w-[160px]", // Skyscraper
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center bg-muted/50 border border-dashed border-border rounded-lg mx-auto overflow-hidden",
                dimensions[format],
                className
            )}
        >
            <div className="text-center p-4">
                <p className="text-xs text-muted-foreground font-mono uppercase mb-1">Advertisement</p>
                <p className="text-sm font-medium text-foreground/80">Support ABI Builder</p>
                {/* Actual Ad Script would go here */}
            </div>
        </div>
    );
}
