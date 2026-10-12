import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  // Honoured like the page and global hooks, so a script outside Next can write redirects.
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating redirects`)

    revalidateTag('redirects', 'max')
  }

  return doc
}
