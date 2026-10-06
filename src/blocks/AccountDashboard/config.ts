import type { Block } from 'payload'

/**
 * The signed-in customer's account page. Everything here is the page's own copy and
 * artwork; the customer's subscription, items, address and payment come from their account
 * at runtime (`actions.ts`), never from these fields.
 */
export const AccountDashboard: Block = {
  slug: 'accountDashboard',
  interfaceName: 'AccountDashboardBlock',
  labels: { singular: 'Account Dashboard', plural: 'Account Dashboards' },
  fields: [
    {
      type: 'collapsible',
      label: 'Account Menu',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'ordersLabel', type: 'text', defaultValue: 'Orders', admin: { width: '33%' } },
            {
              name: 'accountLabel',
              type: 'text',
              defaultValue: 'Account',
              admin: { width: '33%' },
            },
            { name: 'logoutLabel', type: 'text', defaultValue: 'Logout', admin: { width: '33%' } },
          ],
        },
        {
          name: 'loginUrl',
          type: 'text',
          defaultValue: '/login',
          admin: { description: 'Where a signed-out visitor, or one who logs out, is sent.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Refer a Friend Banner',
      admin: { initCollapsed: true },
      fields: [
        { name: 'referHeading', type: 'text', defaultValue: 'GIVE 25%. GET 25%.' },
        {
          name: 'referText',
          type: 'textarea',
          defaultValue: 'Give a friend 25% off their first order.\nGet 25% off your next.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'referButtonLabel',
              type: 'text',
              defaultValue: 'REFER A FRIEND',
              admin: { width: '50%' },
            },
            {
              name: 'referButtonUrl',
              type: 'text',
              admin: { description: 'The button is hidden until this is set.', width: '50%' },
            },
          ],
        },
        {
          name: 'referPhotos',
          type: 'array',
          label: 'Customer photos',
          maxRows: 5,
          admin: { description: 'Shown in a strip beside the offer, five at most.' },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Customer-Reported Results',
      admin: { initCollapsed: true },
      fields: [
        { name: 'resultsLabel', type: 'text', defaultValue: 'Customer-reported results*' },
        {
          name: 'results',
          type: 'array',
          maxRows: 4,
          defaultValue: [
            { value: '91%', label: 'Smaller hemorrhoids', note: '(29 of 32 reviewers)' },
            { value: '93%', label: 'Less pain & irritation', note: '(40 of 43 reviewers)' },
            { value: '82%', label: 'Less bleeding', note: '(9 of 11 reviewers)' },
            { value: '97%', label: 'Improvement within 30 days', note: '(57 of 59 reviewers)' },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '25%' } },
                { name: 'label', type: 'text', required: true, admin: { width: '45%' } },
                { name: 'note', type: 'text', admin: { width: '30%' } },
              ],
            },
          ],
        },
        { name: 'resultsBadge', type: 'text', defaultValue: 'Verified-purchase reviewers' },
        {
          name: 'resultsFootnote',
          type: 'textarea',
          defaultValue:
            '*Among verified-purchase reviewers who discussed each outcome. Sample size varies by outcome; negative reports were included. Individual results may vary.\nReferral terms shown for illustration.',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Cashback Strip',
      admin: {
        initCollapsed: true,
        description: 'Shown only once the customer has a cashback balance to show.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cashbackLabel',
              type: 'text',
              defaultValue: 'Cashback',
              admin: { width: '33%' },
            },
            {
              name: 'balanceLabel',
              type: 'text',
              defaultValue: 'Your balance:',
              admin: { width: '33%' },
            },
            { name: 'redeemLabel', type: 'text', defaultValue: 'Redeem', admin: { width: '33%' } },
          ],
        },
        { name: 'redeemUrl', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'VIP Gifting Journey',
      admin: { initCollapsed: true },
      fields: [
        { name: 'giftingTitle', type: 'text', defaultValue: 'YOUR VIP GIFTING JOURNEY' },
        {
          name: 'giftingSteps',
          type: 'array',
          maxRows: 4,
          defaultValue: [
            { order: 'ORDER 1', title: 'Wipes + Bath Salts', value: '$24.90 value' },
            { order: 'ORDER 3', title: 'Anti-Hemorrhoid Tea', value: '$19.95 value' },
            { order: 'ORDER 6', title: 'Cushion + Donut Pillow', value: '$69.90 value' },
          ],
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'order', type: 'text', required: true, admin: { width: '25%' } },
                { name: 'title', type: 'text', required: true, admin: { width: '45%' } },
                { name: 'value', type: 'text', admin: { width: '30%' } },
              ],
            },
          ],
        },
        { name: 'giftingNote', type: 'text', defaultValue: 'Example gifts and milestones' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Share Card',
      admin: { initCollapsed: true },
      fields: [
        { name: 'shareHeading', type: 'text', defaultValue: 'Give 25% off, Get 25% off' },
        {
          name: 'shareText',
          type: 'textarea',
          defaultValue:
            'Share your link. Your friend gets 25% off their first order, and you get 25% off your next.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'shareButtonLabel',
              type: 'text',
              defaultValue: 'Share your link',
              admin: { width: '50%' },
            },
            {
              name: 'shareUrl',
              type: 'text',
              admin: {
                description: 'The link the button shares or copies. Hidden until set.',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'You Might Also Like',
      admin: { initCollapsed: true },
      fields: [
        { name: 'upsellTitle', type: 'text', defaultValue: 'You might also like' },
        {
          name: 'upsellProducts',
          type: 'array',
          maxRows: 6,
          defaultValue: [
            { name: 'HemCream', option: '1 jar', price: '$43.95', url: '/hemcream' },
            {
              name: 'HemClear · 1 bottle',
              option: '1 bottle',
              price: '$43.95',
              url: '/hemclear-capsules',
            },
            {
              name: 'HemClear · 3 bottles',
              option: '3 bottles',
              price: '$119.85',
              url: '/hemclear-capsules',
            },
            {
              name: 'HemClear · 6 bottles',
              option: '6 bottles',
              price: '$249.00',
              url: '/hemclear-capsules',
            },
          ],
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'option', type: 'text', admin: { width: '30%' } },
                { name: 'price', type: 'text', admin: { width: '30%' } },
              ],
            },
            {
              name: 'url',
              type: 'text',
              admin: { description: 'The product page the "Add" button opens.' },
            },
          ],
        },
        { name: 'addLabel', type: 'text', defaultValue: 'Add' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Subscription Sections',
      admin: {
        initCollapsed: true,
        description:
          'Headings for the parts filled from the customer’s own subscription, and what shows when they have none.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'productsTitle',
              type: 'text',
              defaultValue: 'Products',
              admin: { width: '25%' },
            },
            {
              name: 'shippingTitle',
              type: 'text',
              defaultValue: 'Adjust Your Shipping Address',
              admin: { width: '25%' },
            },
            {
              name: 'summaryTitle',
              type: 'text',
              defaultValue: 'Summary',
              admin: { width: '25%' },
            },
            {
              name: 'billingTitle',
              type: 'text',
              defaultValue: 'Billing',
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'emptyHeading',
          type: 'text',
          defaultValue: 'No active subscription yet',
        },
        {
          name: 'emptyText',
          type: 'textarea',
          defaultValue:
            'Once you subscribe, your deliveries, products, shipping address and billing will appear here.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'emptyButtonLabel',
              type: 'text',
              defaultValue: 'Shop HemClear',
              admin: { width: '50%' },
            },
            {
              name: 'emptyButtonUrl',
              type: 'text',
              defaultValue: '/hemclear-total-care-system',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
