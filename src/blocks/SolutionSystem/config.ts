import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'
import { backgroundField } from '@/fields/background'

export const SolutionSystem: Block = {
  slug: 'solutionSystem',
  interfaceName: 'SolutionSystemBlock',
  labels: { singular: 'Solution System', plural: 'Solution Systems' },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Centre diagram. A placeholder holds its space until one is set.',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Highlight Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      maxRows: 8,
      admin: {
        description:
          'Split around the diagram by position: the first half fills the left column, the rest the right. On mobile they stack below the diagram in this order.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/SolutionSystem/RowLabel#CardRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'shieldCheck',
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
    backgroundField(),
  ],
}
