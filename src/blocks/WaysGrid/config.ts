import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

export const WaysGrid: Block = {
  slug: 'waysGrid',
  interfaceName: 'WaysGridBlock',
  labels: { singular: 'Ways Grid', plural: 'Ways Grids' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { description: 'Small caps line above the heading.' } },
        {
          type: 'row',
          fields: [
            {
              name: 'headingBefore',
              type: 'text',
              admin: { description: 'Navy text before the accent, e.g. "9 Ways".', width: '33%' },
            },
            {
              name: 'headingAccent',
              type: 'text',
              admin: { description: 'Blue accent word, e.g. "HemClear®".', width: '33%' },
            },
            {
              name: 'headingAfter',
              type: 'text',
              admin: { description: 'Navy text after the accent, e.g. "Supports You".', width: '33%' },
            },
          ],
        },
        { name: 'subheading', type: 'textarea' },
      ],
    },
    {
      name: 'ways',
      type: 'array',
      label: 'Ways',
      labels: { singular: 'Way', plural: 'Ways' },
      minRows: 1,
      admin: {
        description: 'Numbered automatically in order — reordering renumbers them.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/WaysGrid/RowLabel#WayRowLabel' },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Circular icon illustration.' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Fine print below the grid, shown with a shield icon.' },
    },
    {
      name: 'mediaStyle',
      type: 'select',
      defaultValue: 'circle',
      options: [
        { label: 'Circular icon', value: 'circle' },
        { label: 'Photo card with number badge', value: 'card' },
      ],
      admin: {
        description:
          'Circular is the "9 Ways" treatment: a ringed icon with the number in the title. Photo card is the /why routine treatment: a wide photo with the number in a badge over it.',
      },
    },
    {
      name: 'firstRowCount',
      type: 'number',
      defaultValue: 4,
      min: 1,
      admin: {
        description:
          'How many items sit in the top row on desktop; the rest flow into a second row. Ignored on smaller screens.',
        step: 1,
      },
    },
    backgroundField(),
  ],
}
