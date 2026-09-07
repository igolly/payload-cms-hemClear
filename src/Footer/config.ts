import type { GlobalConfig } from 'payload'

import { brandIconOptions, socialIconOptions } from '@/components/BrandIcons'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      labels: { singular: 'Column', plural: 'Columns' },
      maxRows: 4,
      admin: {
        description: 'e.g. Support, Shop, Learn.',
        initCollapsed: true,
        components: { RowLabel: '@/Footer/RowLabel#ColumnRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          admin: { initCollapsed: true },
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Our Promise',
      fields: [
        { name: 'promiseTitle', type: 'text', defaultValue: 'Our Promise' },
        {
          name: 'promiseItems',
          type: 'array',
          labels: { singular: 'Promise', plural: 'Promises' },
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/Footer/RowLabel#PromiseRowLabel' },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'stethoscope',
                  options: brandIconOptions,
                  required: true,
                  admin: { width: '50%' },
                },
                { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social Links',
      fields: [
        { name: 'socialTitle', type: 'text', defaultValue: 'Social Links' },
        {
          name: 'socialItems',
          type: 'array',
          labels: { singular: 'Social Link', plural: 'Social Links' },
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/Footer/RowLabel#SocialRowLabel' },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  defaultValue: 'facebook',
                  options: socialIconOptions,
                  required: true,
                  admin: { width: '33%' },
                },
                { name: 'label', type: 'text', required: true, admin: { width: '33%' } },
                { name: 'url', type: 'text', admin: { width: '33%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bottom Bar',
      fields: [
        {
          name: 'tagline',
          type: 'textarea',
          admin: { description: 'Sits under the logo. Line breaks are preserved.' },
        },
        { name: 'copyright', type: 'text' },
        {
          name: 'legalLinks',
          type: 'array',
          labels: { singular: 'Legal Link', plural: 'Legal Links' },
          admin: { initCollapsed: true },
          fields: [link({ appearances: false })],
        },
        {
          name: 'disclaimer',
          type: 'textarea',
          admin: { description: 'Fine print. Blank lines become separate paragraphs.' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
