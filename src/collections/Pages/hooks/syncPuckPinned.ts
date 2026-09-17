import type { CollectionBeforeChangeHook, Field } from 'payload'

import { PINNED_FIELDS, PINNED_SOURCE, isPinnedSlug, type PinnedSlug } from '@/puck/pinned'

/**
 * Sends the pinned components home, and keeps them out of `puckData`.
 *
 * The canvas carries the real header, hero and footer (see `src/puck/pinnedSync.tsx`), so a
 * save arrives with those three sitting in `puckData.content`. None of them belongs there:
 * the globals serve every page, the hero is its own field on this document, and a copy left
 * in `puckData` would go stale and render a second header inside the article. So each one is
 * written to its real home and dropped before the document is saved.
 *
 * Globals have no drafts, so an edit to the nav goes live on save even when the page itself
 * is saved as a draft. That is the same as editing the Header global directly, which is what
 * this is. The hero, being a field on the page, follows the page's own draft status.
 */

type PuckItem = { props?: Record<string, unknown>; type?: string }

/** Puck keeps a copy of a related document; Payload wants the id back. */
const idOf = (value: unknown): unknown =>
  value && typeof value === 'object' && 'id' in (value as Record<string, unknown>)
    ? (value as { id: unknown }).id
    : value

/**
 * Rebuilds a props object from the global's own field list, so only real fields are sent
 * and related documents are reduced to ids. Built up rather than spread: a global read over
 * REST also carries `id`, `globalType` and timestamps, and Puck adds its instance `id`.
 */
export const toGlobalData = (
  value: Record<string, unknown>,
  fields: Field[],
): Record<string, unknown> => {
  const out: Record<string, unknown> = {}

  for (const field of fields) {
    // Presentation-only containers in Payload: their children sit at this same level.
    if (field.type === 'row' || field.type === 'collapsible') {
      Object.assign(out, toGlobalData(value, field.fields))
      continue
    }
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab && Array.isArray(tab.fields))
          Object.assign(out, toGlobalData(value, tab.fields))
      }
      continue
    }
    if (field.type === 'ui' || !('name' in field) || !field.name) continue

    const name = field.name
    if (!(name in value)) continue
    const raw = value[name]

    switch (field.type) {
      case 'array':
        out[name] = Array.isArray(raw)
          ? raw.map((item) => {
              const row = (item ?? {}) as Record<string, unknown>
              // A row's `id` is Payload's, not one of the declared fields, so it has to be
              // carried across by hand — dropped, Payload treats every row as new and mints
              // fresh ids on each save.
              const id = typeof row.id === 'string' ? { id: row.id } : {}
              return { ...id, ...toGlobalData(row, field.fields) }
            })
          : []
        break
      case 'group':
        out[name] = toGlobalData((raw ?? {}) as Record<string, unknown>, field.fields)
        break
      case 'upload':
        out[name] = idOf(raw)
        break
      case 'relationship':
        // Polymorphic relationships keep their shape; only the document is reduced.
        out[name] =
          raw && typeof raw === 'object' && 'relationTo' in (raw as Record<string, unknown>)
            ? { ...(raw as object), value: idOf((raw as { value: unknown }).value) }
            : idOf(raw)
        break
      default:
        out[name] = raw
    }
  }

  return out
}

export const syncPuckPinned: CollectionBeforeChangeHook = async ({ data, req }) => {
  const puckData = data?.puckData as { content?: unknown } | null | undefined
  const content = puckData?.content
  if (!Array.isArray(content)) return data

  const pinned = content.filter(
    (item): item is PuckItem & { type: PinnedSlug } =>
      Boolean(item) && isPinnedSlug((item as PuckItem).type),
  )
  if (pinned.length === 0) return data

  // Page fields are collected and returned with the document; globals are written here and
  // now, because this page save is the only moment they are offered.
  const pageFields: Record<string, unknown> = {}

  for (const item of pinned) {
    const { id: _puckId, ...props } = item.props ?? {}
    const document = toGlobalData(props, PINNED_FIELDS[item.type])
    const source = PINNED_SOURCE[item.type]

    if (source.type === 'global') {
      await req.payload.updateGlobal({ slug: source.slug, data: document, depth: 0, req })
    } else {
      pageFields[source.name] = document
    }
  }

  return {
    ...data,
    ...pageFields,
    puckData: {
      ...puckData,
      content: content.filter((item) => !isPinnedSlug((item as PuckItem)?.type)),
    },
  }
}
