import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

export const ProductSystem: Block = {
  slug: 'productSystem',
  interfaceName: 'ProductSystemBlock',
  labels: { singular: 'Product System', plural: 'Product Systems' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          admin: { description: 'Use a line break to control where the heading wraps.' },
        },
        { name: 'subheading', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Left Column',
      fields: [
        {
          name: 'columnHeading',
          type: 'textarea',
          admin: { description: 'e.g. "What Is\nHemClear®?"' },
        },
        {
          name: 'paragraphs',
          type: 'array',
          label: 'Paragraphs',
          labels: { singular: 'Paragraph', plural: 'Paragraphs' },
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/blocks/ProductSystem/RowLabel#ParagraphRowLabel' },
          },
          fields: [
            {
              name: 'lead',
              type: 'text',
              admin: { description: 'Bold blue lead-in, e.g. "HemClear®".' },
            },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Centre diagram. A placeholder renders until one is set.',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Feature Cards',
      labels: { singular: 'Feature', plural: 'Features' },
      admin: {
        description: 'Shown in the right column on desktop, below the diagram on mobile.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/ProductSystem/RowLabel#FeatureRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'flask',
              options: brandIconOptions,
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'stat',
              type: 'text',
              admin: { description: 'Large lead-in number, e.g. "13".', width: '50%' },
            },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
      ],
    },
  ],
}
