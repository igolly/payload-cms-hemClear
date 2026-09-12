import React from 'react'

import type { WaysGridBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

type Way = NonNullable<Props['ways']>[number]

/**
 * One row of steps.
 *
 * The design centres fixed-width cards rather than stretching them to the container edge —
 * 280px across the top row, 204px across the second — so a card is `flex-1` up to a
 * per-row cap and the row itself is centred. Capping rather than fixing the width keeps
 * the row honest when an editor changes `firstRowCount` and more cards land in it than the
 * design ever had.
 *
 * Cards stretch to a common height so the dividers between them all run the same length,
 * as they do in the design, rather than stopping at each card's own last line.
 */
/**
 * The `/why` routine treatment: a wide photo carrying its step number in a badge, rather
 * than a ringed icon with the number spelled into the title. Same content shape, so it is a
 * variant on this block instead of a near-duplicate of it.
 */
const PhotoRow: React.FC<{ offset: number; ways: Way[] }> = ({ offset, ways }) => (
  <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-center lg:gap-x-8">
    {ways.map((way, i) => (
      <li
        className="flex flex-col items-center gap-3 text-center lg:w-[322px]"
        data-payload-subpath={`ways.${offset + i}.title`}
        key={way.id ?? i}
      >
        <div className="relative aspect-[322/236] w-full">
          <ImageSlot
            className="h-full w-full"
            hint="Recommended 900 × 660px photo"
            imgClassName="h-full w-full object-cover"
            label={`Step ${offset + i + 1}`}
            resource={way.image}
          />
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[#2C80E2] text-[18px] font-bold leading-none text-white"
          >
            {offset + i + 1}
          </span>
        </div>

        <h3 className="text-[17.5px] font-bold leading-[21px] text-heading">{way.title}</h3>

        <span aria-hidden="true" className="block h-[3px] w-6 bg-[#C9D9F0]" />

        {way.description && (
          <p
            className="text-[15px] leading-[18.75px] text-heading"
            data-payload-subpath={`ways.${offset + i}.description`}
          >
            {marks(way.description)}
          </p>
        )}
      </li>
    ))}
  </ul>
)

const Row: React.FC<{ cardWidth: string; offset: number; ways: Way[] }> = ({
  cardWidth,
  offset,
  ways,
}) => (
  <ul className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:flex lg:items-stretch lg:justify-center lg:gap-y-0">
    {ways.map((way, i) => (
      <li
        className={`flex flex-col items-center gap-2.5 p-4 text-center lg:flex-1 lg:border-l lg:border-navy lg:first:border-l-0 ${cardWidth}`}
        data-payload-subpath={`ways.${offset + i}.title`}
        key={way.id ?? i}
      >
        {/*
         * The ring is the designed geometry: a 146px circle with a hairline border, holding
         * a 134px illustration. Both sizes are set explicitly so the illustration keeps its
         * inset inside the ring instead of filling it.
         */}
        <div className="flex h-36.5 w-36.5 shrink-0 items-center justify-center overflow-hidden rounded-full border-[0.729px] border-[#2C80E2]">
          <ImageSlot
            className="h-33.5 w-33.5 rounded-full"
            hint="Circular icon"
            imgClassName="h-33.5 w-33.5 rounded-full object-cover"
            label={`Icon ${offset + i + 1}`}
            resource={way.image}
          />
        </div>

        <h3 className="text-base font-bold leading-normal text-subheading">
          {offset + i + 1}. {way.title}
        </h3>

        {way.description && (
          <p
            className="text-xs leading-normal text-subheading"
            data-payload-subpath={`ways.${offset + i}.description`}
          >
            {marks(way.description)}
          </p>
        )}
      </li>
    ))}
  </ul>
)

export const WaysGridBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  eyebrow,
  firstRowCount,
  footnote,
  headingAccent,
  headingAfter,
  headingBefore,
  mediaStyle,
  subheading,
  ways,
}) => {
  const items = Array.isArray(ways) ? ways : []
  const split = Math.min(Math.max(1, firstRowCount ?? 4), items.length)

  const firstRow = items.slice(0, split)
  const secondRow = items.slice(split)
  const photo = mediaStyle === 'card'

  return (
    <section
      className="w-full bg-[#F5F8FD] px-4 py-7 sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-350">
        <header className="text-center">
          {eyebrow && (
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {/*
           * Marcellus at the design's 52px, stepping down on narrow screens. The navy here
           * is the design's own #051959 rather than the site's `--color-heading`; the two
           * are close but not the same, and this section is the one held to the comp.
           */}
          {(headingBefore || headingAccent || headingAfter) && (
            <h2 className="font-marcellus text-[32px] leading-tight text-[#051959] sm:text-[42px] lg:text-[52px]">
              {headingBefore && (
                <span data-payload-subpath="headingBefore">{headingBefore} </span>
              )}
              {headingAccent && (
                <span className="text-[#2C80E2]" data-payload-subpath="headingAccent">
                  {marks(headingAccent)}
                </span>
              )}
              {headingAfter && (
                <span data-payload-subpath="headingAfter"> {marks(headingAfter)}</span>
              )}
            </h2>
          )}

          {/* The "9 Ways" comp rules its heading; the /why routine comp does not, and the
              two variants differ in exactly that way — so the rule follows the variant
              rather than adding a field an editor would have to keep in sync with it. */}
          {!photo && (
            <span aria-hidden="true" className="mx-auto mt-3.75 block h-0.5 w-18.25 bg-[#2C80E2]" />
          )}

          {subheading && (
            <p
              className="mt-3.75 whitespace-pre-line text-lg font-medium leading-normal text-[#0052CC] sm:text-xl lg:text-2xl"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}
        </header>

        <div className="mt-4 py-5 lg:px-15">
          {firstRow.length > 0 &&
            (photo ? (
              <PhotoRow offset={0} ways={firstRow} />
            ) : (
              <Row cardWidth="lg:max-w-70" offset={0} ways={firstRow} />
            ))}

          {secondRow.length > 0 && (
            <div className={firstRow.length > 0 ? 'mt-8' : undefined}>
              {photo ? (
                <PhotoRow offset={split} ways={secondRow} />
              ) : (
                <Row cardWidth="lg:max-w-51" offset={split} ways={secondRow} />
              )}
            </div>
          )}
        </div>

        {footnote && (
          <p
            className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 whitespace-pre-line rounded-lg bg-white/70 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-500"
            data-payload-subpath="footnote"
          >
            <BrandIcon className="shrink-0 text-[#1668C4] [&>svg]:h-4 [&>svg]:w-4" name="shieldCheck" />
            {marks(footnote)}
          </p>
        )}
      </div>
    </section>
  )
}
