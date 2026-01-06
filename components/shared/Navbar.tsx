"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PlusSquare, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { UserNav } from "./UserNav";

interface NavbarProps {
    user: User | null;
}

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-lg shadow-black/20">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="mr-8 flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
                        <Hexagon className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent group-hover:to-primary transition-all duration-300">
                        ABI Builder
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary shadow-[0_0_10px_-5px_rgba(245,184,0,0.5)] border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Create Build Button */}
                    <Button
                        size="sm"
                        asChild
                        className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 border border-primary/20"
                    >
                        <Link href="/builder">
                            <PlusSquare className="mr-2 h-4 w-4" />
                            NEW BUILD
                        </Link>
                    </Button>

                    <div className="h-6 w-px bg-border/50 mx-2" />

                    {/* User Auth State */}
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <Button size="sm" variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu (Sheet) */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] border-r-primary/20 bg-background/95 backdrop-blur-xl">
                        <div className="flex flex-col space-y-6 py-6">
                            <Link href="/" className="flex items-center gap-2 px-2" onClick={() => setIsOpen(false)}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                                    <Hexagon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-bold text-lg text-foreground">ABI Builder</span>
                            </Link>

                            <div className="flex flex-col space-y-2">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                            pathname === link.href
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="my-4 h-px bg-border/50" />

                                <Link
                                    href="/builder"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-4 py-3 text-sm font-bold text-primary-foreground bg-primary rounded-md shadow-lg shadow-primary/20"
                                >
                                    <PlusSquare className="mr-2 h-4 w-4" />
                                    Create New Build
                                </Link>

                                <div className="mt-4 px-2">
                                    {user ? (
                                        <div className="flex items-center space-x-2 text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                                            <span className="text-xs font-mono truncate">{user.email}</span>
                                        </div>
                                    ) : (
                                        <Button asChild className="w-full" variant="outline">
                                            <Link href="/login" onClick={() => setIsOpen(false)}>Login Account</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
