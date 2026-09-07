import type { Block } from 'payload'

export const FormulaTable: Block = {
  slug: 'formulaTable',
  interfaceName: 'FormulaTableBlock',
  labels: { singular: 'Formula Table', plural: 'Formula Tables' },
  fields: [
    { name: 'heading', type: 'text', admin: { description: 'Line above the product toggle.' } },
    {
      name: 'formulas',
      type: 'array',
      label: 'Formulas',
      labels: { singular: 'Formula', plural: 'Formulas' },
      minRows: 1,
      admin: {
        description: 'Each becomes one thumbnail in the toggle. With one formula the toggle is hidden.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/FormulaTable/RowLabel#FormulaRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            {
              name: 'titleBefore',
              type: 'text',
              admin: { description: 'Navy text before the accent, e.g. "The".', width: '33%' },
            },
            {
              name: 'titleAccent',
              type: 'text',
              admin: { description: 'Blue accent, e.g. "HemClear®".', width: '33%' },
            },
            {
              name: 'titleAfter',
              type: 'text',
              admin: { description: 'e.g. "Formula".', width: '33%' },
            },
          ],
        },
        { name: 'subtitle', type: 'text' },
        {
          name: 'rows',
          type: 'array',
          labels: { singular: 'Ingredient', plural: 'Ingredients' },
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/blocks/FormulaTable/RowLabel#IngredientRowLabel' },
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'benefit', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    { name: 'footnote', type: 'textarea' },
  ],
}
