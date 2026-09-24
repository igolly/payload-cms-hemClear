'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Arrows for a row that scrolls sideways.
 *
 * Several sections turn a column into a swipe row on a narrow screen and left the reader to
 * discover that by dragging — the row simply ran off the edge with nothing to say it moved.
 * This wraps such a row and steers it.
 *
 * It finds the scrolling element itself rather than being told which one, and shows the
 * arrows only while that element actually overflows. A section whose row becomes a column
 * again at `sm` therefore drops its arrows at `sm` without naming the breakpoint twice, and
 * a row short enough to fit never shows them at all.
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

  const sync = useCallback(() => {
    const track = trackOf()
    if (!track) {
      setShown(false)
      return
    }
    const max = track.scrollWidth - track.clientWidth
    setShown(max > 4)
    setAtStart(track.scrollLeft <= 2)
    setAtEnd(track.scrollLeft >= max - 2)
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

  const step = (direction: 1 | -1) => {
    const track = trackOf()
    if (!track) return
    const [first, second] = Array.from(track.children) as HTMLElement[]
    if (!first) return
    const by = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    const max = track.scrollWidth - track.clientWidth
    // `scrollTo` with an absolute position, as the other carousels here do.
    track.scrollTo({
      behavior: 'smooth',
      left: Math.max(0, Math.min(max, track.scrollLeft + by * direction)),
    })
  }

  const arrow =
    'absolute top-1/2 z-10 size-8 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-0'

  return (
    <div className={cn('relative', className)} ref={wrap}>
      {children}

      {shown && (
        <>
          <button
            aria-label={`Previous ${label}`}
            className={cn(arrow, 'left-0', arrowClassName)}
            disabled={atStart}
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
        </>
      )}
    </div>
  )
}
