"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { checkUsernameAvailability } from "@/app/actions/auth";

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Registration specific state
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check for "remember me" persistence locally on mount
        const rememberedEmail = localStorage.getItem("remembered_email");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleUsernameChange = async (val: string) => {
        // Only allow lowercase letters, numbers, and underscores
        const sanitized = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
        setUsername(sanitized);
        setUsernameAvailable(null);

        if (sanitized.length < 3) return;

        setIsCheckingUsername(true);
        try {
            const isAvailable = await checkUsernameAvailability(sanitized);
            setUsernameAvailable(isAvailable);
        } catch (error) {
            console.error("Username check failed", error);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged in successfully!");
            if (rememberMe) {
                localStorage.setItem("remembered_email", email);
            } else {
                localStorage.removeItem("remembered_email");
            }
            router.push("/");
            router.refresh();
        }

        setIsLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || username.length < 3) {
            toast.error("Please enter a valid username (min 3 chars).");
            return;
        }

        if (usernameAvailable === false) {
            toast.error("Username is already taken.");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/confirm`,
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Verification code sent to your email.");
            setIsVerifying(true);
        }

        setIsLoading(false);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: verificationCode,
            type: 'signup'
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Account verified successfully!");
            router.push("/");
            router.refresh();
        }

        setIsLoading(false);
    };

    const handleDiscordLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4 py-10">
            <Card className="w-full max-w-md border-white/10 glass-elevated">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-display font-bold">
                        {activeTab === "login" ? "Welcome Back" : "Join the Community"}
                    </CardTitle>
                    <CardDescription>
                        {activeTab === "login"
                            ? "Sign in to manage your builds"
                            : "Create an account to share your loadouts"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <a href="#" className="text-xs text-primary hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-black/20 border-white/10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-text-secondary hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(c) => setRememberMe(c as boolean)}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            {isVerifying ? (
                                <form onSubmit={handleVerify} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                        </div>
                                        <h3 className="font-bold text-lg">Verify Email</h3>
                                        <p className="text-sm text-text-secondary">
                                            Enter the 6-digit code sent to <span className="text-primary">{email}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="otp-code">Verification Code</Label>
                                        <Input
                                            id="otp-code"
                                            type="text"
                                            placeholder="123456"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="bg-black/20 border-white/10 text-center text-2xl tracking-widest font-mono py-6"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full font-bold bg-gradient-to-r from-primary to-accent"
                                        disabled={isLoading || verificationCode.length < 6}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setIsVerifying(false)}
                                        className="w-full text-xs text-text-secondary hover:text-white mt-2"
                                    >
                                        Use a different email
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">Email</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-username">Username</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-username"
                                                type="text"
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => handleUsernameChange(e.target.value)}
                                                required
                                                className={`bg-black/20 pr-10 ${usernameAvailable === true
                                                    ? "border-green-500/50 focus-visible:ring-green-500"
                                                    : usernameAvailable === false
                                                        ? "border-red-500/50 focus-visible:ring-red-500"
                                                        : "border-white/10"
                                                    }`}
                                            />
                                            <div className="absolute right-3 top-2.5">
                                                {isCheckingUsername ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
                                                ) : username.length >= 3 ? (
                                                    usernameAvailable ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-red-500" />
                                                    )
                                                ) : null}
                                            </div>
                                        </div>
                                        {username.length >= 3 && usernameAvailable === false && (
                                            <p className="text-xs text-red-400">Username is taken.</p>
                                        )}
                                        {username.length > 0 && username.length < 3 && (
                                            <p className="text-xs text-amber-400">At least 3 characters.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="bg-black/20 border-white/10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-text-secondary hover:text-white"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                                        disabled={isLoading || usernameAvailable === false || username.length < 3}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                                    </Button>

                                    <p className="text-xs text-text-secondary text-center">
                                        We'll send a code to verify your email.
                                    </p>
                                </form>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#1a1b1e] px-2 text-text-secondary">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white border-0 py-5"
                        onClick={handleDiscordLogin}
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 26.153 26.153 0 0 0-3.327 6.928 26.115 26.115 0 0 0-3.35-6.918.069.069 0 0 0-.077-.038 19.645 19.645 0 0 0-4.896 1.516.07.07 0 0 0-.033.029C1.045 8.783 0 13.921 0 19.006a.084.084 0 0 0 .041.071 19.387 19.387 0 0 0 5.899 2.946.066.066 0 0 0 .078-.023 13.298 13.298 0 0 0 1.259-2.046.066.066 0 0 0-.035-.084 9.172 9.172 0 0 1-1.397-.665.07.07 0 0 1-.004-.117c.277-.202.551-.415.816-.637a.066.066 0 0 1 .074-.012 18.083 18.083 0 0 0 8.08 0 .066.066 0 0 1 .075.011c.267.224.542.437.82.64a.069.069 0 0 1-.002.115 9.467 9.467 0 0 1-1.39.664.066.066 0 0 0-.036.084 12.872 12.872 0 0 0 1.263 2.043.064.064 0 0 0 .077.023 19.336 19.336 0 0 0 5.891-2.943.085.085 0 0 0 .041-.072c-.228-5.322-1.635-10.278-3.692-14.61a.07.07 0 0 0-.034-.029zM8.02 15.331c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.085 2.156 2.418 0 1.334-.946 2.419-2.156 2.419zm7.974 0c-1.18 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.085 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z" /></svg>
                        Continue with Discord
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
