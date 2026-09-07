import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/products/${doc.slug}`
      payload.logger.info(`Revalidating product at path: ${path}`)
      revalidatePath(path)
    }

    // A product that was unpublished still needs its old path cleared.
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/products/${previousDoc.slug}`)
    }
  }

  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/products/${doc?.slug}`)
  }

  return doc
}
