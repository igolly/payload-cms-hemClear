import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'
import { linkGroup } from '@/fields/linkGroup'

import { backgroundField } from '@/fields/background'

export const FeatureStrip: Block = {
  slug: 'featureStrip',
  interfaceName: 'FeatureStripBlock',
  labels: { singular: 'Feature Strip', plural: 'Feature Strips' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header (optional)',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'textarea' },
        { name: 'subheading', type: 'textarea' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      labels: { singular: 'Item', plural: 'Items' },
      minRows: 1,
      admin: {
        description: 'Laid out in one divided row on desktop, stacking on smaller screens.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/FeatureStrip/RowLabel#StripRowLabel' },
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
              admin: { width: '40%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Illustrated icon. Replaces the icon above when set; leave empty to keep using the icon.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Appearance',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'divided',
          options: [
            { label: 'Divided row', value: 'divided' },
            { label: 'Bordered cards', value: 'cards' },
            { label: 'Compact pills (icon + title only)', value: 'pills' },
            { label: 'Checklist', value: 'checklist' },
          ],
          admin: { description: 'How the items are laid out.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional artwork behind the whole section.',
                width: '50%',
              },
            },
            {
              name: 'background',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Light blue', value: 'light' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'align',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Centred', value: 'center' },
                { label: 'Left', value: 'left' },
                { label: 'Split (icon beside the title, description below)', value: 'split' },
              ],
              admin: { description: 'Alignment of each item.', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'iconSize',
              type: 'select',
              defaultValue: 'small',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
              admin: {
                description: 'Large matches the /why comp, where the icon is an illustration.',
                width: '50%',
              },
            },
            {
              name: 'showRule',
              type: 'checkbox',
              defaultValue: false,
              label: 'Hairline between the title and description',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'titleCase',
              type: 'select',
              defaultValue: 'upper',
              options: [
                { label: 'UPPERCASE', value: 'upper' },
                { label: 'As typed', value: 'none' },
              ],
              admin: { description: 'How item titles are cased.', width: '50%' },
            },
          ],
        },
      ],
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'footnote',
      type: 'textarea',
      admin: {
        description:
          'Fine print below the row. In the Checklist variant it renders as a highlighted callout instead.',
      },
    },
    backgroundField(),
  ],
}
