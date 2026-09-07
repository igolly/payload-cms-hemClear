'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'

import type { BenefitsCarouselBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

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
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1c2f6e] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40'

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
          className="flex grow snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {items.map((item, i) => {
            const key = String(item.id ?? i)
            const isOpen = open === key

            return (
              <li
                className="w-[70%] flex-none snap-start sm:w-[44%] md:w-[30%] lg:w-[calc((100%-3rem)/5)]"
                key={key}
              >
                <div
                  className="flex h-full flex-col overflow-hidden rounded-xl bg-white"
                  data-payload-subpath={`items.${i}.title`}
                >
                  <div className="relative aspect-[4/5] w-full bg-[#e8f0fc]">
                    {item.image && typeof item.image === 'object' ? (
                      <Media fill imgClassName="object-cover" resource={item.image} />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[11px] text-[#8AA6C8]">
                        Photo
                      </span>
                    )}
                  </div>

                  <div className="relative flex grow flex-col items-center px-3 pb-6 pt-8 text-center">
                    <span className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#dbe8fa] bg-white text-[#1c2f6e] [&>span>svg]:h-6 [&>span>svg]:w-6">
                      <BrandIcon name={item.icon} />
                    </span>

                    <h3 className="font-serif text-base leading-tight text-[#1c2f6e]">
                      {item.title}
                    </h3>

                    {isOpen && item.details && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.details}</p>
                    )}

                    {item.details && (
                      <button
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} more about ${item.title}`}
                        className="mt-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#1c2f6e] text-white transition-colors hover:bg-[#162456]"
                        onClick={() => setOpen(isOpen ? null : key)}
                        type="button"
                      >
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
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
                i === active ? 'w-5 bg-[#1c2f6e]' : 'w-2 bg-[#a9c5ea] hover:bg-[#7fa8dd]',
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
