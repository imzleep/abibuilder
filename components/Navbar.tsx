"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogIn, LogOut, Search, Coffee, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { searchUsers } from "@/app/actions/profile"; // Updated import

interface NavbarProps {
  user: User | null;
  profile?: any;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const supabase = createClient();

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

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMobileMenuOpen(false);
      setShowDropdown(false);
      router.push(`/builds?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // derived data
  const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || "user";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = profile?.display_name || user?.user_metadata?.full_name || "User";


  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Builds", href: "/builds" },
    { name: "Upload Build", href: "/upload", highlight: true },
  ];

  if (profile?.is_admin) {
    navLinks.push({ name: "Admin Panel", href: "/admin", highlight: false });
  }
  if (profile?.is_moderator || profile?.is_admin) {
    navLinks.push({ name: "Mod Panel", href: "/moderator", highlight: false });
  }

  // Clean up Upload link highlight to avoid double highlight if we want
  // But let's keep Upload Highlighted as Primary Call to Action for users.

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <img src="/logo.png" alt="ABI Builder Logo" className="h-10 w-auto object-contain hover:opacity-90 transition-opacity" />
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-xl">
                  ABI <span className="text-primary">Builder</span>
                </h1>
                <p className="text-xs text-text-secondary -mt-1">Gun Database</p>
              </div>
            </Link>

            {/* Middle Section: Links and Search */}
            <div className="hidden md:flex items-center flex-1 justify-center gap-8">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={
                      link.highlight
                        ? "px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-background font-bold hover:shadow-lg transition-all duration-300"
                        : "text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
                    }
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Search Bar */}
              <div ref={dropdownRef} className="relative w-64 group">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search builds, users..."
                    className="w-full bg-black/20 border border-white/10 rounded-full px-10 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all placeholder:text-text-secondary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (userResults.length > 0) setShowDropdown(true);
                    }}
                  />
                </form>

                {/* Dropdown Results */}
                {showDropdown && userResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                      <h3 className="text-xs font-bold text-text-secondary px-3 py-2 uppercase tracking-wider">Profiles</h3>
                      {userResults.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            router.push(`/profile/${u.username}`);
                            setShowDropdown(false);
                            setSearchQuery(""); // Optional: clear or keep? Usually clear or set to username.
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                {u.username[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">{u.display_name}</span>
                              {u.is_streamer && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Streamer"></span>}
                              {u.is_verified && <span className="w-1.5 h-1.5 rounded-full bg-primary" title="Verified"></span>}
                            </div>
                            <p className="text-xs text-text-secondary truncate">@{u.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* Optional: 'Search for "query"' generic option */}
                    <div className="border-t border-white/5 p-1">
                      <button
                        onClick={(e) => handleSearch(e as any)}
                        className="w-full text-center py-2 text-xs text-primary hover:text-accent transition-colors font-medium"
                      >
                        Search all builds for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Support Button */}
              <a
                href="https://buymeacoffee.com/zleepdev"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#FFDD00] text-black font-bold hover:bg-[#FFDD00]/90 transition-all duration-300 shadow-lg shadow-yellow-500/20"
              >
                <Coffee className="w-4 h-4" />
                <span className="text-sm">Support</span>
              </a>
              {user ? (
                // Logged in view: Profile link and Logout button
                <div className="hidden sm:flex items-center gap-4">
                  <Link href={`/profile/${encodeURIComponent(username)}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {/* User avatar/initials */}
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-primary/50 relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-none max-w-[100px] truncate">{displayName}</span>
                      <span className="text-[10px] text-text-secondary leading-none">View Profile</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-danger transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                // Logged out view: Login button
                <>
                  <Link href="/login">
                    <button
                      className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg glass-elevated hover:border-primary/50 transition-all duration-300"
                      aria-label="Login"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="font-medium">Login</span>
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg glass-elevated hover:border-primary/50 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-16 right-0 bottom-0 w-64 glass border-l border-white/10 transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col p-6 space-y-6">
            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={
                    link.highlight
                      ? "px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-background font-bold text-center"
                      : "text-text-secondary hover:text-primary transition-colors duration-200 font-medium text-lg"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
              <a
                href="https://buymeacoffee.com/zleepdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[#FFDD00] text-black font-bold hover:bg-[#FFDD00]/90 transition-all duration-300 w-full"
              >
                <Coffee className="w-4 h-4" />
                <span className="font-medium">Support</span>
              </a>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/50 relative">
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.full_name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-bold">{user.user_metadata?.full_name || "User"}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg glass-elevated hover:bg-white/5 hover:text-danger transition-all duration-300 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg glass-elevated hover:border-primary/50 transition-all duration-300 w-full">
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">Login</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
