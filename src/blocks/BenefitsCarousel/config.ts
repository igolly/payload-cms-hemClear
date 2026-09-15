import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const BenefitsCarousel: Block = {
  slug: 'benefitsCarousel',
  interfaceName: 'BenefitsCarouselBlock',
  labels: { singular: 'Benefits Carousel', plural: 'Benefits Carousels' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      label: 'Benefits',
      labels: { singular: 'Benefit', plural: 'Benefits' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/BenefitsCarousel/RowLabel#BenefitRowLabel' },
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'badge',
          type: 'select',
          label: 'Badge artwork',
          options: [
            { label: 'Internal + External', value: 'internalExternal' },
            { label: 'Vein', value: 'vein' },
            { label: 'Circulation', value: 'circulation' },
            { label: 'Regularity', value: 'regularity' },
            { label: 'Soothing', value: 'soothing' },
          ],
          admin: {
            description:
              'Optional. The badge drawn for this section in the design; overrides the icon below.',
          },
        },
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
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        {
          name: 'details',
          type: 'textarea',
          admin: { description: 'Revealed when the visitor expands the card.' },
        },
      ],
    },
    backgroundField(),
  ],
}
