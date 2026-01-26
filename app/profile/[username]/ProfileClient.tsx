"use client";

import NextImage from "next/image";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import BuildCard from "@/components/BuildCard";
import { WeaponBuild } from "@/types";
import { Trophy, TrendingUp, Link as LinkIcon, Edit, User, Save, X, Filter, SlidersHorizontal, Search } from "lucide-react";
import { UserProfile, updateProfileAction } from "@/app/actions/profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { compressImage } from "@/lib/image-compression";
import { createClient } from "@/lib/supabase/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Loader2, Upload } from "lucide-react";
import { checkUsernameAvailability } from "@/app/actions/auth";


interface ProfileClientProps {
    profile: UserProfile;
    uploadedBuilds: WeaponBuild[];
    totalUploaded: number;
    savedBuilds: WeaponBuild[];
    totalSaved: number;
    isOwner: boolean;
    autoOpenEdit?: boolean;
    initialTab?: 'uploaded' | 'saved';
    currentPage?: number;
    initialFilters: any;
}

export default function ProfileClient({
    profile,
    uploadedBuilds,
    totalUploaded,
    savedBuilds,
    totalSaved,
    isOwner,
    autoOpenEdit = false,
    initialTab = 'uploaded',
    currentPage = 1,
    initialFilters,
}: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<'uploaded' | 'saved'>(initialTab);
    const [editOpen, setEditOpen] = useState(autoOpenEdit);
    const [editLoading, setEditLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter State
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'most-voted');
    const [buildSearchQuery, setBuildSearchQuery] = useState(initialFilters.query || '');

    // Update URL Helper
    const updateUrl = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page on filter change
        if (key !== 'page') params.delete('page');

        // Sync local state
        if (key === 'sortBy') setSortBy(value || 'most-voted');
        if (key === 'query') setBuildSearchQuery(value || '');

        router.push(`? ${params.toString()} `, { scroll: false });
    };

    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (tab: 'uploaded' | 'saved') => {
        // Optimistic update
        setActiveTab(tab);
        // Navigate
        router.push(`? tab = ${tab}& page=1`);
    };

    // Edit Form State
    const [username, setUsername] = useState(profile.username);
    const [displayName, setDisplayName] = useState(profile.display_name);
    const [bio, setBio] = useState(profile.bio || "");
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
    const [uploading, setUploading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const checkUsername = async (val: string) => {
        if (val === profile.username) {
            setUsernameAvailable(true);
            return;
        }
        if (val.length < 3) return;

        setIsCheckingUsername(true);
        const isAvailable = await checkUsernameAvailability(val);
        setUsernameAvailable(isAvailable);
        setIsCheckingUsername(false);
    };


    const handleVote = (buildId: string, type: 'up' | 'down') => {
        // BuildCard handles the logic and toast
        router.refresh();
    };

    const handleBookmark = (buildId: string) => {
        // BuildCard handles the logic and toast
        router.refresh();
    };

    const handleCopy = (buildId: string) => {
        toast.success("Build code copied!");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file.");
            return;
        }

        setUploading(true);
        try {
            // 1. Client-side Compression
            const compressedFile = await compressImage(file, {
                maxWidth: 300,
                maxHeight: 300,
                maxSizeBytes: 100 * 1024,
                quality: 0.8,
                format: 'image/webp' // Avatars can be WebP too for better compression
            });

            // 2. Upload to Supabase
            const supabase = createClient();
            const fileExt = compressedFile.name.split('.').pop();
            // RLS Policy requires: auth.uid() = (storage.foldername(name))[1]::uuid
            // So we MUST store it in a folder named with the user's ID.
            const filePath = `${profile.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, compressedFile, {
                    upsert: true
                });

            if (uploadError) {
                console.error("Supabase Upload Error:", uploadError);
                throw uploadError;
            }

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
            toast.success("Image uploaded, click Save to confirm.");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditLoading(true);

        try {
            // Client-side validation
            if (username.length < 3) {
                toast.error("Username must be at least 3 characters.");
                setEditLoading(false);
                return;
            }

            if (!usernameAvailable) {
                toast.error("Username is already taken.");
                setEditLoading(false);
                return;
            }

            const res = await updateProfileAction(username, displayName, avatarUrl, bio);

            if (res.success) {
                toast.success("Profile updated successfully!");
                setEditOpen(false);
                // Simple reload to reflect changes for now
                // Redirect if username changed, otherwise just reload/refresh
                if (username !== profile.username) {
                    window.location.href = `/profile/${username}`;
                } else {
                    window.location.reload();
                }
            } else {
                toast.error(res.error || "Failed to update profile.");
            }
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setEditLoading(false);
        }
    };

    const [isDiscordLinked, setIsDiscordLinked] = useState(false);

    useEffect(() => {
        if (isOwner) {
            const checkIdentities = async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.identities) {
                    const discordIdentity = user.identities.find(id => id.provider === 'discord');
                    if (discordIdentity) {
                        setIsDiscordLinked(true);

                        // Auto-sync avatar if missing
                        if (!profile.avatar_url) {
                            const discordAvatar = discordIdentity.identity_data?.avatar_url || discordIdentity.identity_data?.picture;
                            if (discordAvatar) {
                                toast.info("Syncing Discord avatar...");
                                await updateProfileAction(profile.username, profile.display_name, discordAvatar, profile.bio || "");
                                setAvatarUrl(discordAvatar);
                                setTimeout(() => window.location.reload(), 1500);
                            }
                        }
                    }
                }
            };
            checkIdentities();
        }
    }, [isOwner, profile.avatar_url, profile.username, profile.bio]);

    const handleDiscordConnect = async () => {
        const supabase = createClient();
        toast.loading("Redirecting to Discord...");

        const { data, error } = await supabase.auth.linkIdentity({
            provider: 'discord',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'identify email'
            }
        });

        if (error) {
            toast.dismiss();
            toast.error(error.message);
        }
        // If successful, it redirects, so no need for success toast here.
    };

    const currentBuilds = activeTab === 'uploaded' ? uploadedBuilds : savedBuilds;

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Profile Header */}
                <div className="glass-elevated rounded-2xl p-8 mb-8 relative overflow-hidden group">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 p-32 opacity-10 bg-gradient-to-br from-primary to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    {/* Action Buttons (Edit & Link) */}
                    {isOwner && (
                        <div className="absolute top-4 right-4 z-20 flex flex-col md:flex-row gap-2">
                            {!isDiscordLinked && (
                                <Button
                                    onClick={handleDiscordConnect}
                                    variant="outline"
                                    size="sm"
                                    className="glass hover:bg-[#5865F2]/20 hover:text-[#5865F2] hover:border-[#5865F2]/50 transition-all gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Connect Discord</span>
                                </Button>
                            )}

                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="glass hover:bg-primary/20 hover:text-primary transition-all gap-2">
                                        <Edit className="w-4 h-4" />
                                        <span className="hidden sm:inline">Customize Profile</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] glass-elevated border-white/10">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your public profile information.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-text-secondary">@</span>
                                                <Input
                                                    id="username"
                                                    value={username}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                                        setUsername(val);
                                                        setDisplayName(e.target.value); // Sync display name initially
                                                        checkUsername(val);
                                                    }}
                                                    className={`pl-8 bg-black/20 ${usernameAvailable === false ? "border-red-500" : "border-white/10"}`}
                                                    maxLength={20}
                                                />
                                                {isCheckingUsername && (
                                                    <div className="absolute right-3 top-2.5">
                                                        <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
                                                    </div>
                                                )}
                                            </div>
                                            {(() => {
                                                if (profile.last_username_change) {
                                                    const lastChange = new Date(profile.last_username_change);
                                                    const now = new Date();
                                                    // Calculate difference in milliseconds then convert to days
                                                    const diffTime = Math.abs(now.getTime() - lastChange.getTime());
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                    // If less than 30 days have passed
                                                    // Note: We used Math.ceil for diffDays, so if it's 0.1 days, it counts as 1 day passed? 
                                                    // Let's stick to the previous reliable logic:
                                                    // remaining = 30 - days_passed

                                                    const daysPassed = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
                                                    const remaining = 30 - daysPassed;

                                                    if (remaining > 0) {
                                                        return (
                                                            <p className="text-xs text-yellow-500 mt-1">
                                                                You can change your username again in {remaining} days.
                                                            </p>
                                                        );
                                                    }
                                                }

                                                return (
                                                    <p className="text-xs text-text-secondary mt-1">
                                                        Note: You can change your username once every 30 days.
                                                    </p>
                                                );
                                            })()}
                                            {username !== profile.username && usernameAvailable === false && (
                                                <p className="text-xs text-red-500 mt-1">Username is already taken.</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className={`bg-black/20 ${displayName.toLowerCase() !== username ? "border-amber-500" : "border-white/10"}`}
                                                maxLength={20}
                                            />
                                            {displayName.toLowerCase() !== username ? (
                                                <p className="text-xs text-amber-500 mt-1">
                                                    Display name must match username (case-insensitive).
                                                </p>
                                            ) : (
                                                <p className="text-xs text-text-secondary mt-1">
                                                    You can capitalize your name (Twitch style).
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="bg-black/20 border-white/10 min-h-[100px]"
                                                placeholder="Tell us about yourself..."
                                                maxLength={160}
                                            />
                                            <p className="text-xs text-text-secondary text-right">{bio.length}/160</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar">Profile Picture</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                    {avatarUrl ? (
                                                        <NextImage src={avatarUrl} alt="Avatar Preview" fill quality={95} sizes="48px" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                            {username[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        disabled={uploading}
                                                        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                                    />
                                                    {uploading && <div className="absolute right-3 top-2.5"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={editLoading} className="w-full">
                                                {editLoading ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-surface shadow-xl relative group-hover:scale-105 transition-transform duration-300">
                                {profile.avatar_url ? (
                                    <NextImage src={profile.avatar_url} alt={profile.display_name} fill quality={95} sizes="128px" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                                        {profile.username[0]?.toUpperCase()}
                                    </div>
                                )}
                                {/* Quick Edit Overlay for Avatar (Optional, can add later) */}
                            </div>
                            {profile.is_verified && (
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background" title="Verified User">
                                    <svg className="w-6 h-6 text-background" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="mb-4">
                                <h1 className="font-display font-bold text-4xl mb-2 flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                    <span className={profile.is_supporter ? "text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" : ""}>
                                        {profile.display_name}
                                    </span>
                                    {profile.is_streamer && (
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/50 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> STREAMER
                                        </span>
                                    )}
                                </h1>
                                <p className="text-text-secondary mb-4 flex items-center justify-center md:justify-start gap-2">
                                    @{profile.username}
                                </p>
                                <p className="text-text-secondary max-w-2xl mx-auto md:mx-0 whitespace-pre-wrap">{profile.bio || "No bio yet."}</p>
                            </div>

                            {/* Badges */}
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start items-center">
                                {/* Member Badge (Default) */}
                                <span className="px-3 py-1 rounded-full text-xs font-medium glass border border-white/10 text-text-secondary">Member</span>

                                {/* Supporter Badge (Rainbow) */}
                                {profile.is_supporter && (
                                    <span className="relative px-3 py-1 rounded-full text-xs font-bold bg-transparent overflow-hidden group/supporter select-none">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-20 group-hover/supporter:opacity-30 transition-opacity" />
                                        <div className="absolute inset-0 rounded-full border border-white/10" />
                                        <span className="relative bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                                            Supporter
                                        </span>
                                    </span>
                                )}

                                {/* Admin Badge */}
                                {profile.is_admin && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold glass border border-red-500/30 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                        ADMIN
                                    </span>
                                )}

                                {/* Mod Badge */}
                                {profile.is_moderator && !profile.is_admin && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold glass border border-blue-500/30 text-blue-400 bg-blue-500/10">
                                        MOD
                                    </span>
                                )}

                                {/* Streamer Badge */}
                                {profile.is_streamer && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold glass border border-purple-500/30 text-purple-400 bg-purple-500/10 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                        Streamer
                                    </span>
                                )}

                                {/* Verified Badge (Keep if needed separately, or merge logic) */}
                                {profile.is_verified && !profile.is_streamer && !profile.is_admin && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium glass border border-primary/20 text-primary">Verified</span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                                <div className="glass rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                        <Trophy className="w-5 h-5 text-primary" />
                                        <span className="text-text-secondary text-sm">Builds</span>
                                    </div>
                                    <div className="font-display font-bold text-2xl text-gradient">{profile.stats.totalBuilds}</div>
                                </div>
                                <div className="glass rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        <span className="text-text-secondary text-sm">Upvotes</span>
                                    </div>
                                    <div className="font-display font-bold text-2xl text-gradient">{profile.stats.totalUpvotes.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                {/* Tabs & Filters */}
                <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleTabChange('uploaded')}
                            className={`px-4 py-2 font-semibold transition-all relative ${activeTab === 'uploaded'
                                ? 'text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Uploaded ({totalUploaded})
                            {activeTab === 'uploaded' && (
                                <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                            )}
                        </button>
                        <button
                            onClick={() => handleTabChange('saved')}
                            className={`px-4 py-2 font-semibold transition-all relative ${activeTab === 'saved'
                                ? 'text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Saved ({totalSaved})
                            {activeTab === 'saved' && (
                                <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                            <Input
                                placeholder="Quick search..."
                                value={buildSearchQuery}
                                onChange={(e) => updateUrl('query', e.target.value)}
                                className="pl-9 w-full sm:w-64 bg-black/20 border-white/10 h-9"
                            />
                        </div>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="glass gap-2 hover:text-primary border-white/10 h-9 bg-black/40 min-w-[140px] justify-between">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span>
                                            {({
                                                'most-voted': 'Most Voted',
                                                'recent': 'Recently Added',
                                                'price-low': 'Price: Low to High',
                                                'price-high': 'Price: High to Low'
                                            } as Record<string, string>)[sortBy] || 'Sort By'}
                                        </span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-elevated border-white/10">
                                <DropdownMenuItem
                                    onClick={() => updateUrl('sortBy', 'most-voted')}
                                    className={`cursor-pointer ${sortBy === 'most-voted' ? 'bg-primary/20 text-primary' : ''}`}
                                >
                                    Most Voted
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateUrl('sortBy', 'recent')}
                                    className={`cursor-pointer ${sortBy === 'recent' ? 'bg-primary/20 text-primary' : ''}`}
                                >
                                    Recently Added
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateUrl('sortBy', 'price-low')}
                                    className={`cursor-pointer ${sortBy === 'price-low' ? 'bg-primary/20 text-primary' : ''}`}
                                >
                                    Price: Low to High
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateUrl('sortBy', 'price-high')}
                                    className={`cursor-pointer ${sortBy === 'price-high' ? 'bg-primary/20 text-primary' : ''}`}
                                >
                                    Price: High to Low
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Builds Section */}
                <div className="mb-8">
                    {currentBuilds.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentBuilds.map((build) => (
                                <BuildCard
                                    key={build.id}
                                    build={build}
                                    onVote={handleVote}
                                    onBookmark={handleBookmark}
                                    onCopy={handleCopy}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card/30 rounded-xl border border-dashed border-white/10">
                            <p className="text-text-secondary text-lg">
                                {activeTab === 'uploaded' ? "This user hasn't uploaded any builds yet." : "This user hasn't saved any builds yet."}
                            </p>
                        </div>
                    )}

                    <div className="mt-8">
                        <Pagination
                            totalItems={activeTab === 'uploaded' ? totalUploaded : totalSaved}
                            itemsPerPage={9}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
