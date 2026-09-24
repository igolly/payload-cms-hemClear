'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Arrows and a dot per card for a row that scrolls sideways.
 *
 * Several sections turn a column into a swipe row on a narrow screen and left the reader to
 * discover that by dragging — the row simply ran off the edge with nothing to say it moved,
 * or how far it went. This wraps such a row, steers it, and shows where in it you are.
 *
 * It finds the scrolling element itself rather than being told which one, and shows the
 * controls only while that element actually overflows. A section whose row becomes a column
 * again at `sm` therefore drops them at `sm` without naming the breakpoint twice, and a row
 * short enough to fit never shows them at all.
 */
export const ScrollArrows: React.FC<{
  /** Extra classes for the two buttons, for a row whose arrows need a different inset. */
  arrowClassName?: string
  children: React.ReactNode
  className?: string
  /** Names the buttons for a screen reader: "Previous <label>". */
  label: string
}> = ({ arrowClassName, children, className, label }) => {
  const wrap = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [active, setActive] = useState(0)
  const [count, setCount] = useState(0)
  const [midline, setMidline] = useState(0)

  const trackOf = () => {
    const root = wrap.current
    if (!root) return null
    const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
    return (
      nodes.find((node) => {
        const overflow = getComputedStyle(node).overflowX
        return (
          (overflow === 'auto' || overflow === 'scroll') && node.scrollWidth > node.clientWidth + 4
        )
      }) ?? null
    )
  }

  /** The distance from one card to the next, which is also one press of an arrow. */
  const stepOf = (track: HTMLElement) => {
    const [first, second] = Array.from(track.children) as HTMLElement[]
    if (!first) return 0
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
  }

  const sync = useCallback(() => {
    const track = trackOf()
    if (!track) {
      setShown(false)
      return
    }
    const max = track.scrollWidth - track.clientWidth
    const by = stepOf(track)
    setShown(max > 4)
    setAtStart(track.scrollLeft <= 2)
    setAtEnd(track.scrollLeft >= max - 2)
    setCount(track.children.length)
    // The dots sit under the row and make the wrapper taller than the row, so the arrows
    // are centred on the track itself rather than on half of everything.
    setMidline(track.offsetTop + track.offsetHeight / 2)
    // The last cards cannot scroll to the left edge, so pin the final dot at the end stop
    // rather than leaving it unreachable.
    setActive(
      max > 0 && track.scrollLeft >= max - 2
        ? track.children.length - 1
        : by > 0
          ? Math.round(track.scrollLeft / by)
          : 0,
    )
  }, [])

  useEffect(() => {
    const root = wrap.current
    if (!root) return
    sync()

    // The track is found by measurement, so the listeners have to follow whatever is
    // scrolling now: a resize can turn the row back into a column and the element away.
    const track = trackOf()
    track?.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(root)
    return () => {
      track?.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  /** Scrolls to an absolute card position, as the other carousels here do. */
  const scrollToCard = (index: number) => {
    const track = trackOf()
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    track.scrollTo({ behavior: 'smooth', left: Math.max(0, Math.min(max, stepOf(track) * index)) })
  }

  const step = (direction: 1 | -1) => scrollToCard(active + direction)

  const arrow =
    'absolute z-10 size-8 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-0'

  return (
    <div className={cn('relative', className)} ref={wrap}>
      {children}

      {shown && (
        <>
          <button
            aria-label={`Previous ${label}`}
            className={cn(arrow, 'left-0', arrowClassName)}
            disabled={atStart}
            style={{ top: midline }}
            onClick={() => step(-1)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
            <img
              alt=""
              className="size-8"
              decoding="async"
              height={32}
              loading="lazy"
              src="/icons/reviews/carousel-left.svg"
              width={32}
            />
          </button>
          <button
            aria-label={`Next ${label}`}
            className={cn(arrow, 'right-0', arrowClassName)}
            disabled={atEnd}
            style={{ top: midline }}
            onClick={() => step(1)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
            <img
              alt=""
              className="size-8"
              decoding="async"
              height={32}
              loading="lazy"
              src="/icons/reviews/carousel-right.svg"
              width={32}
            />
          </button>

          {/* One dot per card, below the row, as the mobile frames draw them: 8px circles
              10px apart, the one in view filled. They double as a way to jump. */}
          <div className="flex items-start justify-center gap-2.5 py-2.5">
            {Array.from({ length: count }, (_, i) => (
              <button
                aria-current={i === active}
                aria-label={`${label} ${i + 1}`}
                className={cn(
                  'size-2 shrink-0 rounded-full transition-colors',
                  i === active ? 'bg-brand-600' : 'bg-ash-250',
                )}
                key={i}
                onClick={() => scrollToCard(i)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
