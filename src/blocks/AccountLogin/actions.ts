'use server'

export type LoginCodeResult =
  | { status: 'invalid' }
  | { status: 'sent' }
  /** No account provider is connected yet, so no code can be sent. */
  | { status: 'unavailable' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Asks for a one-time login code for `email`.
 *
 * This is the one place login connects to an account provider — Shopify's Customer Account
 * API, or a Customers collection here that emails and texts the code. None is chosen yet,
 * so it validates the address and reports that login is unavailable rather than claiming
 * a code went out that never will. Once a provider is wired in, return `sent` on success;
 * the form already shows the "check your inbox" state for it.
 */
export async function requestLoginCode(email: string): Promise<LoginCodeResult> {
  const address = typeof email === 'string' ? email.trim() : ''
  if (!EMAIL.test(address)) return { status: 'invalid' }

  return { status: 'unavailable' }
}
