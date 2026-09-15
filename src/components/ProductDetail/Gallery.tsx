'use client'
/* eslint-disable @next/next/no-img-element -- static design-system artwork, nothing to optimise */
import React, { useState } from 'react'

import type { ProductDetailBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

type Slide = NonNullable<ProductDetailBlock['gallery']>[number]

/**
 * Figma 6187:1974 (PRODUCT LEFT): a 675px square slide with a 40px radius, a strip of six
 * 100px thumbnails 15px apart (10px above and below), then 12px dots 10px apart.
 *
 * The overlay copy on a slide is sized in container units off the comp's 675px square
 * (1cqw = 6.75px there), so it scales with the photo like the baked-in copy on the other
 * slides does instead of reflowing over the product shot on a phone.
 */
export const Gallery: React.FC<{ badgeLabel?: string | null; slides: Slide[] }> = ({
  badgeLabel,
  slides,
}) => {
  const [active, setActive] = useState(0)
  const current = slides[active]
  const hasOverlay = Boolean(
    current && (current.overlayEyebrow || current.overlayHeading || current.overlayText),
  )

  return (
    <div className="font-inter">
      <div className="@container relative aspect-square w-full overflow-hidden rounded-[5.926%] bg-shell">
        {current?.image && typeof current.image === 'object' ? (
          <Media
            className="absolute inset-0"
            pictureClassName="absolute inset-0"
            fill
            imgClassName="object-cover"
            priority
            resource={current.image}
            size="(min-width: 1024px) 675px, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-steel-400">
            Product image
          </div>
        )}

        {(hasOverlay || current?.overlayTestedBadge) && (
          /* Figma 6187:1976: 50px padding, the copy block at the top and the seal at the
             bottom (space-between). */
          <div className="absolute inset-0 flex flex-col justify-between p-[7.407cqw] text-navy [&_sup]:leading-[0]">
            <div className="flex w-[44.44cqw] flex-col items-start gap-[2.963cqw]">
              {hasOverlay && badgeLabel && (
                /* Figma 6191:2011: a 316x48 white pill, square bottom-left corner with a
                   6px tail beneath it, speech-bubble glyph then the label. */
                <span className="relative flex h-[7.111cqw] w-[46.81cqw] items-center gap-[1.333cqw] rounded-[2.37cqw] rounded-bl-none bg-white pl-[1.48cqw] pr-[2cqw]">
                  <img
                    alt=""
                    className="h-[5.333cqw] w-[7.407cqw] shrink-0"
                    height={36}
                    src="/icons/product-detail/reviews-bubble.png"
                    width={52}
                  />
                  <span className="whitespace-nowrap text-[2.519cqw] font-bold uppercase leading-none">
                    {marks(badgeLabel)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-full h-[0.889cqw] w-[1.481cqw] bg-white [clip-path:polygon(0_0,100%_0,0_100%)]"
                  />
                </span>
              )}

              {current?.overlayEyebrow && (
                <p className="text-[2.074cqw] font-bold uppercase leading-[1.21]">
                  {marks(current.overlayEyebrow)}
                </p>
              )}

              {current?.overlayHeading && (
                <p className="w-[42.96cqw] font-marcellus text-[5.926cqw] leading-[6.519cqw] text-brand-600">
                  {multiline(current.overlayHeading)}
                </p>
              )}

              {current?.overlayText && (
                <p className="text-[2.074cqw] font-medium leading-[1.21]">
                  {multiline(current.overlayText)}
                </p>
              )}
            </div>

            {current?.overlayTestedBadge && (
              /* Figma 6193:2013: the 90x120 "3rd-party tested" seal. */
              <img
                alt="3rd-party tested"
                className="h-[17.78cqw] w-[13.33cqw]"
                height={120}
                src="/icons/product-detail/third-party-tested.png"
                width={90}
              />
            )}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          {/* Figma 6220:3630: 100px thumbnails (14.81% of 675), 15px (2.22%) apart. */}
          <ul className="flex gap-[2.222%] py-2.5">
            {slides.map((slide, i) => {
              const thumb =
                slide.thumbnail && typeof slide.thumbnail === 'object'
                  ? slide.thumbnail
                  : slide.image

              return (
                <li className="w-[14.815%] flex-none" key={slide.id ?? i}>
                  <button
                    aria-current={i === active}
                    aria-label={`Show image ${i + 1}`}
                    className={cn(
                      'relative block aspect-square w-full overflow-hidden rounded-[5px] border bg-white',
                      i === active ? 'border-danger-bright' : 'border-ash-100',
                    )}
                    onClick={() => setActive(i)}
                    type="button"
                  >
                    {thumb && typeof thumb === 'object' && (
                      <Media
                        className="absolute inset-0"
                        pictureClassName="absolute inset-0"
                        fill
                        imgClassName="object-cover"
                        resource={thumb}
                        size="100px"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center justify-center gap-2.5 py-2.5">
            {slides.map((slide, i) => (
              <button
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'size-3 rounded-full transition-colors',
                  i === active ? 'bg-brand-600' : 'bg-ash-250 hover:bg-steel-300',
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
