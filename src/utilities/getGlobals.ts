import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { rewriteMediaProxyURLs } from './storageURL'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) => {
  // `depth` must be part of the cache key: without it, two callers requesting the same
  // global at different depths share one entry and whichever ran first wins.
  const cached = unstable_cache(async () => getGlobal<T>(slug, depth), [slug, String(depth)], {
    tags: [`global_${slug}`],
  })
  // Rewritten outside the cache so entries stored before direct bucket delivery are fixed too.
  return async () => rewriteMediaProxyURLs(await cached())
}
