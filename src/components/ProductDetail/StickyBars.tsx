'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Plan = NonNullable<ProductDetailBlock['plans']>[number]

/**
 * The pair of bars that slide in once the buy box has scrolled away — an offer strip at the
 * top and a buy strip at the bottom.
 *
 * Both are driven by the product data that is already on the block: the bottom bar takes its
 * thumbnail from the first gallery image, its name from the title, and its prices from the
 * same `plans` the buy box uses, so there is no second copy of the pricing to keep in sync.
 */
export const StickyBars: React.FC<{
  ctaLabel?: string | null
  gallery?: ProductDetailBlock['gallery']
  offerNote?: string | null
  offerText?: string | null
  plans?: Plan[]
  stickyCtaLabel?: string | null
  stickyCtaUrl?: string | null
  title?: string | null
}> = ({
  ctaLabel,
  gallery,
  offerNote,
  offerText,
  plans = [],
  stickyCtaLabel,
  stickyCtaUrl,
  title,
}) => {
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

      {/* Top: offer strip */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-navy text-white',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          shown ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="container flex items-center justify-between gap-4 py-3">
          <span className="hidden shrink-0 brightness-0 invert sm:block">
            <Logo />
          </span>

          <p className="min-w-0 flex-1 text-center text-xs font-semibold sm:text-sm">
            {offerText && <span className="text-amber">{marks(offerText)}</span>}
            {offerText && offerNote && (
              <span aria-hidden="true" className="mx-2 text-white/40">
                |
              </span>
            )}
            {offerNote && <span className="font-normal text-white/90">{marks(offerNote)}</span>}
          </p>

          {stickyCtaLabel && (
            <a
              className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-heading transition-colors hover:bg-white/90 sm:inline-flex"
              href={stickyCtaUrl || '#'}
            >
              {marks(stickyCtaLabel)}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>

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
            className="flex flex-1 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:flex-none"
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
