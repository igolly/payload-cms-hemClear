import React from 'react'

import type { ScienceStatsBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { asText, marks } from '@/utilities/marks'

/**
 * A figure wider than three characters ("2-Part") drops from 56px to
 * 42px so it still fits the fixed 143.75px figure column (the phone comp uses the same sizes).
 */
const valueSize = (value: string) =>
  value.length > 3 ? 'text-[42px] leading-[43.75px]' : 'text-[56px] leading-[56.25px]'

export const ScienceStatsBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  badges,
  footnote,
  heading,
  image,
  links,
  stats,
  subheading,
}) => {
  const items = Array.isArray(stats) ? stats : []
  const chips = Array.isArray(badges) ? badges : []

  return (
    <section className="w-full bg-mist font-inter" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[12.5px] px-[31.25px] py-[18.75px] lg:py-[33.75px]">
        {heading && (
          <h2
            className="text-balance text-center font-marcellus text-[28px] font-normal leading-[normal] text-navy-900 lg:text-[51px] lg:leading-[64px] lg:text-heading xl:whitespace-nowrap"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {subheading && (
          <p
            className="text-balance text-center text-xl font-medium leading-[26px] text-ash-500 lg:text-2xl lg:leading-[29px] lg:text-ash-600"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {/* Phones stack the figures (and buttons) above the illustration; desktop sets the image first. */}
        <div className="flex w-full flex-col-reverse items-center justify-center gap-[6.25px] p-[6.25px] lg:flex-row">
          <div
            className="relative aspect-[878/600] w-full max-w-[548.75px] shrink-0"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Science / formula visual"
              imgClassName="h-full w-full object-cover"
              label="Formula visual"
              resource={image}
            />
          </div>

          <div className="flex w-full max-w-[410px] flex-col items-start">
            <ul className="flex w-full flex-col">
              {items.map((stat, i) => (
                <li
                  className="flex items-center gap-[18.75px] border-b border-aqua-200 py-4 last:border-b-0 [&_sup]:leading-[0]"
                  data-payload-subpath={`stats.${i}.title`}
                  key={stat.id ?? i}
                >
                  <span
                    className={cn(
                      'w-[143.75px] shrink-0 whitespace-nowrap text-center font-bold text-heading',
                      valueSize(stat.value),
                    )}
                  >
                    {marks(stat.value)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[6.25px] leading-normal">
                    <span className="text-base font-semibold leading-5 text-info-dark">
                      {marks(stat.title)}
                    </span>
                    {stat.description && (
                      <span className="text-xs leading-[15px] text-black">
                        {marks(stat.description)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {Array.isArray(links) && links.length > 0 && (
              <div className="flex w-full flex-col items-center gap-[12.5px] lg:flex-row lg:flex-wrap lg:items-start">
                {links.map(({ link }, i) => (
                  <CMSLink
                    {...link}
                    appearance="inline"
                    className={cn(
                      // Phone comp: 260×40 pill, 14px label. Desktop comp: 187.5×38.75, 10px label.
                      'inline-flex h-10 w-[260px] max-w-full items-center justify-center whitespace-pre rounded-[20px] p-[6px] text-center text-sm font-medium leading-[normal] transition-colors [&_sup]:leading-[0] lg:h-[38.75px] lg:w-[187.5px] lg:rounded-[19.375px] lg:p-[6.25px] lg:text-[10px] lg:leading-3',
                      link.appearance === 'outline'
                        ? 'cta-gleam [--cta-gleam-color:color-mix(in_oklab,currentcolor_10%,transparent)] border-[1.25px] border-brand-600 text-brand-600 hover:bg-white'
                        : 'cta-gleam [--cta-glow:var(--color-brand-600)] bg-brand-600 text-white hover:bg-brand-dark',
                    )}
                    key={i}
                  >
                    {/* The comp trails every button label with two spaces and an arrow. */}
                    {!asText(link.label).trim().endsWith('→') && (
                      <span aria-hidden="true">{'  →'}</span>
                    )}
                  </CMSLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {chips.length > 0 && (
          // Phone comp: four equal cells in one row, labels wrapping to two lines.
          <ul className="flex w-full items-center justify-center sm:w-auto sm:flex-wrap sm:gap-y-2">
            {chips.map((chip, i) => (
              <li
                className="min-w-0 flex-1 border-l border-ash-500 px-[10px] py-[6px] text-center text-base font-semibold leading-5 text-heading first:border-l-0 sm:flex-none sm:whitespace-nowrap sm:px-6 sm:py-0 sm:font-bold"
                key={chip.id ?? i}
              >
                {marks(chip.text)}
              </li>
            ))}
          </ul>
        )}

        {footnote && (
          <p className="w-full text-center text-xs font-medium leading-[15px] text-ash-500">
            {marks(footnote)}
          </p>
        )}
      </div>
    </section>
  )
}
