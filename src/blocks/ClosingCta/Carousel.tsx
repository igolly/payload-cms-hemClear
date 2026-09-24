'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Below `lg` the four approach cards become a swipe track: two cards per view on a phone
 * (Figma mobile: 194px cards, 17.5px gap in a 408px box) with 32px arrows sitting over the
 * card edges at mid-height. From `lg` the track is a plain centred row of 250px cards.
 */
export const CardsCarousel: React.FC<{ slides: React.ReactNode[] }> = ({ slides }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  const stepOf = (track: HTMLUListElement) => {
    const [first, second] = Array.from(track.children) as HTMLElement[]
    if (!first) return 1
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
  }

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const step = stepOf(track)
    setActive(Math.round(track.scrollLeft / step))
    setMaxIndex(Math.max(0, Math.ceil((track.scrollWidth - track.clientWidth) / step - 0.01)))
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
    const clamped = Math.max(0, Math.min(maxIndex, index))
    track.scrollTo({ behavior: 'smooth', left: stepOf(track) * clamped })
  }

  const arrow =
    'absolute top-1/2 z-10 size-8 -translate-y-1/2 opacity-80 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-30 xl:hidden'

  return (
    <div className="relative">
      <ul
        className="flex snap-x snap-mandatory gap-[17.5px] overflow-x-auto scroll-smooth py-[12.5px] [-ms-overflow-style:none] [scrollbar-width:none] xl:justify-center xl:overflow-visible [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
      >
        {slides}
      </ul>

      <button
        aria-label="Previous card"
        className={cn(arrow, 'left-0')}
        disabled={active <= 0}
        onClick={() => scrollToIndex(active - 1)}
        type="button"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
        <img
          alt=""
          className="size-8"
          decoding="async"
          height={32}
          loading="lazy"
          src="/icons/support/arrow-left.svg"
          width={32}
        />
      </button>
      <button
        aria-label="Next card"
        className={cn(arrow, 'right-0')}
        disabled={active >= maxIndex}
        onClick={() => scrollToIndex(active + 1)}
        type="button"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
        <img
          alt=""
          className="size-8"
          decoding="async"
          height={32}
          loading="lazy"
          src="/icons/support/arrow-right.svg"
          width={32}
        />
      </button>
    </div>
  )
}
