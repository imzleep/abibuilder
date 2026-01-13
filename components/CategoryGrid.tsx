"use client";

import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryGrid() {
    const router = useRouter();

    const categories = [
        { id: "streamer", label: "Streamer Builds", icon: Users, filter: "streamer" },
        { id: "budget", label: "Budget Builds", icon: DollarSign, filter: "budget" },
        { id: "meta", label: "Meta Builds", icon: TrendingUp, filter: "meta" },
        { id: "troll", label: "Troll Builds", icon: Target, filter: "troll" },
    ];

    const handleCategoryClick = (filter: string) => {
        router.push(`/builds?tag=${filter}`); // Using router.push for SPA nav
    };

    return (
        <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
                const Icon = category.icon;
                return (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.filter)}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 glass hover:border-primary/50 hover:bg-primary/10 text-white"
                    >
                        <Icon className="w-5 h-5" />
                        {category.label}
                    </button>
                );
            })}
        </div>
    );
}
