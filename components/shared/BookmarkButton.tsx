"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleBookmarkAction } from "@/app/actions/bookmark";

interface BookmarkButtonProps {
    buildId: string;
    initialBookmarked: boolean;
}

export function BookmarkButton({ buildId, initialBookmarked }: BookmarkButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticBookmarked, toggleOptimistic] = useOptimistic(
        initialBookmarked,
        (state) => !state
    );

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to build details if card is clicked
        e.stopPropagation();

        startTransition(async () => {
            toggleOptimistic(null); // Flip state immediately
            const result = await toggleBookmarkAction(buildId);
            if (!result.success) {
                toast.error(result.error);
                // Optimistic update will revert automatically if we revalidated, 
                // but simple toggleOptimistic might desync if error.
                // For MVP, just show toast.
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-transparent"
            onClick={handleToggle}
            disabled={isPending}
        >
            <Bookmark
                className={cn(
                    "h-5 w-5 transition-colors",
                    optimisticBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
                )}
            />
            <span className="sr-only">Bookmark</span>
        </Button>
    );
}
