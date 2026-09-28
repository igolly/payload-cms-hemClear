import type { Website } from '@/payload-types'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

/**
 * The Website record this deployment renders: the one ticked Active, or the only one there
 * is. Returns `null` on a fresh database — every caller has to cope with that anyway, since
 * the palette in `globals.css` is the fallback.
 */
const read = async (): Promise<null | Website> => {
  const payload = await getPayload({ config: configPromise })

  const active = await payload.find({
    collection: 'websites',
    depth: 1,
    limit: 1,
    where: { isActive: { equals: true } },
  })
  if (active.docs[0]) return active.docs[0]

  // Nothing ticked: a single-site deployment almost certainly has exactly one record, and
  // rendering it beats rendering nothing over a checkbox nobody knew to tick.
  const any = await payload.find({ collection: 'websites', depth: 1, limit: 1 })
  return any.docs[0] ?? null
}

/*
 * Saving the record drops this entry through the collection's `afterChange` hook, so the
 * tag carries the normal case. The time limit is for the one it cannot: on a fresh
 * deployment the first render caches "no website yet", and if the record is created by a
 * route that skips revalidation — a seed script, a direct database write — nothing would
 * ever evict that empty answer and the site would stay unbranded until the next deploy.
 */
export const getCachedWebsite = unstable_cache(read, ['active_website'], {
  revalidate: 300,
  tags: ['active_website'],
})
