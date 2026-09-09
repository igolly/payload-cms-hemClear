import type { Block } from 'payload'

import { backgroundField } from '@/fields/background'

export const SavingsCompare: Block = {
  slug: 'savingsCompare',
  interfaceName: 'SavingsCompareBlock',
  labels: { singular: 'Savings Comparison', plural: 'Savings Comparisons' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'savingsLabel', type: 'text', admin: { width: '50%' } },
        { name: 'savingsValue', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Left — Buying Separately',
      fields: [
        { name: 'separateTitle', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'separateColLabel', type: 'text', admin: { width: '50%' } },
            { name: 'separateCostLabel', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          name: 'separateRows',
          type: 'array',
          labels: { singular: 'Row', plural: 'Rows' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
                { name: 'cost', type: 'text', required: true, admin: { width: '40%' } },
              ],
            },
          ],
        },
        {
          name: 'separateTotals',
          type: 'array',
          label: 'Total Rows',
          labels: { singular: 'Total', plural: 'Totals' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
                { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Right — The Formula',
      fields: [
        { name: 'formulaTitle', type: 'text' },
        { name: 'formulaBadge', type: 'text' },
        {
          name: 'formulaFeatures',
          type: 'array',
          labels: { singular: 'Feature', plural: 'Features' },
          admin: { initCollapsed: true },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          type: 'row',
          fields: [
            { name: 'formulaPriceLabel', type: 'text', admin: { width: '50%' } },
            { name: 'formulaPrice', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'formulaAnnual', type: 'text', admin: { width: '50%' } },
            { name: 'formulaSaveLabel', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'formulaSaveValue', type: 'text', admin: { width: '50%' } },
            { name: 'formulaSaveNote', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
            { name: 'ctaUrl', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    backgroundField(),
  ],
}
