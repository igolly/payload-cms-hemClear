/**
 * The site header, the page hero and the site footer, as Puck components.
 *
 * None of the three is page content — see `src/puck/pinned.ts` for where each one's data
 * actually lives. They are generated from the very same field lists Payload uses and
 * rendered by the very same components the site renders, so the canvas cannot drift from
 * the page. What differs is the plumbing: `pinnedSyncPlugin` fills them from their real
 * homes when the editor opens, and `syncPuckPinned` (a Pages `beforeChange` hook) writes
 * any edits back and strips the components out again before the page document is saved.
 */
import type { ComponentConfig } from '@puckeditor/core'
import React from 'react'

import { FooterView } from '@/Footer/View'
import { HeaderView } from '@/Header/View'
import { RenderHero } from '@/heros/RenderHero'

import { PINNED_FIELDS, type PinnedSlug } from './pinned'
import { convertFields, defaultsFor } from './fields'

export * from './pinned'

// Each view is typed by its own document; the registry below holds them uniformly, so the
// props type is erased at this boundary and restored by Puck — as for the blocks.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>

const Footer = FooterView as AnyComponent
const Header = HeaderView as AnyComponent
const Hero = RenderHero as AnyComponent

/**
 * The prop names a pinned component owns. A document read over REST also carries `id`,
 * `globalType` and the timestamps; those are not fields, so they are dropped on the way in
 * rather than being handed back to Payload on the way out.
 */
export const pinnedFieldNames = (slug: PinnedSlug): string[] =>
  Object.keys(convertFields(PINNED_FIELDS[slug]))

/** A document reduced to the props its canvas component takes. */
export const toPinnedProps = (
  slug: PinnedSlug,
  data: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  if (!data) return out
  for (const name of pinnedFieldNames(slug)) {
    if (name in data) out[name] = data[name]
  }
  return out
}

const toPinnedConfig = (
  slug: PinnedSlug,
  label: string,
  render: (props: Record<string, unknown>) => React.ReactNode,
): ComponentConfig => ({
  label,
  fields: convertFields(PINNED_FIELDS[slug]),
  defaultProps: defaultsFor(PINNED_FIELDS[slug]) as never,
  // Wrapped in a fragment because Puck's render must return an element, and a hero of type
  // "None" renders nothing at all.
  render: ({
    puck: _puck,
    id: _id,
    ...props
  }: Record<string, unknown> & { puck?: unknown; id?: unknown }) => <>{render(props)}</>,
})

export const pinnedComponents: Record<string, ComponentConfig> = {
  footer: toPinnedConfig('footer', 'Site Footer', (props) => <Footer data={props} />),
  header: toPinnedConfig('header', 'Site Header', (props) => <Header data={props} />),
  // `RenderHero` picks the hero for the chosen `type` and draws nothing for "None", which is
  // exactly what the page does — a page with no hero shows none on the canvas either.
  pageHero: toPinnedConfig('pageHero', 'Page Hero', (props) => <Hero {...props} />),
}
