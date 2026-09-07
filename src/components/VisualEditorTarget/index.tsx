'use client'
import React, { useEffect } from 'react'

const VISUAL_SELECT_EVENT = 'payload-visual-select'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Admin-side half of the click-to-edit bridge. Registered as an admin provider, so it is
 * mounted across the admin panel and listens for messages posted by the preview iframe
 * (see `@/components/VisualEditorBridge`).
 *
 * Targets Payload's DOM contract:
 *   - array/blocks row : id="<parentPath with dots as dashes>-row-<index>"  e.g. `layout-row-0`
 *   - any other field  : id="field-<path with dots as double underscores>"  e.g. `field-hero__heading`
 *   - collapsed row    : `.collapsible--collapsed`, opened via `.collapsible__toggle`
 *
 * Note: array rows use a random `scroll-<componentId>-row-<i>` id and are NOT addressable
 * by path — so nested content is targeted by its leaf field id instead.
 *   - inactive tab     : `button.tabs-field__tab-button`
 */
export const VisualEditorTarget: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const findTarget = (path: string): HTMLElement | null => {
      const segments = path.split('.')
      const last = segments[segments.length - 1]

      // Blocks and array rows are addressed by row index, everything else by field path.
      if (/^\d+$/.test(last)) {
        const rowId = `${segments.slice(0, -1).join('-')}-row-${last}`
        const row = document.getElementById(rowId)
        if (row) return row
      }

      return document.getElementById(`field-${segments.join('__')}`)
    }

    /**
     * Walk from the most specific path to the least: `layout.1.featured.2.quote` →
     * `layout.1.featured.2` → `layout.1.featured` → `layout.1`. A click then always lands
     * somewhere useful, even if a deep path doesn't resolve to its own field wrapper.
     */
    const findTargetOrAncestor = (path: string): HTMLElement | null => {
      const segments = path.split('.')

      for (let i = segments.length; i > 0; i--) {
        const el = findTarget(segments.slice(0, i).join('.'))
        if (el) return el
      }

      return null
    }

    const reveal = async (path: string) => {
      let el = findTargetOrAncestor(path)

      // The field may live under an inactive tab (e.g. the hero sits on the "Hero" tab).
      if (!el) {
        const tabs = Array.from(
          document.querySelectorAll<HTMLButtonElement>('button.tabs-field__tab-button'),
        )

        for (const tab of tabs) {
          if (tab.classList.contains('tabs-field__tab-button--active')) continue
          tab.click()
          await wait(80)
          el = findTargetOrAncestor(path)
          if (el) break
        }
      }

      if (!el) return

      // A nested field can sit inside several collapsed rows (block row → array row).
      // Collapsed content stays mounted (AnimateHeight height:0), so the element is
      // findable first; expand every collapsed ancestor, outermost first.
      const collapsibles: HTMLElement[] = []
      let cursor: HTMLElement | null = el.querySelector('.collapsible') ?? el

      while (cursor) {
        const collapsible = cursor.closest('.collapsible') as HTMLElement | null
        if (!collapsible) break
        collapsibles.unshift(collapsible)
        cursor = collapsible.parentElement
      }

      for (const collapsible of collapsibles) {
        if (collapsible.classList.contains('collapsible--collapsed')) {
          // The row's own toggle renders before its content, so this is the first match.
          collapsible.querySelector<HTMLElement>('.collapsible__toggle')?.click()
          await wait(80)
        }
      }

      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      el.classList.add('visual-editor-flash')
      setTimeout(() => el?.classList.remove('visual-editor-flash'), 1400)

      // Focus the first editable input so the editor can start typing immediately.
      el.querySelector<HTMLElement>('input:not([type="hidden"]), textarea')?.focus({
        preventScroll: true,
      })
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const data = event.data
      if (!data || data.type !== VISUAL_SELECT_EVENT || typeof data.path !== 'string') return

      void reveal(data.path)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <React.Fragment>
      <style>{`
        .visual-editor-flash {
          animation: visual-editor-flash 1.4s ease-out;
          border-radius: 4px;
        }
        @keyframes visual-editor-flash {
          0%, 40% { box-shadow: 0 0 0 3px #2d80e2; }
          100% { box-shadow: 0 0 0 3px rgba(45, 128, 226, 0); }
        }
      `}</style>
      {children}
    </React.Fragment>
  )
}
