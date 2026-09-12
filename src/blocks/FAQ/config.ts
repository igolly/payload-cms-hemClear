import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          admin: {
            description: 'Use a line break to control where the heading wraps.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Product shot shown beside the heading. A placeholder renders until one is set.',
                width: '50%',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Decorative background behind the header band. Optional.',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      labels: {
        singular: 'Question',
        plural: 'Questions',
      },
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/FAQ/RowLabel#FaqRowLabel',
        },
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Blank lines become separate paragraphs.',
          },
        },
        {
          name: 'groupLabel',
          type: 'text',
          admin: {
            description:
              'Optional. Draws a ruled heading above this question, starting a new group — e.g. "Questions about Shipping HemClear®". Leave empty for questions that continue the previous group.',
          },
        },
      ],
    },
    {
      name: 'defaultState',
      type: 'select',
      defaultValue: 'allOpen',
      label: 'Default State',
      options: [
        { label: 'All questions open', value: 'allOpen' },
        { label: 'First question open', value: 'firstOpen' },
        { label: 'All questions closed', value: 'allClosed' },
      ],
      admin: {
        description: 'How the accordion appears before the visitor interacts with it.',
      },
    },
    {
      name: 'headerStyle',
      type: 'select',
      defaultValue: 'banner',
      label: 'Header Style',
      options: [
        { label: 'Banner with product image', value: 'banner' },
        { label: 'Compact — heading only', value: 'compact' },
      ],
      admin: {
        description:
          'Compact drops the image panel and centres the heading, for pages where the FAQ is one section among many rather than the whole page.',
      },
    },
    {
      type: 'collapsible',
      label: 'Support Callout (optional)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'supportTitle', type: 'text', admin: { width: '50%' } },
            { name: 'supportText', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'supportIcon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Large icon on the left.', width: '50%' },
            },
            {
              name: 'supportLinkIcon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Small icon inside the button.', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'supportLinkLabel', type: 'text', admin: { width: '50%' } },
            { name: 'supportLinkUrl', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    backgroundField(),
  ],
}
