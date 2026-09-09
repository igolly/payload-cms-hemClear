import type { Endpoint, PayloadRequest } from 'payload'

import { blocksToPuckData } from '@/puck/blocksToPuck'

/**
 * `GET /api/pages/:id/puck-seed`
 *
 * Returns this page's Payload blocks expressed as a Puck document, so the visual editor can
 * open an existing page with its real content instead of a blank canvas.
 *
 * Read-only. Nothing is written, and the page's `layout` is untouched — the conversion only
 * becomes the page's content if the editor is then saved, which is what flips it to Puck.
 *
 * Returns `{ data: null }` when there is nothing to seed: a page already authored in Puck
 * (its own content wins, so re-opening never overwrites it) or a page with no blocks.
 */
export const puckSeed: Endpoint = {
  path: '/:id/puck-seed',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const id = req.routeParams?.id

    if (!id) return Response.json({ error: 'Missing page id' }, { status: 400 })
    if (!req.user) return Response.json({ error: 'Forbidden' }, { status: 403 })

    try {
      const page = await req.payload.findByID({
        collection: 'pages',
        id: String(id),
        // Depth 1 inlines media and referenced documents: Puck stores them in the document
        // rather than by id.
        depth: 1,
        draft: true,
        req,
        overrideAccess: false,
      })

      const puckContent = (page?.puckData as { content?: unknown[] } | null)?.content
      if (Array.isArray(puckContent) && puckContent.length > 0) {
        return Response.json({ data: null, reason: 'already-authored-in-puck' })
      }

      const blocks = page?.layout
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return Response.json({ data: null, reason: 'no-blocks' })
      }

      return Response.json({ data: blocksToPuckData(blocks), reason: 'seeded-from-blocks' })
    } catch (error) {
      req.payload.logger.error({ err: error, page: String(id) }, 'puck-seed failed')
      return Response.json({ error: 'Could not read this page' }, { status: 500 })
    }
  },
}
