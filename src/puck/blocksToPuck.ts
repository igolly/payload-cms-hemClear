/**
 * Payload `layout` blocks -> a Puck document.
 *
 * Lets an existing, block-authored page open in the visual editor with its real content
 * instead of a blank canvas. The block field names and the Puck component prop names are
 * the same (both are generated from `src/blocks/<Name>/config.ts`), so this is close to a
 * pass-through; the two things that genuinely differ are handled below.
 *
 * Nothing here writes to the database — the result seeds the editor, and the page's blocks
 * are only superseded once someone saves from Puck.
 */
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type PuckItem = { type: string; props: Record<string, unknown> }
export type PuckDocument = { content: PuckItem[]; root: { props: Record<string, unknown> } }

/** Lexical editor state, as stored by Payload's rich text fields. */
const isLexicalState = (value: unknown): value is SerializedEditorState => {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { type?: string; children?: unknown } }).root
  return root?.type === 'root' && Array.isArray(root.children)
}

/**
 * Payload stores rich text as Lexical JSON; Puck's rich text field holds an HTML string.
 * `src/components/RichText` renders both, so converting on the way in is enough — no
 * conversion back is needed.
 */
const convertValue = (value: unknown): unknown => {
  if (isLexicalState(value)) {
    return convertLexicalToHTML({ data: value, disableContainer: true })
  }
  if (Array.isArray(value)) return value.map(convertValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, convertValue(v)]),
    )
  }
  return value
}

let fallbackId = 0

/**
 * @param blocks  A page's `layout`, read at a depth that populates uploads and
 *                relationships — Puck stores the referenced document inline, not its id.
 */
export const blocksToPuckData = (blocks: unknown[]): PuckDocument => ({
  root: { props: {} },
  content: (blocks ?? []).flatMap((block) => {
    if (!block || typeof block !== 'object') return []
    const { blockType, blockName: _blockName, id, ...rest } = block as Record<string, unknown>
    if (typeof blockType !== 'string') return []

    return [
      {
        type: blockType,
        props: {
          ...(convertValue(rest) as Record<string, unknown>),
          // Puck identifies every item by `props.id`; reuse Payload's so the mapping is
          // stable across re-opens of the editor.
          id: typeof id === 'string' && id ? id : `${blockType}-${(fallbackId += 1)}`,
        },
      },
    ]
  }),
})
