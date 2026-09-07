import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const WhyDays: Block = {
  slug: 'whyDays',
  interfaceName: 'WhyDaysBlock',
  labels: { singular: 'Why 90 Days', plural: 'Why 90 Days' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Large lifestyle image on the left.' },
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Use line breaks to control where the heading wraps.' },
    },
    {
      name: 'paragraphs',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      admin: { initCollapsed: true },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      type: 'collapsible',
      label: 'Call to Action',
      fields: [
        { name: 'ctaHeading', type: 'text' },
        { name: 'ctaText', type: 'textarea' },
        linkGroup({ appearances: false, overrides: { maxRows: 1 } }),
      ],
    },
    {
      name: 'productImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Product shot beside the copy.' },
    },
  ],
}
