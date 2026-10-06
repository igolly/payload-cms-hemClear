'use server'

import { createSupabaseServerClient, isAuthConfigured } from '@/utilities/supabase/server'

import type { AccountOverview } from './types'

/**
 * What the account page shows the signed-in customer. The session is checked here, on the
 * server, on every call — the page itself is static and public, so this is the only gate on
 * anything personal.
 *
 * `subscription` and `cashbackBalance` stay null until there is somewhere to read them
 * from: the site places no orders yet, and a page that showed a made-up delivery or card to
 * a real customer would be worse than one that says there is nothing yet. When a commerce
 * platform is connected, look the customer up by `user.email` (or a stored customer id in
 * `user.app_metadata`) and fill them in — the page already renders every field.
 */
export async function getAccountOverview(): Promise<AccountOverview> {
  if (!isAuthConfigured()) return { status: 'unavailable' }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return { status: 'signedOut' }

  return {
    cashbackBalance: null,
    email: data.user.email ?? '',
    status: 'ready',
    subscription: null,
  }
}

export async function signOut(): Promise<void> {
  if (!isAuthConfigured()) return
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
}
