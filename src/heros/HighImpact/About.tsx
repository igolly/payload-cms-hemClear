import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

/**
 * The About comp's hero (Figma ABOUT HERO, 2002:75): no band colour of its own, a 1063px
 * group centred on the page — a 500px copy column beside the 563×535 photo, which sets the
 * band's height — with the copy block 29px from the top (the comp centres it; for the comp's
 * copy that is the same pixel, and a longer copy then grows the band instead of overflowing).
 * The copy is a ruled list of what the page covers and a pale callout card, instead of the
 * home hero's badge, CTAs and trust row.
 *
 * Vertical rhythm is set margin by margin rather than with one gap: the comp's parts use
 * different line boxes, and these offsets reproduce its glyph positions at 1440+.
 */
export const AboutHero: React.FC<Page['hero']> = ({
  benefits,
  calloutIcon,
  calloutText,
  calloutTitle,
  description,
  eyebrow,
  heading,
  media,
  mediaPosition,
  subheading,
}) => {
  const hasMedia = media && typeof media === 'object'
  const mediaLeft = mediaPosition === 'left'

  /*
   * The band is tinted rather than white: the header above it is white, so a white hero ran
   * straight into it and the page opened with no edge between the two.
   */
  return (
    <section className="w-full bg-mist-50 px-4 font-inter sm:px-6 [&_sup]:leading-[0]">
      <div className="mx-auto grid w-full max-w-[1063px] grid-cols-1 lg:grid-cols-[minmax(0,500fr)_minmax(0,563fr)]">
        <div
          className={cn(
            // Centred on a phone, where a single narrow column reads better ranged to the
            // middle; from `sm` it returns to the comp's left-ranged column.
            'flex min-w-0 flex-col items-center justify-center py-5 text-center sm:items-start sm:py-[30px] sm:text-left lg:justify-start lg:pb-[30px] lg:pt-[29px]',
            mediaLeft && 'lg:order-2 lg:pl-8',
          )}
        >
          {eyebrow && (
            <p
              className="text-[17.5px] font-semibold uppercase leading-[17.5px] text-navy sm:leading-[normal]"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {heading && (
            <h1
              className="mt-[12.5px] font-marcellus text-[57.5px] leading-[59.375px] text-brand-500 sm:mt-1.5 sm:leading-[72px]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h1>
          )}

          {/* The comp's short rule under the headline. */}
          <span
            aria-hidden="true"
            className="mt-[12.5px] block h-[3.125px] w-[62.5px] rounded-full bg-brand-600 sm:mt-1 sm:h-[3.5px] sm:w-16"
          />

          {subheading && (
            <p
              className="mt-[12.5px] text-[18.75px] font-semibold leading-[23.75px] text-brand-300 sm:mt-[11.5px] sm:leading-[normal]"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}

          {description && (
            <p
              className="mt-[12.5px] w-full whitespace-pre-line text-[13.75px] leading-5 text-black sm:mt-[13.25px]"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {/* A 26px icon disc beside each line; a pale rule under every line but the last. */}
          {Array.isArray(benefits) && benefits.length > 0 && (
            <ul className="mt-[12.5px] flex w-full max-w-[412.5px] flex-col gap-0 text-left sm:mt-[15.5px] sm:gap-[3.125px]">
              {benefits.map((benefit, i) => (
                <li
                  className="flex items-center gap-[12.5px]"
                  data-payload-subpath={`benefits.${i}.text`}
                  key={benefit.id ?? i}
                >
                  <span className="-mt-1 block size-[26px] shrink-0">
                    {benefit.icon && typeof benefit.icon === 'object' ? (
                      // `htmlElement={null}` so `Media` emits its `<picture>` bare — its
                      // default `<div>` wrapper is not valid inside a span.
                      <Media
                        htmlElement={null}
                        imgClassName="size-[26px] object-contain"
                        resource={benefit.icon}
                      />
                    ) : (
                      <span className="block size-[26px] rounded-full bg-brand-600" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'flex min-h-[33.75px] min-w-0 flex-1 items-center py-[9.375px] text-[15px] leading-[15px] text-brand-600 sm:min-h-[30.625px] sm:py-1 sm:leading-[normal]',
                      i < benefits.length - 1 && 'border-b-[0.625px] border-tint-50',
                    )}
                  >
                    {/* Its own span: as direct flex items, the text and a ® `<sup>` would be
                        split apart and lose the space between them. */}
                    <span>{marks(benefit.text)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {(calloutTitle || calloutText) && (
            <div className="mt-[12.5px] flex min-h-[100px] w-full max-w-[412.5px] items-center gap-[18.75px] rounded-[15.625px] bg-tint-50 p-[18.75px] text-left sm:mt-[11.5px] sm:rounded-[12.5px] sm:px-[18.75px] sm:py-3">
              {calloutIcon && typeof calloutIcon === 'object' && (
                <span className="block size-[62.5px] shrink-0">
                  <Media
                    htmlElement={null}
                    imgClassName="size-[62.5px] object-contain"
                    resource={calloutIcon}
                  />
                </span>
              )}
              <span className="min-w-0 text-brand-600">
                {calloutTitle && (
                  <span
                    className="block text-[13.75px] font-bold leading-[normal]"
                    data-payload-subpath="calloutTitle"
                  >
                    {marks(calloutTitle)}
                  </span>
                )}
                {calloutText && (
                  <span
                    className="mt-[3.125px] block text-[12.5px] leading-[17.5px] sm:mt-[5.75px] sm:leading-[18px]"
                    data-payload-subpath="calloutText"
                  >
                    {marks(calloutText)}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* The photo's own 563:535 box sets the band height beside the copy; stacked, it
            follows the copy at up to its comp width. */}
        <div
          className={cn(
            'relative mx-auto aspect-[563/535] w-full max-w-[563px] self-center overflow-hidden',
            !hasMedia && 'bg-slate-100',
            mediaLeft && 'lg:order-1',
          )}
          data-payload-subpath="media"
        >
          {hasMedia && (
            <Media
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
              pictureClassName="block h-full w-full"
              priority
              resource={media}
            />
          )}
        </div>
      </div>
    </section>
  )
}
