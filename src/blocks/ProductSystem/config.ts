import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Card visual. A dashed placeholder holds its space until set.',
                width: '50%',
              },
            },
            {
              name: 'stat',
              type: 'text',
              admin: { description: 'Large lead-in number, e.g. "13".', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              admin: {
                description: 'Built-in icon, used when no card image is uploaded.',
                width: '50%',
              },
              options: [
                { label: 'Flask (ingredients)', value: 'flask' },
                { label: 'Target (support system)', value: 'supportSystem' },
                { label: 'Stethoscope', value: 'stethoscope' },
                { label: 'Clipboard (research)', value: 'research' },
                { label: 'Made in USA', value: 'madeInUsa' },
                { label: 'Guarantee', value: 'guarantee' },
              ],
            },
            {
              name: 'titleSize',
              type: 'select',
              admin: {
                description:
                  'Leave empty for the default: 16px beside a number, 24px above a subtitle, 18px otherwise.',
                width: '50%',
              },
              options: [
                { label: 'Small (16px)', value: 'sm' },
                { label: 'Medium (18px)', value: 'md' },
                { label: 'Large (24px)', value: 'lg' },
              ],
            },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
      ],
    },
    backgroundField(),
  ],
}
