import React from 'react'

import type { FeatureStripBlock as Props } from '@/payload-types'

import { FeaturedCarousel } from '@/blocks/Reviews/FeaturedCarousel'
import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

type Item = NonNullable<Props['items']>[number]

/**
 * The About-page cuts of the strip — matched to the ABOUT frame in Figma (1920 wide,
 * 1400 content). Every size below is the Figma value; on phones and tablets the rows fold
 * into grids instead.
 *
 *   trustBar   ABOUT HERO FEATURES  compact row under the hero, hairline above
 *   iconCards  SYMPTOMS             six cards, round icon over title and text
 *   pills      CONTRIBUTE           icon + label tiles
 *   cards      MANAGE               illustration beside title and text
 *   checklist  HABITS               two check columns and a side note
 *   trustRow   OFFER FEATURES       large round icons split by blue rules
 *
 * The `divided` row (the /why page) stays in `Component.tsx`, untouched.
 *
 * ABOUT MOBILE (Figma 6252:4404) reshapes four of them on a phone: the two long rows —
 * SYMPTOMS and CONTRIBUTE — become swipe tracks, MANAGE narrows to one 300px column, and
 * OFFER FEATURES keeps all four columns side by side rather than stacking. The desktop
 * treatments above are unchanged; every rule below is either mobile-first with an `xl:`
 * (or `sm:`) restore, or new.
 */

/**
 * An item's uploaded artwork in a fixed box, falling back to its brand icon. The icon
 * SVGs uploaded for these sections carry their own round backdrop, so the fallback draws
 * one to stand in for it.
 */
const Art: React.FC<{
  box: string
  fallback: string
  /** The fallback's own box, when the artwork box is not square. */
  fallbackBox?: string
  item: Item
}> = ({ box, fallback, fallbackBox, item }) =>
  item.image && typeof item.image === 'object' ? (
    <span className={cn('block shrink-0', box)}>
      <Media htmlElement={null} imgClassName={cn('object-contain', box)} resource={item.image} />
    </span>
  ) : (
    <span className={cn('flex shrink-0 items-center justify-center', fallbackBox ?? box, fallback)}>
      <BrandIcon className="text-brand [&>svg]:h-1/2 [&>svg]:w-1/2" name={item.icon} />
    </span>
  )

/** Figma's widths for the four trust-bar boxes, which it sizes one by one. */
const TRUST_BAR_WIDTHS = ['lg:w-[262.5px]', 'lg:w-[343.75px]', 'lg:w-[281.25px]', 'lg:w-[262.5px]']

const SECTION_PADDING: Record<string, string> = {
  checklist: 'lg:pt-[44px] lg:pb-[45px]',
  cards: 'lg:pt-[43px] lg:pb-[49.5px]',
  iconCards: 'lg:pt-[44px] lg:pb-[53px]',
  pills: 'lg:pt-[44px] lg:pb-[45.5px]',
  trustBar: '',
  trustRow: 'lg:py-[25px]',
}

/**
 * The phone headings, which the mobile frame sizes section by section rather than on one
 * scale. Above `sm` they all return to the shared desktop ramp.
 */
const HEADING_SIZE: Record<string, string> = {
  checklist: 'text-[48px] leading-[54px]',
  cards: 'text-[36px] leading-[52px]',
  iconCards: 'text-[48px] leading-[52px]',
  pills: 'text-[38px] leading-[44px]',
  trustBar: '',
  trustRow: '',
}

/** The gap the mobile frame leaves between the header and the body of each section. */
const BODY_GAP: Record<string, string> = {
  checklist: 'mt-4',
  cards: 'mt-2.5',
  iconCards: 'mt-3',
  pills: 'mt-5',
  trustBar: '',
  trustRow: '',
}

export const FeatureStripAbout: React.FC<Props> = ({
  background,
  bgColor,
  bgColorCustom,
  footnote,
  heading,
  intro,
  items,
  subheading,
  titleCase,
  variant,
}) => {
  const style = variant ?? 'iconCards'
  const strip = Array.isArray(items) ? items : []
  const upper = titleCase !== 'none'
  const hasHeader = Boolean(heading || subheading || intro)

  const header = hasHeader && (
    <header className="text-center">
      {heading && (
        <h2
          className={cn(
            'font-marcellus text-heading sm:text-[46px] sm:leading-[1.2] lg:text-[57.5px] lg:leading-[normal]',
            HEADING_SIZE[style] || 'text-[34px] leading-[1.2]',
          )}
          data-payload-subpath="heading"
        >
          {multiline(heading)}
        </h2>
      )}
      {subheading && (
        <p
          className="mt-3 whitespace-pre-line text-[18.75px] leading-5 text-brand-500 sm:text-[17px] sm:leading-[normal] lg:mt-[10.5px] lg:text-[18.75px]"
          data-payload-subpath="subheading"
        >
          {marks(subheading)}
        </p>
      )}
      {intro && (
        <p
          className="mx-auto mt-3 max-w-[590px] whitespace-pre-line text-[15px] leading-[20px] text-black lg:mt-[11.5px]"
          data-payload-subpath="intro"
        >
          {marks(intro)}
        </p>
      )}
    </header>
  )

  let body: React.ReactNode = null

  if (style === 'trustBar') {
    body = (
      <ul className="grid grid-cols-1 gap-5 border-t-[0.625px] border-tint-50 py-[18.75px] sm:grid-cols-2 lg:flex lg:justify-center lg:gap-0">
        {strip.map((item, i) => (
          <li
            className={cn(
              'flex items-center gap-[9.375px] px-[12.5px] lg:shrink-0 lg:border-r-[0.625px] lg:border-tint-50 lg:last:border-r-0',
              TRUST_BAR_WIDTHS[i],
            )}
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art box="h-12 w-12" fallback="" item={item} />
            <div className="flex min-w-0 flex-1 flex-col gap-[3.125px] text-subheading">
              <h3
                className={cn('text-[13.75px] font-bold leading-[18.75px]', upper && 'uppercase')}
              >
                {marks(item.title)}
              </h3>
              {item.description && (
                <p
                  className="text-[12.5px] leading-[16.25px]"
                  data-payload-subpath={`items.${i}.description`}
                >
                  {marks(item.description)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (style === 'iconCards') {
    /*
     * The six cards are 162.5px wide at every width — the same figure the desktop grid
     * arrives at (1037.5 less five 12.5px gutters, over six columns) — so the one track
     * serves both: a swipe carousel on a phone, a centred row from `xl`.
     */
    body = (
      <div className={cn(BODY_GAP[style], 'lg:mt-[16px]')}>
        <FeaturedCarousel
          slides={strip.map((item, i) => (
            <li
              className="flex w-[162.5px] shrink-0 snap-center flex-col items-center gap-[3.125px] rounded-[18.75px] bg-white p-[18.75px] text-center shadow-[0_0_4.688px_rgba(0,0,0,0.25)] xl:gap-0 xl:rounded-[16px] xl:px-[17px] xl:pb-[25px] xl:pt-[19.5px] xl:shadow-[0_0_5px_rgba(0,0,0,0.2)] xl:min-h-[337px]"
              data-payload-subpath={`items.${i}.title`}
              key={item.id ?? i}
            >
              <Art box="h-[78px] w-[78px]" fallback="rounded-full bg-[#f2f7fe]" item={item} />
              {/* The title sits in a fixed box so the descriptions below it line up across
                  cards of different title lengths; the desktop card spaces them instead. */}
              <div className="flex h-[68.75px] items-center justify-center xl:mt-[21.5px] xl:h-auto">
                <h3
                  className={cn(
                    'text-[13.75px] font-bold leading-[16.25px] text-brand-500',
                    upper && 'uppercase',
                  )}
                >
                  {marks(item.title)}
                </h3>
              </div>
              {item.description && (
                <p
                  className="text-[13.75px] leading-[16.25px] text-black xl:mt-[21.5px] xl:leading-[16.5px]"
                  data-payload-subpath={`items.${i}.description`}
                >
                  {marks(item.description)}
                </p>
              )}
            </li>
          ))}
          trackClassName="gap-[14px] px-4 py-[6px] scroll-px-4 sm:gap-[14px] xl:mx-auto xl:max-w-[1037.5px] xl:gap-[12.5px]"
        />
      </div>
    )
  }

  if (style === 'pills') {
    /* Eight causes are too many to wrap on a phone, so the frame swipes them: the tile
       stands the icon above its label, and from `xl` it lies back down as the wide pill. */
    body = (
      <div className={cn(BODY_GAP[style], 'lg:mt-[43.5px]')}>
        <FeaturedCarousel
          slides={strip.map((item, i) => (
            <li
              className="flex w-[160px] shrink-0 snap-center flex-col items-center gap-2.5 rounded-[18.75px] bg-white px-4 py-3 shadow-[0_0_4.688px_rgba(0,0,0,0.25)] xl:h-[81.25px] xl:w-[218.75px] xl:flex-row xl:gap-[12.5px] xl:rounded-[15px] xl:py-2 xl:pl-[18.75px] xl:pr-[14px] xl:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
              data-payload-subpath={`items.${i}.title`}
              key={item.id ?? i}
            >
              <Art box="h-14 w-14" fallback="" item={item} />
              <span className="min-w-0 text-center text-[16.25px] leading-5 text-heading xl:text-left xl:text-[16px]">
                {marks(item.title)}
              </span>
            </li>
          ))}
          trackClassName="gap-2.5 px-4 py-[6px] scroll-px-4 sm:gap-2.5 xl:mx-auto xl:max-w-[1143.75px] xl:flex-wrap xl:gap-[12.5px]"
        />
      </div>
    )
  }

  if (style === 'cards') {
    body = (
      <ul
        className={cn(
          BODY_GAP[style],
          'mx-auto grid max-w-[300px] grid-cols-1 gap-[12.5px] sm:mt-8 sm:max-w-[1103px] sm:grid-cols-2 sm:gap-[13px] lg:mt-[38px] xl:grid-cols-4',
        )}
      >
        {strip.map((item, i) => (
          <li
            className="flex items-center gap-3 rounded-[18.75px] bg-white px-4 py-[14px] shadow-[0_0_4.688px_rgba(0,0,0,0.25)] sm:min-h-[166px] sm:gap-[6px] sm:rounded-[20px] sm:py-3 sm:pl-[16px] sm:pr-[18px] sm:shadow-[0_0_8px_rgba(0,0,0,0.2)]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art
              box="h-[105px] w-[78.75px] sm:h-[124px] sm:w-[88px]"
              fallback="rounded-full bg-mist-100"
              fallbackBox="h-[78.75px] w-[78.75px] sm:h-[88px] sm:w-[88px]"
              item={item}
            />
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'text-[15px] font-bold leading-[21px] text-brand-500',
                  upper && 'uppercase',
                )}
              >
                {marks(item.title)}
              </h3>
              {item.description && (
                <p
                  className="mt-[6.25px] text-[13.75px] leading-[16.25px] text-black sm:mt-[6.5px] sm:leading-[16.5px]"
                  data-payload-subpath={`items.${i}.description`}
                >
                  {marks(item.description)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (style === 'checklist') {
    body = (
      <div
        className={cn(
          BODY_GAP[style],
          'mx-auto flex max-w-[850px] flex-col items-center gap-4 sm:mt-8 sm:gap-8 lg:mt-[30px] lg:flex-row lg:items-stretch lg:gap-[50px]',
        )}
      >
        {/* The frame indents the phone list 80px inside the section, which reads as a
            column rather than a full-width sweep of short lines. */}
        <ul
          className="grid w-full grid-cols-1 gap-y-[12.5px] px-[80px] sm:w-auto sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[repeat(var(--rows),auto)] sm:gap-x-[50px] sm:px-0"
          style={{ '--rows': Math.ceil(strip.length / 2) } as React.CSSProperties}
        >
          {strip.map((item, i) => (
            <li
              className="flex items-center gap-[12.5px] sm:w-[250px]"
              data-payload-subpath={`items.${i}.title`}
              key={item.id ?? i}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="h-[26px] w-[26px] shrink-0"
                decoding="async"
                height={26}
                loading="lazy"
                src="/icons/feature-strip/check.svg"
                width={26}
              />
              <span className="text-[15px] font-medium leading-[15px] text-subheading sm:leading-[26px]">
                {marks(item.title)}
              </span>
            </li>
          ))}
        </ul>

        {footnote && (
          <p
            className="flex w-full shrink-0 items-center justify-center rounded-[18.75px] bg-tint-50 p-4 text-center text-[15px] font-medium leading-[21.25px] text-subheading sm:max-w-[250px] sm:rounded-[20px] sm:px-[22px] sm:py-5 lg:min-h-[141.5px]"
            data-payload-subpath="footnote"
          >
            {marks(footnote)}
          </p>
        )}
      </div>
    )
  }

  if (style === 'trustRow') {
    // The phone keeps all four columns in the row rather than stacking them: the icon moves
    // above its text and the blue rules stay, 18.75px clear of each column.
    body = (
      <ul className="flex justify-center p-[6.25px] sm:grid sm:grid-cols-2 sm:gap-6 sm:p-0 lg:flex lg:justify-center lg:gap-0">
        {strip.map((item, i) => (
          <li
            className="flex w-[70.75px] flex-col items-center gap-[12.5px] text-center [&+li]:ml-[18.75px] [&+li]:border-l [&+li]:border-brand-300 [&+li]:pl-[18.75px] sm:w-auto sm:flex-row sm:items-center sm:gap-[13px] sm:text-left sm:[&+li]:ml-0 sm:[&+li]:border-l-0 sm:[&+li]:pl-0 lg:box-content lg:w-[296.5px] lg:shrink-0 lg:[&+li]:ml-[19px] lg:[&+li]:border-l lg:[&+li]:border-brand-300 lg:[&+li]:pl-[18px]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art box="h-[75px] w-[75px]" fallback="rounded-full bg-ash-250" item={item} />
            <div className="min-w-0 sm:flex-1">
              <h3
                className={cn(
                  'text-[12.5px] font-bold leading-[15px] text-subheading',
                  upper && 'uppercase',
                )}
              >
                {marks(item.title)}
              </h3>
              {item.description && (
                <p
                  className="mt-[6.25px] text-[11.25px] leading-[normal] text-heading sm:mt-[5.5px] sm:leading-[15px]"
                  data-payload-subpath={`items.${i}.description`}
                >
                  {marks(item.description)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  const trustBar = style === 'trustBar'

  return (
    <section
      className={cn(
        'w-full px-4 font-inter sm:px-6',
        trustBar ? 'bg-white lg:px-5' : 'py-5 sm:py-10 lg:px-8',
        !trustBar && (background === 'light' ? 'bg-mist-100' : 'bg-white'),
        SECTION_PADDING[style],
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-[1400px]">
        {header}
        {body}
        {footnote && style !== 'checklist' && (
          <p
            className="mx-auto mt-5 max-w-[600px] whitespace-pre-line text-center text-[18.75px] leading-[25px] text-brand-500 sm:mt-8 sm:text-[17px] sm:leading-[23px] lg:mt-[42px] lg:text-[18.75px] lg:leading-[25px]"
            data-payload-subpath="footnote"
          >
            {marks(footnote)}
          </p>
        )}
      </div>
    </section>
  )
}
