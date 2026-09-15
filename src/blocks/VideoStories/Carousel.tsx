'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
/* eslint-disable @next/next/no-img-element */

import type { VideoStoriesBlock } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { StoryCard } from './StoryCard'

type Story = NonNullable<VideoStoriesBlock['stories']>[number]

/**
 * Scroll-snap carousel — no carousel library. The track is a native horizontal scroller,
 * so touch swipe and keyboard scrolling work for free; the arrows and dots just drive
 * `scrollTo`, and the active dot is derived from scroll position.
 */
export const Carousel: React.FC<{
  /** Show the prev/next buttons. Off in a narrow column, where their gutters cost more
      than they are worth and the dots carry the paging on their own. */
  arrows?: boolean
  /** Card width classes. Override when the carousel sits in a narrow column. */
  itemClassName?: string
  /** The posters already carry the phone status bar, badge and duration. */
  posterIncludesChrome?: boolean
  stories: Story[]
  /**
   * Which background the controls sit on. The arrows and dots were written in white for
   * the navy `videoStories` band; on a white section they were invisible while still
   * taking up their gutter, which pushed the track out of line with the heading above it.
   */
  tone?: 'dark' | 'light'
}> = ({ arrows = true, itemClassName, posterIncludesChrome, stories, tone = 'dark' }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /** Phone widths (dark tone): cards snap to the centre of the track, as Figma 6246:3126 does. */
  const centred = useCallback(
    () => tone === 'dark' && window.matchMedia('(max-width: 639.98px)').matches,
    [tone],
  )

  /** How far the track must scroll to put card `index` in its middle. */
  const centreOffset = (track: HTMLUListElement, index: number) => {
    const card = track.children[index] as HTMLElement | undefined
    if (!card) return 0
    const c = card.getBoundingClientRect()
    const t = track.getBoundingClientRect()
    return track.scrollLeft + c.left + c.width / 2 - (t.left + t.width / 2)
  }

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const { clientWidth, scrollLeft, scrollWidth } = track
    const step = track.firstElementChild?.clientWidth ?? 1

    if (centred()) {
      const mid = track.getBoundingClientRect()
      const centre = mid.left + mid.width / 2
      let nearest = 0
      let best = Infinity
      Array.from(track.children).forEach((child, i) => {
        const r = child.getBoundingClientRect()
        const d = Math.abs(r.left + r.width / 2 - centre)
        if (d < best) {
          best = d
          nearest = i
        }
      })
      setActive(nearest)
    } else {
      setActive(Math.round(scrollLeft / step))
    }
    setAtStart(scrollLeft <= 1)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // The mobile comp opens on the middle story with its neighbours peeking either side.
    if (centred() && track.children.length > 2) {
      track.scrollTo({
        behavior: 'instant',
        left: centreOffset(track, Math.floor((track.children.length - 1) / 2)),
      })
    }

    sync()
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      track.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [centred, sync])

  const scrollToIndex = (index: number) => {
    const track = trackRef.current
    if (!track) return
    if (centred()) {
      const clamped = Math.max(0, Math.min(track.children.length - 1, index))
      track.scrollTo({ behavior: 'smooth', left: centreOffset(track, clamped) })
      return
    }
    const step = track.firstElementChild?.clientWidth ?? 0
    track.scrollTo({ behavior: 'smooth', left: step * index })
  }

  const nudge = (direction: -1 | 1) => scrollToIndex(active + direction)

  const light = tone === 'light'

  if (light) {
    /* Light tone — the product page's buy column (Figma 6216:3157). Five 114x214 cards
       9.43px apart on a 607.72px track centred in the column (4px of padding each side,
       cancelled by negative margin, keeps the card shadows from being clipped), 32px arrows
       at 60% over the column edges with their centres 105px down, then 12px dots 10px apart. */
    const arrowClass =
      'absolute top-[89px] z-30 size-8 opacity-60 transition-opacity hover:opacity-80 disabled:opacity-25 disabled:hover:opacity-25'

    return (
      <div className="relative flex flex-col items-center gap-2.5 pb-4">
        <ul
          className="-my-1 flex w-full max-w-[615.72px] snap-x snap-mandatory gap-[9.43px] overflow-x-auto scroll-smooth scroll-px-1 p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {stories.map((story, i) => (
            <li
              className={cn('flex flex-none snap-start', itemClassName ?? 'w-[114px]')}
              key={story.id ?? i}
            >
              <StoryCard
                index={i}
                posterIncludesChrome={posterIncludesChrome}
                story={story}
                tone="light"
              />
            </li>
          ))}
        </ul>

        {arrows && (
          <>
            <button
              aria-label="Previous stories"
              className={cn(arrowClass, 'left-0')}
              disabled={atStart}
              onClick={() => nudge(-1)}
              type="button"
            >
              <img
                alt=""
                className="size-8"
                height={32}
                src="/icons/product-detail/carousel-left.svg"
                width={32}
              />
            </button>
            <button
              aria-label="Next stories"
              className={cn(arrowClass, 'right-0')}
              disabled={atEnd}
              onClick={() => nudge(1)}
              type="button"
            >
              <img
                alt=""
                className="size-8"
                height={32}
                src="/icons/product-detail/carousel-right.svg"
                width={32}
              />
            </button>
          </>
        )}

        {stories.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 py-2.5">
            {stories.map((story, i) => (
              <button
                aria-label={`Go to story ${i + 1}`}
                className={cn(
                  'size-3 rounded-full transition-colors',
                  i === active ? 'bg-brand-600' : 'bg-ash-250 hover:bg-steel-300',
                )}
                key={story.id ?? i}
                onClick={() => scrollToIndex(i)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  /* Dark tone — the navy `videoStories` band (Figma 58:841 + carousel 6517:2023). The
     track caps at the comp's 1113.75px (five 208.75px cards, 17.5px gaps) and the 64px
     arrows sit 50px in from the 1400px container edges, `justify-between` taking up the
     slack. The track pads 8px vertically (cancelled by a negative margin) so the cards'
     soft shadow is not clipped by the horizontal scroller; 4px side padding does the same
     horizontally, which is why the cap is 1121.75px. */
  const arrowClass =
    'h-16 w-16 shrink-0 opacity-60 transition-opacity hover:opacity-80 disabled:opacity-25 disabled:hover:opacity-25'

  return (
    <div>
      <div className="relative flex items-center justify-between gap-3 xl:px-[50px]">
        {/* Mobile (6517:2035): 32px arrows at 60% on the content edges, 187.25px down the cards. */}
        {arrows &&
          ([-1, 1] as const).map((direction) => (
            <button
              aria-label={direction < 0 ? 'Previous stories' : 'Next stories'}
              className={cn(
                'absolute top-[187.25px] z-30 size-8 opacity-60 transition-opacity hover:opacity-80 disabled:opacity-25 sm:hidden',
                direction < 0 ? 'left-0' : 'right-0',
              )}
              disabled={direction < 0 ? atStart : atEnd}
              key={direction}
              onClick={() => nudge(direction)}
              type="button"
            >
              <img
                alt=""
                className="block size-8"
                height={32}
                src={`/icons/video-stories/carousel-${direction < 0 ? 'left' : 'right'}.svg`}
                width={32}
              />
            </button>
          ))}

        <button
          aria-label="Previous stories"
          className={cn(arrowClass, arrows ? 'hidden md:block' : 'hidden')}
          disabled={atStart}
          onClick={() => nudge(-1)}
          type="button"
        >
          <img
            alt=""
            className="h-16 w-16"
            height={64}
            src="/icons/video-stories/arrow-left.svg"
            width={64}
          />
        </button>

        <ul
          className="-my-2 flex min-w-0 max-w-[1121.75px] grow snap-x snap-mandatory gap-[17.5px] overflow-x-auto scroll-smooth scroll-px-1 px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {stories.map((story, i) => (
            <li
              className={cn(
                'flex flex-none snap-start max-sm:snap-center',
                itemClassName ??
                  'w-[208.75px] sm:w-[42%] md:w-[calc((100%-35px)/3)] lg:w-[calc((100%-70px)/5)]',
              )}
              key={story.id ?? i}
            >
              <StoryCard
                index={i}
                posterIncludesChrome={posterIncludesChrome}
                story={story}
                tone="dark"
              />
            </li>
          ))}
        </ul>

        <button
          aria-label="Next stories"
          className={cn(arrowClass, arrows ? 'hidden md:block' : 'hidden')}
          disabled={atEnd}
          onClick={() => nudge(1)}
          type="button"
        >
          <img
            alt=""
            className="h-16 w-16"
            height={64}
            src="/icons/video-stories/arrow-right.svg"
            width={64}
          />
        </button>
      </div>

      {stories.length > 1 && (
        /* Figma 61:913: a 48.75px strip, 25px white pill + 8.75px brand-300 dots, 6.25px apart. */
        <div className="mt-[12.5px] flex h-[48.75px] items-center justify-center gap-[6.25px]">
          {stories.map((story, i) => (
            <button
              aria-label={`Go to story ${i + 1}`}
              className={cn(
                'h-[8.75px] rounded-full transition-all',
                i === active ? 'w-[25px] bg-white' : 'w-[8.75px] bg-brand-300 hover:bg-brand-200',
              )}
              key={story.id ?? i}
              onClick={() => scrollToIndex(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
