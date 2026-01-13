"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!");

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-elevated rounded-xl p-6 border border-white/5 text-center">
            <p className="text-sm text-text-secondary mb-4">Like this build? Share it!</p>
            <button
                onClick={handleCopy}
                className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                    copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                        : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
                )}
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Link2 className="w-4 h-4" />
                        Copy Link
                    </>
                )}
            </button>
        </div>
    );
}
