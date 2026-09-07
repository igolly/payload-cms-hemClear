import type { Block } from 'payload'

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
  ],
}
