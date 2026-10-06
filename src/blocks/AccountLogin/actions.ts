'use server'

import { headers } from 'next/headers'

import { createSupabaseServerClient, isAuthConfigured } from '@/utilities/supabase/server'

export type LoginLinkResult =
  | { status: 'invalid' }
  | { status: 'sent' }
  /** Supabase refused or failed; `message` is safe to show. */
  | { message: string; status: 'error' }
  /** No Supabase keys are set, so no link can be sent. */
  | { status: 'unavailable' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Only a path on this site — never somewhere a crafted link could bounce a customer to. */
const safePath = (path: unknown) =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : '/account'

/**
 * The address the email link comes back to, built from the request rather than an env var
 * so it is right on localhost, on a preview deploy and on the live domain alike. Supabase
 * only honours it if it is listed under Authentication → URL Configuration → Redirect URLs.
 */
const confirmUrl = async (next: string) => {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}/auth/confirm?next=${encodeURIComponent(next)}`
}

/**
 * Emails the customer a sign-in link through Supabase Auth. Opening it signs them in — the
 * email address is verified by the act of clicking — and a first login creates the account,
 * so there is no separate sign-up and no code to type.
 */
export async function requestLoginLink(email: string, next?: string): Promise<LoginLinkResult> {
  const address = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!EMAIL.test(address)) return { status: 'invalid' }
  if (!isAuthConfigured()) return { status: 'unavailable' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: address,
    options: { emailRedirectTo: await confirmUrl(safePath(next)), shouldCreateUser: true },
  })

  if (error) {
    return {
      message:
        error.status === 429
          ? 'Too many login emails requested. Please wait a few minutes and try again.'
          : 'We could not send the login email just now. Please try again.',
      status: 'error',
    }
  }

  return { status: 'sent' }
}

/** Whether this visitor already has a session, so the login page can send them onwards. */
export async function isSignedIn(): Promise<boolean> {
  if (!isAuthConfigured()) return false
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return Boolean(data.user)
}
