import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
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
      label: 'Intro Content',
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      label: 'Layout',
      options: [
        { label: 'Default — form in the page column', value: 'default' },
        { label: 'Split — photo beside the form', value: 'split' },
      ],
      admin: {
        description:
          'Split fills the screen: a photo on one side, the form centred on a tinted panel beside it.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        condition: (_, { variant }) => variant === 'split',
        description: 'Sits above the form, in the display face.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: {
        condition: (_, { variant }) => variant === 'split',
        description: 'Fills its half of the screen. A placeholder holds the space until set.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      label: 'Photo Side',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: { condition: (_, { variant }) => variant === 'split' },
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
