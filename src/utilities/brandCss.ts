import type { Website } from '@/payload-types'

/**
 * Which palette tokens each brand colour drives.
 *
 * Tailwind v4 compiles a brand utility to a custom property — `bg-brand` is
 * `background-color: var(--color-brand)` — so re-declaring these on `:root` re-skins every
 * class that uses them. One field can therefore drive several tokens: the heading colour
 * and the dark band are the same navy on this site, and a new brand should not have to
 * know that to change it.
 *
 * Only a handful of the palette's ~40 tokens are here on purpose. The rest — the steel and
 * ash ramps, the semantic greens and reds — are structural rather than brand, and exposing
 * all of them would be handing an editor forty ways to make a site unreadable.
 */
const TOKENS: Partial<Record<keyof Website, string[]>> = {
  accent: ['--color-brand-500'],
  bandMist: ['--color-mist'],
  bandTint: ['--color-tint-50'],
  navy: ['--color-navy', '--color-heading'],
  navyDeep: ['--color-navy-900'],
  primary: ['--color-brand'],
  primaryDark: ['--color-brand-dark'],
  subheading: ['--color-subheading', '--color-brand-600'],
}

/**
 * The `:root` override for a website's palette, or '' when it sets no colours — in which
 * case nothing is emitted and `globals.css` stands as written.
 */
export const brandCss = (website: null | Website | undefined): string => {
  if (!website) return ''

  const declarations = Object.entries(TOKENS).flatMap(([field, tokens]) => {
    const value = website[field as keyof Website]
    if (typeof value !== 'string' || !value.trim()) return []
    // Re-validated here rather than trusted from the database: this string is written
    // straight into a stylesheet, and the field's own validation only runs on save.
    const hex = value.trim()
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return []
    return tokens.map((token) => `${token}:${hex}`)
  })

  return declarations.length ? `:root{${declarations.join(';')}}` : ''
}
