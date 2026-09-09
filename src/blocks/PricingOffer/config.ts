import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const PricingOffer: Block = {
  slug: 'pricingOffer',
  interfaceName: 'PricingOfferBlock',
  labels: { singular: 'Pricing Offer', plural: 'Pricing Offers' },
  fields: [
    {
      type: 'collapsible',
      label: 'Offer Banner',
      fields: [
        { name: 'bannerTitle', type: 'text', admin: { description: 'e.g. "Limited Time Offer:"' } },
        {
          name: 'bannerText',
          type: 'textarea',
          admin: { description: 'Wrap a word in *asterisks* to highlight it in light blue.' },
        },
        { name: 'bannerImage', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'bannerValue', type: 'text', admin: { width: '50%' } },
            { name: 'bannerValueLabel', type: 'text', defaultValue: 'Value', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'plans',
      type: 'array',
      label: 'Plans',
      labels: { singular: 'Plan', plural: 'Plans' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/PricingOffer/RowLabel#PlanRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'priceLead', type: 'text', defaultValue: 'As low as', admin: { width: '33%' } },
            { name: 'price', type: 'text', required: true, admin: { width: '33%' } },
            { name: 'priceSuffix', type: 'text', defaultValue: '/month', admin: { width: '33%' } },
          ],
        },
        {
          name: 'features',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          admin: { initCollapsed: true },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'highlight', type: 'checkbox', label: 'Show in blue' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', defaultValue: 'Buy Now', admin: { width: '50%' } },
            { name: 'ctaUrl', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'footnote', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'popular', type: 'checkbox', label: 'Highlight as most popular', admin: { width: '50%' } },
            { name: 'popularLabel', type: 'text', defaultValue: 'Most Popular', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'trustItems',
      type: 'array',
      label: 'Trust Bar',
      labels: { singular: 'Item', plural: 'Items' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'guarantee',
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
