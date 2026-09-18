import React from 'react'

import type { WaysGridBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { StepsCarousel } from './Carousel'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
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
  <ul className="grid grid-cols-1 gap-[31.25px] sm:grid-cols-2 lg:flex lg:items-start lg:justify-center lg:gap-x-[31.25px]">
    {ways.map((way, i) => (
      <li
        className="flex flex-col items-center gap-[12.5px] text-center lg:w-[322.5px]"
        data-payload-subpath={`ways.${offset + i}.title`}
        key={way.id ?? i}
      >
        <div className="relative aspect-[322.5/236.25] w-full max-w-[322.5px] sm:max-w-none">
          <ImageSlot
            className="h-full w-full"
            hint="Recommended 900 × 660px photo"
            imgClassName="h-full w-full object-cover"
            label={`Step ${offset + i + 1}`}
            resource={way.image}
          />
          <span
            aria-hidden="true"
            className="absolute left-[12.5px] top-[12.5px] flex h-[37.5px] w-[37.5px] items-center justify-center rounded-full bg-brand-300 text-[18.75px] font-bold leading-none text-white"
          >
            {offset + i + 1}
          </span>
        </div>

        <h3 className="text-[17.5px] font-bold leading-[21.25px] text-heading">{way.title}</h3>

        {/* The comp's rule: a zero-height vector with a 3.125px stroke centred on it, so it
            takes no room in the 12.5px stack. */}
        <span
          aria-hidden="true"
          className="-my-[1.5625px] block h-[3.125px] w-[25px] bg-brand-300"
        />

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

/**
 * The ring is the designed geometry: a 146px circle with a hairline border, holding a 134px
 * illustration. Both sizes are set explicitly so the illustration keeps its inset inside the
 * ring instead of filling it.
 */
const StepBody: React.FC<{ index: number; way: Way }> = ({ index, way }) => (
  <>
    <div className="flex h-36.5 w-36.5 shrink-0 items-center justify-center overflow-hidden rounded-full border-[0.729px] border-brand-300">
      <ImageSlot
        className="h-33.5 w-33.5 rounded-full"
        hint="Circular icon"
        imgClassName="h-33.5 w-33.5 rounded-full object-cover"
        label={`Icon ${index + 1}`}
        resource={way.image}
      />
    </div>

    <h3 className="text-base font-bold leading-[normal] text-subheading">
      {index + 1}. {way.title}
    </h3>

    {way.description && (
      <p
        className="text-xs leading-[normal] text-subheading"
        data-payload-subpath={`ways.${index}.description`}
      >
        {marks(way.description)}
      </p>
    )}
  </>
)

const Row: React.FC<{ cardClassName: string; offset: number; ways: Way[] }> = ({
  cardClassName,
  offset,
  ways,
}) => (
  <ul className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:flex lg:items-stretch lg:justify-center lg:gap-y-0">
    {ways.map((way, i) => (
      <li
        className={`flex flex-col items-center p-4 text-center lg:flex-1 lg:border-l lg:border-navy lg:first:border-l-0 ${cardClassName}`}
        data-payload-subpath={`ways.${offset + i}.title`}
        key={way.id ?? i}
      >
        <StepBody index={offset + i} way={way} />
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
      className={cn(
        'w-full bg-mist px-4 py-4 font-inter sm:px-6 sm:py-[50px]',
        // The /why routine band sits in the page's 1200px column with 43.75px of padding.
        photo ? 'lg:px-[43.75px] lg:py-[43.75px]' : 'lg:px-8 lg:py-7',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className={cn('mx-auto', photo ? 'max-w-[1112.5px]' : 'max-w-350')}>
        <header className="text-center">
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase',
                photo
                  ? 'mb-[12.5px] text-[15px] leading-5 text-subheading sm:text-[18.75px]'
                  : 'mb-3 text-xs tracking-[0.15em] text-brand-500',
              )}
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {/*
           * Marcellus at the design's 52px, stepping down on narrow screens. `navy-900` here
           * rather than the default `text-heading`: the two are close but not the same, and
           * this section is the one held to the comp.
           */}
          {(headingBefore || headingAccent || headingAfter) && (
            <h2
              className={cn(
                'font-marcellus [&_sup]:leading-[0]',
                photo
                  ? 'text-[34px] leading-[1.25] text-heading sm:text-[46px] lg:text-[57.5px]'
                  : 'text-[44px] leading-[normal] text-navy-900 lg:text-[52px] lg:leading-tight',
              )}
            >
              {headingBefore && <span data-payload-subpath="headingBefore">{headingBefore} </span>}
              {headingAccent && (
                <span className="text-brand-300" data-payload-subpath="headingAccent">
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
            <span
              aria-hidden="true"
              className="mx-auto -mb-[1.458px] mt-[13.542px] block h-[2.917px] w-[75.833px] rounded-full bg-brand-300"
            />
          )}

          {subheading && (
            <p
              className="mt-3.75 whitespace-pre-line text-2xl font-medium leading-[normal] text-brand-500"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}
        </header>

        {photo ? (
          <div className="mt-[12.5px] p-[6.25px]">
            {firstRow.length > 0 && <PhotoRow offset={0} ways={firstRow} />}
            {secondRow.length > 0 && (
              <div className={firstRow.length > 0 ? 'mt-[31.25px]' : undefined}>
                <PhotoRow offset={split} ways={secondRow} />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Phones and tablets: every step in one swipeable track. */}
            {items.length > 0 && (
              <div className="mt-4 lg:hidden">
                <StepsCarousel
                  slides={items.map((way, i) => (
                    <li
                      className="flex w-70 flex-none snap-center flex-col items-center gap-2.5 border-r border-navy p-4 text-center last:border-r-0"
                      data-payload-subpath={`ways.${i}.title`}
                      key={way.id ?? i}
                    >
                      <StepBody index={i} way={way} />
                    </li>
                  ))}
                />
              </div>
            )}

            <div className="mt-4 hidden py-5 lg:block lg:px-15">
              {firstRow.length > 0 && (
                <Row cardClassName="gap-2.5 lg:max-w-70" offset={0} ways={firstRow} />
              )}
              {secondRow.length > 0 && (
                <div className={firstRow.length > 0 ? 'mt-8 lg:mt-4' : undefined}>
                  <Row cardClassName="gap-[10.938px] lg:max-w-51" offset={split} ways={secondRow} />
                </div>
              )}
            </div>
          </>
        )}

        {footnote && (
          <p
            className={cn(
              'mx-auto flex whitespace-pre-line',
              photo
                ? // The /why comp's disclaimer card: 593.75px wide, pale blue, the shield at
                  // 35px beside left-ranged fine print.
                  'mt-[12.5px] w-[593.75px] max-w-full items-center gap-[18.75px] rounded-[15.625px] bg-tint-50 p-[18.75px] text-left text-[12.5px] leading-[17.5px] text-heading'
                : 'mt-6 max-w-3xl items-start justify-center gap-2 rounded-lg bg-white/70 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-500',
            )}
            data-payload-subpath="footnote"
          >
            <BrandIcon
              className={cn(
                'shrink-0',
                photo
                  ? 'text-heading [&>svg]:h-[35px] [&>svg]:w-[35px]'
                  : 'text-brand-400 [&>svg]:h-4 [&>svg]:w-4',
              )}
              name="shieldCheck"
            />
            {marks(footnote)}
          </p>
        )}
      </div>
    </section>
  )
}
