'use client'
import React, { useRef, useState } from 'react'

import type { ReviewsBlock } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Stars } from './Stars'
import { marks } from '@/utilities/marks'

type Review = NonNullable<ReviewsBlock['reviews']>[number]

type Props = {
  /** Server-rendered trust strip. When present the grid starts fully collapsed behind it. */
  features?: React.ReactNode
  initialCount?: number | null
  reviews: Review[]
  showLessLabel?: string | null
  showMoreLabel?: string | null
  showMoreStep?: number | null
  verifiedLabel?: string | null
}

/**
 * The show-more part of the section (Figma TESTIMONI → TESTIMONI 2/3/4).
 *
 * - Collapsed: the trust strip (if any), no customer reviews.
 * - First "Show More": the strip gives way to the first `initialCount` reviews.
 * - Each further click reveals `showMoreStep` more (all, when unset), until "Show Less".
 *
 * Every reveal is its own batch: a 4-column wrap from `xl`, a swipeable row below it — the
 * mobile frames show each batch as one horizontally clipped row of 264px cards.
 */
export const ReviewGrid: React.FC<Props> = ({
  features,
  initialCount,
  reviews,
  showLessLabel,
  showMoreLabel,
  showMoreStep,
  verifiedLabel,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const total = reviews.length
  const limit = Math.max(1, initialCount ?? 4)
  const step = Math.max(1, showMoreStep ?? total)
  const start = features ? 0 : Math.min(limit, total)
  const [visible, setVisible] = useState(start)

  const hasMore = total > start
  const full = visible >= total

  const batches: Review[][] = []
  for (let from = 0; from < visible;) {
    const size = from === 0 ? limit : step
    batches.push(reviews.slice(from, Math.min(visible, from + size)))
    from += size
  }

  const toggle = () => {
    if (!full) {
      setVisible((v) => Math.min(total, v === 0 ? limit : v + step))
      return
    }
    setVisible(start)
    // Collapsing removes rows above the button; bring the section back into view if it left.
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) rootRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div ref={rootRef}>
      {features && visible === 0 && <div className="mt-[12.5px] xl:mt-[18px]">{features}</div>}

      {batches.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-4 xl:mt-[18px] xl:gap-[15.5px]">
          {batches.map((batch, b) => (
            <ul
              className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-[14px] overflow-x-auto px-4 py-1 [-ms-overflow-style:none] [scrollbar-width:none] xl:mx-auto xl:grid xl:w-[1115.75px] xl:grid-cols-[repeat(4,266px)] xl:justify-between xl:gap-y-[15.5px] xl:overflow-visible xl:p-0 [&::-webkit-scrollbar]:hidden"
              key={b}
            >
              {batch.map((review) => {
                const i = reviews.indexOf(review)
                return (
                  <li
                    className="flex min-h-[322px] w-[266px] shrink-0 snap-start flex-col justify-between gap-3 rounded-[18.75px] border border-ash-200 bg-white p-4 shadow-[0_0_6.25px_rgba(0,0,0,0.15)]"
                    data-payload-subpath={`reviews.${i}.title`}
                    data-review-card
                    key={review.id ?? i}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex h-[29px] items-center">
                        <Stars
                          className="text-navy"
                          count={review.stars}
                          gap="gap-0"
                          size="size-6"
                        />
                      </div>

                      {review.verified && (
                        <p
                          className="flex h-[22px] items-center gap-2 text-[16px] font-medium leading-[19px] text-brand-600"
                          data-payload-subpath={`reviews.${i}.verified`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- 44px crop, nothing to optimise; decorative next to its label */}
                          <img
                            alt=""
                            className="size-[22px] shrink-0"
                            height={22}
                            src="/icons/reviews/verified.png"
                            width={22}
                          />
                          {verifiedLabel || 'Verified Purchase'}
                        </p>
                      )}

                      <h3
                        className="font-playfair text-[18px] font-bold leading-[normal] text-navy"
                        data-payload-subpath={`reviews.${i}.title`}
                      >
                        &ldquo;{review.title}&rdquo;
                      </h3>

                      <p
                        className="whitespace-pre-line text-[16px] font-medium leading-[19px] text-navy"
                        data-payload-subpath={`reviews.${i}.quote`}
                      >
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </div>

                    <p
                      className="text-[16px] font-bold leading-[19px] text-navy"
                      data-payload-subpath={`reviews.${i}.author`}
                    >
                      {marks(review.author)}
                    </p>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-2.5 flex justify-center xl:mt-[18px]">
          <button
            aria-expanded={full}
            className="flex h-[50px] w-[280px] items-center justify-center gap-5 rounded-lg border-[0.63px] border-navy bg-white p-1.5 text-[18px] font-medium uppercase leading-[normal] text-navy transition-colors hover:bg-mist"
            onClick={toggle}
            type="button"
          >
            {full ? showLessLabel || 'Show Less' : showMoreLabel || 'Show More'}
            {/* eslint-disable-next-line @next/next/no-img-element -- 40px crop, nothing to optimise */}
            <img
              alt=""
              className={cn('size-5 transition-transform', full && 'rotate-180')}
              height={20}
              src="/icons/reviews/arrow-down.png"
              width={20}
            />
          </button>
        </div>
      )}
    </div>
  )
}
