import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

import { backgroundField } from '@/fields/background'

export const BannerHero: Block = {
  slug: 'bannerHero',
  interfaceName: 'BannerHeroBlock',
  labels: { singular: 'Banner Hero', plural: 'Banner Heroes' },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Full-bleed background. A deep navy gradient stands in until one is set.',
      },
    },
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'textarea',
      admin: { description: 'Use line breaks to control where the heading wraps.' },
    },
    { name: 'description', type: 'textarea' },
    linkGroup({ appearances: false, overrides: { maxRows: 2 } }),
    {
      type: 'row',
      fields: [
        {
          name: 'overlay',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left fade (text on the left)', value: 'left' },
            { label: 'Even wash', value: 'even' },
            { label: 'None', value: 'none' },
          ],
          admin: { description: 'Darkening applied over the image so text stays readable.', width: '50%' },
        },
        {
          name: 'height',
          type: 'select',
          defaultValue: 'tall',
          options: [
            { label: 'Tall', value: 'tall' },
            { label: 'Short', value: 'short' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    backgroundField(),
  ],
}
