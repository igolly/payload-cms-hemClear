import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * The palette is read once per render and cached under one tag, so saving a colour has to
 * drop that entry or the site keeps painting the old brand until the next deploy.
 */
export const revalidateWebsite: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating website settings')
    revalidateTag('active_website', 'max')
  }

  return doc
}
