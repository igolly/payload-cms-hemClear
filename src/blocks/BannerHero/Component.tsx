import React from 'react'

import type { BannerHeroBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

/**
 * Figma "PILL HERO" (2003:237): a navy band holding a 1200 × 675 photo panel, with the copy
 * column (514 wide) on the photo's dark left side. Measurements are the Figma values.
 */
export const BannerHeroBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  backgroundImage,
  description,
  eyebrow,
  heading,
  height,
  links,
  overlay,
}) => {
  const hasImage = backgroundImage && typeof backgroundImage === 'object'
  const short = height === 'short'

  return (
    <section
      className="w-full bg-[#0c2657] font-inter"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-[1200px] items-center overflow-hidden',
          short ? 'min-h-[420px] lg:h-[480px]' : 'min-h-[560px] lg:h-[675px]',
        )}
      >
        {hasImage ? (
          <Media
            className="absolute inset-0"
            fill
            imgClassName="object-cover object-[30%_50%] lg:object-center"
            priority
            resource={backgroundImage}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--color-navy-900)_0%,var(--color-navy-600)_60%,var(--color-brand-500)_100%)]" />
        )}

        {overlay === 'none' ? (
          // The Figma photo carries its own dark side for the copy. Once the panel is too
          // narrow to keep the copy on that side, a wash keeps it readable.
          <div aria-hidden="true" className="absolute inset-0 bg-[#0c2657]/60 lg:hidden" />
        ) : (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0',
              overlay === 'even'
                ? 'bg-navy-900/55'
                : 'bg-[linear-gradient(90deg,rgba(13,32,80,0.92)_0%,rgba(13,32,80,0.75)_45%,rgba(13,32,80,0.15)_100%)]',
            )}
          />
        )}

        <div className="relative flex w-full flex-col items-start gap-6 px-4 py-12 sm:px-8 lg:w-auto lg:max-w-[639px] lg:gap-[31.25px] lg:px-[62.5px] lg:py-[43.75px]">
          <div className="flex w-full flex-col gap-6 lg:w-[514px] lg:gap-[31.25px]">
            {eyebrow && (
              <p
                className="text-[15px] font-semibold uppercase leading-none text-brand-300 lg:text-[17.5px] lg:leading-[17.5px] [&_sup]:leading-[0]"
                data-payload-subpath="eyebrow"
              >
                {marks(eyebrow)}
              </p>
            )}

            {heading && (
              <h1
                className="font-marcellus text-[38px] font-normal leading-[1.05] text-white sm:text-[48px] lg:text-[57.5px] lg:leading-[59.38px]"
                data-payload-subpath="heading"
              >
                {multiline(heading)}
              </h1>
            )}

            <span
              aria-hidden="true"
              className="-my-[1.56px] block h-[3.13px] w-[62.5px] bg-aqua-200"
            />

            {description && (
              <p
                className="whitespace-pre-line text-base leading-[1.5] text-white lg:text-[17.5px] lg:leading-[26.25px]"
                data-payload-subpath="description"
              >
                {marks(description)}
              </p>
            )}
          </div>

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {links.map(({ link }, i) => (
                <CMSLink
                  {...link}
                  appearance="inline"
                  className="inline-flex h-[38.75px] items-center gap-[18.75px] rounded-full bg-brand-300 px-[18.75px] text-[12.5px] font-bold uppercase leading-[12.5px] text-white transition-colors hover:bg-brand-400"
                  key={i}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="h-5 w-5 shrink-0"
                    decoding="async"
                    height={20}
                    loading="lazy"
                    src="/icons/ingredients/arrow-right-circle.png"
                    width={20}
                  />
                </CMSLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
