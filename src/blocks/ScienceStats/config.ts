import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

import { backgroundField } from '@/fields/background'

export const ScienceStats: Block = {
  slug: 'scienceStats',
  interfaceName: 'ScienceStatsBlock',
  labels: { singular: 'Science Stats', plural: 'Science Stats' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/ScienceStats/RowLabel#StatRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'badges',
      type: 'array',
      label: 'Badge Row',
      labels: { singular: 'Badge', plural: 'Badges' },
      admin: { description: 'e.g. Gluten Free | Dairy Free.', initCollapsed: true },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'footnote', type: 'textarea' },
    backgroundField(),
  ],
}
