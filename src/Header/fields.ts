/**
 * The Header global's fields, kept apart from `config.ts` so the visual editor can convert
 * them into Puck fields. `config.ts` also carries the `revalidateHeader` hook, and that
 * imports `next/cache` — pulled into the browser bundle, it fails the build.
 */
import type { Field } from 'payload'

import { link } from '@/fields/link'

export const headerFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Announcement Bar',
    fields: [
      { name: 'announcementEnabled', type: 'checkbox', label: 'Show the announcement bar' },
      {
        name: 'announcementTitle',
        type: 'text',
        admin: { description: 'e.g. "Free Offer" — rendered in yellow.' },
      },
      { name: 'announcementText', type: 'text' },
      {
        name: 'announcementEndsAt',
        type: 'date',
        admin: {
          date: { pickerAppearance: 'dayAndTime' },
          description: 'Countdown target. Leave empty to hide the timer.',
        },
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Sticky Offer Bar',
    admin: {
      description:
        'The strip that slides down once the reader scrolls past the header. It began on the product page and now runs on every page.',
    },
    fields: [
      { name: 'stickyEnabled', type: 'checkbox', label: 'Show the sticky offer bar' },
      {
        name: 'stickyText',
        type: 'text',
        admin: { description: 'The offer itself, rendered in amber.' },
      },
      {
        name: 'stickyNote',
        type: 'text',
        admin: { description: 'The quieter half after the divider.' },
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
  {
    name: 'navItems',
    type: 'array',
    fields: [
      link({
        appearances: false,
      }),
      {
        name: 'megaMenu',
        type: 'array',
        label: 'Dropdown Cards',
        labels: { singular: 'Card', plural: 'Cards' },
        admin: {
          description:
            'Leave empty for a plain link. Add cards and this item opens a dropdown on hover, e.g. the product list under "Shop".',
          initCollapsed: true,
          components: { RowLabel: '@/Header/RowLabel#MegaMenuRowLabel' },
        },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
              { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
            ],
          },
          { name: 'description', type: 'textarea' },
          { name: 'image', type: 'upload', relationTo: 'media' },
          link({ appearances: false }),
        ],
      },
    ],
    maxRows: 8,
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/Header/RowLabel#RowLabel',
      },
    },
  },
]
