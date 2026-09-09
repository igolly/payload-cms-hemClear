import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const SupportTabs: Block = {
  slug: 'supportTabs',
  interfaceName: 'SupportTabsBlock',
  labels: { singular: 'Support Tabs', plural: 'Support Tabs' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { description: 'Outlined pill above the heading.' } },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Support Areas',
      labels: { singular: 'Area', plural: 'Areas' },
      minRows: 1,
      admin: {
        description:
          'Each one becomes a tab and a card. Selecting a tab scrolls its card into view.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/SupportTabs/RowLabel#AreaRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'supportSystem',
              options: brandIconOptions,
              required: true,
              admin: { description: 'Used when no icon image is uploaded.', width: '50%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional illustrated icon; overrides the icon above.' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: { description: 'Line breaks are preserved.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Section Footer',
      fields: [
        { name: 'footerLine', type: 'text' },
        { name: 'disclaimer', type: 'textarea' },
      ],
    },
    backgroundField(),
  ],
}
