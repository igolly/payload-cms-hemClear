import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'
import { linkGroup } from '@/fields/linkGroup'

import { backgroundField } from '@/fields/background'

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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Card illustration. Replaces the icon above when set; leave empty to keep using the icon.',
          },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: { description: 'Fine print below the grid, shown with an info icon.' },
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Showcase (large display heading, plain icon row)', value: 'showcase' },
        { label: 'Overlay (copy over a full-bleed photo)', value: 'overlay' },
      ],
      admin: {
        description:
          'Showcase is the /why Quality treatment: a Marcellus display heading, no rule, borderless icon columns divided by hairlines, and the footnote in a tinted note card. Overlay is the /why Internal and External treatment: the image fills the whole band and the copy sits in a narrow column over it, on the side opposite "Image position". Default keeps the original look for pages already using it.',
      },
    },
    {
      name: 'imageFrame',
      type: 'select',
      defaultValue: 'tall',
      options: [
        { label: 'Tall crop (fills a portrait frame)', value: 'tall' },
        { label: 'Square, uncropped', value: 'square' },
      ],
      admin: {
        condition: (_, { variant } = {}) => variant === 'showcase',
        description:
          'Showcase only. Tall is the /why Quality frame, which crops the photo to fill it. Square suits a product shot that must not be cropped.',
      },
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    backgroundField(),
  ],
}
