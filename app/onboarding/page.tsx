"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

export default function OnboardingPage() {
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(true); // Start loading to fetch defaults
    const router = useRouter();

    useEffect(() => {
        // Fetch current user defaults
        import("@/lib/supabase/client").then(({ createClient }) => {
            const supabase = createClient();
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    // Prefer metadata from Discord
                    const meta = user.user_metadata || {};
                    // Default to: metadata username -> email prefix
                    const rawUsername = meta.username || meta.name || user.email?.split('@')[0] || "";

                    // Remove discriminator (e.g. #0) first
                    const baseUsername = rawUsername.split('#')[0];

                    // Clean up username for input (lowercase, no spaces)
                    const cleanUsername = baseUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');

                    setUsername(cleanUsername);
                    setAvatarUrl(meta.avatar_url || "");
                }
                setLoading(false);
            });
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (username.length < 3) {
            toast.error("Username must be at least 3 characters.");
            setLoading(false);
            return;
        }

        const res = await updateProfileAction(username, username, avatarUrl, ""); // Empty bio for onboarding

        if (res.success) {
            toast.success("Profile updated!");
            // Force hard reload to update Navbar state? or router.push is enough?
            // Since we revalidated layout in action, router.refresh() + push should work.
            router.refresh();
            router.push("/");
        } else {
            toast.error(res.error || "Failed to update profile.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-display font-bold mb-2">Welcome to <span className="text-primary">ABI Builder</span></h1>
                    <p className="text-text-secondary">Let's set up your profile to get started.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Choose a Username</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-text-secondary">@</span>
                            <Input
                                id="username"
                                placeholder="username"
                                className="pl-8"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>
                        <p className="text-xs text-text-secondary">Only lowercase letters, numbers, and underscores.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                        <Input
                            id="avatar"
                            placeholder="https://..."
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                        {/* Preview */}
                        <div className="flex justify-center mt-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-surface border-2 border-primary/20 flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                ) : (
                                    <User className="w-8 h-8 text-secondary" />
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Complete Setup"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
