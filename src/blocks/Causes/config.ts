import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'
import { linkGroup } from '@/fields/linkGroup'

export const Causes: Block = {
  slug: 'causes',
  interfaceName: 'CausesBlock',
  labels: { singular: 'Causes Section', plural: 'Causes Sections' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Illustration shown on the left. A placeholder renders until one is set.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image on the left', value: 'left' },
        { label: 'Image on the right', value: 'right' },
        { label: 'No image (full width)', value: 'none' },
      ],
      admin: { description: 'Which side the illustration sits on at desktop widths.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: { description: 'Small caps line above the heading.' },
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Use a line break to control where the heading wraps.' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'gridLabel',
      type: 'text',
      label: 'Grid Label',
      admin: { description: 'Small blue line above the icon grid.' },
    },
    {
      name: 'factorStyle',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Icon cards', value: 'cards' },
        { label: 'Checklist', value: 'checklist' },
      ],
      admin: { description: 'How the factor list is presented.' },
    },
    {
      name: 'factors',
      type: 'array',
      label: 'Factors',
      labels: { singular: 'Factor', plural: 'Factors' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Causes/RowLabel#FactorRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'pregnancy',
              options: brandIconOptions,
              required: true,
              admin: { width: '50%' },
            },
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Fine print below the grid, shown with an info icon.' },
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
  ],
}
