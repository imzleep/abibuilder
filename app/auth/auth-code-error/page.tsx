"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    return (
        <Card className="w-full max-w-md border-white/10 glass-elevated">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
                <CardDescription>
                    There was a problem signing you in.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                {errorDescription ? (
                    <p className="text-sm text-text-secondary bg-red-500/5 border border-red-500/20 p-3 rounded-lg">
                        {errorDescription}
                    </p>
                ) : (
                    <p className="text-sm text-text-secondary">
                        An unexpected error occurred during authentication. Please try again.
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/">Return to Home</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <AuthErrorContent />
            </Suspense>
        </div>
    );
}
