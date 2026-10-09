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

/*
 * The navy band on a wide screen: five cards of one size, every one in full — no slices
 * cut off at the edges. The width is solved for that from the track's width (five slots of
 * card + gap), capped so a card never outgrows a laptop screen. The arrows sit in a gutter
 * either side of the track rather than over the outer cards.
 */
const VISIBLE = 5
const MAX_FEATURE_CARD = 260
/** Wider than this the row stops growing and centres. */
const MAX_FEATURE_ROW = VISIBLE * (MAX_FEATURE_CARD + GAP.dark)
/** The gutter each side of the track that holds an arrow, in px (`lg:px-16`). */
const ARROW_GUTTER = 64
// Floored to the hundredth so five slots never come out a hair wider than the track.
const featureCardWidth = (trackWidth: number) =>
  Math.floor(Math.min(MAX_FEATURE_CARD, trackWidth / VISIBLE - GAP.dark) * 100) / 100

/** How long each card holds before the row steps on by itself, in ms. */
const AUTO_STEP_MS = 3500
/** How long the row stays still after the visitor swipes, scrolls or presses an arrow. */
const IDLE_AFTER_TOUCH_MS = 6000
/** How long an arrow's target is trusted before stepping from the real position again. */
const PENDING_MS = 900

/**
 * An endless, self-advancing scroll-snap carousel — no carousel library. The track is a
 * native horizontal scroller carrying several copies of the stories; whenever a scroll
 * comes to rest it is jumped, without animation, back into the middle copy by a whole
 * number of sets. The jump lands on an identical frame, so the row never reaches an end
 * in either direction.
 *
 * It steps on one card every few seconds by itself, and holds still while the pointer is
 * over it, for a while after the visitor moves it, while a clip plays, while it is off
 * screen, and for anyone who has asked their system for reduced motion.
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
   * before the scroll comes to rest. It loops even when the stories would fit the row, so
   * the row always has somewhere to go; only a single story stays put.
   */
  const [copies, setCopies] = useState(1)
  /**
   * The scroll position the arrows last asked for, held until the scroll comes to rest —
   * and only briefly: a scroll that never moved fires no `scrollend`, and a target left
   * standing would make every later press step from somewhere the row is not.
   */
  const pending = useRef<null | { at: number; left: number }>(null)
  /** When the visitor last moved the row themselves; the auto-step waits after it. */
  const touchedAt = useRef(0)
  const [hovered, setHovered] = useState(false)
  /** The dark band's card width, which grows to the five-across size on a wide screen. */
  const [cardWidth, setCardWidth] = useState<number>(CARD[tone])
  /** Whether the row has been opened on its first five stories yet. */
  const opened = useRef(false)

  const light = tone === 'light'
  const step = cardWidth + GAP[tone]
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
      if (!light) {
        const wide = window.matchMedia('(min-width: 1024px)').matches
        setCardWidth(wide ? featureCardWidth(width) : CARD.dark)
      }
      if (stories.length < 2) return setCopies(1)
      const side = Math.max(2, Math.ceil((2 * width) / setWidth))
      setCopies(side * 2 + 1)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(track)
    return () => observer.disconnect()
  }, [light, setWidth, stories.length])

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
    const track = trackRef.current
    /*
     * The navy band snaps cards to its centre, so it opens with the third story there: the
     * first five in full across a wide screen.
     */
    if (track && loops && !light && !opened.current) {
      opened.current = true
      const base = Math.floor(copies / 2) * setWidth
      track.scrollTo({ behavior: 'instant', left: base + 2.5 * step - track.clientWidth / 2 })
      return
    }
    recentre()
  }, [copies, light, loops, recentre, setWidth, step])

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
      if (playingIndex === null) return recentre()
      // A clip scrolled out of sight stops, so the row is free to loop again.
      const left = playingIndex * step
      if (left + step < track.scrollLeft || left > track.scrollLeft + track.clientWidth) {
        setPlayingIndex(null)
      }
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
  }, [playingIndex, recentre, step])

  // Closing a clip is a scroll coming to rest as far as the loop is concerned.
  useEffect(() => {
    if (playingIndex === null) recentre()
  }, [playingIndex, recentre])

  /*
   * Step from where we are *going*, not from where we are: a reader pressing the arrow
   * twice in quick succession otherwise gets the same card twice, the second press landing
   * while the first smooth scroll is still on its way.
   */
  const nudge = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current
      if (!track) return
      const now = Date.now()
      const fresh = pending.current && now - pending.current.at < PENDING_MS
      const from = fresh && pending.current ? pending.current.left : track.scrollLeft
      let left = from + direction * step
      /*
       * Rapid presses can outrun the copies before any scroll comes to rest to recentre.
       * Near either end, jump back by whole sets first — an identical frame — then go on.
       */
      const max = track.scrollWidth - track.clientWidth
      if (loops && (left > max - step || left < step)) {
        const middle = Math.floor(copies / 2) * setWidth + setWidth / 2
        const shift = -Math.round((left - middle) / setWidth) * setWidth
        track.scrollTo({ behavior: 'instant', left: track.scrollLeft + shift })
        left += shift
      }
      pending.current = { at: now, left }
      track.scrollTo({ behavior: 'smooth', left })
    },
    [copies, loops, setWidth, step],
  )

  /** An arrow press: the visitor's own move, which also ends any clip it carries away. */
  const press = (direction: -1 | 1) => {
    touchedAt.current = Date.now()
    if (playingIndex !== null) setPlayingIndex(null)
    nudge(direction)
  }

  // Swipes, wheel and keyboard scrolling count as the visitor's own moves too.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const touched = () => {
      touchedAt.current = Date.now()
    }
    const events = ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const
    events.forEach((e) => track.addEventListener(e, touched, { passive: true }))
    return () => events.forEach((e) => track.removeEventListener(e, touched))
  }, [])

  /*
   * The auto-step. A timer rather than a continuous drift, so every stop is a card snapped
   * into place and the snap points keep working for the visitor's own swipes.
   */
  useEffect(() => {
    if (!loops || hovered || playingIndex !== null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = trackRef.current
    if (!track) return

    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(track)

    const timer = setInterval(() => {
      if (!visible || document.hidden) return
      if (Date.now() - touchedAt.current < IDLE_AFTER_TOUCH_MS) return
      nudge(1)
    }, AUTO_STEP_MS)

    return () => {
      clearInterval(timer)
      observer.disconnect()
    }
  }, [hovered, loops, nudge, playingIndex])

  const items = Array.from({ length: copies }, () => stories).flat()

  const track = (
    <ul
      className={cn(
        'flex min-w-0 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        // Room for the cards' soft shadow, which the scroller would otherwise clip.
        light ? '-my-1 w-full max-w-[615.72px] py-1' : '-my-2 w-full py-2',
      )}
      ref={trackRef}
    >
      {items.map((story, i) => (
        <li
          className={cn('flex flex-none', light ? 'snap-start' : 'snap-center')}
          // Padding rather than a flex gap, so each set ends with its gap and a jump of one
          // set lands exactly on a card. The navy band splits it either side, so a card's
          // centre is its slot's centre and centre-snapping lines the row up evenly.
          key={`${Math.floor(i / stories.length)}-${story.id ?? i}`}
          style={
            light
              ? { paddingRight: GAP.light, width: step }
              : { paddingInline: GAP.dark / 2, width: step }
          }
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
      <div
        className="relative flex flex-col items-center pb-4"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {track}
        {loops &&
          ([-1, 1] as const).map((direction) => (
            <button
              aria-label={direction < 0 ? 'Previous stories' : 'Next stories'}
              className={cn(arrowClass, direction < 0 ? 'left-0' : 'right-0')}
              key={direction}
              onClick={() => press(direction)}
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

  /* Dark tone — the navy `videoStories` band. On a wide screen five cards sit in full and
     the arrows have a gutter of their own either side; narrower, the arrows sit over the
     edges of the row, half-way down the cards. */
  return (
    <div
      className="relative mx-auto lg:px-16"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ maxWidth: MAX_FEATURE_ROW + 2 * ARROW_GUTTER }}
    >
      {track}
      {loops &&
        ([-1, 1] as const).map((direction) => (
          <button
            aria-label={direction < 0 ? 'Previous stories' : 'Next stories'}
            className={cn(
              'absolute top-1/2 z-30 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100',
              direction < 0 ? 'left-1 md:left-3 lg:left-0' : 'right-1 md:right-3 lg:right-0',
            )}
            key={direction}
            onClick={() => press(direction)}
            type="button"
          >
            <img
              alt=""
              className="block size-8 md:hidden"
              decoding="async"
              height={32}
              loading="lazy"
              src={`/icons/video-stories/carousel-${direction < 0 ? 'left' : 'right'}.svg`}
              width={32}
            />
            <img
              alt=""
              className="hidden size-14 md:block"
              decoding="async"
              height={64}
              loading="lazy"
              src={`/icons/video-stories/arrow-${direction < 0 ? 'left' : 'right'}.svg`}
              width={64}
            />
          </button>
        ))}
    </div>
  )
}
