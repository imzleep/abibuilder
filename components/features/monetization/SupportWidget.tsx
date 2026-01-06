import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SupportWidget() {
    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <Button
                asChild
                size="lg"
                className={cn(
                    "rounded-full shadow-xl bg-[#D2C1B6] text-[#1B3C53] hover:bg-[#c0b0a6] hover:scale-105 transition-all duration-300 font-bold"
                )}
            >
                <Link href="https://buymeacoffee.com/yourusername" target="_blank" rel="noopener noreferrer">
                    <Coffee className="mr-2 h-5 w-5" />
                    Support Dev
                </Link>
            </Button>
        </div>
    );
}
