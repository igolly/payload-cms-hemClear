import React from 'react'

import type { ResultsBannerBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

/**
 * The reported results, full width, on the navy band.
 *
 * The figures are the loudest thing here and the counts behind them the quietest, which is
 * the right order for reading but the wrong order for trust — so the count sits with its
 * figure in the same card rather than being swept into the footnote, and the footnote keeps
 * the qualification that applies to all four.
 */
export const ResultsBannerBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  footnote,
  heading,
  image,
  intro,
  results,
}) => {
  const figures = Array.isArray(results) ? results : []

  if (figures.length === 0) return null

  const hasImage = image && typeof image === 'object'

  return (
    <section
      className="w-full bg-navy-900 px-4 py-10 font-inter text-white sm:px-6 lg:px-8 lg:py-14"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1240px] flex-col items-center gap-8',
          hasImage && 'lg:flex-row lg:items-center lg:gap-12',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
          {heading && (
            <h2
              className="text-balance text-center font-marcellus text-[32px] leading-[1.1] sm:text-[44px] [&_sup]:leading-[0]"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}

          {intro && (
            <p
              className="max-w-[640px] text-balance text-center text-sm leading-5 text-white/80 sm:text-base"
              data-payload-subpath="intro"
            >
              {marks(intro)}
            </p>
          )}

          {/*
           * Two across on a phone rather than four: at four, a figure like "91%" and the
           * count under it share about 80px, which sets the count at a size nobody reads.
           */}
          <ul className="mt-4 grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {figures.map((figure, i) => (
              <li
                className="flex flex-col items-center gap-1 rounded-2xl bg-white/[0.07] px-3 py-4 text-center ring-1 ring-inset ring-white/15 sm:px-4"
                data-payload-subpath={`results.${i}.value`}
                key={figure.id ?? i}
              >
                {/*
                 * Two lines' worth of room whether the label needs it or not, so the figures
                 * sit on one line across the row. "Improvement Within 30 Days" wraps where
                 * "Less Bleeding" does not, and without this its 97% dropped below its
                 * neighbours and the row stopped reading as one set of numbers.
                 */}
                <p className="flex min-h-8 items-center text-xs font-bold uppercase leading-4 text-white/85 sm:min-h-10 sm:text-sm sm:leading-5">
                  {marks(figure.label)}
                </p>
                <p className="font-gentium text-[44px] font-bold leading-[1.05] text-aqua sm:text-[56px]">
                  {marks(figure.value)}
                </p>
                {figure.detail && (
                  <p className="text-[11px] leading-[15px] text-white/70 sm:text-xs sm:leading-4">
                    {marks(figure.detail)}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {footnote && (
            <p
              className="mt-2 max-w-[860px] text-balance text-center text-[11px] leading-4 text-white/60"
              data-payload-subpath="footnote"
            >
              {marks(footnote)}
            </p>
          )}
        </div>

        {hasImage && (
          <div className="w-[220px] shrink-0 sm:w-[260px] lg:w-[300px]" data-payload-subpath="image">
            <Media
              imgClassName="h-auto w-full object-contain"
              resource={image}
              size="(min-width: 1024px) 300px, 260px"
            />
          </div>
        )}
      </div>
    </section>
  )
}
