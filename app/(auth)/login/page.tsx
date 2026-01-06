"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Attempt sign IN
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // If sign in fails, try sign UP (lazy simplification for MVP)
            // OR just show error. For a real app, separate flows are better.
            // Let's stick to simple Sign Up/In toggle logic or just separate buttons.
            // For this MVP, let's just try Sign Up if Sign In fails? No, better be explicit.

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                }
            });

            if (signUpError) {
                toast.error(error.message);
            } else {
                toast.success("Check your email for the confirmation link!");
            }
        } else {
            toast.success("Logged in successfully!");
            router.push("/");
            router.refresh();
        }

        setIsLoading(false);
    };

    const handleDiscordLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to save and share your builds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white border-0"
                        onClick={handleDiscordLogin}
                    >
                        {/* Discord Icon SVG */}
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 26.153 26.153 0 0 0-3.327 6.928 26.115 26.115 0 0 0-3.35-6.918.069.069 0 0 0-.077-.038 19.645 19.645 0 0 0-4.896 1.516.07.07 0 0 0-.033.029C1.045 8.783 0 13.921 0 19.006a.084.084 0 0 0 .041.071 19.387 19.387 0 0 0 5.899 2.946.066.066 0 0 0 .078-.023 13.298 13.298 0 0 0 1.259-2.046.066.066 0 0 0-.035-.084 9.172 9.172 0 0 1-1.397-.665.07.07 0 0 1-.004-.117c.277-.202.551-.415.816-.637a.066.066 0 0 1 .074-.012 18.083 18.083 0 0 0 8.08 0 .066.066 0 0 1 .075.011c.267.224.542.437.82.64a.069.069 0 0 1-.002.115 9.467 9.467 0 0 1-1.39.664.066.066 0 0 0-.036.084 12.872 12.872 0 0 0 1.263 2.043.064.064 0 0 0 .077.023 19.336 19.336 0 0 0 5.891-2.943.085.085 0 0 0 .041-.072c-.228-5.322-1.635-10.278-3.692-14.61a.07.07 0 0 0-.034-.029zM8.02 15.331c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.085 2.156 2.418 0 1.334-.946 2.419-2.156 2.419zm7.974 0c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.085 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z" /></svg>
                        Continue with Discord
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In / Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
