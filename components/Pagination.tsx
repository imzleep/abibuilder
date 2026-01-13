"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Show page 1 even if single page
    if (totalItems === 0) return null;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);

        // Optional: Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        // Simple logic: Show first, last, current, and surrounding
        // Example: 1 ... 4 5 6 ... 10
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in">
            {/* Previous */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pages */}
            <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return <span key={`ellipsis-${index}`} className="px-2 text-text-secondary">...</span>;
                    }

                    const p = page as number;
                    const isActive = p === currentPage;

                    return (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={cn(
                                "w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300",
                                isActive
                                    ? "bg-primary text-background shadow-lg shadow-primary/25 scale-105"
                                    : "glass hover:bg-white/10 hover:border-primary/30"
                            )}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Next */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
