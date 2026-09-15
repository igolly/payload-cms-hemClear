'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * The phone treatment of the ringed steps: one 280px card centred at a time with its
 * neighbours peeking, 32px arrows over the icon row and a dot per step. The active step is
 * derived from scroll position, so swiping, arrows and dots stay in sync.
 */
export const StepsCarousel: React.FC<{ slides: React.ReactNode[] }> = ({ slides }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

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
    const clamped = Math.max(0, Math.min(slides.length - 1, index))
    track.scrollTo({ behavior: 'smooth', left: stepOf(track) * clamped })
  }

  const arrow =
    'absolute top-[109px] z-10 size-8 opacity-60 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-25'

  return (
    <div className="flex flex-col gap-4">
      <div className="relative pb-[15px]">
        {/* Side padding of half the viewport less half a card lets the first and last steps centre. */}
        <ul
          className="flex snap-x snap-mandatory items-stretch overflow-x-auto scroll-smooth px-[calc(50%-140px)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {slides}
        </ul>

        <button
          aria-label="Previous step"
          className={cn(arrow, 'left-0')}
          disabled={active === 0}
          onClick={() => scrollToIndex(active - 1)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="size-8"
            height={32}
            src="/icons/support/arrow-left.svg"
            width={32}
          />
        </button>
        <button
          aria-label="Next step"
          className={cn(arrow, 'right-0')}
          disabled={active >= slides.length - 1}
          onClick={() => scrollToIndex(active + 1)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="size-8"
            height={32}
            src="/icons/support/arrow-right.svg"
            width={32}
          />
        </button>
      </div>

      <div className="flex items-start justify-center gap-2.5 py-2.5">
        {slides.map((_, i) => (
          <button
            aria-current={i === active}
            aria-label={`Step ${i + 1}`}
            className={cn('size-2 rounded-full', i === active ? 'bg-brand-600' : 'bg-[#d9d9d9]')}
            key={i}
            onClick={() => scrollToIndex(i)}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
