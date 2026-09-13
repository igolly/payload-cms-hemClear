import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
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
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
