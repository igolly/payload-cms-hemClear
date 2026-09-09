import type { Block } from 'payload'

import { brandIconOptions } from '@/components/BrandIcons'

import { backgroundField } from '@/fields/background'

export const MedicalReview: Block = {
  slug: 'medicalReview',
  interfaceName: 'MedicalReviewBlock',
  labels: { singular: 'Medical Review', plural: 'Medical Reviews' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: { description: 'Flanked by laurel marks, e.g. "HemClear® Medical Review".' },
        },
        { name: 'heading', type: 'text' },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      admin: {
        description: 'The row of points above the reviewer cards.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/MedicalReview/RowLabel#HighlightRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'stethoscope',
              options: brandIconOptions,
              required: true,
              admin: { width: '40%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'doctors',
      type: 'array',
      label: 'Reviewers',
      labels: { singular: 'Reviewer', plural: 'Reviewers' },
      admin: {
        initCollapsed: true,
        components: { RowLabel: '@/blocks/MedicalReview/RowLabel#DoctorRowLabel' },
      },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'role', type: 'text', admin: { width: '30%' } },
            {
              name: 'tag',
              type: 'text',
              admin: { description: 'Pill beside the name.', width: '30%' },
            },
          ],
        },
        { name: 'quoteHeading', type: 'text', required: true },
        { name: 'quote', type: 'textarea', required: true },
        {
          name: 'tags',
          type: 'array',
          labels: { singular: 'Tag', plural: 'Tags' },
          admin: { initCollapsed: true },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'readMoreLabel',
              type: 'text',
              defaultValue: 'Read full review',
              admin: { width: '33%' },
            },
            {
              name: 'verifiedLabel',
              type: 'text',
              defaultValue: 'Medical Professional',
              admin: { width: '33%' },
            },
            {
              name: 'profileLabel',
              type: 'text',
              defaultValue: 'View Profile',
              admin: { width: '33%' },
            },
          ],
        },
        { name: 'profileUrl', type: 'text' },
      ],
    },
    backgroundField(),
  ],
}
