import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams, origin: urlOrigin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    // Cloudflare/Vercel origin fix
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const effectiveHost = forwardedHost || host || urlOrigin.replace(/^https?:\/\//, '');
    const origin = `${protocol}://${effectiveHost}`;

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // redirect user to specified redirect URL or root of app
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // redirect the user to an error page with some instructions
    return NextResponse.redirect(`${origin}/login?error=AuthCodeError`)
}
