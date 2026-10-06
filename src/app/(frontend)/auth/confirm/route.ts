import type { EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createSupabaseServerClient, isAuthConfigured } from '@/utilities/supabase/server'

/** Only a path on this site, so a crafted link cannot bounce a customer elsewhere. */
const safePath = (path: string | null) =>
  path && path.startsWith('/') && !path.startsWith('//') ? path : '/account'

/**
 * Where the login email's link lands. Supabase has already checked the link by the time it
 * redirects here, and hands over either a one-time `code` (its default email template, PKCE)
 * or a `token_hash` (a custom template that links here directly). Either is exchanged for a
 * session cookie and the customer goes on to their account.
 *
 * The `code` form only works in the browser that asked for the email — the other half of
 * the exchange is a cookie set when the link was requested. Opened anywhere else, the login
 * page says so and they ask for a new one.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const next = safePath(searchParams.get('next'))
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, request.url))

  if (!isAuthConfigured()) return fail('unavailable')

  const supabase = await createSupabaseServerClient()
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return fail('link')
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) return fail('link')
  } else {
    // Supabase reports an expired or already-used link as `error=...` on the way here.
    return fail('link')
  }

  return NextResponse.redirect(new URL(next, request.url))
}
