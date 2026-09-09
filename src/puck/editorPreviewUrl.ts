/**
 * Preview URL for the visual editor — and the hook that fills its canvas.
 *
 * The plugin's editor view opens whatever is stored in `puckData`, and gives no supported
 * hook for supplying initial data. It does, however, call this function with the freshly
 * read page document immediately before it computes that initial data, which makes this the
 * one place on the server where a block-authored page can be handed to the editor with its
 * real content instead of a blank canvas.
 *
 * That is a liberty, so it is fenced in:
 *
 * - **Read-only.** The page object is only decorated in memory for this one render. Nothing
 *   is written, `layout` is untouched, and the page keeps rendering from its blocks until
 *   someone saves from the editor.
 * - **Fails safe.** If a future version of the plugin stops calling this, or calls it later,
 *   the editor simply opens empty — the behaviour without this file. Nothing breaks.
 * - **Belt and braces.** `src/puck/seedFromBlocks.tsx` does the same job from the browser
 *   against `/api/pages/:id/puck-seed`, and no-ops when the canvas already has content.
 *   Either path alone is enough.
 *
 * Returning a function here also makes the view read the page at `depth: 1`, which is what
 * inlines media and referenced documents — exactly the shape Puck stores them in.
 */
import { blocksToPuckData } from '@/puck/blocksToPuck'
import { getServerSideURL } from '@/utilities/getURL'

type EditorPage = {
  layout?: unknown
  puckData?: { content?: unknown[] } | null
}

export const editorPreviewUrl = (page: EditorPage) => {
  try {
    const hasPuckContent = Array.isArray(page?.puckData?.content) && page.puckData.content.length > 0
    const blocks = page?.layout

    if (!hasPuckContent && Array.isArray(blocks) && blocks.length > 0) {
      page.puckData = blocksToPuckData(blocks)
    }
  } catch {
    // Seeding is a convenience; never let it stop the editor from opening.
  }

  const origin = getServerSideURL()
  return (slug: string) => (slug ? `${origin}/${slug}` : origin)
}
