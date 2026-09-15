'use client'
/* eslint-disable @next/next/no-img-element -- static design-system artwork, nothing to optimise */
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { BenefitsCarouselBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { multiline } from '@/utilities/marks'

type Item = NonNullable<BenefitsCarouselBlock['items']>[number]

/** Badge glyphs drawn for this section in the Figma comp (`benefit-icon1…5`). */
const badges: Record<NonNullable<Item['badge']>, string> = {
  circulation: '/icons/benefits/circulation.png',
  internalExternal: '/icons/benefits/internal-external.png',
  regularity: '/icons/benefits/regularity.png',
  soothing: '/icons/benefits/soothing.png',
  vein: '/icons/benefits/vein.png',
}

/**
 * The revealed copy, as the comp sets it: paragraphs split on a blank line in the textarea.
 *
 * On the Puck canvas an inline-editable field arrives as an element rather than a string,
 * which has nothing to split — print it as it comes.
 */
const paragraphs = (value: Item['details']): React.ReactNode =>
  typeof value !== 'string'
    ? value
    : value.split(/\n{2,}/).map((para, i) => (
        <p className={i > 0 ? 'mt-3' : undefined} key={i}>
          {multiline(para)}
        </p>
      ))

/**
 * Room around the scroller for what overflows a card — its 6.25px shadow and the plus
 * button hanging half below it — since a horizontal scroller clips on both axes. Taken
 * back with negative margins so the cards still sit where the comp puts them.
 */
const BLEED = 'px-2 pt-2 pb-5 -mx-2 -mt-2 -mb-5 scroll-px-2'

export const Cards: React.FC<{ items: Item[] }> = ({ items }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const target = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  const stepOf = (track: HTMLUListElement) => {
    const [a, b] = Array.from(track.children) as HTMLElement[]
    return a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? 1)
  }

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { clientWidth, scrollLeft, scrollWidth } = track
    const end = scrollLeft + clientWidth >= scrollWidth - 1
    const index = Math.round(scrollLeft / stepOf(track))

    // Once the track hits its end the last few cards cannot scroll any further left, so a
    // dot clicked past that point stays lit rather than snapping back to the reachable one.
    setActive(end && target.current !== null ? Math.max(index, target.current) : index)
    setAtStart(scrollLeft <= 1)
    setAtEnd(end)
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
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    target.current = clamped
    setActive(clamped)
    track.scrollTo({ behavior: 'smooth', left: stepOf(track) * clamped })
  }

  /* Desktop: 64px arrows 50px inside the track. Mobile (6809:287): 32px arrows on the
     content edges, 163px below the top of the cards. */
  const arrow =
    'absolute top-[167.37px] z-10 hidden size-16 opacity-60 transition-opacity hover:opacity-100 disabled:pointer-events-none max-sm:top-[163px] max-sm:block max-sm:size-8 min-[1320px]:block'

  return (
    <div className="relative flex w-full flex-col items-center gap-[10px] max-sm:gap-[30px]">
      <button
        aria-label="Previous benefits"
        className={cn(arrow, 'left-[50px] max-sm:left-0')}
        disabled={atStart}
        onClick={() => scrollToIndex(active - 1)}
        type="button"
      >
        <img
          alt=""
          className="max-sm:hidden"
          height={64}
          src="/icons/benefits/arrow-left.svg"
          width={64}
        />
        <img
          alt=""
          className="block size-8 sm:hidden"
          height={32}
          src="/icons/benefits/carousel-left.svg"
          width={32}
        />
      </button>

      <ul
        className={cn(
          'flex w-[calc(100%+1rem)] max-w-[calc(1113.75px+1rem)] snap-x snap-mandatory gap-[17.5px] overflow-x-auto scroll-smooth text-left [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          BLEED,
        )}
        ref={trackRef}
      >
        {items.map((item, i) => {
          const key = String(item.id ?? i)
          const isOpen = open === key
          const badge = item.badge ? badges[item.badge] : undefined

          return (
            <li
              className="w-[208.75px] flex-none snap-start max-sm:w-[min(194px,calc((100%-17.5px)/2))]"
              key={key}
            >
              <div
                className="relative h-[395px] rounded-[18.75px] bg-mist-100 shadow-[0_0_6.25px_rgba(0,0,0,0.15)]"
                data-payload-subpath={`items.${i}.title`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[18.75px]">
                  {item.image && typeof item.image === 'object' && (
                    <Media fill imgClassName="object-cover" resource={item.image} />
                  )}
                </div>

                {/* The white panel sits over the photo, so it can grow upward when details open. */}
                {/*
                 * The panel is anchored to the bottom of the card, so growing its content
                 * pushes its top edge up over the photo — and carries the badge, which is
                 * pinned to that edge, along with it. `max-h` keeps a strip of the photo
                 * visible however long the copy runs.
                 */}
                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 flex max-h-[calc(100%-50px)] min-h-[156.25px] flex-col items-center justify-center gap-[6.25px] rounded-[18.75px] bg-white px-[25.63px] pb-[17.5px] text-center max-sm:px-[13.2%]',
                    'transition-[padding-top] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                    /* Closed, the copy is centred and clears the half-badge on its own.
                       Open, it starts at the panel's top edge, so the padding has to step
                       up to the badge's radius — transitioned, so it grows with the panel
                       rather than jumping at the start of it. */
                    isOpen ? 'pt-[46px]' : 'pt-[17.5px]',
                  )}
                >
                  <span className="absolute left-1/2 top-0 flex size-[72.5px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-[0.63px] border-brand-300 bg-white text-brand-300 [&>span>svg]:size-9">
                    {badge ? (
                      <img alt="" className="size-9" height={36} src={badge} width={36} />
                    ) : (
                      <BrandIcon name={item.icon} />
                    )}
                  </span>

                  <h3 className="font-fraunces text-lg font-normal leading-[22px] text-info-dark [&_sup]:leading-[0]">
                    {multiline(item.title)}
                  </h3>

                  {item.details && (
                    /*
                     * `grid-template-rows: 0fr → 1fr` is what makes this animate at all:
                     * height alone cannot transition to `auto`, and measuring the copy in
                     * JS would fight the carousel's own scrolling. The row collapses to
                     * nothing when closed, so the card keeps its resting height.
                     */
                    <div
                      className={cn(
                        'grid w-full min-h-0 transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      )}
                    >
                      <div
                        className={cn(
                          'min-h-0',
                          /* Scrollable only as a safety net for copy longer than the
                             card, and never with a visible bar — the same treatment the
                             carousel track above gets. */
                          isOpen
                            ? 'overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                            : 'overflow-hidden',
                        )}
                      >
                        <div
                          className={cn(
                            'text-sm leading-snug text-steel-600 transition-opacity duration-300 motion-reduce:transition-none',
                            isOpen ? 'opacity-100 delay-100' : 'opacity-0',
                          )}
                          data-payload-subpath={`items.${i}.details`}
                        >
                          {paragraphs(item.details)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hangs half below the card's bottom edge, as in the design. */}
                {item.details && (
                  <button
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Hide' : 'Show'} more about ${item.title}`}
                    className="absolute bottom-0 left-1/2 size-[30px] -translate-x-1/2 translate-y-1/2 rounded-full"
                    onClick={() => setOpen(isOpen ? null : key)}
                    type="button"
                  >
                    {/*
                     * Drawn rather than swapped between two exported SVGs so the vertical
                     * bar can retract into the horizontal one as the panel opens. Bar
                     * thickness and length are `plus.svg`'s own, scaled from its 32px
                     * artboard to this 30px button.
                     */}
                    <span className="flex size-[30px] items-center justify-center rounded-full bg-brand-600">
                      <span className="relative block size-[13.6px]">
                        <span className="absolute inset-x-0 top-1/2 h-[3.44px] -translate-y-1/2 rounded-[1px] bg-white" />
                        <span
                          className={cn(
                            'absolute inset-y-0 left-1/2 w-[3.44px] -translate-x-1/2 rounded-[1px] bg-white transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                            isOpen && 'scale-y-0',
                          )}
                        />
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <button
        aria-label="Next benefits"
        className={cn(arrow, 'right-[50px] max-sm:right-0')}
        disabled={atEnd}
        onClick={() => scrollToIndex(active + 1)}
        type="button"
      >
        <img
          alt=""
          className="max-sm:hidden"
          height={64}
          src="/icons/benefits/arrow-right.svg"
          width={64}
        />
        <img
          alt=""
          className="block size-8 sm:hidden"
          height={32}
          src="/icons/benefits/carousel-right.svg"
          width={32}
        />
      </button>

      {items.length > 1 && (
        <div className="flex items-start justify-center gap-[10px] py-[10px]">
          {items.map((item, i) => (
            <button
              aria-current={i === active}
              aria-label={`Go to benefit ${i + 1}`}
              className={cn(
                'size-3 rounded-full transition-colors max-sm:size-2',
                i === active ? 'bg-brand-600' : 'bg-white hover:bg-tint-100',
              )}
              key={item.id ?? i}
              onClick={() => scrollToIndex(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
