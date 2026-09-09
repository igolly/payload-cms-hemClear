import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        condition: (_, { type } = {}) => type !== 'highImpact',
      },
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image on the left', value: 'left' },
        { label: 'Image on the right', value: 'right' },
      ],
      admin: { condition: (_, { type } = {}) => type === 'highImpact' },
      label: 'Image Position',
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Small caps line above the heading.',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Serif line between the heading and the description.',
      },
    },
    {
      name: 'badgeTitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'e.g. "Doctor\'s Choice". Use a line break for a two-line badge title.',
      },
      label: 'Badge Title',
    },
    {
      name: 'badgeDescription',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
      label: 'Badge Description',
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Use a line break to control where the heading wraps.',
      },
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
      label: 'Description',
    },
    {
      name: 'benefits',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      label: 'Benefits',
    },
    {
      name: 'calloutTitle',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Optional highlighted box below the benefits.',
      },
    },
    {
      name: 'calloutText',
      type: 'textarea',
      admin: { condition: (_, { type } = {}) => type === 'highImpact' },
    },
    {
      name: 'trustPoints',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Small square icon image. A dashed placeholder holds the space until one is set.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
      label: 'Trust Points',
    },
  ],
  label: false,
}
