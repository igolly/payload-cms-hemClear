import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'
import { linkGroup } from '@/fields/linkGroup'

import { backgroundField } from '@/fields/background'

export const ClosingCta: Block = {
  slug: 'closingCta',
  interfaceName: 'ClosingCtaBlock',
  labels: { singular: 'Closing CTA', plural: 'Closing CTAs' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'headingTop',
          type: 'text',
          admin: { description: 'Bold sans-serif first line, e.g. "Don\'t Let Hemorrhoids Win!"' },
        },
        {
          name: 'heading',
          type: 'text',
          admin: { description: 'Serif second line.' },
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/ClosingCta/RowLabel#CtaCardRowLabel' },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Lifestyle photo above the card body.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'clipboardCheck',
              options: brandIconOptions,
              required: true,
              admin: { width: '50%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'iconImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon image',
          admin: {
            description:
              'Small mark shown beside the title. Replaces the icon above when set; leave empty to use the icon. (The photo field above is the large card image.)',
          },
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: { maxRows: 2 },
    }),
    backgroundField(),
  ],
}
