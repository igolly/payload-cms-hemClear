'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Plan = NonNullable<ProductDetailBlock['plans']>[number]

/**
 * The buy strip that slides up once the buy box has scrolled away.
 *
 * It is driven by the product data already on the block: the thumbnail from the first
 * gallery image, the name from the title, the prices from the same `plans` the buy box uses,
 * so there is no second copy of the pricing to keep in sync.
 *
 * The offer strip that used to sit along the top went to the Header global — it runs on
 * every page now (`src/components/StickyOfferBar`), so rendering it here too would put two
 * of them on this one.
 */
export const StickyBars: React.FC<{
  ctaLabel?: string | null
  gallery?: ProductDetailBlock['gallery']
  plans?: Plan[]
  /** Where the buy button goes — the block's own `stickyCtaUrl`. */
  stickyCtaUrl?: string | null
  title?: string | null
}> = ({ ctaLabel, gallery, plans = [], stickyCtaUrl, title }) => {
  const sentinel = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [planIndex, setPlanIndex] = useState(() => {
    const best = plans.findIndex((p) => p.bestValue)
    return best >= 0 ? best : 0
  })

  /*
   * A zero-height sentinel sits at the top of the product section. Once it has left the
   * viewport the buy box is behind the reader, which is the moment the bars earn their
   * space — cheaper and steadier than measuring scroll position on every frame.
   */
  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const plan = plans[planIndex]
  const thumb = gallery?.[0]?.image

  return (
    <>
      <div aria-hidden="true" ref={sentinel} />

      {/* Bottom: buy strip */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-tint-100 bg-mist shadow-[0_-6px_24px_rgba(16,60,120,0.10)]',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          shown ? 'translate-y-0' : 'translate-y-full',
        )}
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
                onChange={(e) => setPlanIndex(Number(e.target.value))}
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

          <a
            className="cta-gleam [--cta-glow:var(--color-brand)] flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:flex-none"
            href={stickyCtaUrl || '#'}
          >
            {marks(ctaLabel || 'Add to cart')}
            {plan?.price && (
              <span className="font-normal normal-case">
                — {marks(plan.price)}
                {plan.priceSuffix ? marks(plan.priceSuffix) : ''}
              </span>
            )}
          </a>
        </div>
      </div>
    </>
  )
}
