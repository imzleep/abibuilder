"use client";

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 mt-20 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Brand & Copy */}
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="ABI Builder Logo" className="h-8 w-auto object-contain hover:opacity-90 transition-opacity" />
                        <p className="text-sm text-text-secondary">
                            &copy; {currentYear} <span className="font-bold text-white">ABI Builder</span>. Made by <a href="https://zleep.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent font-semibold transition-colors">Zleep</a>.
                        </p>
                    </div>

                    {/* Compact Links */}
                    <nav className="flex items-center gap-6 text-sm font-medium text-text-secondary">
                        <Link href="/builds" className="hover:text-primary transition-colors">
                            All Builds
                        </Link>
                        <Link href="/upload" className="hover:text-primary transition-colors">
                            Upload
                        </Link>
                        <Link href="/media-kit" className="hover:text-primary transition-colors">
                            Media Kit
                        </Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">
                            Contact
                        </Link>
                        <a href="https://buymeacoffee.com/zleepdev" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors text-yellow-500 font-semibold">
                            Support ❤️
                        </a>
                    </nav>

                </div>
            </div>
        </footer>
    );
}
