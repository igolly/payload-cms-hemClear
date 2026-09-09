import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

/**
 * The product detail — gallery, buy box, results, detail sections — as a block.
 *
 * This used to be its own `products` collection with a fixed `/products/[slug]` route.
 * It is a block now so a product page is an ordinary Pages doc: the detail is one
 * section in `layout`, and anything that should run below it is simply the next block
 * in the same list. That also drops the collection's own nested `layout` field, which
 * existed only to let site blocks run under a product.
 *
 * The fields are grouped into tabs because a flat list of ~30 is unusable in the admin.
 */
export const ProductDetail: Block = {
  slug: 'productDetail',
  interfaceName: 'ProductDetailBlock',
  labels: { singular: 'Product Detail', plural: 'Product Details' },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        // ---------------------------------------------------------------- Overview
        {
          label: 'Overview',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              admin: { description: 'Small caps line above the title.' },
            },
            { name: 'description', type: 'textarea' },
            {
              name: 'gallery',
              type: 'array',
              label: 'Gallery',
              labels: { singular: 'Image', plural: 'Images' },
              admin: { description: 'First image is shown by default.', initCollapsed: true },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
            },
            {
              type: 'collapsible',
              label: 'Review Bar',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rating',
                      type: 'number',
                      defaultValue: 5,
                      max: 5,
                      min: 0,
                      admin: { description: 'Filled stars, 0–5.', width: '50%' },
                    },
                    {
                      name: 'ratingLabel',
                      type: 'text',
                      admin: { description: 'e.g. "4.8 from 5,864 Reviews".', width: '50%' },
                    },
                  ],
                },
                {
                  name: 'ratingNotes',
                  type: 'array',
                  labels: { singular: 'Note', plural: 'Notes' },
                  admin: {
                    description: 'Separated by vertical rules, e.g. "500,000+ Orders".',
                    initCollapsed: true,
                  },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Benefit Pills',
              labels: { singular: 'Pill', plural: 'Pills' },
              admin: { initCollapsed: true },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'badgeLabel',
              type: 'text',
              admin: { description: 'Pill over the gallery, e.g. "1,100+ Customer Reviews".' },
            },
          ],
        },
        // ---------------------------------------------------------------- Results
        {
          label: 'Results',
          fields: [
            { name: 'resultsTitle', type: 'text', defaultValue: 'Customer-Reported Results*' },
            {
              name: 'results',
              type: 'array',
              labels: { singular: 'Result', plural: 'Results' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
                { name: 'detail', type: 'textarea' },
              ],
            },
            { name: 'resultsFootnote', type: 'textarea' },
            { name: 'feelTitle', type: 'text', defaultValue: "What You'll Feel" },
            {
              name: 'feel',
              type: 'array',
              label: 'What You’ll Feel',
              labels: { singular: 'Row', plural: 'Rows' },
              admin: { initCollapsed: true },
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
                      admin: { width: '30%' },
                    },
                    { name: 'title', type: 'text', required: true, admin: { width: '45%' } },
                    {
                      name: 'percent',
                      type: 'text',
                      admin: { description: 'e.g. "92%"', width: '25%' },
                    },
                  ],
                },
                { name: 'subtitle', type: 'text' },
              ],
            },
          ],
        },
        // ---------------------------------------------------------------- Buy box
        {
          label: 'Buy Box',
          fields: [
            { name: 'variantsTitle', type: 'text', defaultValue: 'Select Your System:' },
            {
              name: 'variants',
              type: 'array',
              labels: { singular: 'Variant', plural: 'Variants' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Purchase Plans',
              labels: { singular: 'Plan', plural: 'Plans' },
              admin: {
                description: 'The first plan is selected by default.',
                initCollapsed: true,
                components: { RowLabel: '@/blocks/ProductDetail/RowLabel#PlanRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'saveLabel',
                      type: 'text',
                      admin: { description: 'e.g. "Save 30%"', width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'text', required: true, admin: { width: '33%' } },
                    {
                      name: 'comparePrice',
                      type: 'text',
                      admin: { description: 'Struck through.', width: '33%' },
                    },
                    {
                      name: 'priceSuffix',
                      type: 'text',
                      defaultValue: '/mo',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'billingNote', type: 'text', admin: { width: '50%' } },
                    { name: 'perServing', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'bestValue', type: 'checkbox', admin: { width: '50%' } },
                    {
                      name: 'bestValueLabel',
                      type: 'text',
                      defaultValue: 'Best Value',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'features',
                  type: 'array',
                  labels: { singular: 'Feature', plural: 'Features' },
                  admin: { initCollapsed: true },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                {
                  type: 'collapsible',
                  label: 'Bonus',
                  fields: [
                    { name: 'bonusHeading', type: 'text' },
                    { name: 'bonusHighlight', type: 'text' },
                    { name: 'bonusTitle', type: 'text' },
                    { name: 'bonusSubtitle', type: 'text' },
                    { name: 'bonusImage', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'oneTimeLabel', type: 'text', admin: { width: '50%' } },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Add to Cart',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'notes',
              type: 'array',
              label: 'Info Banners',
              labels: { singular: 'Banner', plural: 'Banners' },
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
                      admin: { width: '30%' },
                    },
                    { name: 'lead', type: 'text', admin: { width: '70%' } },
                  ],
                },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
            {
              name: 'trustItems',
              type: 'array',
              label: 'Trust Icons',
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
          ],
        },
        // ---------------------------------------------------------------- Details
        {
          label: 'Details',
          fields: [
            {
              type: 'collapsible',
              label: "What's In It / What's Not",
              fields: [
                { name: 'compositionTitle', type: 'text' },
                {
                  name: 'compositionNote',
                  type: 'text',
                  admin: { description: 'Centred line above the two columns.' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'containsTitle',
                      type: 'text',
                      defaultValue: 'Contains',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'notContainsTitle',
                      type: 'text',
                      defaultValue: 'Does Not Contain',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'contains',
                  type: 'array',
                  labels: { singular: 'Item', plural: 'Items' },
                  admin: { initCollapsed: true },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                {
                  name: 'notContains',
                  type: 'array',
                  labels: { singular: 'Item', plural: 'Items' },
                  admin: { initCollapsed: true },
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Customer Videos',
              fields: [
                { name: 'storiesTitle', type: 'text' },
                {
                  name: 'stories',
                  type: 'array',
                  labels: { singular: 'Story', plural: 'Stories' },
                  admin: {
                    description: 'Same carousel used by the Video Stories block.',
                    initCollapsed: true,
                    components: { RowLabel: '@/blocks/ProductDetail/RowLabel#StoryRowLabel' },
                  },
                  fields: [
                    { name: 'poster', type: 'upload', relationTo: 'media' },
                    {
                      type: 'row',
                      fields: [
                        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'caption', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'badge',
                          type: 'text',
                          defaultValue: 'Customer Video',
                          admin: { width: '50%' },
                        },
                        { name: 'duration', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    { name: 'video', type: 'upload', relationTo: 'media' },
                    { name: 'videoUrl', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'sections',
              type: 'array',
              label: 'Detail Sections',
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                description: 'Collapsible sections below the buy box, e.g. Ingredients.',
                initCollapsed: true,
                components: { RowLabel: '@/blocks/ProductDetail/RowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Bullet', plural: 'Bullets' },
                  admin: { initCollapsed: true },
                  fields: [{ name: 'text', type: 'textarea', required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
