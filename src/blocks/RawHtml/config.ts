import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

/**
 * A section of hand-written HTML, for the pages that are mostly prose and mostly legal:
 * terms, privacy, shipping, returns.
 *
 * Those pages are written once, changed rarely, and usually arrive as markup from a
 * solicitor or a generator. Rebuilding them as blocks would mean a field for every heading
 * and clause; pasting them keeps the source of truth in one place.
 *
 * What is pasted is rendered as written — that is the point of it, and it is also the risk:
 * a `<script>` in this field runs on the page for every visitor, with the site's own
 * origin. It is therefore only as trustworthy as the person editing it. If this site ever
 * grows an editor role that should not be able to run scripts on it, this field wants
 * either restricting to admins or putting through a sanitiser.
 */
export const RawHtml: Block = {
  slug: 'rawHtml',
  interfaceName: 'RawHtmlBlock',
  labels: { singular: 'HTML Section', plural: 'HTML Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description:
          'Optional title above the content. Leave empty when the pasted markup carries its own.',
      },
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      label: 'HTML',
      admin: {
        description:
          'Pasted exactly as written. Headings, paragraphs, lists, tables and links are styled to match the site — you do not need to add classes. Anything you paste here runs on the live page, so only paste markup you trust.',
        language: 'html',
      },
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Reading width (best for terms and policies)', value: 'prose' },
        { label: 'Full width of the page', value: 'wide' },
      ],
      admin: {
        description:
          'Reading width holds the text to a comfortable measure. Full width suits a table or an embed that needs the room.',
      },
    },
    backgroundField(),
  ],
}
