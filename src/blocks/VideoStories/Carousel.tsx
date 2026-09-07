'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  /** Card width classes. Override when the carousel sits in a narrow column. */
  itemClassName?: string
  stories: Story[]
}> = ({
  itemClassName = 'w-[68%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-4rem)/5)]',
  stories,
}) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const { clientWidth, scrollLeft, scrollWidth } = track
    const step = track.firstElementChild?.clientWidth ?? 1

    setActive(Math.round(scrollLeft / step))
    setAtStart(scrollLeft <= 1)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
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
    track.scrollTo({ behavior: 'smooth', left: step * index })
  }

  const nudge = (direction: -1 | 1) => scrollToIndex(active + direction)

  const arrowClass =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 disabled:opacity-30'

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Previous stories"
          className={cn(arrowClass, 'hidden sm:flex')}
          disabled={atStart}
          onClick={() => nudge(-1)}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <ul
          className="flex grow snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={trackRef}
        >
          {stories.map((story, i) => (
            <li className={cn('flex-none snap-start', itemClassName)} key={story.id ?? i}>
              <StoryCard index={i} story={story} />
            </li>
          ))}
        </ul>

        <button
          aria-label="Next stories"
          className={cn(arrowClass, 'hidden sm:flex')}
          disabled={atEnd}
          onClick={() => nudge(1)}
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {stories.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {stories.map((story, i) => (
            <button
              aria-label={`Go to story ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === active ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70',
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
