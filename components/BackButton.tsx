"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    fallbackUrl: string;
    text?: string;
}

export default function BackButton({ fallbackUrl, text = "Back" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // If history has more than 1 entry (meaning they didn't land here directly)
        // Note: window.history.length > 1 is not always reliable in Next.js SPA navigation, 
        // but router.back() is generally the desired behavior.
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-text-secondary hover:text-primary mb-6 transition-colors group"
        >
            <ArrowLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            {text}
        </button>
    );
}
