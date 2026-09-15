import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

const starsField = {
  name: 'stars',
  type: 'number' as const,
  defaultValue: 5,
  max: 5,
  min: 0,
  required: true,
  admin: {
    description: 'Number of filled stars, 0–5.',
    step: 1,
  },
}

export const Reviews: Block = {
  slug: 'reviews',
  interfaceName: 'ReviewsBlock',
  labels: {
    singular: 'Reviews',
    plural: 'Reviews',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'First line of the heading. Rendered in navy.',
          },
        },
        {
          name: 'headingAccent',
          type: 'text',
          admin: {
            description: 'Second line of the heading. Rendered in the lighter accent blue.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Intro paragraph below the heading.',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'array',
      label: 'Featured Reviews',
      labels: {
        singular: 'Featured Review',
        plural: 'Featured Reviews',
      },
      maxRows: 6,
      admin: {
        description:
          'The top row of highlighted reviews, each with a score and a source logo. Best with 4–5.',
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Reviews/RowLabel#FeaturedRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'score',
              type: 'text',
              admin: {
                description: 'e.g. "5.0". Leave empty to hide.',
                width: '50%',
              },
            },
            {
              ...starsField,
              admin: { ...starsField.admin, width: '50%' },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "Mark D."',
                width: '50%',
              },
            },
            {
              name: 'authorNote',
              type: 'text',
              admin: {
                description: 'e.g. "Verified Buyer" or "Community Review".',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Amazon', value: 'amazon' },
            { label: 'HemClear.com', value: 'hemclear' },
            { label: 'Trustpilot', value: 'trustpilot' },
            { label: 'Reddit', value: 'reddit' },
            { label: 'Google', value: 'google' },
          ],
          admin: {
            description:
              'Platform the review came from — shows the built-in logo. An uploaded Source Logo below takes precedence.',
          },
        },
        {
          name: 'sourceLogo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Logo of the platform the review came from (Amazon, Trustpilot, Google…). Upload a transparent PNG or SVG.',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Trust Strip',
      labels: {
        singular: 'Trust Point',
        plural: 'Trust Points',
      },
      maxRows: 4,
      admin: {
        description:
          'Optional strip under the featured reviews. When set, the customer reviews stay hidden until the visitor clicks "Show More", and the strip gives way to them.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'customers',
          options: [
            { label: 'Happy customers', value: 'customers' },
            { label: 'Rating', value: 'rating' },
            { label: 'Guarantee shield', value: 'guarantee' },
            { label: 'Daily comfort', value: 'comfort' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'text', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      label: 'Customer Reviews',
      labels: {
        singular: 'Customer Review',
        plural: 'Customer Reviews',
      },
      admin: {
        description:
          'The expandable grid below the featured row. Add as many as you like — the block only shows the first few until the visitor expands it.',
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Reviews/RowLabel#ReviewRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              ...starsField,
              admin: { ...starsField.admin, width: '50%' },
            },
            {
              name: 'verified',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show verified badge',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Short pull-quote headline, e.g. "Pain Almost Gone."',
          },
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Display Options',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'initialCount',
              type: 'number',
              defaultValue: 4,
              min: 1,
              admin: {
                description: 'How many customer reviews to show before "Show More".',
                step: 1,
                width: '33%',
              },
            },
            {
              name: 'showMoreLabel',
              type: 'text',
              defaultValue: 'Show More',
              admin: { width: '33%' },
            },
            {
              name: 'showLessLabel',
              type: 'text',
              defaultValue: 'Show Less',
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'showMoreStep',
          type: 'number',
          min: 1,
          admin: {
            description:
              'Optional. How many more reviews each further "Show More" click reveals. Leave empty to reveal all of them at once.',
            step: 1,
          },
        },
        {
          name: 'verifiedLabel',
          type: 'text',
          defaultValue: 'Verified Purchase',
          admin: {
            description: 'Text of the badge shown on customer reviews marked as verified.',
          },
        },
        {
          name: 'disclaimer',
          type: 'textarea',
          admin: {
            description: 'Fine print rendered under the section, e.g. the FDA statement.',
          },
        },
      ],
    },
    backgroundField(),
  ],
}
