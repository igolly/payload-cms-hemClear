import type { Endpoint, PayloadRequest, Where } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

/**
 * The media list behind the Puck editor's image picker.
 *
 * The picker in `@delmaredigital/payload-puck` 0.9.0 hard-codes two things that make a
 * library this size painful to work with, and neither is configurable — but the endpoint it
 * reads from *is*, so both are corrected here rather than by patching the package:
 *
 * 1. **It asks for 24 rows at a time.** With 300+ images that is a dozen "Load more"
 *    clicks to reach anything old. This returns up to `PAGE_SIZE` in one response, so the
 *    button never appears until the library outgrows that — and still works if it does.
 * 2. **It searches `alt` only.** Almost nothing in this library has an `alt`, so the search
 *    box returned nothing for virtually every term and the grid had to be scrolled by eye.
 *    This searches `filename` as well, which is how the files are actually named
 *    (`approach-icon1.svg`, `problem-icon3.svg`).
 *
 * `POST` is proxied to the collection's own route untouched: the picker uploads to the same
 * endpoint it reads from, and Payload's handler already does that correctly.
 */
const PAGE_SIZE = 500

/** The picker sends its search term as `where[alt][contains]`. */
const searchTerm = (req: PayloadRequest): string => {
  const where = (req.query as { where?: { alt?: { contains?: unknown } } } | undefined)?.where
  const term = where?.alt?.contains
  return typeof term === 'string' ? term.trim() : ''
}

export const puckMediaBrowse: Endpoint = {
  path: '/puck-browse',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const term = searchTerm(req)
    const page = Number((req.query as { page?: unknown } | undefined)?.page) || 1

    const where: Where = {
      and: [
        { mimeType: { contains: 'image' } },
        ...(term
          ? [{ or: [{ filename: { contains: term } }, { alt: { contains: term } }] }]
          : []),
      ],
    }

    try {
      const result = await req.payload.find({
        collection: 'media',
        depth: 0,
        limit: PAGE_SIZE,
        page,
        sort: '-createdAt',
        where,
        req,
        overrideAccess: false,
      })

      // Same shape the picker already reads: `docs` plus `hasNextPage`.
      return Response.json(result)
    } catch (error) {
      req.payload.logger.error({ err: error }, 'puck-browse failed')
      return Response.json({ docs: [], hasNextPage: false }, { status: 500 })
    }
  },
}

/**
 * Upload passthrough, so pointing the picker at `/puck-browse` does not cost it its
 * Upload tab. The body and content type are forwarded verbatim to `/api/media`, which is
 * exactly where the picker posted before this endpoint existed.
 */
export const puckMediaUpload: Endpoint = {
  path: '/puck-browse',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const upstream = await fetch(`${getServerSideURL()}/api/media`, {
      method: 'POST',
      body: req.body as unknown as BodyInit,
      // @ts-expect-error — Node's fetch requires this for a streamed body; not in the DOM types.
      duplex: 'half',
      headers: {
        'content-type': req.headers.get('content-type') ?? '',
        cookie: req.headers.get('cookie') ?? '',
      },
    })

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': 'application/json' },
    })
  },
}
