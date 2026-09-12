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
      // `textarea`, not `text`: the component renders this through `multiline`, so a line
      // break is meaningful — and a single-line input gives an editor no way to enter one.
      type: 'textarea',
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
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional illustrated icon. Replaces the default tick when set.',
          },
        },
      ],
      label: 'Benefits',
    },
    {
      name: 'calloutIcon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Optional icon for the callout box. Replaces the default tick when set.',
      },
      label: 'Callout Icon',
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
    {
      name: 'trustPointsStyle',
      type: 'select',
      defaultValue: 'inline',
      options: [
        { label: 'Inline, below the buttons', value: 'inline' },
        { label: 'Stacked, above the buttons', value: 'stacked' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description:
          'Stacked is the /why treatment: each point sets its icon over its label and the row moves above the call-to-action buttons. The two go together in the comp, so one control drives both.',
      },
      label: 'Trust Points Layout',
    },
  ],
  label: false,
}
