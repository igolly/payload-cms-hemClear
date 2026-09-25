import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

/**
 * The Why comp's hero (Figma WHY HERO, 2003:348): the photo is not a half of the band but a
 * single 1200×582 picture centred on a #f7f8fa page, with the copy laid over its left third
 * inside a 625px column (50px side padding, 525px of text). The photo already fades to the
 * page colour on its left, so there is no panel or scrim behind the copy.
 *
 * Below `xl` the 1200px picture no longer clears the copy column — the bottles sit right
 * behind the text — so the two stack: the picture keeps its own box above a full-width copy
 * column, the same retreat the split hero makes.
 */
const icons = {
  arrowOutline: '/icons/hero/arrow-color.svg',
  arrowSolid: '/icons/hero/arrow-white.svg',
}

export const WhyHero: React.FC<Page['hero']> = ({
  description,
  eyebrow,
  heading,
  links,
  media,
  subheading,
  trustPoints,
}) => {
  const hasMedia = media && typeof media === 'object'

  return (
    <section className="w-full bg-[#f7f8fa] font-inter [&_sup]:leading-[0]">
      <div className="mx-auto w-full max-w-[1200px] xl:relative xl:min-h-[581.875px]">
        {/* Picture. Stacked it sets its own 1200:582 box, anchored right because the photo
            keeps its subject in its right half — a phone's taller crop throws away the empty
            left rather than the couple; from `xl` it is laid over the whole band and the
            copy sits on top of it. */}
        {hasMedia && (
          <div
            className="relative aspect-[440/330] w-full overflow-hidden sm:aspect-[1200/582] xl:absolute xl:inset-0 xl:aspect-auto"
            data-payload-subpath="media"
          >
            <Media
              // `Media` wraps its <picture> in a div of its own; without a height here that
              // div collapses to content height and `h-full` below resolves against nothing.
              className="h-full w-full"
              imgClassName="h-full w-full object-cover object-right xl:object-center"
              pictureClassName="block h-full w-full"
              priority
              resource={media}
            />
          </div>
        )}

        {/* Copy column: 625px wide with 50px sides in the comp, centred in the band. */}
        <div
          className={cn(
            /* 16px sides and no band padding of its own on a phone: the comp's photo sits
               behind the copy rather than above it, and the buttons carry their own
               12.5px. */
            // Ranged left at every width, as the About hero is: the eyebrow, the headline
            // and the copy under it share the column's left edge.
            'relative flex w-full max-w-[625px] flex-col items-start gap-[12.5px] px-4 py-0 text-left sm:px-[50px] sm:py-8',
            'xl:min-h-[581.875px] xl:justify-center xl:py-0',
          )}
        >
          {eyebrow && (
            <p
              className="text-[17.5px] font-semibold uppercase leading-[17.5px] text-heading"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {/* The comp's 50×3.125px rule under the eyebrow. It is a zero-height vector there,
              with the stroke centred on it, so it is pulled back out of the 12.5px stack. */}
          <span
            aria-hidden="true"
            className="-my-[1.5625px] block h-[3.125px] w-[50px] bg-subheading"
          />

          {heading && (
            <h1
              className="hero-heading text-heading max-lg:text-[48px]! max-lg:leading-[50px]!"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h1>
          )}

          {subheading && (
            <p
              className="font-playfair text-[22.5px] font-semibold leading-[30px] text-heading"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}

          {description && (
            <p
              className="w-full whitespace-pre-line text-[15px] leading-[21.25px] text-black"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {/* Trust points: each icon over its label, hairline-ruled between, 17.5px apart. */}
          {Array.isArray(trustPoints) && trustPoints.length > 0 && (
            <div className="flex flex-wrap items-stretch gap-x-[17.5px] gap-y-3 pt-[12.5px] sm:pt-0">
              {trustPoints.map((point, i) => (
                <div
                  className="flex items-stretch gap-[17.5px]"
                  data-payload-subpath={`trustPoints.${i}.label`}
                  key={point.id ?? i}
                >
                  {i !== 0 && (
                    <span
                      aria-hidden="true"
                      className="block w-[0.625px] shrink-0 self-stretch bg-ash-500"
                    />
                  )}
                  <div className="flex w-[90px] flex-col items-center gap-[9.375px] text-center">
                    {point.icon && typeof point.icon === 'object' ? (
                      <Media
                        className="h-[30px] w-[30px] shrink-0"
                        imgClassName="h-full w-full object-contain"
                        resource={point.icon}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="block h-[30px] w-[30px] shrink-0 rounded-md border-2 border-dashed border-tint-150 bg-mist"
                      />
                    )}
                    <span className="text-[12.5px] font-semibold leading-[normal] text-heading">
                      {marks(point.label)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTAs: 50px pills, 12.5px inset, 18.75px arrow glyph after the label. */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex max-w-full flex-col items-stretch gap-3 py-[12.5px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-[18.75px]">
              {links.map(({ link }, i) => {
                const isOutline = link.appearance === 'outline'
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className={cn(
                      'cta-gleam inline-flex h-[50px] max-w-full items-center justify-center gap-[12.5px] whitespace-pre-line rounded-[6.25px] px-[12.5px] text-center text-[13.75px] font-medium leading-[13.75px]',
                      isOutline
                        ? // A white band would vanish on the light fill, so the outline
                          // button sweeps a tint of its own ink instead.
                          'border-[0.625px] border-subheading text-subheading hover:bg-white [--cta-gleam-color:color-mix(in_oklab,currentcolor_10%,transparent)]'
                        : 'bg-subheading text-white hover:bg-brand-dark [--cta-glow:var(--color-subheading)]',
                    )}
                  >
                    <img
                      alt=""
                      className="h-[18.75px] w-[18.75px] shrink-0"
                      height={19}
                      src={isOutline ? icons.arrowOutline : icons.arrowSolid}
                      width={19}
                    />
                  </CMSLink>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
