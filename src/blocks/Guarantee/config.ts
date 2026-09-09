import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const Guarantee: Block = {
  slug: 'guarantee',
  interfaceName: 'GuaranteeBlock',
  labels: { singular: 'Guarantee', plural: 'Guarantees' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        { name: 'badgeLabel', type: 'text', defaultValue: 'Our Promise' },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Seal',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'sealValue',
              type: 'text',
              defaultValue: '90',
              admin: { description: 'Large number in the circular seal.', width: '50%' },
            },
            {
              name: 'sealLabel',
              type: 'text',
              defaultValue: 'DAY',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'points',
      type: 'array',
      label: 'Promise Points',
      labels: { singular: 'Point', plural: 'Points' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Guarantee/RowLabel#PointRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'calendar',
              options: brandIconOptions,
              required: true,
              admin: { width: '40%' },
            },
            { name: 'text', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Trust Pills',
      labels: { singular: 'Pill', plural: 'Pills' },
      admin: {
        description: 'Rendered as a centred, wrapping row of outlined pills.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/Guarantee/RowLabel#BadgeRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'truck',
              options: brandIconOptions,
              required: true,
              admin: { width: '40%' },
            },
            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    backgroundField(),
  ],
}
