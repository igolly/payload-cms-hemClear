import type { Block, Field } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { productArtworkOptions } from './artwork'

/** Optional Figma glyph beside the shared `icon` select; wins over it when set. */
const artworkField = (width: string) => ({
  name: 'artwork',
  type: 'select' as const,
  options: productArtworkOptions,
  admin: { description: 'Product-page glyph. Overrides Icon when set.', width },
})

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
/**
 * One plan's fields. Shared by the block's own `plans` and by each variant's, so a variant
 * that prices differently is described in the same shape rather than a parallel one.
 */
const planFields: Field[] = [
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
    name: 'ctaUrl',
    type: 'text',
    label: 'Buy link',
    admin: {
      description:
        'Where both buy buttons go when this package is the chosen one — the checkout link for this exact product and package. Leave it empty and the buttons fall back to the link under Sticky Bars, which cannot know which package was picked.',
    },
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
      {
        name: 'bonusNote',
        type: 'text',
        admin: { description: 'Optional third line, e.g. "($59.95 VALUE)".' },
      },
      { name: 'bonusImage', type: 'upload', relationTo: 'media' },
    ],
  },
]

const galleryField: Field = {
  name: 'gallery',
  type: 'array',
  label: 'Gallery',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { description: 'First image is shown by default.', initCollapsed: true },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional. Shown in the thumbnail strip instead of the image.',
      },
    },
    {
      type: 'collapsible',
      label: 'Overlay',
      admin: {
        description:
          'Optional copy set over the image (the comp does this on the first slide). The Review Badge shows on slides that have an overlay.',
        initCollapsed: true,
      },
      fields: [
        { name: 'overlayEyebrow', type: 'text' },
        {
          name: 'overlayHeading',
          type: 'textarea',
          admin: { description: 'Line breaks are kept.' },
        },
        {
          name: 'overlayText',
          type: 'textarea',
          admin: { description: 'Line breaks are kept.' },
        },
        {
          name: 'overlayTestedBadge',
          type: 'checkbox',
          label: 'Show the "3rd-party tested" seal',
        },
      ],
    },
  ],
}

const benefitsField: Field = {
  name: 'benefits',
  type: 'array',
  label: 'Benefit Pills',
  labels: { singular: 'Pill', plural: 'Pills' },
  admin: { initCollapsed: true },
  fields: [{ name: 'text', type: 'text', required: true }],
}

const resultsField: Field = {
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
}

const feelField: Field = {
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
    {
      type: 'row',
      fields: [{ name: 'subtitle', type: 'text', admin: { width: '70%' } }, artworkField('30%')],
    },
  ],
}

const containsField: Field = {
  name: 'contains',
  type: 'array',
  labels: { singular: 'Item', plural: 'Items' },
  admin: { initCollapsed: true },
  fields: [{ name: 'text', type: 'text', required: true }],
}

const notContainsField: Field = {
  name: 'notContains',
  type: 'array',
  labels: { singular: 'Item', plural: 'Items' },
  admin: { initCollapsed: true },
  fields: [{ name: 'text', type: 'text', required: true }],
}

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
            galleryField,
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
            benefitsField,
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
            resultsField,
            { name: 'resultsFootnote', type: 'textarea' },
            { name: 'feelTitle', type: 'text', defaultValue: "What You'll Feel" },
            feelField,
          ],
        },
        // ---------------------------------------------------------------- Buy box
        {
          // The systems a buyer chooses between, each with its own prices and copy.
          label: 'Variants',
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
                {
                  name: 'plans',
                  type: 'array',
                  label: 'Plans for this variant',
                  labels: { singular: 'Plan', plural: 'Plans' },
                  admin: {
                    description:
                      'Leave empty and the shared plans below are used. Fill it in and choosing this variant shows these prices instead.',
                    initCollapsed: true,
                    components: { RowLabel: '@/blocks/ProductDetail/RowLabel#PlanRowLabel' },
                  },
                  fields: planFields,
                },
                {
                  type: 'collapsible',
                  label: 'Content for this variant',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'ui',
                      name: 'variantContentNote',
                      admin: {
                        components: {
                          Field: '@/blocks/ProductDetail/OverrideNote#OverrideNote',
                        },
                      },
                    },
                    { name: 'eyebrow', type: 'text' },
                    { name: 'title', type: 'text' },
                    { name: 'description', type: 'textarea' },
                    { name: 'badgeLabel', type: 'text' },
                    { name: 'ctaLabel', type: 'text' },
                    galleryField,
                    benefitsField,
                    { name: 'resultsTitle', type: 'text' },
                    resultsField,
                    { name: 'resultsFootnote', type: 'textarea' },
                    { name: 'feelTitle', type: 'text' },
                    feelField,
                    { name: 'compositionTitle', type: 'text' },
                    { name: 'compositionNote', type: 'textarea' },
                    { name: 'containsTitle', type: 'text' },
                    containsField,
                    { name: 'notContainsTitle', type: 'text' },
                    notContainsField,
                  ],
                },
              ],
            },
          ],
        },
        {
          // What each variant costs, and the one-time line under the cards.
          label: 'Plans',
          fields: [
            {
              name: 'plans',
              type: 'array',
              label: 'Purchase Plans',
              labels: { singular: 'Plan', plural: 'Plans' },
              admin: {
                description:
                  'The first plan is selected by default. A variant with plans of its own overrides these.',
                initCollapsed: true,
                components: { RowLabel: '@/blocks/ProductDetail/RowLabel#PlanRowLabel' },
              },
              fields: planFields,
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
          ],
        },
        {
          // The strips under the cart button: info banners, then the icon row.
          label: 'Banners & Trust',
          fields: [
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
                    { name: 'lead', type: 'text', admin: { width: '40%' } },
                    artworkField('30%'),
                  ],
                },
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Wrap a phrase in **double asterisks** to set it in bold.',
                  },
                },
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
                      admin: { width: '30%' },
                    },
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    artworkField('30%'),
                  ],
                },
              ],
            },
          ],
        },
        // ---------------------------------------------------------------- Details
        {
          // The two lists under the buy box: what it contains, and what it does not.
          label: 'Composition',
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
                containsField,
                notContainsField,
              ],
            },
          ],
        },
        {
          // The customer clips that run below the detail.
          label: 'Videos',
          fields: [
            {
              type: 'collapsible',
              label: 'Customer Videos',
              fields: [
                { name: 'storiesTitle', type: 'text' },
                {
                  name: 'storiesPosterIncludesChrome',
                  type: 'checkbox',
                  label: 'Posters already include the phone status bar and badge',
                },
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
          ],
        },
        {
          // The accordions beneath the buy box — ingredients, quality, how to use.
          label: 'Sections',
          fields: [
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
        {
          // ------------------------------------------------------------------ Cart
          label: 'Cart',
          fields: [
            {
              name: 'cartFreeShippingThreshold',
              type: 'number',
              label: 'Free shipping from',
              min: 0,
              admin: {
                description:
                  'Order subtotal at which shipping becomes free, in dollars. The cart shows how much more is needed below it and "You unlocked FREE shipping!" at or above it. Leave empty to show no shipping line at all — better than stating a rule that is not the real one.',
                step: 1,
              },
            },
            {
              name: 'cartPaymentMethods',
              type: 'select',
              hasMany: true,
              label: 'Payment methods accepted',
              options: [
                { label: 'Visa', value: 'visa' },
                { label: 'Mastercard', value: 'mastercard' },
                { label: 'American Express', value: 'amex' },
                { label: 'PayPal', value: 'paypal' },
                { label: 'Apple Pay', value: 'applePay' },
                { label: 'Google Pay', value: 'googlePay' },
              ],
              admin: {
                description:
                  'Only the ones checkout actually takes. Nothing is shown until you pick some — a payment badge the shop cannot honour is a promise broken at the worst moment.',
              },
            },
            {
              name: 'cartCrossSell',
              type: 'array',
              label: 'Customers also bought',
              labels: { singular: 'Extra', plural: 'Extras' },
              admin: {
                description:
                  'Offered inside the cart. Nothing is added until the reader presses Add, and the total updates when they do.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
                    {
                      name: 'price',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. "$49.95"', width: '40%' },
                    },
                  ],
                },
                { name: 'description', type: 'text' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Sticky Bars',
          fields: [
            {
              name: 'stickyEnabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show the sticky offer and buy bars once the buy box scrolls away',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'stickyOfferText',
                  type: 'text',
                  admin: { description: 'e.g. "Save 50% + Free HemCream®".', width: '50%' },
                },
                {
                  name: 'stickyOfferNote',
                  type: 'text',
                  admin: { description: 'e.g. "Free shipping + 90-day guarantee".', width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'stickyCtaLabel', type: 'text', admin: { width: '50%' } },
                { name: 'stickyCtaUrl', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
