/**
 * The product page's own icon set — the glyphs exported from the Figma product frame
 * (6219:3619) into `public/icons/product-detail/`.
 *
 * They are chosen per row through an optional `artwork` select that sits beside the older
 * shared `icon` field: when it is set the Figma glyph is drawn, otherwise the row falls
 * back to the `BrandIcon` it has always used, so documents saved before this field existed
 * render as they did.
 */
export const productArtwork = {
  heart: { label: 'Heart', src: '/icons/product-detail/heart.svg' },
  padlock: { label: 'Padlock', src: '/icons/product-detail/padlock.svg' },
  shield: { label: 'Shield', src: '/icons/product-detail/shield.svg' },
  delivery: { label: 'Delivery van', src: '/icons/product-detail/delivery.svg' },
  cancel: { label: 'Stop', src: '/icons/product-detail/cancel.svg' },
  leaf: { label: 'Leaf (green tile)', src: '/icons/product-detail/feel-leaf.svg' },
  smile: { label: 'Smile (yellow tile)', src: '/icons/product-detail/feel-smile.svg' },
  recycle: { label: 'Cycle (blue tile)', src: '/icons/product-detail/feel-recycle.svg' },
  cardiogram: { label: 'Heartbeat (red tile)', src: '/icons/product-detail/feel-cardiogram.svg' },
} as const

export type ProductArtwork = keyof typeof productArtwork

export const productArtworkOptions = (Object.keys(productArtwork) as ProductArtwork[]).map(
  (value) => ({ label: productArtwork[value].label, value }),
)

/** The "What You'll Feel" tiles: each glyph sits on its own tinted gradient in the comp. */
export const feelTile: Partial<Record<ProductArtwork, string>> = {
  leaf: 'linear-gradient(180deg, #e7ffd3 0%, #daf4c3 100%)',
  smile: 'linear-gradient(180deg, #fffed9 0%, #eeeb92 100%)',
  recycle: 'linear-gradient(180deg, #e0f4ff 0%, #9ddaff 100%)',
  cardiogram: 'linear-gradient(180deg, #ffe2e2 0%, #e89696 100%)',
}

export const artworkSrc = (value?: string | null): string | null =>
  value && value in productArtwork ? productArtwork[value as ProductArtwork].src : null
