import type { Field } from 'payload'

/**
 * The Puck document for a page.
 *
 * Hidden from the admin form: it is written by the visual editor, not typed by hand. A page
 * that has never been saved from the visual editor has no value here and renders from its
 * `layout` blocks — see [[puckEditorVersion]].
 *
 * Opening such a page in the editor fills the canvas from those blocks; that path is the
 * `/api/pages/:id/puck-seed` endpoint plus the `seed-from-blocks` Puck plugin, not a hook on
 * this field. The plugin's editor view reads the page through the Local API without passing
 * the request, so a field hook here cannot tell the editor apart from the site or the REST
 * API, and seeding on every read would put a duplicate of every page's layout into every
 * API response.
 */
export const puckData: Field = {
  name: 'puckData',
  type: 'json',
  admin: {
    hidden: true,
    description: 'Puck editor data — managed via the visual editor',
  },
}
