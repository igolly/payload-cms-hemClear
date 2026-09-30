import type { Field } from 'payload'

/**
 * An optional anchor for a section, so a link can point at it rather than at the top of the
 * page it happens to sit on.
 *
 * Two footer links — the comfort guide and the bowel-habits guide — both pointed at
 * `/about-hemorrhoids`, because that one page carries a section for each of them. Naming a
 * section lets each link land on the part it promises, without copying the copy onto a page
 * of its own and then owing an editor two places to keep it right.
 *
 * Stored without the `#`: an editor writes `everyday-habits` and links to
 * `/about-hemorrhoids#everyday-habits`.
 */
export const anchorField = (): Field => ({
  name: 'anchor',
  type: 'text',
  label: 'Anchor',
  admin: {
    description:
      'Optional. Lets a link jump straight to this section — enter a short name with no spaces, e.g. "everyday-habits", then link to /page-slug#everyday-habits.',
  },
  validate: (value: unknown) => {
    if (!value) return true
    return /^[a-z0-9][a-z0-9-]*$/.test(String(value))
      ? true
      : 'Use lowercase letters, numbers and hyphens only, starting with a letter or number.'
  },
})
