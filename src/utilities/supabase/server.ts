import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Customer accounts are Supabase Auth users — separate from the Payload `users` who edit
 * the site. The same Supabase project that stores the media, but its Auth API, reached with
 * the project URL and its publishable (anon) key rather than the S3 keys.
 */
const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''

/** Whether customer login can work at all. Until the keys are set, login says "coming soon". */
export const isAuthConfigured = () => Boolean(url() && key())

/**
 * A Supabase client bound to this request's cookies, for server actions and route handlers.
 * The session lives in those cookies; Supabase refreshes it through `setAll`, which only a
 * server action, a route handler or the proxy may call — a server component cannot write
 * cookies, which is why `src/proxy.ts` keeps the session fresh before the page renders.
 */
export const createSupabaseServerClient = async () => {
  const store = await cookies()

  return createServerClient(url(), key(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, options, value }) => store.set(name, value, options))
        } catch {
          // Called from a server component, where cookies are read-only. The proxy has
          // already refreshed the session for this request, so there is nothing to lose.
        }
      },
    },
  })
}
