"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "All",
    "Assault Rifle",
    "SMG",
    "Carbine",
    "Marksman Rifle",
    "Bolt-Action Rifle",
    "Shotgun",
    "LMG",
    "Pistol",
];

export function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "All";

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.replace(`/?${params.toString()}`);
    };

    return (
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar md:flex-wrap">
            {CATEGORIES.map((cat) => (
                <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryChange(cat)}
                    className={cn(
                        "whitespace-nowrap rounded-full",
                        (currentCategory === cat || (cat === "All" && !currentCategory))
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-background hover:bg-accent"
                    )}
                >
                    {cat}
                </Button>
            ))}
        </div>
    );
}
