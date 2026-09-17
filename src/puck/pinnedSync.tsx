'use client'

/**
 * Puts the header, the hero and the footer on the canvas, and keeps them where they belong.
 *
 * None of them lives in `puckData`, so none is loaded from it: on open this reads the two
 * globals and the page's own `hero` over REST, then pins the header and hero above the
 * page's content and the footer below it. An editor sees the page as a visitor will, and
 * can click straight into a nav label or a headline. Saving is the mirror image —
 * `syncPuckPinned` sends each one home and removes the components before the page document
 * is written.
 *
 * Both globals are publicly readable (`access.read: () => true`); the page is read with the
 * editor's own session, which is already authenticated.
 */
import React, { useEffect, useRef, useState } from 'react'
import type { Plugin } from '@puckeditor/core'
import { usePuck } from '@puckeditor/core'

import {
  PINNED_ABOVE,
  PINNED_BELOW,
  PINNED_SLUGS,
  PINNED_SOURCE,
  isPinnedSlug,
  toPinnedProps,
  type PinnedSlug,
} from './pinnedComponents'

/**
 * Fixed instance ids. Puck needs one per item; fixed ones mean re-opening a page does not
 * churn the document, and they name the rows plainly in the outline.
 */
const PINNED_IDS: Record<PinnedSlug, string> = {
  footer: 'site-footer',
  header: 'site-header',
  pageHero: 'page-hero',
}

/**
 * `depth` matches what each view needs to render: the header resolves its nav links one
 * level down, the footer's link columns and the hero's media sit a level deeper again.
 */
const PINNED_DEPTH: Record<PinnedSlug, number> = { footer: 2, header: 1, pageHero: 2 }

type Item = { props: Record<string, unknown>; type: string }

/** `/admin/puck-editor/pages/<id>` — the route the plugin registers for this view. */
const pageIdFromLocation = (): null | string => {
  if (typeof window === 'undefined') return null
  return window.location.pathname.match(/\/puck-editor\/[^/]+\/([^/?#]+)/)?.[1] ?? null
}

const loadPinned = async (slug: PinnedSlug): Promise<Item | null> => {
  const source = PINNED_SOURCE[slug]

  try {
    let url: null | string = null
    if (source.type === 'global') {
      url = `/api/globals/${source.slug}?depth=${PINNED_DEPTH[slug]}`
    } else {
      const id = pageIdFromLocation()
      url = id ? `/api/pages/${id}?depth=${PINNED_DEPTH[slug]}` : null
    }
    if (!url) return null

    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      console.warn(`[pinned-sync] GET ${url} responded ${res.status}`)
      return null
    }

    const document = await res.json()
    // A page field is a group on the document; a global *is* the document.
    const data = source.type === 'global' ? document : document?.[source.name]
    return { props: { ...toPinnedProps(slug, data), id: PINNED_IDS[slug] }, type: slug }
  } catch (error) {
    // Reported rather than swallowed: silently, the canvas simply opens without the piece
    // and the cause is invisible.
    console.warn(`[pinned-sync] could not load ${slug}`, error)
    return null
  }
}

const PinnedSync: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { appState, dispatch } = usePuck()
  const requested = useRef(false)
  const [pinned, setPinned] = useState<Partial<Record<PinnedSlug, Item | null>> | null>(null)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    /*
     * Deliberately not cancelled on unmount. React mounts, unmounts and remounts effects in
     * development, and the remount is stopped by the ref above — so a cancel flag would kill
     * the only requests in flight and the canvas would never receive any of this. Setting
     * state after unmount is a no-op in React 18, which is the worst this can do.
     */
    void (async () => {
      const loaded = await Promise.all(PINNED_SLUGS.map((slug) => loadPinned(slug)))
      setPinned(Object.fromEntries(PINNED_SLUGS.map((slug, i) => [slug, loaded[i]])))
    })()
  }, [])

  const content = appState?.data?.content as Item[] | undefined

  useEffect(() => {
    if (!pinned || !content) return

    // An existing instance wins over the freshly loaded one: it carries edits made in this
    // session, which a re-run after every canvas change would otherwise throw away.
    const resolve = (slug: PinnedSlug) =>
      content.find((item) => item.type === slug) ?? pinned[slug] ?? null

    const above = PINNED_ABOVE.map(resolve).filter((item): item is Item => Boolean(item))
    const below = PINNED_BELOW.map(resolve).filter((item): item is Item => Boolean(item))
    const body = content.filter((item) => !isPinnedSlug(item.type))

    const next = [...above, ...body, ...below]

    // Identity comparison, not a deep one: every item above is either the object already in
    // `content` or a newly loaded one, so this settles after a single dispatch instead of
    // looping on its own output.
    const settled =
      next.length === content.length && next.every((item, index) => item === content[index])
    if (settled) return

    dispatch({
      type: 'setData',
      data: (previous) => ({ ...previous, content: next }),
    })
  }, [appState, content, dispatch, pinned])

  return <>{children}</>
}

export const pinnedSyncPlugin: Plugin = {
  name: 'pinned-sync',
  overrides: {
    // Rendered for the lifetime of the editor, which is all this needs; it draws nothing.
    headerActions: ({ children }) => <PinnedSync>{children}</PinnedSync>,
  },
}
