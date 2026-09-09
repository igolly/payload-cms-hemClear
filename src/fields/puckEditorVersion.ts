import type { Field } from 'payload'

/**
 * Which renderer a page uses.
 *
 * Derived, never hand-set: a page renders through Puck once the visual editor holds
 * content, and through the legacy `layout` blocks until then. The plugin's own version of
 * this field keeps whatever value it sees first, which would pin a page to `legacy`
 * forever after its first save and make migrating it to Puck impossible.
 *
 * The legacy `layout` array is never touched by any of this, so switching a page to Puck
 * is reversible: empty it in the visual editor and the original blocks render again.
 */
export const puckEditorVersion: Field = {
  name: 'editorVersion',
  type: 'select',
  options: [
    { label: 'Legacy (Payload Blocks)', value: 'legacy' },
    { label: 'Puck Visual Editor', value: 'puck' },
  ],
  admin: {
    position: 'sidebar',
    readOnly: true,
    description:
      'Set automatically. A page switches to Puck once the visual editor has content; its block layout is kept either way.',
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, value }) => {
        // `puckData` is admin-hidden, so a save from the normal admin form may omit it.
        // Fall back to the stored document before concluding a page has no Puck content.
        const puckData = (data?.puckData ?? originalDoc?.puckData) as
          | { content?: unknown[] }
          | null
          | undefined
        const layout = (data?.layout ?? originalDoc?.layout) as unknown[] | null | undefined

        const hasPuckContent = Array.isArray(puckData?.content) && puckData.content.length > 0
        if (hasPuckContent) return 'puck'

        const hasLegacyBlocks = Array.isArray(layout) && layout.length > 0
        if (hasLegacyBlocks) return 'legacy'

        return value ?? 'legacy'
      },
    ],
  },
}
