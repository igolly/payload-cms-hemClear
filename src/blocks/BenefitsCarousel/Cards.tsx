'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react'

import type { BenefitsCarouselBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { PlusIcon } from '@/components/PlusIcon'
import { marks } from '@/utilities/marks'

type Item = NonNullable<BenefitsCarouselBlock['items']>[number]

export const Cards: React.FC<{ items: Item[] }> = ({ items }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<string | null>(null)

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
    track.scrollTo({ behavior: 'smooth', left: step * Math.max(0, Math.min(items.length - 1, index)) })
  }

  const arrow =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40'

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Previous"
          className={cn(arrow, 'hidden sm:flex')}
          disabled={active === 0}
          onClick={() => scrollToIndex(active - 1)}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <ul
          className="flex grow snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items.map((item, i) => {
            const key = String(item.id ?? i)
            const isOpen = open === key

            return (
              <li
                /* Five across at desktop, per the comp — four gaps of `gap-4` (1rem each)
                   come out of the track before the cards are divided up. */
                className="w-[70%] flex-none snap-start sm:w-[44%] md:w-[30%] lg:w-[calc((100%-4rem)/5)]"
                key={key}
              >
                <div className="relative" data-payload-subpath={`items.${i}.title`}>
                  {/*
                   * The photo fills the whole card. The white panel is laid over its lower
                   * third rather than stacked beneath it, so the icon badge can straddle the
                   * seam and the panel can grow upward over the photo when details expand.
                   */}
                  <div className="relative aspect-[10/19] w-full overflow-hidden rounded-3xl bg-[#e8f0fc]">
                    {item.image && typeof item.image === 'object' ? (
                      <Media fill imgClassName="object-cover" resource={item.image} />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[11px] text-[#8AA6C8]">
                        Photo
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex min-h-[38%] flex-col items-center justify-center rounded-t-3xl bg-white px-4 pb-8 pt-12 text-center">
                      <span className="absolute -top-9 left-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe8fa] bg-white text-brand [&>span>svg]:h-8 [&>span>svg]:w-8">
                        <BrandIcon name={item.icon} />
                      </span>

                      <h3 className="font-serif text-xl leading-tight text-subheading">
                        {marks(item.title)}
                      </h3>

                      {isOpen && item.details && (
                        <p className="mt-2 text-xs leading-relaxed text-slate-600">
                          {marks(item.details)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sits on the card's bottom edge, half outside it, as in the design. */}
                  {item.details && (
                    <button
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} more about ${item.title}`}
                      className="absolute bottom-0 left-1/2 flex h-10 w-10 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-md transition-colors hover:bg-brand-dark"
                      onClick={() => setOpen(isOpen ? null : key)}
                      type="button"
                    >
                      {isOpen ? <Minus className="h-5 w-5" /> : <PlusIcon className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <button
          aria-label="Next"
          className={cn(arrow, 'hidden sm:flex')}
          disabled={active >= items.length - 1}
          onClick={() => scrollToIndex(active + 1)}
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {items.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              aria-label={`Go to ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === active ? 'w-5 bg-brand' : 'w-2 bg-[#a9c5ea] hover:bg-[#7fa8dd]',
              )}
              key={item.id ?? i}
              onClick={() => scrollToIndex(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
