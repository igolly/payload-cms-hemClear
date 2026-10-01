'use client'

import React, { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { marks } from '@/utilities/marks'

type Plan = NonNullable<ProductDetailBlock['plans']>[number]

/**
 * The buy strip along the bottom of the product page.
 *
 * It is driven by the product data already on the block: the thumbnail from the first
 * gallery image, the name from the title, the prices from the same `plans` the buy box uses,
 * so there is no second copy of the pricing to keep in sync. The chosen package comes down
 * from the block for the same reason — it used to keep its own, which meant it offered the
 * best-value package no matter which card the reader had open.
 *
 * It shows from the first paint rather than sliding up once the buy box has gone by, so the
 * price is on screen before anyone scrolls. Because it is fixed, it would sit over the foot
 * of the page forever; it measures itself and pads the body by that much, so everything can
 * still be scrolled clear of it.
 *
 * The offer strip that used to sit along the top went to the Header global — it runs on
 * every page now (`src/components/StickyOfferBar`), so rendering it here too would put two
 * of them on this one.
 */
export const StickyBars: React.FC<{
  /** Puts the chosen product and package in the cart and opens the panel. */
  addToCart?: () => void
  /** Where the chosen package is bought; resolved by the block so both buttons agree. */
  buyUrl?: null | string
  ctaLabel?: string | null
  gallery?: ProductDetailBlock['gallery']
  onPlanChange?: (index: number) => void
  /** The chosen package, resolved and clamped by the block. */
  plan?: number
  plans?: Plan[]
  title?: string | null
}> = ({
  addToCart,
  buyUrl,
  ctaLabel,
  gallery,
  onPlanChange,
  plan: planIndex = 0,
  plans = [],
  title,
}) => {
  const bar = useRef<HTMLDivElement>(null)

  /*
   * Keep the foot of the page reachable. The bar's height is not a constant — it loses the
   * thumbnail, the title and the package menu as the screen narrows — so it is measured
   * rather than guessed, and re-measured when the window changes.
   */
  useEffect(() => {
    const node = bar.current
    if (!node) return

    const previous = document.body.style.paddingBottom
    const apply = () => {
      document.body.style.paddingBottom = `${node.offsetHeight}px`
    }
    apply()

    const observer = new ResizeObserver(apply)
    observer.observe(node)
    return () => {
      observer.disconnect()
      document.body.style.paddingBottom = previous
    }
  }, [])

  const plan = plans[planIndex]
  const thumb = gallery?.[0]?.image

  return (
    <>
      {/* Bottom: buy strip */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-tint-100 bg-mist shadow-[0_-6px_24px_rgba(16,60,120,0.10)]"
        ref={bar}
      >
        <div className="container flex items-center gap-4 py-3">
          {thumb && typeof thumb === 'object' && (
            <span className="hidden size-14 shrink-0 overflow-hidden rounded-lg bg-white sm:block">
              {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default
                  `<div>` wrapper is not valid inside a span. */}
              <Media htmlElement={null} imgClassName="size-14 object-contain" resource={thumb} />
            </span>
          )}

          <p className="hidden min-w-0 flex-1 text-sm font-bold leading-tight text-heading md:block">
            {marks(title)}
          </p>

          {plans.length > 1 && (
            <label className="relative hidden shrink-0 sm:block">
              <span className="sr-only">Choose a plan</span>
              <select
                className="w-56 appearance-none rounded-xl border border-tint-150 bg-white py-2.5 pl-4 pr-9 text-left text-sm font-semibold text-heading"
                onChange={(e) => onPlanChange?.(Number(e.target.value))}
                value={planIndex}
              >
                {plans.map((p, i) => (
                  <option key={p.id ?? i} value={i}>
                    {p.name}
                    {p.saveLabel ? ` (${p.saveLabel})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-heading"
              />
            </label>
          )}

          {/* The same action as the button in the buy box, so the strip is not a second,
              quieter way of doing something slightly different. */}
          {addToCart ? (
            <button
              className="cta-gleam [--cta-glow:var(--color-brand)] flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:flex-none"
              onClick={addToCart}
              type="button"
            >
              {marks(ctaLabel || 'Add to cart')}
              {plan?.price && (
                <span className="font-normal normal-case">
                  — {marks(plan.price)}
                  {plan.priceSuffix ? marks(plan.priceSuffix) : ''}
                </span>
              )}
            </button>
          ) : (
            <a
              className="cta-gleam [--cta-glow:var(--color-brand)] flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:flex-none"
              href={buyUrl || '#'}
            >
              {marks(ctaLabel || 'Add to cart')}
              {plan?.price && (
                <span className="font-normal normal-case">
                  — {marks(plan.price)}
                  {plan.priceSuffix ? marks(plan.priceSuffix) : ''}
                </span>
              )}
            </a>
          )}
        </div>
      </div>
    </>
  )
}
