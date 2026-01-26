"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import NextImage from "next/image";

interface Streamer {
  id: string;
  username: string;
  avatar_url: string;
}

interface StreamerRowProps {
  streamers: Streamer[];
}

export default function StreamerRow({ streamers }: StreamerRowProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter out streamers with no avatar or ensure fallback?
  // Let's use all for now.
  const displayStreamers = streamers && streamers.length > 0 ? streamers : [];

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || displayStreamers.length < 5) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, displayStreamers.length]);

  const handleStreamerClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handlePrev = () => {
    if (displayStreamers.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + displayStreamers.length) % displayStreamers.length);
  };

  const handleNext = () => {
    if (displayStreamers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % displayStreamers.length);
  };

  // Calculate visible streamers with wrap-around
  const getVisibleStreamers = () => {
    if (displayStreamers.length === 0) return [];
    if (displayStreamers.length < 5) return displayStreamers; // Show all if less than 5

    const visible = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % displayStreamers.length;
      visible.push(displayStreamers[index]);
    }
    return visible;
  };

  const visibleStreamers = getVisibleStreamers();

  if (displayStreamers.length === 0) return null;

  return (
    <section className="py-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl mb-2">
              <span className="text-gradient">Streamer</span> Spotlight
            </h2>
            <p className="text-text-secondary">
              Discover builds from your favorite content creators
            </p>
          </div>

        </div>

        {/* Streamers Carousel with Prev/Next */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-elevated flex items-center justify-center hover:border-primary/50 transition-all -ml-6"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-elevated flex items-center justify-center hover:border-primary/50 transition-all -mr-6"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Streamers Container */}
          <div className="flex gap-6 justify-center overflow-hidden py-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleStreamers.map((streamer) => (
                <motion.button
                  layout
                  key={streamer.id}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
                  onClick={() => handleStreamerClick(streamer.username)}
                  className="group relative flex-shrink-0 w-32"
                >
                  {/* Avatar Container */}
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Avatar */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-elevated group-hover:border-primary transition-all duration-300 bg-surface">
                      <NextImage
                        src={streamer.avatar_url || "https://via.placeholder.com/120?text=?"}
                        alt={streamer.username}
                        fill
                        quality={95}
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    {/* Build Count Badge - Removed for now or fetch later
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-elevated text-xs font-bold border border-primary/30">
                      {streamer.buildCount}
                    </div>
                    */}
                  </div>

                  {/* Name */}
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                      {streamer.username}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
