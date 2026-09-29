'use client'

/**
 * A list of the site's pages in the editor's own header, so moving between them does not
 * mean going back to the collection and in again.
 *
 * The editor is a page of its own at `/admin/puck-editor/pages/<id>`, so switching is a
 * navigation rather than a state change — which also means the editor's own guard on
 * unsaved work still runs, and an editor with changes in hand is asked before they leave.
 */
import React, { useEffect, useRef, useState } from 'react'
import type { Plugin } from '@puckeditor/core'

type PageRow = { id: string; slug?: null | string; title?: null | string }

/** `/admin/puck-editor/pages/<id>` — the route the plugin registers for this view. */
const currentId = (): null | string =>
  typeof window === 'undefined'
    ? null
    : (window.location.pathname.match(/\/puck-editor\/[^/]+\/([^/?#]+)/)?.[1] ?? null)

const PageSwitcher: React.FC = () => {
  const [pages, setPages] = useState<PageRow[]>([])
  const requested = useRef(false)
  const here = currentId()

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    void (async () => {
      try {
        // Titles and slugs only; the editor has the page it is editing already.
        const res = await fetch('/api/pages?depth=0&limit=200&sort=title', {
          credentials: 'include',
        })
        if (!res.ok) return
        const body = await res.json()
        setPages(Array.isArray(body?.docs) ? body.docs : [])
      } catch {
        // Without the list the control simply does not appear; the editor is unaffected.
      }
    })()
  }, [])

  if (pages.length < 2) return null

  return (
    <label
      style={{ alignItems: 'center', display: 'flex', gap: '0.5rem', marginRight: '0.5rem' }}
      title="Open another page in the editor"
    >
      <span style={{ color: 'var(--puck-color-grey-04, #6b7280)', fontSize: '0.75rem' }}>Page</span>
      <select
        onChange={(event) => {
          const next = event.target.value
          if (next && next !== here) window.location.href = `/admin/puck-editor/pages/${next}`
        }}
        style={{
          background: 'var(--puck-color-white, #fff)',
          border: '1px solid var(--puck-color-grey-09, #d1d5db)',
          borderRadius: '4px',
          color: 'inherit',
          fontSize: '0.8125rem',
          maxWidth: '14rem',
          padding: '0.35rem 0.5rem',
        }}
        value={here ?? ''}
      >
        {/* The page being edited may sit outside the first 200, so it is always present. */}
        {here && !pages.some((page) => page.id === here) && <option value={here}>This page</option>}
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title || page.slug || page.id}
          </option>
        ))}
      </select>
    </label>
  )
}

export const pageSwitcherPlugin: Plugin = {
  name: 'page-switcher',
  overrides: {
    headerActions: ({ children }) => (
      <>
        <PageSwitcher />
        {children}
      </>
    ),
  },
}
