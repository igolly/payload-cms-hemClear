import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const TotalCare: Block = {
  slug: 'totalCare',
  interfaceName: 'TotalCareBlock',
  labels: { singular: 'Total Care System', plural: 'Total Care Systems' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small caps line above the heading.' } },
    { name: 'heading', type: 'text' },
    {
      name: 'subheading',
      type: 'richText',
      admin: { description: 'Supports bold for the product names.' },
    },
    {
      name: 'showConnector',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show the "+" between the two sides',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Sides',
      labels: { singular: 'Side', plural: 'Sides' },
      maxRows: 2,
      admin: {
        description: 'Two sides of the system. A "+" is drawn between them automatically.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/TotalCare/RowLabel#SideRowLabel' },
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          admin: {
            description: 'Listed beside the image.',
            initCollapsed: true,
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
                  admin: { width: '40%' },
                },
                { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
              ],
            },
          ],
        },
      ],
    },
    backgroundField(),
  ],
}
