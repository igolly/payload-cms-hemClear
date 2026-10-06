import type { AccountOverview } from './types'

const MEDIA = 'https://hshfhgdhogilfoatubyq.storage.supabase.co/storage/v1/object/public/media'

/**
 * The reference design's subscription, for laying out the page while no real subscription
 * exists. Only ever shown in development, and only with `?preview=sample` in the address —
 * see `Dashboard.tsx`. Never returned for a real customer.
 */
export const SAMPLE_ACCOUNT: Extract<AccountOverview, { status: 'ready' }> = {
  cashbackBalance: 0,
  email: 'preview@example.com',
  status: 'ready',
  subscription: {
    cadence: 'Every 4 weeks',
    giftCount: 1,
    items: [
      {
        description: 'You’ve unlocked HemClear Wipes in this order',
        gift: true,
        name: 'HemClear Wipes',
        originalPrice: 9.95,
        price: 0,
      },
      {
        description: 'You’ve unlocked Bath Salts in this order',
        gift: true,
        name: 'Bath Salts',
        originalPrice: 14.95,
        price: 0,
      },
      {
        description: '3 HemClear bottles + 1 FREE HemCream',
        image: `${MEDIA}/hemclearcombo.png`,
        name: 'HemClear Complete Care System',
        packageLabel: '3-bottle package',
        price: 119.85,
        quantity: 1,
      },
    ],
    nextOrderDate: '2026-11-20',
    payment: { brand: 'VISA', expiry: '04/28', last4: '4242' },
    planName: 'HemClear Complete Care System',
    price: 119.85,
    shippingAddress: { lines: ['Your saved shipping address', 'United States'] },
    summary: { saved: 12, shipping: 0, subtotal: 119.85, total: 119.85 },
  },
}
