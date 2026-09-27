/**
 * The parts of a page that are pinned to the visual editor's canvas, and nothing else.
 *
 * Three things frame a page's content without belonging to it: the site header, the page's
 * own hero, and the site footer. All three are pinned to the canvas so a page previews the
 * way a visitor will see it and can be edited where it is seen — but none of them is stored
 * in `puckData`. Each has its own home, named by `PINNED_SOURCE`:
 *
 *   header / footer   Payload globals, shared by every page
 *   pageHero          the `hero` group on the page document itself
 *
 * Deliberately free of Puck imports. This module is read from the Payload config (the Pages
 * `beforeChange` hook that writes these edits back), and that config is loaded by plain Node
 * for `payload generate:types`, migrations and one-off scripts — where an import chain
 * reaching `src/puck/fields.tsx` pulls in the editor's stylesheet and Node stops at the
 * first `.css`. The canvas-side half lives in `src/puck/pinnedComponents.tsx`.
 */
import type { Field } from 'payload'

import { footerFields } from '@/Footer/fields'
import { headerFields } from '@/Header/fields'
import { heroFields } from '@/heros/fields'

/** Puck component names. `pageHero` is spelled out so it cannot be taken for a block. */
export const PINNED_SLUGS = ['header', 'pageHero', 'footer'] as const

export type PinnedSlug = (typeof PINNED_SLUGS)[number]

export const isPinnedSlug = (type: unknown): type is PinnedSlug =>
  PINNED_SLUGS.includes(type as PinnedSlug)

/** Above the page's content, in this order; the footer goes below it. */
export const PINNED_ABOVE: PinnedSlug[] = ['header', 'pageHero']
export const PINNED_BELOW: PinnedSlug[] = ['footer']

/**
 * The Payload fields behind each canvas component, so both ends work from one definition:
 * the editor converts them into Puck fields, and the save hook walks the same list to
 * rebuild the document. The global and hero *configs* stay out of it — one carries an
 * `afterChange` hook importing `next/cache`, the other the Lexical editor, and neither may
 * reach the browser bundle.
 */
export const PINNED_FIELDS: Record<PinnedSlug, Field[]> = {
  footer: footerFields,
  header: headerFields,
  pageHero: heroFields,
}

export type PinnedSource =
  { name: 'hero'; type: 'pageField' } | { slug: 'footer' | 'header'; type: 'global' }

/** Where each component reads from on open, and writes to on save. */
export const PINNED_SOURCE: Record<PinnedSlug, PinnedSource> = {
  footer: { slug: 'footer', type: 'global' },
  header: { slug: 'header', type: 'global' },
  pageHero: { name: 'hero', type: 'pageField' },
}

/**
 * The prop names each pinned component takes, read straight off the Payload field list.
 *
 * The editor derives the same list through `convertFields`, which is a Puck module: a
 * Payload hook that imported it would pull the editor's own field components — and their
 * stylesheets — into the server bundle. Row, collapsible and unnamed tab wrappers hold no
 * data of their own, so their children are collected in their place, exactly as Payload
 * stores them.
 */
export const pinnedFieldNames = (slug: PinnedSlug): string[] => {
  const names: string[] = []

  const walk = (fields: Field[]) => {
    for (const field of fields) {
      if ('name' in field && typeof field.name === 'string') {
        names.push(field.name)
        continue
      }
      if ('fields' in field && Array.isArray(field.fields)) walk(field.fields as Field[])
      if ('tabs' in field && Array.isArray(field.tabs)) {
        for (const tab of field.tabs) {
          if ('name' in tab && typeof tab.name === 'string') names.push(tab.name)
          else if (Array.isArray(tab.fields)) walk(tab.fields as Field[])
        }
      }
    }
  }

  walk(PINNED_FIELDS[slug])
  return names
}

/** A document reduced to the props its canvas component takes. */
export const toPinnedProps = (
  slug: PinnedSlug,
  data: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!data) return {}
  const out: Record<string, unknown> = {}
  for (const name of pinnedFieldNames(slug)) if (name in data) out[name] = data[name]
  return out
}
