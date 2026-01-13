import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    // Check for errors returned by Supabase directly
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error || errorDescription) {
        console.error('Auth Callback Incoming Error:', error, errorDescription);

        let customMessage = errorDescription || "An error occurred during authentication.";

        if (customMessage.includes("already linked") || customMessage.includes("already used")) {
            customMessage = "This Discord account is already linked to another user. Please use a different account.";
        }

        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&error_description=${encodeURIComponent(customMessage)}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Check if it's a new or existing user
            const { data: { user } } = await supabase.auth.getUser();

            // If user is new (created in last minute), redirect to profile edit
            if (user && user.created_at) {
                const created = new Date(user.created_at).getTime();
                const now = new Date().getTime();
                const diffSeconds = (now - created) / 1000;

                // Threshold: 30 seconds to consider "Just Registered"
                if (diffSeconds < 60) {
                    // We need the username to redirect to profile.
                    // The profile might have been created by trigger.
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', user.id)
                        .single();

                    if (profile?.username) {
                        const forwardedHost = request.headers.get('x-forwarded-host');
                        const originUrl = forwardedHost ? `https://${forwardedHost}` : origin;
                        return NextResponse.redirect(`${originUrl}/profile/${profile.username}?edit=true`);
                    }
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development';
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        } else {
            console.error('Auth Callback Error:', error);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=AuthError&error_description=${encodeURIComponent(error.message)}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=NoCode&error_description=No+authorization+code+received`);
}
