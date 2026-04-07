"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Guide } from "@/lib/data/guides";

interface GuideCardProps {
  guide: Guide;
  fullHeight?: boolean;
}

export default function GuideCard({ guide, fullHeight = true }: GuideCardProps) {
  const guideLink = guide.linkOverride || `/guides/${guide.slug}`;

  return (
    <div className={cn(
      "group relative glass-elevated rounded-xl overflow-hidden transition-all duration-300 animate-fade-in hover:border-primary/30 flex flex-col p-5",
      fullHeight ? "h-full" : "h-fit"
    )}>
      
      {/* Title & Description wrapped in link */}
      <Link href={guideLink} className="block flex-1 mb-4">
        {guide.thumbnailUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-surface aspect-[16/9]">
            <Image
              src={guide.thumbnailUrl}
              alt={guide.title}
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <h3 className="font-display font-bold text-xl mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
          {guide.description}
        </p>
      </Link>

      {/* Author Footer */}
      <div className="pt-3 border-t border-white/5 mt-auto flex items-center">
        <p className="text-xs text-text-secondary flex items-center gap-1.5">
          <span>by</span>
          <Link href={`/profile/${guide.author.toLowerCase()}`} className="font-medium text-primary hover:text-accent hover:underline transition-colors">
            {guide.authorDisplayName || guide.author}
          </Link>
        </p>
      </div>

    </div>
  );
}
