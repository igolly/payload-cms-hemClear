'use client'

/**
 * Loads a page's existing Payload blocks into the visual editor.
 *
 * The plugin's editor view opens whatever is stored in `puckData`, so a page that was built
 * with the block editor would otherwise open on a blank canvas — which reads as "Puck is
 * broken". This Puck plugin fills that canvas on first open by asking
 * `GET /api/pages/:id/puck-seed` for the page's blocks expressed as a Puck document.
 *
 * It only ever acts on an empty canvas, and it changes nothing in the database: the page
 * keeps rendering from its blocks until someone saves from this editor.
 */
import React, { useEffect, useRef } from 'react'
import type { Plugin } from '@puckeditor/core'
import { usePuck } from '@puckeditor/core'

/** `/admin/puck-editor/pages/<id>` — the route the plugin registers for this view. */
const pageIdFromLocation = (): string | null => {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/puck-editor\/[^/]+\/([^/?#]+)/)
  return match?.[1] ?? null
}

const SeedFromBlocks: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { appState, dispatch } = usePuck()
  // One attempt per editor session, so re-emptying a page by hand is not undone.
  const attempted = useRef(false)

  const isEmpty = (appState?.data?.content?.length ?? 0) === 0

  useEffect(() => {
    if (attempted.current || !isEmpty) return
    attempted.current = true

    const id = pageIdFromLocation()
    if (!id) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/pages/${id}/puck-seed`, { credentials: 'include' })
        if (!res.ok) return
        const { data } = await res.json()
        if (cancelled || !data?.content?.length) return

        dispatch({
          type: 'setData',
          // Keep the root props the view already synced from the Payload document
          // (title, slug, meta…); only the canvas contents come from the blocks.
          data: (previous) => ({ ...previous, content: data.content }),
        })
      } catch {
        // Seeding is a convenience. On failure the editor simply opens empty, which is
        // the behaviour without this plugin.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, isEmpty])

  return <>{children}</>
}

export const seedFromBlocksPlugin: Plugin = {
  name: 'seed-from-blocks',
  overrides: {
    // `headerActions` is rendered for the lifetime of the editor, which is all this needs;
    // the component itself draws nothing of its own.
    headerActions: ({ children }) => <SeedFromBlocks>{children}</SeedFromBlocks>,
  },
}
