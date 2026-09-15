'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * The featured platform reviews. From `xl` they sit in one centred row (Figma TESTIMONI,
 * 5 cards of 208.75 + 17.5 gaps). Below that the same cards become a swipeable track with
 * 32px arrows over the cards and a dot per card (Figma TESTIMONI mobile). The active card is
 * derived from scroll position so swipes, arrows and dots stay in sync.
 */
export const FeaturedCarousel: React.FC<{ slides: React.ReactNode[] }> = ({ slides }) => {
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
    const max = track.scrollWidth - track.clientWidth
    // The last cards can't scroll to the start edge, so pin the final dot at the end stop.
    setActive(
      max > 0 && track.scrollLeft >= max - 2
        ? slides.length - 1
        : Math.round(track.scrollLeft / stepOf(track)),
    )
  }, [slides.length])

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
    'absolute top-1/2 z-10 size-8 -translate-y-1/2 transition-opacity disabled:pointer-events-none disabled:opacity-40 xl:hidden'

  return (
    <div>
      <div className="relative">
        {/* Full-bleed track: the 19.75px side padding lands the first card's outer stroke where
            Figma draws it (16px gutter + 5px inset − 1.25px outside stroke). */}
        <ul
          className="-mx-4 flex snap-x snap-mandatory scroll-px-[19.75px] gap-[13.5px] overflow-x-auto px-[19.75px] py-[16.75px] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-[15px] xl:mx-0 xl:justify-center xl:overflow-visible xl:px-0 xl:py-[17.5px] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {slides}
        </ul>

        {slides.length > 1 && (
          <>
            <button
              aria-label="Previous review"
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
                src="/icons/reviews/carousel-left.svg"
                width={32}
              />
            </button>
            <button
              aria-label="Next review"
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
                src="/icons/reviews/carousel-right.svg"
                width={32}
              />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-[12.5px] flex items-start justify-center gap-2.5 py-2.5 xl:hidden">
          {slides.map((_, i) => (
            <button
              aria-current={i === active}
              aria-label={`Review ${i + 1}`}
              className={cn('size-2 rounded-full', i === active ? 'bg-brand-600' : 'bg-[#d9d9d9]')}
              key={i}
              onClick={() => scrollToIndex(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
