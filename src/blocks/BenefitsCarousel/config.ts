import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

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
  ],
}
