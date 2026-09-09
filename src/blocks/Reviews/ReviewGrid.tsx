'use client'
import React, { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import type { ReviewsBlock } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Stars } from './Stars'
import { marks } from '@/utilities/marks'

type Review = NonNullable<ReviewsBlock['reviews']>[number]

type Props = {
  initialCount?: number | null
  reviews: Review[]
  showLessLabel?: string | null
  showMoreLabel?: string | null
  verifiedLabel?: string | null
}

export const ReviewGrid: React.FC<Props> = ({
  initialCount,
  reviews,
  showLessLabel,
  showMoreLabel,
  verifiedLabel,
}) => {
  const [expanded, setExpanded] = useState(false)

  const limit = Math.max(1, initialCount ?? 4)
  const hasMore = reviews.length > limit
  const visible = expanded || !hasMore ? reviews : reviews.slice(0, limit)

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((review, i) => (
          <li
            className="flex flex-col rounded-xl border border-[#e7e7e7] bg-white p-5"
            data-payload-subpath={`reviews.${i}.title`}
            key={review.id ?? i}
          >
            <Stars className="text-brand" count={review.stars} />

            {review.verified && (
              <p
                className="mt-3 flex items-center gap-2 text-sm font-medium text-brand"
                data-payload-subpath={`reviews.${i}.verified`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {verifiedLabel || 'Verified Purchase'}
              </p>
            )}

            <h3
              className="mt-4 font-serif text-base font-bold leading-snug text-subheading"
              data-payload-subpath={`reviews.${i}.title`}
            >
              &ldquo;{review.title}&rdquo;
            </h3>

            <p
              className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand"
              data-payload-subpath={`reviews.${i}.quote`}
            >
              &ldquo;{review.quote}&rdquo;
            </p>

            <p
              className="mt-auto pt-6 text-sm font-bold text-brand"
              data-payload-subpath={`reviews.${i}.author`}
            >
              {marks(review.author)}
            </p>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            aria-expanded={expanded}
            className="inline-flex items-center gap-3 rounded-lg border border-[#e7e7e7] bg-white px-10 py-3 text-sm font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-slate-50"
            onClick={() => setExpanded((value) => !value)}
            type="button"
          >
            {expanded ? showLessLabel || 'Show Less' : showMoreLabel || 'Show More'}
            <ChevronDown
              aria-hidden="true"
              className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            />
          </button>
        </div>
      )}
    </div>
  )
}
