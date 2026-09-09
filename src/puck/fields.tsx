/**
 * Payload field config -> Puck field config.
 *
 * The Payload block configs in `src/blocks/<Name>/config.ts` stay the single source of
 * truth for what a section contains. This module translates those field definitions into
 * the equivalent Puck fields so the visual editor exposes exactly the same knobs as the
 * admin block editor — no second schema to keep in sync.
 *
 * Client-safe by construction: the block configs import only `type`-level things from
 * `payload` plus plain data helpers, so pulling them into the editor bundle costs nothing.
 */
import type { Field as PayloadField } from 'payload'
import type { Field as PuckField, Fields as PuckFields } from '@puckeditor/core'
import { MediaField } from '@delmaredigital/payload-puck/fields'
import React from 'react'

/** Media shape the site's `<Media>` component expects. Wider than the plugin's own
 *  `MediaReference` so uploaded videos keep their `mimeType` and images keep cache tags. */
export type PuckMediaValue = {
  id: string | number
  url: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
  filename?: string
  thumbnailURL?: string
  updatedAt?: string
}

const humanize = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())

/** Payload labels can be a string, a locale record, or `false`. Puck wants a string. */
const labelFor = (field: PayloadField): string | undefined => {
  const raw = 'label' in field ? field.label : undefined
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const first = Object.values(raw)[0]
    if (typeof first === 'string') return first
  }
  if ('name' in field && typeof field.name === 'string') return humanize(field.name)
  return undefined
}

const optionsFor = (field: PayloadField): { label: string; value: string }[] => {
  const raw = 'options' in field ? field.options : undefined
  if (!Array.isArray(raw)) return []
  return raw.map((opt) =>
    typeof opt === 'string'
      ? { label: humanize(opt), value: opt }
      : { label: typeof opt.label === 'string' ? opt.label : String(opt.value), value: String(opt.value) },
  )
}

/**
 * Media picker. Wraps the plugin's browser but re-reads the chosen doc so the stored value
 * carries `mimeType` (video blocks branch on it) and `updatedAt` (image cache tag).
 */
const mediaField = (label?: string): PuckField => ({
  type: 'custom',
  label,
  render: ({ value, onChange, readOnly }) => (
    <MediaField
      label={label}
      onChange={async (next) => {
        if (!next) {
          onChange(null as never)
          return
        }
        // `external-...` ids come from the plugin's "paste a URL" tab: nothing to enrich.
        if (typeof next.id === 'string' && next.id.startsWith('external-')) {
          onChange(next as never)
          return
        }
        try {
          const res = await fetch(`/api/media/${next.id}?depth=0`)
          if (res.ok) {
            const doc = await res.json()
            onChange({
              id: doc.id,
              url: doc.url ?? next.url,
              alt: doc.alt ?? next.alt,
              width: doc.width ?? next.width,
              height: doc.height ?? next.height,
              mimeType: doc.mimeType,
              filename: doc.filename,
              thumbnailURL: doc.thumbnailURL,
              updatedAt: doc.updatedAt,
            } as never)
            return
          }
        } catch {
          // Fall through to the un-enriched reference rather than losing the selection.
        }
        onChange(next as never)
      }}
      readOnly={readOnly}
      value={(value as PuckMediaValue) ?? null}
    />
  ),
})

/**
 * Document picker for `relationship` fields, backed by Payload's REST API. Stores the
 * `{ relationTo, value }` shape `CMSLink` and the block components already read.
 */
const relationshipField = (field: PayloadField, label?: string): PuckField => {
  const relations = ('relationTo' in field ? field.relationTo : undefined) as
    | string
    | string[]
    | undefined
  const collections = Array.isArray(relations) ? relations : relations ? [relations] : []

  return {
    type: 'external',
    label,
    placeholder: 'Select a document',
    showSearch: true,
    fetchList: async ({ query }) => {
      const results = await Promise.all(
        collections.map(async (collection) => {
          const params = new URLSearchParams({ limit: '20', depth: '0' })
          if (query) params.set('where[or][0][title][like]', query)
          try {
            const res = await fetch(`/api/${collection}?${params}`)
            if (!res.ok) return []
            const json = await res.json()
            return (json.docs ?? []).map((doc: Record<string, unknown>) => ({
              _collection: collection,
              id: doc.id,
              title: (doc.title as string) ?? (doc.slug as string) ?? String(doc.id),
              slug: doc.slug,
            }))
          } catch {
            return []
          }
        }),
      )
      return results.flat()
    },
    mapRow: (row) => ({ Title: row.title, Collection: row._collection }),
    mapProp: (row) =>
      // A single-collection relationship stores the doc; a polymorphic one stores
      // `{ relationTo, value }`, matching what Payload itself writes.
      (collections.length > 1
        ? { relationTo: row._collection, value: { id: row.id, slug: row.slug, title: row.title } }
        : { id: row.id, slug: row.slug, title: row.title }) as never,
    getItemSummary: (item) => {
      const doc = (item as { value?: { title?: string }; title?: string }) ?? {}
      return doc.value?.title ?? doc.title ?? 'Document'
    },
  }
}

/** Best-effort one-line summary for an array row, so the Puck outline stays readable. */
const summaryKeys = ['title', 'label', 'heading', 'name', 'question', 'quote', 'text']
const itemSummary = (item: Record<string, unknown>, index = 0): string => {
  for (const key of summaryKeys) {
    const value = item?.[key]
    if (typeof value === 'string' && value.trim()) return value.slice(0, 60)
  }
  const firstString = Object.values(item ?? {}).find(
    (value) => typeof value === 'string' && value.trim(),
  )
  return typeof firstString === 'string' ? firstString.slice(0, 60) : `Item ${index + 1}`
}

const convertField = (field: PayloadField): PuckField | null => {
  const label = labelFor(field)

  switch (field.type) {
    case 'text':
      return { type: 'text', label }
    case 'textarea':
      return { type: 'textarea', label }
    case 'number':
      return { type: 'number', label }
    case 'email':
    case 'code':
    case 'date':
      return { type: 'text', label }
    case 'checkbox':
      return {
        type: 'radio',
        label,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      }
    case 'select':
      return { type: 'select', label, options: [{ label: '—', value: '' }, ...optionsFor(field)] }
    case 'radio':
      return { type: 'radio', label, options: optionsFor(field) }
    case 'upload':
      return mediaField(label)
    case 'relationship':
      return relationshipField(field, label)
    case 'richText':
      // Payload stores Lexical JSON; Puck's editor produces an HTML string. `<RichText>`
      // accepts both, so existing Lexical content keeps rendering untouched.
      //
      // Puck's built-in richtext field, not the plugin's `createRichTextField()`: that one
      // lives in a `'use client'` module, and this config is also evaluated on the server
      // to render pages, where calling into a client module throws.
      return { type: 'richtext', label, contentEditable: false }
    case 'array':
      return {
        type: 'array',
        label,
        arrayFields: convertFields(field.fields) as never,
        defaultItemProps: defaultsFor(field.fields) as never,
        getItemSummary: (item, index) => itemSummary(item as Record<string, unknown>, index),
        ...(typeof field.maxRows === 'number' ? { max: field.maxRows } : {}),
        ...(typeof field.minRows === 'number' ? { min: field.minRows } : {}),
      }
    case 'group':
      return { type: 'object', label, objectFields: convertFields(field.fields) as never }
    default:
      return null
  }
}

/**
 * Converts a Payload field list into Puck fields. `row`, `collapsible` and unnamed `tabs`
 * are presentation-only containers in Payload, so their children are flattened up.
 */
export const convertFields = (fields: PayloadField[]): PuckFields => {
  const out: Record<string, PuckField> = {}

  for (const field of fields) {
    if (field.type === 'row' || field.type === 'collapsible') {
      Object.assign(out, convertFields(field.fields))
      continue
    }
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab && Array.isArray(tab.fields)) Object.assign(out, convertFields(tab.fields))
      }
      continue
    }
    if (field.type === 'ui' || !('name' in field) || !field.name) continue

    const converted = convertField(field)
    if (converted) out[field.name] = converted
  }

  return out as PuckFields
}

/** Mirrors `convertFields`, collecting Payload `defaultValue`s into Puck `defaultProps`. */
export const defaultsFor = (fields: PayloadField[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {}

  for (const field of fields) {
    if (field.type === 'row' || field.type === 'collapsible') {
      Object.assign(out, defaultsFor(field.fields))
      continue
    }
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab && Array.isArray(tab.fields)) Object.assign(out, defaultsFor(tab.fields))
      }
      continue
    }
    if (field.type === 'ui' || !('name' in field) || !field.name) continue

    if ('defaultValue' in field && typeof field.defaultValue !== 'undefined') {
      if (typeof field.defaultValue !== 'function') out[field.name] = field.defaultValue
      continue
    }
    if (field.type === 'array') out[field.name] = []
    if (field.type === 'group') out[field.name] = defaultsFor(field.fields)
  }

  return out
}
