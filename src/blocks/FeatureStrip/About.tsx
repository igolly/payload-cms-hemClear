import React from 'react'

import type { FeatureStripBlock as Props } from '@/payload-types'

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
          className="font-marcellus text-[34px] leading-[1.2] text-heading sm:text-[46px] lg:text-[57.5px] lg:leading-[normal]"
          data-payload-subpath="heading"
        >
          {multiline(heading)}
        </h2>
      )}
      {subheading && (
        <p
          className="mt-3 whitespace-pre-line text-[17px] leading-[normal] text-brand-500 lg:mt-[10.5px] lg:text-[18.75px]"
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
    body = (
      <ul className="mx-auto mt-8 grid max-w-[1037.5px] grid-cols-2 gap-[12.5px] sm:grid-cols-3 lg:mt-[16px] lg:grid-cols-6">
        {strip.map((item, i) => (
          <li
            className="flex flex-col items-center rounded-[16px] bg-white px-[17px] pb-[25px] pt-[19.5px] text-center shadow-[0_0_5px_rgba(0,0,0,0.2)] lg:min-h-[337px]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art box="h-[78px] w-[78px]" fallback="rounded-full bg-[#f2f7fe]" item={item} />
            <h3
              className={cn(
                'mt-[21.5px] text-[13.75px] font-bold leading-[16.25px] text-brand-500',
                upper && 'uppercase',
              )}
            >
              {marks(item.title)}
            </h3>
            {item.description && (
              <p
                className="mt-[21.5px] text-[13.75px] leading-[16.5px] text-black"
                data-payload-subpath={`items.${i}.description`}
              >
                {marks(item.description)}
              </p>
            )}
          </li>
        ))}
      </ul>
    )
  }

  if (style === 'pills') {
    body = (
      <ul className="mx-auto mt-8 flex max-w-[1143.75px] flex-wrap justify-center gap-[12.5px] lg:mt-[43.5px]">
        {strip.map((item, i) => (
          <li
            className="flex min-h-[72px] w-[calc(50%-6.25px)] items-center gap-2 rounded-[15px] bg-white py-2 pl-3 pr-2 sm:pr-[14px] shadow-[0_0_10px_rgba(0,0,0,0.2)] sm:h-[81.25px] sm:w-[218.75px] sm:gap-[12.5px] sm:pl-[18.75px]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art box="h-10 w-10 sm:h-14 sm:w-14" fallback="" item={item} />
            <span className="min-w-0 text-[14px] leading-[18px] text-heading sm:text-[16px] sm:leading-[20px]">
              {marks(item.title)}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (style === 'cards') {
    body = (
      <ul className="mx-auto mt-8 grid max-w-[1103px] grid-cols-1 gap-[13px] sm:grid-cols-2 lg:mt-[38px] xl:grid-cols-4">
        {strip.map((item, i) => (
          <li
            className="flex min-h-[166px] items-center gap-[6px] rounded-[20px] bg-white py-3 pl-[16px] pr-[18px] shadow-[0_0_8px_rgba(0,0,0,0.2)]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art
              box="h-[124px] w-[88px]"
              fallback="rounded-full bg-mist-100"
              fallbackBox="h-[88px] w-[88px]"
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
                  className="mt-[6.5px] text-[13.75px] leading-[16.5px] text-black"
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
      <div className="mx-auto mt-8 flex max-w-[850px] flex-col items-center gap-8 lg:mt-[30px] lg:flex-row lg:items-stretch lg:gap-[50px]">
        <ul
          className="grid w-full grid-cols-1 gap-y-[12.5px] sm:w-auto sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[repeat(var(--rows),auto)] sm:gap-x-[50px]"
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
              <span className="text-[15px] font-medium leading-[26px] text-subheading">
                {marks(item.title)}
              </span>
            </li>
          ))}
        </ul>

        {footnote && (
          <p
            className="flex w-full max-w-[250px] shrink-0 items-center justify-center rounded-[20px] bg-tint-50 px-[22px] py-5 text-center text-[15px] font-medium leading-[21.25px] text-subheading lg:min-h-[141.5px]"
            data-payload-subpath="footnote"
          >
            {marks(footnote)}
          </p>
        )}
      </div>
    )
  }

  if (style === 'trustRow') {
    body = (
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex lg:justify-center lg:gap-0">
        {strip.map((item, i) => (
          <li
            className="flex items-center gap-[13px] lg:box-content lg:w-[296.5px] lg:shrink-0 lg:[&+li]:ml-[19px] lg:[&+li]:border-l lg:[&+li]:border-brand-300 lg:[&+li]:pl-[18px]"
            data-payload-subpath={`items.${i}.title`}
            key={item.id ?? i}
          >
            <Art box="h-[75px] w-[75px]" fallback="rounded-full bg-ash-250" item={item} />
            <div className="min-w-0 flex-1">
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
                  className="mt-[5.5px] text-[11.25px] leading-[15px] text-heading"
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
        trustBar ? 'bg-white lg:px-5' : 'py-10 lg:px-8',
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
            className="mx-auto mt-8 max-w-[600px] whitespace-pre-line text-center text-[17px] leading-[23px] text-brand-500 lg:mt-[42px] lg:text-[18.75px] lg:leading-[25px]"
            data-payload-subpath="footnote"
          >
            {marks(footnote)}
          </p>
        )}
      </div>
    </section>
  )
}
