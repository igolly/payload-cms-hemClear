import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateWebsite } from './hooks/revalidateWebsite'

/**
 * The site this deployment is. One record per deployment — the frontend reads the one
 * marked Active — so standing up a new brand on this template is a matter of cloning the
 * codebase, pointing it at a fresh database, and filling this in.
 *
 * It is a collection rather than a global on purpose: a global is capped at one document
 * per database, which would make it impossible to keep a second brand's settings beside
 * this one while it is being prepared, or to hold a seasonal variant ready to switch to.
 *
 * The palette below is the reason this exists. Tailwind v4 compiles every brand utility to
 * a custom property — `bg-brand` is `background-color: var(--color-brand)` — so overriding
 * those properties at the root re-skins all ~87 token classes at once, with no rebuild.
 * `src/app/(frontend)/layout.tsx` writes them into the document head.
 */
export const Websites: CollectionConfig = {
  slug: 'websites',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'domain', 'isActive'],
    description:
      'Identity and brand colours for this deployment. The Active record is the one the site renders.',
    group: 'Settings',
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [revalidateWebsite],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { description: 'Brand name, as it reads in the admin and in metadata.' },
            },
            {
              name: 'domain',
              type: 'text',
              admin: {
                description: 'Production domain, without a scheme — e.g. shop.hemclear.com.',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: false,
              label: 'Active',
              admin: {
                description:
                  'The record this deployment renders. Only one should be ticked; the site takes the first it finds.',
                position: 'sidebar',
              },
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'tagline',
              type: 'text',
              admin: { description: 'Short line under the brand name, where a layout uses one.' },
            },
          ],
        },
        {
          label: 'Brand Colours',
          description:
            'Left blank, a colour falls back to the palette in globals.css — so a new brand only fills in what actually differs.',
          fields: [
            {
              type: 'collapsible',
              label: 'Core',
              fields: [
                colour('primary', 'Primary', 'Buttons, links and icons. Drives --color-brand.'),
                colour('primaryDark', 'Primary (hover)', 'The darker press state of the primary.'),
                colour('accent', 'Accent', 'Inline links and small labels.'),
              ],
            },
            {
              type: 'collapsible',
              label: 'Headings and dark bands',
              fields: [
                colour(
                  'navy',
                  'Heading / dark band',
                  'Section headings and full-width dark bands.',
                ),
                colour('navyDeep', 'Deep', 'Display headings on a tinted band, and the footer.'),
                colour('subheading', 'Sub-heading', 'Card titles and kickers.'),
              ],
            },
            {
              type: 'collapsible',
              label: 'Section backgrounds',
              fields: [
                colour('bandTint', 'Tinted band', 'The pale band behind a closing call to action.'),
                colour('bandMist', 'Off-white band', 'The off-white band most sections sit on.'),
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
            {
              name: 'socials',
              type: 'array',
              labels: { plural: 'Links', singular: 'Link' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: ['facebook', 'instagram', 'youtube', 'tiktok', 'x', 'linkedin'],
                  required: true,
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}

/** A hex colour, validated, so a typo cannot take the whole palette down with it. */
function colour(name: string, label: string, description: string) {
  return {
    name,
    type: 'text' as const,
    label,
    admin: { description, placeholder: '#0023a3' },
    validate: (value: null | string | undefined) =>
      !value || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
        ? true
        : 'Use a hex colour such as #0023a3.',
  }
}
