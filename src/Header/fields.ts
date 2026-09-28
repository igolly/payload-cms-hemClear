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
        name: 'announcementCountdown',
        type: 'select',
        defaultValue: 'off',
        label: 'Countdown',
        options: [
          { label: 'No timer', value: 'off' },
          { label: 'Counts down to a fixed date and time', value: 'date' },
          { label: 'Rolling — 24 hours', value: '24' },
          { label: 'Rolling — 48 hours', value: '48' },
          { label: 'Rolling — 72 hours', value: '72' },
        ],
        admin: {
          description:
            'A rolling timer starts when a visitor first arrives and runs for that long; once it reaches zero their next visit starts a fresh one. A fixed date runs out for everyone at the same moment and then stays at zero.',
        },
      },
      {
        name: 'announcementEndsAt',
        type: 'date',
        label: 'Counts down to',
        admin: {
          condition: (_, siblingData) => siblingData?.announcementCountdown === 'date',
          date: { pickerAppearance: 'dayAndTime' },
          description: 'The moment the offer ends.',
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
