"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Search } from "lucide-react";
import { searchUsers } from "@/app/actions/profile";

interface HeroProps {
  stats: {
    totalBuilds: number;
    activeUsers: number;
    weapons: number;
    totalVotes: number;
  };
}

export default function Hero({ stats: inputStats }: HeroProps) {
  const stats = inputStats || { totalBuilds: 0, activeUsers: 0, weapons: 70, totalVotes: 0 };
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const results = await searchUsers(searchQuery);
        setUserResults(results);
        if (results.length > 0) setShowDropdown(true);
        else setShowDropdown(false);
      } else {
        setUserResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/builds?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Subtle Static Glow */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px]" />
      </div>

      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 215, 0, 0.1) 2px, rgba(255, 215, 0, 0.1) 4px)'
      }} />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Main Heading */}
        {/* Main Logo & Heading */}
        <div className="flex flex-col items-center justify-center mb-8 animate-fade-in">
          <img
            src="/logo.png"
            alt="ABI Builder - Arena Breakout Infinite Builds Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mb-6 drop-shadow-[0_0_25px_rgba(250,189,0,0.2)]"
          />
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            ABI <span className="text-gradient">Builder</span>
            <span className="sr-only">Arena Breakout Infinite Builds</span>
          </h1>
        </div>

        {/* Subtitle */}
        {/* Subtitle */}
        <p className="text-text-secondary text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-in">
          Discover, create, and share the most powerful weapon builds for{" "}
          <span className="text-primary font-semibold">Arena Breakout: Infinite</span>. Fueled by{" "}
          <a
            href="https://buffbuff.com/top-up/arena-breakout-infinite?utm_media=zleep&utm_source=zleep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-primary transition-colors hover:underline"
          >
            BuffBuff
          </a>
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto animate-fade-in" ref={dropdownRef}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            <div className="relative glass-elevated rounded-2xl p-2 glow-border-hover">
              <form onSubmit={handleSearch} className="flex items-center space-x-3 px-4">
                <Search className="w-6 h-6 text-text-secondary flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search weapons, builds, or creators..."
                  className="flex-1 bg-transparent border-none outline-none text-lg py-4 placeholder:text-text-secondary/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (userResults.length > 0) setShowDropdown(true);
                  }}
                />
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-background hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex-shrink-0">
                  Search
                </button>
              </form>
            </div>

            {/* Dropdown Results */}
            {showDropdown && userResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 mx-2 bg-surface-elevated border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 text-left">
                  <h3 className="text-xs font-bold text-text-secondary px-3 py-2 uppercase tracking-wider">Profiles</h3>
                  {userResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        router.push(`/profile/${u.username}`);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        {u.avatar_url ? (
                          <Image
                            src={u.avatar_url}
                            alt={u.username}
                            fill
                            quality={95}
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {u.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base truncate">{u.display_name}</span>
                          {u.is_streamer && <span className="w-2 h-2 rounded-full bg-purple-500" title="Streamer"></span>}
                          {u.is_verified && <span className="w-2 h-2 rounded-full bg-primary" title="Verified"></span>}
                        </div>
                        <p className="text-sm text-text-secondary truncate">@{u.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/5 p-2">
                  <button
                    onClick={(e) => handleSearch(e as any)}
                    className="w-full text-center py-2 text-sm text-primary hover:text-accent transition-colors font-medium"
                  >
                    Search all builds for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { label: "Total Builds", value: stats.totalBuilds.toLocaleString() },
            { label: "Registered Users", value: stats.activeUsers.toLocaleString() },
            { label: "Weapons", value: stats.weapons.toLocaleString() + "+" },
            { label: "Total Votes", value: stats.totalVotes.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="glass-elevated rounded-xl p-6 hover:glow-border-hover transition-all duration-300">
              <div className="font-display font-bold text-3xl md:text-4xl text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
