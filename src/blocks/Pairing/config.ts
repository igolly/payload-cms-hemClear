import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

export const Pairing: Block = {
  slug: 'pairing',
  interfaceName: 'PairingBlock',
  labels: { singular: 'Pairing', plural: 'Pairings' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'headingAccent',
          type: 'text',
          admin: { description: 'Second heading line, rendered in red.' },
        },
        {
          name: 'intro',
          type: 'richText',
          admin: { description: 'Supports bold for the emphasised phrases.' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Product shot shown between the two feature columns.' },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      labels: { singular: 'Feature', plural: 'Features' },
      admin: {
        description:
          'Split evenly down the middle — the first half sits left of the image, the rest right.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Pairing/RowLabel#PairingRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'snowflake',
              options: brandIconOptions,
              required: true,
              admin: { width: '40%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
