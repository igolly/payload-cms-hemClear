'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { SupportTabsBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Item = NonNullable<SupportTabsBlock['items']>[number]

const ItemIcon: React.FC<{ className?: string; item: Item }> = ({ className, item }) =>
  item.image && typeof item.image === 'object' ? (
    <Media className={className} imgClassName="h-full w-full object-contain" resource={item.image} />
  ) : (
    <BrandIcon className={className} name={item.icon} />
  )

/**
 * Tabs and cards over one scroll-snap track: the tabs scroll a card into view and the
 * active tab is derived from scroll position, so tapping a tab, pressing an arrow and
 * swiping the cards all stay in sync without a second source of truth.
 */
export const Tabs: React.FC<{ items: Item[] }> = ({ items }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const step = track.firstElementChild?.clientWidth ?? 1
    setActive(Math.round(track.scrollLeft / step))
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
    const step = track.firstElementChild?.clientWidth ?? 0
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    track.scrollTo({ behavior: 'smooth', left: step * clamped })
  }

  const arrow =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1c2f6e] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40'

  return (
    <div>
      {/* Tabs */}
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, i) => (
          <li key={item.id ?? i}>
            <button
              aria-current={i === active}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                i === active
                  ? 'border-[#1c2f6e] bg-[#1c2f6e] text-white'
                  : 'border-[#dbe8fa] bg-white text-[#1c2f6e] hover:bg-slate-50',
              )}
              onClick={() => scrollToIndex(i)}
              type="button"
            >
              <ItemIcon className="[&>svg]:h-4 [&>svg]:w-4 [&_img]:h-4 [&_img]:w-4" item={item} />
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Cards */}
      <div className="mt-8 flex items-center gap-3">
        <button
          aria-label="Previous"
          className={arrow}
          disabled={active === 0}
          onClick={() => scrollToIndex(active - 1)}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <ul
          className="flex grow snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items.map((item, i) => (
            <li className="w-full flex-none snap-center" key={item.id ?? i}>
              <div
                className="flex h-full items-center gap-5 rounded-xl border border-[#c9dcf5] bg-white p-6"
                data-payload-subpath={`items.${i}.title`}
              >
                <ItemIcon
                  className="shrink-0 text-[#0052cc] [&>svg]:h-14 [&>svg]:w-14 [&_img]:h-14 [&_img]:w-14"
                  item={item}
                />
                <div className="min-w-0">
                  <h3 className="font-serif text-2xl text-[#0052cc]">{item.title}</h3>
                  <p
                    className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#1c2f6e]"
                    data-payload-subpath={`items.${i}.description`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          aria-label="Next"
          className={arrow}
          disabled={active >= items.length - 1}
          onClick={() => scrollToIndex(active + 1)}
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
