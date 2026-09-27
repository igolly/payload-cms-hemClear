import type { CollectionAfterReadHook } from 'payload'

import {
  PINNED_ABOVE,
  PINNED_BELOW,
  PINNED_SLUGS,
  PINNED_SOURCE,
  isPinnedSlug,
  toPinnedProps,
  type PinnedSlug,
} from '@/puck/pinned'

/**
 * Puts the header, the hero and the footer into a page's `puckData` as it is read.
 *
 * The editor takes whatever `puckData` it is handed as the state it compares every later
 * change against. The three were being added on the canvas instead, one dispatch after the
 * editor had already taken that reading — so every page opened already marked "Unsaved",
 * an editor could not tell their own edits from the injection, and discarding was never
 * safe. Added here they are simply part of the page the editor loads, and the canvas has
 * nothing left to do.
 *
 * `syncPuckPinned` removes them again on the way back in, so the stored document is
 * unchanged. Only a signed-in read gets them: a visitor's page is rendered from `layout`
 * and would pay for two global reads it has no use for.
 */

/** Fixed ids, matching the canvas: re-opening a page must not churn the document. */
const PINNED_IDS: Record<PinnedSlug, string> = {
  footer: 'site-footer',
  header: 'site-header',
  pageHero: 'page-hero',
}

/** Deep enough for each one to render: nav links, then footer columns and hero media. */
const PINNED_DEPTH: Record<PinnedSlug, number> = { footer: 2, header: 1, pageHero: 2 }

type Item = { props: Record<string, unknown>; type: string }

export const injectPuckPinned: CollectionAfterReadHook = async ({ context, doc, req }) => {
  // The hero is re-read at its own depth below, which lands back here.
  if (context?.skipPinnedInject) return doc
  if (!req?.user) return doc

  const content = doc?.puckData?.content
  if (!Array.isArray(content)) return doc
  if (content.some((item) => isPinnedSlug((item as Item)?.type))) return doc

  const load = async (slug: PinnedSlug): Promise<Item | null> => {
    const source = PINNED_SOURCE[slug]

    try {
      const data =
        source.type === 'global'
          ? await req.payload.findGlobal({ slug: source.slug, depth: PINNED_DEPTH[slug], req })
          : (
              await req.payload.findByID({
                collection: 'pages',
                context: { skipPinnedInject: true },
                depth: PINNED_DEPTH[slug],
                id: doc.id,
                req,
              })
            )?.[source.name]

      const props = toPinnedProps(slug, data as Record<string, unknown>)
      return Object.keys(props).length > 0 ? { props: { ...props, id: PINNED_IDS[slug] }, type: slug } : null
    } catch (error) {
      // A page that cannot show its chrome is still editable; the canvas keeps its own
      // fallback for exactly this case.
      req.payload.logger.warn({ err: error, msg: `[puck] could not load pinned ${slug}` })
      return null
    }
  }

  const loaded = Object.fromEntries(
    await Promise.all(PINNED_SLUGS.map(async (slug) => [slug, await load(slug)] as const)),
  ) as Partial<Record<PinnedSlug, Item | null>>

  const pick = (slugs: PinnedSlug[]) =>
    slugs.map((slug) => loaded[slug]).filter((item): item is Item => Boolean(item))

  return {
    ...doc,
    puckData: {
      ...doc.puckData,
      content: [...pick(PINNED_ABOVE), ...content, ...pick(PINNED_BELOW)],
    },
  }
}
