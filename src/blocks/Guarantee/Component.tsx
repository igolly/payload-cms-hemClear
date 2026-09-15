import React from 'react'

import type { GuaranteeBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

/**
 * Figma `2002:17`. The comp's icons are filled two-tone glyphs the line set in `BrandIcons`
 * doesn't match, so they ship as the exported SVGs, keyed by the icon each row already selects.
 * Any other icon an editor picks falls back to the shared line set.
 */
const pointIcons: Record<string, string> = {
  calendar: '/icons/guarantee/calendar.svg',
  refund: '/icons/guarantee/refund.svg',
  shieldCheck: '/icons/guarantee/shield-check.svg',
}

const pillIcons: Record<string, string> = {
  badgeAward: '/icons/guarantee/tested.svg',
  madeInUsa: '/icons/guarantee/usa.svg',
  packageBox: '/icons/guarantee/package.svg',
  rotate: '/icons/guarantee/cancel.svg',
  truck: '/icons/guarantee/truck.svg',
}

/**
 * The comp's soft drop shadow, shared by the eyebrow, the card and every pill. Their Figma
 * strokes sit inside the box, so the card and pills use 22.5px padding (23.44 minus the
 * 0.94px border) to keep Figma's outer sizes.
 */
const SHADOW = 'shadow-[0_1.875px_7.031px_rgba(0,0,0,0.25)]'

const Icon: React.FC<{ map: Record<string, string>; name?: string | null }> = ({ map, name }) =>
  name && map[name] ? (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
    <img alt="" className="size-[30px] shrink-0" height={30} src={map[name]} width={30} />
  ) : (
    <BrandIcon className="shrink-0 text-brand-600 [&>svg]:size-[30px]" name={name} />
  )

export const GuaranteeBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  badgeLabel,
  badges,
  heading,
  points,
  sealLabel,
  sealValue,
  subheading,
}) => {
  const pointItems = Array.isArray(points) ? points : []
  const pills = Array.isArray(badges) ? badges : []
  // The exported seal artwork reads "90 DAY"; other wording gets the drawn fallback below.
  const standardSeal = sealValue?.trim() === '90' && sealLabel?.trim().toUpperCase() === 'DAY'

  return (
    <section
      className="w-full bg-white px-4 font-inter sm:px-6"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[9.375px] py-[23.4375px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
        <img alt="" className="size-16" height={64} src="/icons/guarantee/shield.svg" width={64} />

        {badgeLabel && (
          <span
            className={cn(
              'flex h-[23.4375px] items-center rounded-[11.72px] bg-gradient-to-b from-brand-600 to-[#01124c] px-[23.4375px] text-xs font-bold uppercase leading-[normal] text-white',
              SHADOW,
            )}
            data-payload-subpath="badgeLabel"
          >
            {marks(badgeLabel)}
          </span>
        )}

        {heading && (
          <h2
            className="text-center font-marcellus text-[2.25rem] font-normal leading-[normal] text-navy-900 lg:text-[55px]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {subheading && (
          <p
            className="text-center text-lg font-medium leading-[normal] text-brand-500 lg:text-2xl"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {pointItems.length > 0 && (
          <div
            className={cn(
              'flex w-full max-w-[704px] flex-col items-center gap-[23.4375px] rounded-[23.44px] border-[0.9375px] border-brand-300 bg-gradient-to-r from-[#f3f6fb] via-white to-[#f3f6fb] p-[22.5px] sm:flex-row',
              SHADOW,
            )}
          >
            {standardSeal ? (
              // eslint-disable-next-line @next/next/no-img-element -- fixed-size artwork exported from the comp
              <img
                alt={`${sealValue} ${sealLabel}`}
                className="size-[140.625px] shrink-0"
                height={141}
                src="/icons/guarantee/seal-90-day.png"
                width={141}
              />
            ) : (
              <div className="relative flex size-[140.625px] shrink-0 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-[6px] rounded-full border border-dotted border-brand-300"
                />
                <span className="flex size-[108px] flex-col items-center justify-center rounded-full bg-brand-500 leading-none text-white">
                  <span className="font-playfair text-5xl font-bold">{marks(sealValue)}</span>
                  <span className="mt-1 font-playfair text-lg font-bold uppercase">
                    {marks(sealLabel)}
                  </span>
                </span>
              </div>
            )}

            <ul className="flex min-w-0 flex-col gap-[14.0625px]">
              {pointItems.map((point, i) => (
                <li
                  className="flex items-center gap-[14.0625px]"
                  data-payload-subpath={`points.${i}.text`}
                  key={point.id ?? i}
                >
                  <Icon map={pointIcons} name={point.icon} />
                  {/* The comp sets ® inline at text size here, not raised. */}
                  <span className="font-playfair text-base leading-[normal] text-brand-600">
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pills.length > 0 && (
          <ul className="flex w-full max-w-[884px] flex-wrap items-start justify-center gap-[14.0625px] py-[9.375px]">
            {pills.map((pill, i) => (
              <li
                className={cn(
                  'flex h-[41.25px] items-center gap-[14.0625px] rounded-[14.06px] border-[0.9375px] border-brand-300 bg-gradient-to-r from-[#f3f6fb] to-white px-4 sm:px-[22.5px]',
                  SHADOW,
                )}
                data-payload-subpath={`badges.${i}.label`}
                key={pill.id ?? i}
              >
                <Icon map={pillIcons} name={pill.icon} />
                <span className="whitespace-nowrap text-sm font-bold uppercase leading-[normal] text-navy sm:text-lg">
                  {marks(pill.label)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
