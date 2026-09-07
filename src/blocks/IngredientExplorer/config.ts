import type { Block } from 'payload'

export const IngredientExplorer: Block = {
  slug: 'ingredientExplorer',
  interfaceName: 'IngredientExplorerBlock',
  labels: { singular: 'Ingredient Explorer', plural: 'Ingredient Explorers' },
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: 'Formulas',
      labels: { singular: 'Formula', plural: 'Formulas' },
      minRows: 1,
      admin: {
        description:
          'Each formula becomes one side of the toggle at the top. With a single formula the toggle is hidden.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/IngredientExplorer/RowLabel#GroupRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Toggle label.' } },
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'ingredients',
          type: 'array',
          labels: { singular: 'Ingredient', plural: 'Ingredients' },
          admin: {
            description:
              'The filter pills are built from the categories used here, in the order they first appear — there is no separate list to keep in sync.',
            initCollapsed: true,
            components: { RowLabel: '@/blocks/IngredientExplorer/RowLabel#IngredientRowLabel' },
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'latin',
                  type: 'text',
                  admin: { description: 'Shown in italics under the name.', width: '50%' },
                },
              ],
            },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'benefit', type: 'text', admin: { width: '50%' } },
                {
                  name: 'category',
                  type: 'text',
                  admin: { description: 'e.g. "Antioxidants". Drives the filter pills.', width: '50%' },
                },
              ],
            },
            {
              name: 'details',
              type: 'textarea',
              admin: { description: 'Revealed when the visitor expands the card.' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Footer',
      fields: [
        { name: 'allLabel', type: 'text', defaultValue: 'All Ingredients' },
        { name: 'disclaimerTitle', type: 'text' },
        { name: 'disclaimer', type: 'textarea' },
      ],
    },
  ],
}
