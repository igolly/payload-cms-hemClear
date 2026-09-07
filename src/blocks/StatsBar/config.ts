import type { Block } from 'payload'

export const StatsBar: Block = {
  slug: 'statsBar',
  interfaceName: 'StatsBarBlock',
  labels: { singular: 'Stats Bar', plural: 'Stats Bars' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Rendered in a row on desktop, wrapping to two columns on mobile.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/StatsBar/RowLabel#StatRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'topLabel',
              type: 'text',
              admin: { description: 'Small line above, e.g. "The".', width: '50%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { description: 'The large line, e.g. "20" or "500,000+".', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: { description: 'Small line below, e.g. "Years in Business".', width: '50%' },
            },
            {
              name: 'showStar',
              type: 'checkbox',
              label: 'Show star after value',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
