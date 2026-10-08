import type { Block } from 'payload'

/** Lucide marks for the promises beside the order, by name. */
export const checkoutTrustIcons = [
  { label: 'Package', value: 'package' },
  { label: 'Lock', value: 'lock' },
  { label: 'Repeat', value: 'repeat' },
  { label: 'Truck', value: 'truck' },
  { label: 'Shield', value: 'shield' },
]

export const Checkout: Block = {
  slug: 'checkout',
  interfaceName: 'CheckoutBlock',
  labels: { singular: 'Checkout', plural: 'Checkouts' },
  fields: [
    {
      type: 'collapsible',
      label: 'Express checkout',
      fields: [
        { name: 'expressTitle', type: 'text', defaultValue: 'Express checkout' },
        {
          name: 'expressMethods',
          type: 'select',
          hasMany: true,
          defaultValue: ['shopPay', 'paypal', 'googlePay'],
          options: [
            { label: 'Shop Pay', value: 'shopPay' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Google Pay', value: 'googlePay' },
            { label: 'Apple Pay', value: 'applePay' },
          ],
          admin: {
            description: 'The buttons above the form, in this order. None: no express row.',
          },
        },
        {
          name: 'expressNote',
          type: 'textarea',
          defaultValue:
            'By continuing with your payment, you agree to the future charges listed on this page and the cancellation policy.',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact & delivery',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              defaultValue: 'Contact',
              admin: { width: '50%' },
            },
            {
              name: 'signInUrl',
              type: 'text',
              label: 'Sign in link',
              defaultValue: '/login',
              admin: {
                description: 'The login page. The customer comes back here afterwards.',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'newsletterLabel',
          type: 'text',
          defaultValue: 'Keep me updated on special offers and product updates (optional)',
        },
        { name: 'deliveryTitle', type: 'text', defaultValue: 'Delivery' },
        { name: 'shippingTitle', type: 'text', defaultValue: 'Shipping method' },
        {
          type: 'row',
          fields: [
            {
              name: 'shippingLabel',
              type: 'text',
              defaultValue: 'Free standard shipping',
              admin: { width: '40%' },
            },
            {
              name: 'shippingNote',
              type: 'text',
              defaultValue: 'Discreet packaging',
              admin: { width: '40%' },
            },
            {
              name: 'shippingPrice',
              type: 'text',
              defaultValue: 'FREE',
              admin: { description: 'Also shown as the Shipping line.', width: '20%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Payment',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'paymentTitle',
              type: 'text',
              defaultValue: 'Payment',
              admin: { width: '50%' },
            },
            {
              name: 'paymentNote',
              type: 'text',
              defaultValue: 'All transactions are secure and encrypted.',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'cardBrands',
          type: 'select',
          hasMany: true,
          defaultValue: ['visa', 'mastercard', 'amex'],
          options: [
            { label: 'Visa', value: 'visa' },
            { label: 'Mastercard', value: 'mastercard' },
            { label: 'American Express', value: 'amex' },
          ],
          admin: { description: 'Card marks beside "Credit card" — only ones the shop takes.' },
        },
        {
          name: 'offerPaypal',
          type: 'checkbox',
          label: 'Offer PayPal as a payment option',
          defaultValue: true,
        },
        {
          name: 'subscriptionTitle',
          type: 'text',
          defaultValue: 'Subscription summary',
          admin: {
            description:
              'Shown only when a package in the cart bills on a schedule, listing its billing line.',
          },
        },
        {
          name: 'subscriptionNote',
          type: 'text',
          defaultValue: 'Manage or cancel your subscription in your account.',
        },
        {
          name: 'payLabel',
          type: 'text',
          defaultValue: 'Pay {total} now',
          admin: { description: '{total} is replaced with the order total.' },
        },
        {
          name: 'unavailableMessage',
          type: 'textarea',
          defaultValue:
            'Online payment is not switched on yet, so nothing has been charged. Please contact our support team to complete your order.',
          admin: {
            description:
              'Shown when Pay or an express button is pressed while no payment provider is connected. The card fields stay locked until then.',
          },
        },
        {
          name: 'legalLead',
          type: 'text',
          defaultValue: 'By placing your order, you agree to HemClear’s',
        },
        {
          name: 'legalLinks',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'url', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Order summary',
      fields: [
        { name: 'orderTitle', type: 'text', defaultValue: 'Your order' },
        {
          name: 'showDiscount',
          type: 'checkbox',
          label: 'Show the discount code field',
          defaultValue: true,
        },
        { name: 'taxNote', type: 'text', defaultValue: 'Calculated at checkout' },
        {
          type: 'row',
          fields: [
            {
              name: 'emptyMessage',
              type: 'text',
              defaultValue: 'Your cart is empty.',
              admin: { width: '50%' },
            },
            {
              name: 'emptyLinkUrl',
              type: 'text',
              label: 'Continue shopping link',
              defaultValue: '/hemclear-total-care-system',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Guarantee & promises',
      fields: [
        { name: 'guaranteeTitle', type: 'text', defaultValue: '90-day money-back guarantee' },
        {
          name: 'guaranteeText',
          type: 'textarea',
          defaultValue:
            'Try HemClear risk-free. If you’re not completely satisfied, we’ll refund your purchase.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'guaranteeLinkLabel',
              type: 'text',
              defaultValue: 'See guarantee terms',
              admin: { width: '50%' },
            },
            {
              name: 'guaranteeUrl',
              type: 'text',
              admin: { description: 'The link is hidden until this is set.', width: '50%' },
            },
          ],
        },
        {
          name: 'trustItems',
          type: 'array',
          labels: { singular: 'Promise', plural: 'Promises' },
          admin: { initCollapsed: true },
          defaultValue: [
            {
              icon: 'package',
              text: 'Plain packaging. Your privacy matters.',
              title: 'Discreet delivery',
            },
            { icon: 'lock', text: 'Encrypted payment processing.', title: 'Secure checkout' },
            {
              icon: 'repeat',
              text: 'Manage your deliveries in your account.',
              title: 'Flexible subscription',
            },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'package',
                  options: checkoutTrustIcons,
                  admin: { width: '25%' },
                },
                { name: 'title', type: 'text', required: true, admin: { width: '35%' } },
                { name: 'text', type: 'text', admin: { width: '40%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Testimonials',
      fields: [
        { name: 'testimonialsTitle', type: 'text', defaultValue: 'What HemClear customers say' },
        {
          name: 'testimonials',
          type: 'array',
          labels: { singular: 'Testimonial', plural: 'Testimonials' },
          admin: {
            description: 'Use real, published customer reviews only.',
            initCollapsed: true,
          },
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'role',
                  type: 'text',
                  defaultValue: 'HemClear customer',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          name: 'testimonialsFootnote',
          type: 'text',
          defaultValue:
            'Excerpts from reviews published on HemClear’s website. Individual results vary.',
        },
      ],
    },
  ],
}
