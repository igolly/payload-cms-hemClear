'use client'
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
/* eslint-disable @next/next/no-img-element */

import type { VideoStoriesBlock } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { StoryCard } from './StoryCard'

type Story = NonNullable<VideoStoriesBlock['stories']>[number]

/*
 * One story plays per page, not merely per carousel: the product page carries two of
 * these, and two people talking over each other is the thing this was meant to stop.
 * Starting a clip announces it, and every other carousel drops whatever it was playing.
 * A window event is enough for one boolean — a context or a store would be more machinery
 * than the problem deserves.
 */
const PLAY_EVENT = 'videostories:play'

/*
 * Card width and gap per tone, in px. The cards are fixed widths so that one set of
 * stories is exactly `stories × (card + gap)` wide — the distance the loop jumps by.
 *   dark  — Figma 58:842: 208.75px cards, 17.5px apart.
 *   light — Figma 6219:3272: 114px cards, 9.43px apart.
 */
const CARD = { dark: 208.75, light: 114 } as const
const GAP = { dark: 17.5, light: 9.43 } as const

/**
 * An endless scroll-snap carousel — no carousel library, and no autoplay: it moves only
 * when the visitor swipes, scrolls or presses an arrow. The track is a native horizontal
 * scroller carrying several copies of the stories; whenever a scroll comes to rest it is
 * jumped, without animation, back into the middle copy by a whole number of sets. The
 * jump lands on an identical frame, so the row never reaches an end in either direction.
 */
export const Carousel: React.FC<{
  /** The posters already carry the phone status bar, badge and duration. */
  posterIncludesChrome?: boolean
  stories: Story[]
  /** Which background it sits on: the navy `videoStories` band or the product page's white
      buy column. Sets the card style, size and the arrows. */
  tone?: 'dark' | 'light'
}> = ({ posterIncludesChrome, stories, tone = 'dark' }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  /*
   * Which rendered card is playing — an index into the repeated list, so pressing play on
   * a copy plays that copy rather than one somewhere off-screen. Starting a second swaps
   * the index, which unmounts the first card's <video> or <iframe>.
   */
  const [playingIndex, setPlayingIndex] = useState<null | number>(null)
  const carouselId = useId()
  /*
   * How many copies of the stories the track carries: an odd number, with at least two
   * viewports of cards either side of the middle copy so a hard fling cannot reach the end
   * before the scroll comes to rest. One copy when the stories fit the row anyway — there
   * is nowhere to go, and repeating them would only show the same faces side by side.
   */
  const [copies, setCopies] = useState(1)
  /** The scroll position the arrows last asked for, held until the scroll comes to rest. */
  const pending = useRef<null | number>(null)

  const step = CARD[tone] + GAP[tone]
  const setWidth = stories.length * step
  const loops = copies > 1

  const play = useCallback(
    (index: null | number) => {
      setPlayingIndex(index)
      if (index !== null) window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: carouselId }))
    },
    [carouselId],
  )

  useEffect(() => {
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== carouselId) setPlayingIndex(null)
    }
    window.addEventListener(PLAY_EVENT, onOtherPlay)
    return () => window.removeEventListener(PLAY_EVENT, onOtherPlay)
  }, [carouselId])

  // Escape stops the clip, the same key that closes the mega menu and the mobile drawer.
  useEffect(() => {
    if (playingIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlayingIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playingIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track || setWidth <= 0) return
    const fit = () => {
      const width = track.clientWidth
      if (setWidth <= width + 1) return setCopies(1)
      const side = Math.max(2, Math.ceil((2 * width) / setWidth))
      setCopies(side * 2 + 1)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(track)
    return () => observer.disconnect()
  }, [setWidth])

  /** Move the scroll position into the middle copy, onto the same card it shows now. */
  const recentre = useCallback(() => {
    const track = trackRef.current
    if (!track || !loops) return
    const base = Math.floor(copies / 2) * setWidth
    const offset = (((track.scrollLeft - base) % setWidth) + setWidth) % setWidth
    const target = base + offset
    if (Math.abs(target - track.scrollLeft) > 1) {
      track.scrollTo({ behavior: 'instant', left: target })
    }
  }, [copies, loops, setWidth])

  /*
   * Each change in the number of copies moves the middle one; put the reader back in it.
   * The first jump, from the far left, is invisible: every copy opens on the same story.
   */
  useLayoutEffect(() => {
    recentre()
  }, [recentre])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    /*
     * The jump waits for the scroll to come to rest: moving a scroller mid-swipe stalls the
     * gesture on iOS. A playing clip is never jumped away from — its copy would scroll off
     * with it, still talking — so the row simply waits until it is closed.
     */
    const settle = () => {
      pending.current = null
      if (playingIndex === null) recentre()
    }
    if ('onscrollend' in window) {
      track.addEventListener('scrollend', settle)
      return () => track.removeEventListener('scrollend', settle)
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(settle, 150)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      track.removeEventListener('scroll', onScroll)
    }
  }, [playingIndex, recentre])

  // Closing a clip is a scroll coming to rest as far as the loop is concerned.
  useEffect(() => {
    if (playingIndex === null) recentre()
  }, [playingIndex, recentre])

  /*
   * Step from where we are *going*, not from where we are: a reader pressing the arrow
   * twice in quick succession otherwise gets the same card twice, the second press landing
   * while the first smooth scroll is still on its way.
   */
  const nudge = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const from = pending.current ?? Math.round(track.scrollLeft / step) * step
    pending.current = from + direction * step
    track.scrollTo({ behavior: 'smooth', left: pending.current })
  }

  const light = tone === 'light'
  const items = Array.from({ length: copies }, () => stories).flat()

  const track = (
    <ul
      className={cn(
        'flex min-w-0 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        // Room for the cards' soft shadow, which the scroller would otherwise clip.
        light ? '-my-1 w-full max-w-[615.72px] py-1' : '-my-2 max-w-[1121.75px] grow py-2',
      )}
      ref={trackRef}
    >
      {items.map((story, i) => (
        <li
          className={cn('flex flex-none snap-start', !light && 'max-sm:snap-center')}
          // Padding rather than a flex gap, so each set ends with its gap and a jump of one
          // set lands exactly on a card.
          key={`${Math.floor(i / stories.length)}-${story.id ?? i}`}
          style={{ paddingRight: GAP[tone], width: step }}
        >
          <StoryCard
            index={i % stories.length}
            onPlayChange={(next) => play(next ? i : null)}
            playing={playingIndex === i}
            posterIncludesChrome={posterIncludesChrome}
            story={story}
            tone={tone}
          />
        </li>
      ))}
    </ul>
  )

  if (light) {
    /* Light tone — the product page's buy column (Figma 6216:3157): 32px arrows at 60%
       over the column edges, their centres 105px down the 214px cards. */
    const arrowClass =
      'absolute top-[89px] z-30 size-8 opacity-60 transition-opacity hover:opacity-80'

    return (
      <div className="relative flex flex-col items-center pb-4">
        {track}
        {loops &&
          ([-1, 1] as const).map((direction) => (
            <button
              aria-label={direction < 0 ? 'Previous stories' : 'Next stories'}
              className={cn(arrowClass, direction < 0 ? 'left-0' : 'right-0')}
              key={direction}
              onClick={() => nudge(direction)}
              type="button"
            >
              <img
                alt=""
                className="size-8"
                decoding="async"
                height={32}
                loading="lazy"
                src={`/icons/product-detail/carousel-${direction < 0 ? 'left' : 'right'}.svg`}
                width={32}
              />
            </button>
          ))}
      </div>
    )
  }

  /* Dark tone — the navy `videoStories` band (Figma 58:841 + carousel 6517:2023). The track
     caps at the comp's five cards and the 64px arrows sit 50px in from the 1400px container
     edges, `justify-between` taking up the slack. */
  const arrowClass = 'h-16 w-16 shrink-0 opacity-60 transition-opacity hover:opacity-80'

  return (
    <div className="relative flex items-center justify-between gap-3 xl:px-[50px]">
      {/* Mobile (6517:2035): 32px arrows at 60% on the content edges, 187.25px down the
          cards, up to `md` where the 64px pair takes over. */}
      {loops &&
        ([-1, 1] as const).map((direction) => (
          <button
            aria-label={direction < 0 ? 'Previous stories' : 'Next stories'}
            className={cn(
              'absolute top-[187.25px] z-30 size-8 opacity-60 transition-opacity hover:opacity-80 md:hidden',
              direction < 0 ? 'left-0' : 'right-0',
            )}
            key={direction}
            onClick={() => nudge(direction)}
            type="button"
          >
            <img
              alt=""
              className="block size-8"
              decoding="async"
              height={32}
              loading="lazy"
              src={`/icons/video-stories/carousel-${direction < 0 ? 'left' : 'right'}.svg`}
              width={32}
            />
          </button>
        ))}

      <button
        aria-label="Previous stories"
        className={cn(arrowClass, loops ? 'hidden md:block' : 'hidden')}
        onClick={() => nudge(-1)}
        type="button"
      >
        <img
          alt=""
          className="h-16 w-16"
          decoding="async"
          height={64}
          loading="lazy"
          src="/icons/video-stories/arrow-left.svg"
          width={64}
        />
      </button>

      {track}

      <button
        aria-label="Next stories"
        className={cn(arrowClass, loops ? 'hidden md:block' : 'hidden')}
        onClick={() => nudge(1)}
        type="button"
      >
        <img
          alt=""
          className="h-16 w-16"
          decoding="async"
          height={64}
          loading="lazy"
          src="/icons/video-stories/arrow-right.svg"
          width={64}
        />
      </button>
    </div>
  )
}
