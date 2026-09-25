import React from 'react'

import type { FeatureStripBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

type Item = NonNullable<Props['items']>[number]

/**
 * The /why cuts of the strip — matched to the WHY frame in Figma (1920 wide, 1200 content).
 * Every size below is the Figma value; on phones and tablets the rows fold into grids and
 * the rules between the columns drop away.
 *
 *   whyFeatures   WHY FEATURES   trust row under the hero, thin blue rules, 75px icons
 *   whyDifferent  WHY DIFFERENT  eyebrow + two-line display heading over four icon columns
 *   whyQuick      WHY QUICK      four guarantees, then the green CTA and the secure line
 *
 * The `divided` row and the About-page variants are untouched (`Component.tsx`, `About.tsx`).
 *
 * Figma's "normal" line height for Inter is ~1.21, not Tailwind's `leading-normal` (1.5),
 * so every line height here is written out in px.
 */

/**
 * An item's uploaded artwork in a fixed box, falling back to its brand icon. The icon SVGs
 * uploaded for these sections carry their own round backdrop, so the fallback draws one to
 * stand in for it.
 */
const Art: React.FC<{ box: string; item: Item }> = ({ box, item }) =>
  item.image && typeof item.image === 'object' ? (
    <span className={cn('block shrink-0', box)}>
      {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default `<div>`
          wrapper is not valid inside a span. */}
      <Media htmlElement={null} imgClassName={cn('object-contain', box)} resource={item.image} />
    </span>
  ) : (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-mist-100', box)}>
      <BrandIcon className="text-brand [&>svg]:h-1/2 [&>svg]:w-1/2" name={item.icon} />
    </span>
  )

export const FeatureStripWhy: React.FC<Props> = (props) => {
  const variant = props.variant
  if (variant === 'whyDifferent') return <WhyDifferent {...props} />
  if (variant === 'whyQuick') return <WhyQuick {...props} />
  return <WhyFeatures {...props} />
}

/* WHY FEATURES (2003:349) — 1200x125, four 246.88px boxes split by 0.63px #006db0 rules. */
const WhyFeatures: React.FC<Props> = ({ bgColor, bgColorCustom, background, items, titleCase }) => {
  const strip = Array.isArray(items) ? items : []
  const upper = titleCase !== 'none'

  return (
    <section
      className={cn(
        'w-full px-4 py-6 font-inter sm:px-6 lg:px-0 lg:py-0',
        background === 'light' ? 'bg-mist-100' : 'bg-white',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-[1200px] lg:px-[43.75px] lg:py-[18.75px]">
        <ul className="grid grid-cols-4 gap-[10px] sm:gap-6 lg:flex lg:gap-[18.75px] lg:p-[6.25px]">
          {strip.map((item, i) => (
            <li
              className={cn(
                /* Four across on a phone as the comp has it — icon over the copy, a
                   hairline between the columns — and icon-beside-copy from `lg`. */
                'flex flex-col items-center gap-2 text-center',
                'lg:flex-row lg:items-center lg:gap-[12.5px] lg:text-left',
                'lg:box-content lg:min-w-0 lg:grow lg:basis-0',
                '[&+li]:border-l [&+li]:border-info [&+li]:pl-[10px] lg:[&+li]:pl-[18.75px]',
              )}
              data-payload-subpath={`items.${i}.title`}
              key={item.id ?? i}
            >
              <Art box="h-[60px] w-[60px] sm:h-[75px] sm:w-[75px]" item={item} />
              <div className="min-w-0 lg:flex-1">
                <h3
                  className={cn(
                    'text-[12.5px] font-bold leading-[15px] text-subheading [&_sup]:leading-[0]',
                    upper && 'uppercase',
                  )}
                >
                  {marks(item.title)}
                </h3>
                {item.description && (
                  <p
                    className="mt-[6.25px] text-[11.25px] font-medium leading-[14px] text-heading"
                    data-payload-subpath={`items.${i}.description`}
                  >
                    {marks(item.description)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* WHY DIFFERENT (2003:352) — eyebrow, a two-line Marcellus heading, four 156.25px columns
   each with an 80px icon, a centred title, a short blue rule and body copy. */
const WhyDifferent: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  background,
  eyebrow,
  heading,
  items,
  showRule,
  subheading,
  titleCase,
}) => {
  const strip = Array.isArray(items) ? items : []
  const upper = titleCase === 'upper'

  return (
    <section
      className={cn(
        'w-full px-4 py-10 font-inter sm:px-6 lg:px-0 lg:py-0',
        background === 'white' ? 'bg-white' : 'bg-mist-100',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center lg:p-[43.75px]">
        {eyebrow && (
          <p
            className="text-center text-[15px] font-bold uppercase leading-[20px] text-subheading sm:text-[18.75px]"
            data-payload-subpath="eyebrow"
          >
            {marks(eyebrow)}
          </p>
        )}

        {heading && (
          <h2
            className="mt-[12.5px] text-center font-marcellus text-[36px] font-normal leading-[46px] text-heading sm:text-[44px] sm:leading-[1.08] lg:text-[57.5px] lg:leading-[58px]"
            data-payload-subpath="heading"
          >
            {multiline(heading)}
          </h2>
        )}

        {subheading && (
          <p
            className="mt-[12.5px] max-w-[800px] whitespace-pre-line text-center text-[16.25px] leading-[21.25px] text-heading"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {strip.length > 0 && (
          <ul className="mt-[12.5px] grid grid-cols-2 gap-x-6 gap-y-10 lg:flex lg:flex-wrap lg:justify-center lg:gap-[62.5px] lg:p-[6.25px]">
            {strip.map((item, i) => (
              <li
                className={cn(
                  'relative flex flex-col items-center text-center lg:w-[156.25px]',
                  /* The rule: down the left of the right-hand box on a phone (the grid has
                     two columns, so that is every even item), and between every pair once
                     the row goes flat at `lg`. */
                  'before:absolute before:top-0 before:h-[218.75px] before:w-px before:bg-ash-400',
                  '[&:nth-child(odd)]:before:hidden lg:[&:nth-child(odd)]:before:block',
                  'before:-left-3 lg:before:-left-[31.25px]',
                  'lg:first:before:hidden',
                )}
                data-payload-subpath={`items.${i}.title`}
                key={item.id ?? i}
              >
                <Art box="h-[80px] w-[80px]" item={item} />
                <h3
                  className={cn(
                    /* 158px, not the column's 156.25: the longest title measures 156.9px in
                       the browser's Inter, and a hair more room keeps it on the comp's two
                       lines so every column's blue rule stays on the same baseline. */
                    'mt-[12.5px] text-[15px] font-bold leading-[17.5px] text-subheading lg:w-[158px] [&_sup]:leading-[0]',
                    upper && 'uppercase',
                  )}
                >
                  {marks(item.title)}
                </h3>
                {showRule !== false && (
                  <span
                    aria-hidden="true"
                    className="mt-[10.94px] block h-[3.13px] w-[25px] bg-brand-300"
                  />
                )}
                {item.description && (
                  <p
                    className="mt-[10.94px] text-[12.5px] leading-[15px] text-heading [&_sup]:leading-[0]"
                    data-payload-subpath={`items.${i}.description`}
                  >
                    {marks(item.description)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/* WHY QUICK (2003:356) — four 225px guarantee boxes split by grey rules, then the green
   CTA (lock, label, arrow) and the secure-checkout line. */
const WhyQuick: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  background,
  footnote,
  items,
  links,
  titleCase,
}) => {
  const strip = Array.isArray(items) ? items : []
  const upper = titleCase !== 'none'

  return (
    <section
      className={cn(
        'w-full px-4 py-10 font-inter sm:px-6 lg:px-0 lg:py-0',
        background === 'light' ? 'bg-mist-100' : 'bg-white',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center lg:p-[43.75px]">
        {strip.length > 0 && (
          <ul className="grid w-full grid-cols-2 gap-x-[25px] gap-y-8 lg:flex lg:min-h-[193.75px] lg:w-auto lg:items-center lg:gap-[50px] lg:px-[6.25px] lg:pt-[6.25px] lg:pb-[25px]">
            {strip.map((item, i) => (
              <li
                className={cn(
                  'relative flex flex-col lg:w-[225px]',
                  'lg:[&+li]:before:absolute lg:[&+li]:before:top-1/2 lg:[&+li]:before:-left-[25px] lg:[&+li]:before:h-[162.5px] lg:[&+li]:before:w-px lg:[&+li]:before:-translate-y-1/2 lg:[&+li]:before:bg-ash-400',
                )}
                data-payload-subpath={`items.${i}.title`}
                key={item.id ?? i}
              >
                {/*
                 * The glyph sits above its title on a phone. Beside it, as the desktop row
                 * has it, the 80px glyph and its gap leave 67px of a 159px card for the
                 * words — narrower than "GUARANTEE" — so the titles broke mid-word.
                 */}
                <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-[12.5px]">
                  <Art box="h-[80px] w-[80px]" item={item} />
                  <h3
                    className={cn(
                      'min-w-0 text-[15px] font-bold leading-[23.13px] text-heading [&_sup]:leading-[0]',
                      upper && 'uppercase',
                    )}
                  >
                    {marks(item.title)}
                  </h3>
                </div>
                {item.description && (
                  <p
                    className="mt-[12.5px] text-[16.25px] leading-[21.25px] text-heading [&_sup]:leading-[0]"
                    data-payload-subpath={`items.${i}.description`}
                  >
                    {marks(item.description)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* The comp's green button: `success-dark` (#166b2e) is the nearest token to #2a772f. */}
        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-[12.5px] flex w-full flex-col items-center gap-4">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className="cta-gleam [--cta-glow:var(--color-success-dark)] inline-flex max-w-full items-center gap-[12.5px] rounded-[15.63px] bg-success-dark px-[18.75px] py-[14px] text-center text-[15px] font-bold uppercase leading-[25px] text-white transition-colors hover:bg-success-deep sm:text-[20px] lg:py-[18.75px] lg:text-[25px] [&_sup]:leading-[0]"
                key={i}
              >
                {/* One fragment, not two siblings: `CMSLink` renders `children` straight out, and
                    an array of children without keys trips React's key warning. */}
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="order-first block h-[24px] w-[24px] shrink-0 lg:h-[30px] lg:w-[30px]"
                    decoding="async"
                    height={30}
                    loading="lazy"
                    src="/icons/why-quick/lock.png"
                    width={30}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="block h-[20px] w-[20px] shrink-0 lg:h-[25px] lg:w-[25px]"
                    decoding="async"
                    height={25}
                    loading="lazy"
                    src="/icons/why-quick/arrow-right.png"
                    width={25}
                  />
                </>
              </CMSLink>
            ))}
          </div>
        )}

        {footnote && (
          <p
            className="mt-[12.5px] flex items-center justify-center gap-[12.5px] text-center text-[16.25px] leading-[21.25px] text-heading"
            data-payload-subpath="footnote"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="block h-[26.25px] w-[26.25px] shrink-0"
              decoding="async"
              height={26}
              loading="lazy"
              src="/icons/why-quick/secure-shield.svg"
              width={26}
            />
            <span>{marks(footnote)}</span>
          </p>
        )}
      </div>
    </section>
  )
}
