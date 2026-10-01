'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Media } from '@/payload-types'

/**
 * The cart's state, held in the browser.
 *
 * There is no cart service behind this and no order is ever placed here: the panel collects
 * what the reader chose and hands it to whatever checkout the plan's own link points at.
 * That is deliberate rather than provisional — until a commerce platform is chosen, a cart
 * that pretended to hold an order server-side would be inventing a guarantee it cannot keep.
 *
 * It survives a reload because a reader who adds something, reads another section and comes
 * back expects it to still be there.
 */
export type CartLine = {
  /** What the plan bills, e.g. "Billed $104.85 USD every 3 months". Shown as subscription detail. */
  billingNote?: null | string
  /** The free gift that comes with this package, e.g. "FREE BOTTLE". */
  bonusLabel?: null | string
  /** Where this exact product and package is bought. */
  checkoutUrl?: null | string
  comparePrice?: null | string
  id: string
  image?: Media | null | number | string
  /** Whether this line came from the cross-sell list rather than the buy box. */
  isExtra?: boolean
  name: string
  packageName?: null | string
  price: string
  priceSuffix?: null | string
  quantity: number
  saveLabel?: null | string
}

type CartContextValue = {
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void
  close: () => void
  count: number
  isOpen: boolean
  lines: CartLine[]
  open: () => void
  remove: (id: string) => void
  savings: number
  setQuantity: (id: string, quantity: number) => void
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'hemclear:cart'

/**
 * "$1,049.85" → 1049.85. Prices are editor-written strings, so this takes the digits and
 * leaves everything else; anything unreadable counts as zero rather than as NaN, which would
 * poison the subtotal.
 */
export const toAmount = (price?: null | string): number => {
  if (!price) return 0
  const n = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** Back to the page's own format, which is dollars throughout. */
export const formatAmount = (amount: number): string =>
  `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Read once on mount rather than in the initial state, so the server and the first client
  // render agree and hydration does not trip over a cart the server never saw.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setLines(JSON.parse(stored) as CartLine[])
    } catch {
      // A cart that cannot be restored is an empty one, not a broken page.
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be unavailable; the cart then lasts for this page view only.
    }
  }, [lines])

  const add = useCallback<CartContextValue['add']>((line, quantity = 1) => {
    setLines((current) => {
      const at = current.findIndex((l) => l.id === line.id)
      if (at === -1) return [...current, { ...line, quantity }]
      // The same product and package again is more of it, not a second row.
      const next = [...current]
      next[at] = { ...next[at], ...line, quantity: next[at].quantity + quantity }
      return next
    })
    setIsOpen(true)
  }, [])

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((l) => l.id !== id))
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    // Stepping down from one removes the line, which is what the minus button at one means.
    setLines((current) =>
      quantity < 1
        ? current.filter((l) => l.id !== id)
        : current.map((l) => (l.id === id ? { ...l, quantity: Math.min(99, quantity) } : l)),
    )
  }, [])

  const { count, savings, subtotal } = useMemo(() => {
    let sub = 0
    let saved = 0
    let items = 0
    for (const line of lines) {
      const price = toAmount(line.price)
      const was = toAmount(line.comparePrice)
      sub += price * line.quantity
      // Only count a saving where the struck price is genuinely higher.
      if (was > price) saved += (was - price) * line.quantity
      items += line.quantity
    }
    return { count: items, savings: saved, subtotal: sub }
  }, [lines])

  const value = useMemo<CartContextValue>(
    () => ({
      add,
      close: () => setIsOpen(false),
      count,
      isOpen,
      lines,
      open: () => setIsOpen(true),
      remove,
      savings,
      setQuantity,
      subtotal,
    }),
    [add, count, isOpen, lines, remove, savings, setQuantity, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * The cart, or `null` where there is no provider above. Returning null rather than throwing
 * lets a block that may or may not be inside a cart — the sticky bar is rendered in the Puck
 * canvas too — fall back to its plain link instead of crashing the editor.
 */
export const useCart = (): CartContextValue | null => useContext(CartContext)
