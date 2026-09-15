import React from 'react'

import type { BenefitsCarouselBlock as Props } from '@/payload-types'

import { Cards } from './Cards'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/**
 * Figma "BENEFITS" (2002:9): a 1400 container with the heading, a short rule and the
 * sub-heading stacked at a 10px rhythm, then a track of 208.75 × 395 photo cards.
 *
 * Mobile (6246:3082, 440 wide): the same stack at a 16px rhythm, 42.5px above it, two
 * 194px cards per view; the dots row (6516:1797) closes the band 30px under the cards.
 */
export const BenefitsCarouselBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  heading,
  items,
  subheading,
}) => {
  const benefits = Array.isArray(items) ? items : []

  return (
    <section
      className="w-full bg-tint-200 px-4 py-10 font-inter max-sm:pb-[14.5px] max-sm:pt-[42.5px] sm:px-6 xl:flex xl:px-0 xl:min-h-[609px] xl:items-center xl:py-5"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[10px] text-center max-sm:gap-4">
        {heading && (
          <h2
            className="font-marcellus text-[36px] leading-[45px] text-navy-900 sm:text-[44px] sm:leading-[1.1] xl:text-[52px] xl:leading-[55px] [&_sup]:leading-[0]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {/* Figma's rule is a 0-height vector with a 2.5 stroke: it adds no height to the stack. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
        <img
          alt=""
          className="-my-[1.25px] block h-[2.5px] w-[62.5px]"
          height={2.5}
          src="/icons/benefits/line.svg"
          width={62.5}
        />

        {subheading && (
          <p
            className="text-2xl font-medium leading-[29px] text-brand-500"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {/* Figma's 6.25px "spacing" frame between the header and the grid. */}
        <div aria-hidden className="h-[6.25px]" />

        {benefits.length > 0 && <Cards items={benefits} />}
      </div>
    </section>
  )
}
