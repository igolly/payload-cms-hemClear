'use client'
import React, { useState } from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Slide = NonNullable<Product['gallery']>[number]

export const Gallery: React.FC<{ badgeLabel?: string | null; slides: Slide[] }> = ({
  badgeLabel,
  slides,
}) => {
  const [active, setActive] = useState(0)
  const current = slides[active]

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#efeae4]">
        {current?.image && typeof current.image === 'object' ? (
          <Media fill imgClassName="object-cover" priority resource={current.image} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Product image
          </div>
        )}

        {badgeLabel && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand shadow">
            {badgeLabel}
          </span>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((slide, i) => (
              <li className="flex-none" key={slide.id ?? i}>
                <button
                  aria-current={i === active}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    'relative block h-16 w-20 overflow-hidden rounded-md border-2 bg-white',
                    i === active ? 'border-[#c0392b]' : 'border-[#dbe8fa]',
                  )}
                  onClick={() => setActive(i)}
                  type="button"
                >
                  {slide.image && typeof slide.image === 'object' && (
                    <Media fill imgClassName="object-cover" resource={slide.image} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  i === active ? 'bg-brand' : 'bg-[#c9dcf5]',
                )}
                key={slide.id ?? i}
                onClick={() => setActive(i)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
