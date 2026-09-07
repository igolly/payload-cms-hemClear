import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

export const Comparison: Block = {
  slug: 'comparison',
  interfaceName: 'ComparisonBlock',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    {
      name: 'products',
      type: 'array',
      label: 'Columns',
      labels: { singular: 'Column', plural: 'Columns' },
      minRows: 1,
      admin: {
        description:
          'One per product column, left to right. Mark your own product as highlighted.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Comparison/RowLabel#ProductRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'highlight',
          type: 'checkbox',
          label: 'Highlight this column',
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Feature Rows',
      labels: { singular: 'Row', plural: 'Rows' },
      admin: {
        description:
          'Each row lists one value per column, in the same order as Columns above.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Comparison/RowLabel#FeatureRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'leaf',
              options: brandIconOptions,
              required: true,
              admin: { width: '40%' },
            },
            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        {
          name: 'values',
          type: 'array',
          labels: { singular: 'Value', plural: 'Values' },
          admin: {
            description: 'One per column, in order.',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'value',
              type: 'select',
              defaultValue: 'no',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
