'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * The plan row. From `xl` the cards sit side by side; below that the row is a native
 * scroll-snap carousel (Figma mobile 6246:3213 / 6400:613): one card centred, the others
 * off either edge, and 32px arrows at 60% on the content edges, level with the card body.
 * No carousel library — touch swipe and keyboard scrolling come with the native scroller,
 * the arrows only drive `scrollTo`.
 */
export const PlanCarousel: React.FC<{
  children: React.ReactNode
  /** The card that starts centred (the popular one). */
  initial: number
  /** Width of one card below `xl`, which sets the side padding that lets the end cards centre. */
  itemWidth: string
  /** Called with the centred card once a user scroll settles. */
  onSettle?: (index: number) => void
  /** Extra props for the track (e.g. the radiogroup role). */
  trackProps?: React.HTMLAttributes<HTMLDivElement>
}> = ({ children, initial, itemWidth, onSettle, trackProps }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(initial)
  const count = React.Children.count(children)

  const offsetFor = (track: HTMLDivElement, index: number) => {
    const card = track.children[index] as HTMLElement | undefined
    if (!card) return track.scrollLeft
    const c = card.getBoundingClientRect()
    const t = track.getBoundingClientRect()
    return track.scrollLeft + c.left + c.width / 2 - (t.left + t.width / 2)
  }

  // Start on the popular card, without animating.
  useEffect(() => {
    const track = trackRef.current
    if (track && track.scrollWidth > track.clientWidth) track.scrollLeft = offsetFor(track, initial)
  }, [initial])

  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onScroll = useCallback(() => {
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const track = trackRef.current
      if (!track || track.scrollWidth <= track.clientWidth) return
      const t = track.getBoundingClientRect()
      const centre = t.left + t.width / 2
      let best = 0
      let bestDistance = Infinity
      Array.from(track.children).forEach((child, i) => {
        const r = child.getBoundingClientRect()
        const distance = Math.abs(r.left + r.width / 2 - centre)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      setActive(best)
      onSettle?.(best)
    }, 120)
  }, [onSettle])

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  const go = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const next = Math.max(0, Math.min(count - 1, index))
    track.scrollTo({ behavior: 'smooth', left: offsetFor(track, next) })
  }

  return (
    <div className="relative w-full">
      <div
        {...trackProps}
        className={cn(
          // Below xl: a scroller whose side padding lets the first and last cards centre.
          'flex w-full snap-x snap-mandatory items-end gap-[35px] overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'px-[max(0px,calc((100%-var(--plan-w))/2))] *:shrink-0 *:snap-center',
          // From xl: the original side-by-side row.
          'xl:justify-center xl:gap-[25px] xl:overflow-visible xl:px-0 xl:py-[25.625px]',
          trackProps?.className,
        )}
        onScroll={onScroll}
        ref={trackRef}
        style={{ '--plan-w': itemWidth } as React.CSSProperties}
      >
        {children}
      </div>

      {count > 1 &&
        ([-1, 1] as const).map((direction) => (
          <button
            aria-label={direction < 0 ? 'Previous plan' : 'Next plan'}
            className={cn(
              // Level with the middle of the white card, which sits below the popular ribbon.
              'absolute top-[calc(50%+17px)] z-10 size-8 -translate-y-1/2 opacity-60 transition-opacity hover:opacity-80 disabled:opacity-25 xl:hidden',
              direction < 0 ? 'left-0' : 'right-0',
            )}
            disabled={direction < 0 ? active <= 0 : active >= count - 1}
            key={direction}
            onClick={() => go(active + direction)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
            <img
              alt=""
              className="block size-8"
              height={32}
              src={`/icons/pricing/carousel-${direction < 0 ? 'left' : 'right'}.svg`}
              width={32}
            />
          </button>
        ))}
    </div>
  )
}
