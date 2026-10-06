/** Amounts are in US dollars. */
export type SubscriptionItem = {
  description?: string
  /** A surprise gift unlocked by this order: shown struck through at `originalPrice`, free. */
  gift?: boolean
  image?: string
  name: string
  originalPrice?: number
  packageLabel?: string
  price: number
  quantity?: number
}

export type Subscription = {
  /** e.g. "Every 4 weeks". */
  cadence: string
  /** Gifts waiting to be claimed — the count on the gift button. */
  giftCount: number
  items: SubscriptionItem[]
  /** ISO date of the next delivery. */
  nextOrderDate: string
  payment: { brand: string; expiry: string; last4: string } | null
  planName: string
  price: number
  shippingAddress: { lines: string[] } | null
  summary: { saved: number; shipping: number; subtotal: number; total: number }
}

export type AccountOverview =
  | { status: 'signedOut' }
  /** Supabase keys are not set, so nobody can be signed in. */
  | { status: 'unavailable' }
  | {
      /** Null until there is a cashback programme to report a balance from. */
      cashbackBalance: number | null
      email: string
      status: 'ready'
      /** Null until a commerce platform supplies the customer's subscription. */
      subscription: Subscription | null
    }
