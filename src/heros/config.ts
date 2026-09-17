import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { heroFields } from './fields'

/**
 * The hero's rich text gets the site's Lexical setup here rather than in `fields.ts`, which
 * the Puck config reads — importing the editor there would pull Lexical into the browser
 * bundle. One field list, two consumers.
 */
const withEditor = (field: Field): Field =>
  field.type === 'richText'
    ? {
        ...field,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ],
        }),
      }
    : field

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: heroFields.map(withEditor),
  label: false,
}
