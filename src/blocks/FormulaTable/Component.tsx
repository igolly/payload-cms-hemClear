import React from 'react'

import type { FormulaTableBlock as Props } from '@/payload-types'

import { Table } from './Table'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/**
 * Figma home frames COMBO (heading + product tiles) and INGREDIENTS (formula table),
 * stacked inside one 1400px container. The phone comp tints the band #f8f9fd and sets the
 * heading as an 18px Inter subtitle.
 */
export const FormulaTableBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  footnote,
  formulas,
  heading,
}) => {
  const items = Array.isArray(formulas) ? formulas : []

  return (
    <section
      className="w-full bg-mist px-4 pt-[18.75px] pb-4 font-inter sm:px-6 lg:bg-white lg:px-8 lg:pt-[29.75px] lg:pb-[31.25px]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center">
        {heading && (
          <h2
            className="-mx-4 text-center text-lg font-medium leading-[22px] text-brand-500 sm:mx-0 md:font-marcellus md:text-[2rem] md:font-normal md:leading-[1.25] md:text-navy-900 lg:text-5xl lg:leading-[60px] [&_sup]:leading-[0]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {items.length > 0 && <Table formulas={items} />}

        {footnote && (
          <p
            className="mt-3 flex w-full items-center justify-center gap-[18.75px] px-[59.375px] py-[9.375px] text-base leading-[19px] font-normal text-black lg:mt-[12.5px] lg:w-auto lg:max-w-[582.75px] lg:px-0"
            data-payload-subpath="footnote"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
            <img
              alt=""
              className="size-16 shrink-0"
              decoding="async"
              height={64}
              loading="lazy"
              src="/icons/formula-table/backed-by-science.svg"
              width={64}
            />
            <span className="min-w-0 flex-1 lg:w-[500px] lg:flex-none">{marks(footnote)}</span>
          </p>
        )}
      </div>
    </section>
  )
}
