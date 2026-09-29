import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

/**
 * The reported results at full width, for a page that also carries the compact row inside
 * the product's buy column.
 *
 * The compact row is a summary sitting beside the price; this is the same evidence given
 * room — the figures large, each with the count behind it, and the qualification that goes
 * with them. The two are separate blocks rather than one rendered twice because they are
 * placed by different things: the row belongs to the product, this belongs to the page.
 *
 * The footnote is not decoration. It says how many reviewers each figure rests on and that
 * negative reports were counted, which is what keeps the figures honest — a section that
 * loses it is making a stronger claim than the data supports.
 */
export const ResultsBanner: Block = {
  slug: 'resultsBanner',
  interfaceName: 'ResultsBannerBlock',
  labels: { singular: 'Reported Results', plural: 'Reported Results' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Customer-Reported Results*',
      admin: { description: 'The asterisk points at the footnote below.' },
    },
    {
      name: 'intro',
      type: 'text',
      admin: { description: 'One line under the title, e.g. what the reviewers reported.' },
    },
    {
      name: 'results',
      type: 'array',
      label: 'Figures',
      labels: { singular: 'Figure', plural: 'Figures' },
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Up to four. They sit in one row on a wide screen and two on a phone.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Smaller Hemorrhoids"', width: '50%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "91%"', width: '50%' },
            },
          ],
        },
        {
          name: 'detail',
          type: 'textarea',
          admin: {
            description:
              'What the figure rests on, e.g. "29 of 32 reviewers reported reduced size or swelling." Leaving this out makes the figure harder to trust, not easier.',
          },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: {
        description:
          'The qualification under the figures — who was counted and how. Keep it: it is what the asterisk in the title promises.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Product image',
      admin: { description: 'Optional, shown beside the figures on a wide screen.' },
    },
    backgroundField(),
  ],
}
