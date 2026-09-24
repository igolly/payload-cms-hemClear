import React from 'react'

import type { SolutionSystemBlock as Props } from '@/payload-types'

import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'
import { cn } from '@/utilities/ui'

type Card = NonNullable<Props['cards']>[number]

/**
 * The two-tone illustrated icons drawn for this section in the Figma comp (exported at their
 * 44px frame), which the line icons in `BrandIcons` don't match. An uploaded card image still
 * wins; any other icon an editor picks falls back to the shared set.
 */
const featureIcons: Record<string, string> = {
  clipboardCheck: '/icons/solution-system/clipboard-check.svg',
  flask: '/icons/solution-system/flask.svg',
  guarantee: '/icons/solution-system/guarantee.svg',
  madeInUsa: '/icons/solution-system/made-in-usa.svg',
  stethoscope: '/icons/solution-system/stethoscope.svg',
  supportSystem: '/icons/solution-system/support-system.svg',
}

/*
 * Figma's "normal" line height for Inter is ~1.21 — not Tailwind's `leading-normal` (1.5),
 * which would add ~8px to every card.
 */
/* Below `sm` the cards stand upright (mobile comp): badge titles keep 24px, the rest run 14px. */
const titleSizes = {
  lg: 'text-2xl leading-[22.5px]',
  md: 'text-[14px] leading-[1.21] sm:text-lg',
  sm: 'text-[14px] leading-[1.21] sm:text-base',
} as const

/** Auto matches the comp: a two-line badge card runs large, a card with a number small. */
const resolveTitleSize = (card: Card): keyof typeof titleSizes => {
  if (card.titleSize && card.titleSize !== 'auto') return card.titleSize
  if (card.subtitle) return 'lg'
  if (card.stat) return 'sm'
  return 'md'
}

/** Underlines the first occurrence of `phrase` in each heading line; ® and ™ stay raised. */
const headingLines = (heading: React.ReactNode, phrase?: string | null): React.ReactNode => {
  // Puck hands an element in place of the string while the heading is being edited inline.
  if (typeof heading !== 'string') return heading

  return heading.split('\n').map((line, i) => {
    const at = phrase ? line.indexOf(phrase) : -1
    return (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {at < 0 || !phrase ? (
          marks(line)
        ) : (
          <>
            {marks(line.slice(0, at))}
            <span className="underline decoration-from-font underline-offset-auto">
              {marks(phrase)}
            </span>
            {marks(line.slice(at + phrase.length))}
          </>
        )}
      </React.Fragment>
    )
  })
}

/**
 * One feature card: icon, an optional oversized lead-in number, title and subtitle.
 *
 * `index` is the row's real position in `cards`, not its position in the column, so
 * click-to-edit still opens the right row after the array has been sliced in two.
 */
const FeatureCard: React.FC<{ card: Card; index: number }> = ({ card, index }) => {
  const localIcon = featureIcons[card.icon]

  return (
    // Figma strokes sit outside layout; padding gives back the 0.625px border to keep 94.5px.
    <li
      className="flex min-h-[94.5px] w-full items-center gap-[18.75px] overflow-hidden rounded-[18.75px] border-[0.625px] border-tint-50 bg-white p-[18.125px] text-brand-600 max-sm:h-[208px] max-sm:w-[120px] max-sm:shrink-0 max-sm:snap-start max-sm:flex-col max-sm:text-center [&_sup]:leading-[0]"
      data-payload-subpath={`cards.${index}.title`}
    >
      {card.image && typeof card.image === 'object' ? (
        <span className="block size-11 shrink-0" data-payload-subpath={`cards.${index}.image`}>
          {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default `<div>`
              wrapper is not valid inside a span. */}
          <Media htmlElement={null} imgClassName="size-11 object-contain" resource={card.image} />
        </span>
      ) : localIcon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="block size-11 shrink-0"
          decoding="async"
          height={44}
          loading="lazy"
          src={localIcon}
          width={44}
        />
      ) : (
        <BrandIcon
          className="block size-11 shrink-0 text-brand-600 [&>svg]:h-full [&>svg]:w-full"
          name={card.icon}
        />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-[6.25px] font-bold max-sm:block max-sm:w-full max-sm:flex-none max-sm:text-[14px] max-sm:leading-[1.21]">
        {/* Upright, the number joins the title's line at the title's size. */}
        {card.stat && (
          <span className="shrink-0 whitespace-nowrap text-[42px] leading-[1.21] max-sm:mr-[0.25em] max-sm:text-[14px]">
            {marks(card.stat)}
          </span>
        )}
        <div className={cn('min-w-0 flex-1', card.stat && 'max-sm:inline')}>
          <p className={cn(titleSizes[resolveTitleSize(card)], card.stat && 'max-sm:inline')}>
            {marks(card.title)}
          </p>
          {card.subtitle && (
            <p className="text-xs font-normal leading-[17.25px] max-sm:leading-[22.5px]">
              {marks(card.subtitle)}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

export const SolutionSystemBlockComponent: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  cards,
  heading,
  image,
  subheading,
  underline,
}) => {
  const items = Array.isArray(cards) ? cards : []

  /*
   * The two columns are derived from position rather than stored on each row — the same
   * reason `waysGrid` numbers itself. An editor reorders the array and the layout follows,
   * with no second field to fall out of sync. An odd count leans the extra card left.
   */
  const split = Math.ceil(items.length / 2)
  const left = items.slice(0, split)
  const right = items.slice(split)

  const column = 'flex w-full flex-col items-center justify-center gap-[6.25px]'

  return (
    <section
      className="w-full bg-mist px-[5px] font-inter sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[18.75px] py-[31.25px] max-sm:pb-0 sm:gap-3">
        {heading && (
          <h2
            className="text-balance text-center font-marcellus text-[36px] font-normal leading-[43px] text-navy-900 [&_sup]:leading-[0] sm:text-[2.625rem] sm:leading-[1.1] lg:text-[50px] lg:leading-[50px]"
            data-payload-subpath="heading"
          >
            {headingLines(heading, underline)}
          </h2>
        )}

        {subheading && (
          <p
            className="text-center text-2xl font-medium leading-6 text-info-dark sm:text-lg sm:leading-snug lg:text-2xl lg:leading-6"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {/* The comp's 6.25px spacer between the intro and the feature row. */}
        <div aria-hidden className="h-[6.25px] w-full max-sm:hidden" />

        {/*
         * Three columns — 281.25 | 500 | 281.25 with 8px gaps — once there is room (xl).
         * Below that the diagram leads and the two card columns sit side by side, then stack.
         */}
        <div className="grid w-full max-w-[36rem] grid-cols-1 max-sm:max-w-none items-center justify-center gap-[6.25px] sm:max-w-none sm:grid-cols-2 sm:gap-x-4 xl:grid-cols-[281.25px_500px_281.25px] xl:gap-x-2 xl:px-[62.5px]">
          <div
            className="relative mx-auto mb-4 aspect-[500/457.5] w-full max-w-[500px] max-sm:-mx-[5px] max-sm:mb-0 max-sm:w-auto max-sm:max-w-none sm:col-span-2 xl:order-2 xl:col-span-1 xl:mb-0 xl:h-[457.5px] xl:w-[500px]"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 1000 × 915px, transparent PNG"
              imgClassName="h-full w-full object-cover"
              label="Inside-out support diagram"
              resource={image}
            />
          </div>

          {/*
           * From `sm` this wrapper is layout-transparent and the two lists are grid columns.
           * The mobile comp runs all the cards as one row of upright 120px cards off the right
           * edge, so below `sm` the wrapper is that sideways-scrolling row and the lists dissolve.
           */}
          <div className="-mr-[5px] flex snap-x gap-2 overflow-x-auto pr-[5px] [scrollbar-width:none] sm:contents">
            {left.length > 0 && (
              <ul className={cn(column, 'max-sm:contents xl:order-1')}>
                {left.map((card, i) => (
                  <FeatureCard card={card} index={i} key={card.id ?? i} />
                ))}
              </ul>
            )}

            {right.length > 0 && (
              <ul className={cn(column, 'max-sm:contents xl:order-3')}>
                {right.map((card, i) => (
                  <FeatureCard card={card} index={split + i} key={card.id ?? i} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
