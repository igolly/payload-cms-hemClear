'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { SupportTabsBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Item = NonNullable<SupportTabsBlock['items']>[number]

/**
 * The comp's illustrated, multi-colour icons, which the line icons in `BrandIcons` don't
 * match. Keyed by the icon each support area already selects; an uploaded image still
 * wins, and any other icon falls back to the shared line set.
 */
const illustrations: Record<string, string> = {
  calendar: '/icons/support/regularity.svg',
  droplet: '/icons/support/stool-comfort.svg',
  flask: '/icons/support/antioxidants.svg',
  leaf: '/icons/support/capillary.svg',
  rotate: '/icons/support/circulation.svg',
  shieldCheck: '/icons/support/skin-protection.svg',
  snowflake: '/icons/support/external-soothing.svg',
  supportSystem: '/icons/support/vein.svg',
}

const ItemIcon: React.FC<{ className: string; item: Item; size: number }> = ({
  className,
  item,
  size,
}) => {
  if (item.image && typeof item.image === 'object') {
    return (
      <Media
        className={cn('relative', className)}
        fill
        imgClassName="object-contain"
        resource={item.image}
        size={`${size}px`}
      />
    )
  }

  const src = item.icon ? illustrations[item.icon] : undefined
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
    return <img alt="" className={className} height={size} src={src} width={size} />
  }

  return (
    <BrandIcon className={cn('text-brand-500 [&>svg]:size-full', className)} name={item.icon} />
  )
}

/**
 * Tabs and cards over one scroll-snap track: the tabs scroll a card into view and the
 * active tab is derived from scroll position, so tapping a tab, pressing an arrow and
 * swiping the cards all stay in sync without a second source of truth.
 */
export const Tabs: React.FC<{ items: Item[] }> = ({ items }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  // One card plus the gap between cards, measured from the layout rather than assumed.
  const stepOf = (track: HTMLUListElement) => {
    const [first, second] = Array.from(track.children) as HTMLElement[]
    if (!first) return 1
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
  }

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setActive(Math.round(track.scrollLeft / stepOf(track)))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    sync()
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      track.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  const scrollToIndex = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    track.scrollTo({ behavior: 'smooth', left: stepOf(track) * clamped })
  }

  const arrow =
    'absolute top-1/2 z-10 size-8 shrink-0 -translate-y-1/2 opacity-60 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-25 md:static md:size-16 md:translate-y-0'

  return (
    <>
      <ul className="flex w-full flex-wrap items-start justify-center gap-2.5">
        {items.map((item, i) => (
          <li key={item.id ?? i}>
            <button
              aria-current={i === active}
              className={cn(
                'flex items-center rounded-[14px] border bg-white p-0.5',
                i === active ? 'border-aqua-200' : 'border-[#ddd] hover:border-brand-300',
              )}
              onClick={() => scrollToIndex(i)}
              type="button"
            >
              <span
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-xl px-2 py-1 text-xs font-medium leading-normal transition-colors',
                  i === active ? 'bg-brand-500 text-white' : 'bg-white text-brand-500',
                )}
              >
                <ItemIcon className="size-8 shrink-0" item={item} size={32} />
                <span className="whitespace-nowrap">{marks(item.title)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="relative flex w-full items-center justify-center gap-4 px-4 py-5 md:justify-between xl:px-[50px]">
        <button
          aria-label="Previous"
          className={cn(arrow, 'left-0')}
          disabled={active === 0}
          onClick={() => scrollToIndex(active - 1)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="size-full"
            height={64}
            src="/icons/support/arrow-left.svg"
            width={64}
          />
        </button>

        <ul
          className="flex w-full max-w-[1000px] snap-x snap-mandatory gap-5 overflow-x-auto lg:gap-6 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items.map((item, i) => (
            <li className="w-full flex-none snap-center" key={item.id ?? i}>
              {/* The white card sits 10px low inside a gradient plate of the same radius, so only a gradient top edge shows. */}
              <div className="h-full rounded-[30px] bg-gradient-to-r from-brand-300 via-brand-600 to-[rgba(44,128,226,0.36)] pt-2.5">
                <div
                  className="flex h-[370px] flex-col items-start justify-center gap-6 rounded-[30px] bg-white p-4 text-left sm:h-full sm:flex-row sm:items-center sm:justify-start lg:h-[160px]"
                  data-payload-subpath={`items.${i}.title`}
                >
                  <ItemIcon className="size-[120px] shrink-0" item={item} size={120} />
                  <div className="flex w-full min-w-0 flex-col gap-2.5 text-brand-500 sm:w-auto sm:flex-1">
                    <h3 className="font-marcellus text-[32px] font-normal leading-[normal] lg:font-playfair lg:text-[42px] lg:font-medium lg:leading-normal [&_sup]:leading-[0]">
                      {marks(item.cardTitle || item.title)}
                    </h3>
                    <p
                      className="whitespace-pre-line text-lg font-medium leading-[normal] lg:leading-normal"
                      data-payload-subpath={`items.${i}.description`}
                    >
                      {marks(item.description)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          aria-label="Next"
          className={cn(arrow, 'right-0')}
          disabled={active >= items.length - 1}
          onClick={() => scrollToIndex(active + 1)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="size-full"
            height={64}
            src="/icons/support/arrow-right.svg"
            width={64}
          />
        </button>
      </div>
    </>
  )
}
