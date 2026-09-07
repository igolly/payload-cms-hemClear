'use client'
import React, { useEffect } from 'react'

import { getClientSideURL } from '@/utilities/getURL'

export const VISUAL_SELECT_EVENT = 'payload-visual-select'

/**
 * Mounted inside the live-preview iframe (draft mode only).
 *
 * Payload's live preview is one-directional — the admin streams document data into the
 * iframe, but there is no channel back. This adds one: a delegated click listener that
 * finds the nearest element tagged with `data-payload-path` and tells the parent admin
 * window which field to open. The admin side lives in `@/components/VisualEditorTarget`.
 */
export const VisualEditorBridge: React.FC = () => {
  useEffect(() => {
    // Only meaningful when embedded in the admin's preview iframe.
    if (typeof window === 'undefined' || window.parent === window) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null

      // Deepest field-level tag wins; it is resolved against the block that contains it,
      // so block components never need to know their own index in `layout`.
      const sub = target?.closest?.('[data-payload-subpath]') as HTMLElement | null
      const root = (sub ?? target)?.closest?.('[data-payload-path]') as HTMLElement | null

      const base = root?.dataset?.payloadPath
      if (!base) return

      const subpath = sub?.dataset?.payloadSubpath
      const path = subpath ? `${base}.${subpath}` : base

      // Don't navigate away from the preview, but leave buttons (e.g. "Show More") working.
      if (target?.closest('a')) event.preventDefault()

      window.parent.postMessage({ path, type: VISUAL_SELECT_EVENT }, getClientSideURL())
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return (
    <style>{`
      [data-payload-path], [data-payload-subpath] { position: relative; }
      [data-payload-path]:hover {
        outline: 2px dashed #2d80e2;
        outline-offset: -2px;
        cursor: pointer;
      }
      /* Deepest tag gets the solid highlight; the parent block keeps the dashed one. */
      [data-payload-subpath]:hover {
        outline: 2px solid #2d80e2;
        outline-offset: 2px;
        border-radius: 2px;
        cursor: pointer;
      }
      [data-payload-path]:hover > *:first-child::before {
        content: 'Click to edit';
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
        background: #2d80e2;
        color: #fff;
        font: 500 11px/1 system-ui, sans-serif;
        padding: 4px 8px;
        border-radius: 0 0 4px 0;
        pointer-events: none;
      }
    `}</style>
  )
}
