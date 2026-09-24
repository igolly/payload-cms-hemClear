import React from 'react'

import type { StatsBarBlock as Props } from '@/payload-types'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Stat = NonNullable<Props['stats']>[number]

/**
 * Figure sizes from the desktop comp (`lg`, Marcellus): 50px for a short figure, 42px for a
 * long one ("500,000+") so it stays inside its column, and 40px for a figure under a top label
 * ("The / Original"). The mobile sizes are 48/50, 36/40 and 36/38 on the 440px artboard,
 * scaled with the viewport below it so a 390px phone keeps the labels inside their cells.
 */
const valueSizes: Record<NonNullable<Stat['valueSize']>, string> = {
  lg: 'text-[min(48px,10.91vw)] leading-[50px] lg:h-[55px] lg:text-[50px] lg:leading-[55px]',
  md: 'text-[min(36px,8.18vw)] leading-[40px] lg:h-[55px] lg:text-[42px] lg:leading-[55px]',
  sm: 'text-[min(36px,8.18vw)] leading-[38px] lg:h-[40px] lg:text-[40px] lg:leading-[40px]',
}

export const StatsBarBlock: React.FC<Props> = ({ bgColor, bgColorCustom, stats }) => {
  const items = Array.isArray(stats) ? stats : []

  if (items.length === 0) return null

  return (
    <section
      // Mobile comp: a 2x2 grid of 200px cells inset 16px / 10px. Marcellus at every width —
      // the comp sets the phone figures in Fraunces, which the site no longer loads.
      className="w-full bg-mist px-4 py-[10px] font-marcellus sm:px-6 lg:px-8 lg:py-0"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <ul className="mx-auto grid max-w-[1116px] grid-cols-[repeat(2,minmax(0,200px))] justify-start text-center text-brand-600 sm:justify-center lg:flex lg:items-center lg:py-[3px]">
        {items.map((stat, i) => {
          // A long figure ("500,000+") at the large size runs into its column's divider, so it
          // steps down to `md` unless an editor has picked a size.
          const size =
            stat.valueSize ?? (stat.topLabel ? 'sm' : stat.value.length > 6 ? 'md' : 'lg')

          return (
            <li
              className={cn(
                // `marks` sets ® in a <sup>; keep it from opening up the fixed line boxes.
                // Mobile cells: bottom-aligned, 16px above and below, 5px between lines, split by
                // #ddd rules (left rule on the right-hand column, top rule on the second row).
                'flex min-w-0 flex-col items-center justify-end gap-[5px] py-4 [&_sup]:leading-[0] max-lg:even:border-l max-lg:even:border-ash-200 max-lg:[&:nth-child(n+3)]:border-t max-lg:[&:nth-child(n+3)]:border-ash-200 lg:flex-1 lg:justify-start lg:border-l lg:border-brand-500 lg:px-[42px] lg:py-0 lg:first:border-l-0',
                stat.topLabel ? 'lg:gap-1' : 'lg:gap-[3px]',
              )}
              data-payload-subpath={`stats.${i}.value`}
              key={stat.id ?? i}
            >
              {stat.topLabel ? (
                // The comp sets "The / Original" as one 74px text box: 34px + 40px lines.
                <span className="flex flex-col items-center gap-[5px] lg:gap-0">
                  <span
                    className="text-[min(26px,5.91vw)] leading-[28px] lg:text-[30px] lg:leading-[34px]"
                    data-payload-subpath={`stats.${i}.topLabel`}
                  >
                    {marks(stat.topLabel)}
                  </span>
                  <span
                    className={cn('whitespace-nowrap font-bold lg:font-normal', valueSizes[size])}
                  >
                    {marks(stat.value)}
                    {stat.showStar && <span aria-hidden>★</span>}
                  </span>
                </span>
              ) : (
                <span
                  className={cn('whitespace-nowrap font-bold lg:font-normal', valueSizes[size])}
                >
                  {marks(stat.value)}
                  {stat.showStar && <span aria-hidden>★</span>}
                </span>
              )}

              {stat.label && (
                <span
                  className="whitespace-nowrap text-[min(24px,5.455vw)] leading-[30px] lg:text-2xl"
                  data-payload-subpath={`stats.${i}.label`}
                >
                  {marks(stat.label)}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
