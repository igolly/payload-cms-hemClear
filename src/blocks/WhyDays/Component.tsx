import React from 'react'

import type { WhyDaysBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

/**
 * Figma 2002:18 (WHY 90 DAYS). A 1400px container, 30/120 padding, with the copy column
 * (483.8px) pushed to the right and the hand photo filling the left of the container.
 * Every gap in the column is 10px (10.19 in the copy/product row).
 *
 * The comp paints the hand as the container's image fill; the CMS image is the hand on its
 * own, so from `xl` it is placed where the fill puts it (749px wide, fingertips ~78px down)
 * and clipped by the container. Its box narrows with the container so it never runs under
 * the copy between 1280 and 1440.
 */
export const WhyDaysBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  ctaHeading,
  ctaText,
  heading,
  image,
  links,
  paragraphs,
  productImage,
}) => {
  const paras = Array.isArray(paragraphs) ? paragraphs : []

  return (
    <section
      className="w-full bg-mist px-4 font-inter sm:px-6"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-5 overflow-hidden py-[30px] xl:flex-row xl:items-start xl:justify-end xl:gap-0 xl:pr-[120px]">
        {/* Hand photo */}
        <div
          className="relative w-full max-w-[400px] xl:absolute xl:left-0 xl:top-0 xl:w-[calc(100%-651px)] xl:max-w-[749px]"
          data-payload-subpath="image"
        >
          <div className="relative aspect-[1012/846] w-full max-xl:max-h-[240px] xl:mt-[10.4%]">
            <ImageSlot
              className="h-full w-full"
              hint="Hand / lifestyle photo"
              imgClassName="h-full w-full object-contain object-top mix-blend-multiply"
              label="Section image"
              resource={image}
            />
          </div>
        </div>

        {/* Copy column */}
        <div className="relative flex w-full max-w-[483.8px] flex-col items-start gap-[10px]">
          {heading && (
            <h2
              className="font-marcellus text-[36px] font-normal leading-[normal] text-navy-900 sm:text-[52px] sm:leading-[65px] [&_sup]:leading-[0]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {/* Figma draws this as a 0-height line with a 2.55px centred stroke. */}
          <span aria-hidden="true" className="relative block h-0 w-[76.84%] shrink-0">
            <span className="absolute inset-x-0 top-1/2 h-[2.55px] -translate-y-1/2 bg-gradient-to-r from-navy to-brand-300" />
          </span>

          <div className="flex w-full items-center gap-[10.19px]">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[10.19px] sm:w-[331.02px] sm:flex-none">
              {paras.length > 0 && (
                <div className="flex flex-col gap-[7.4px] text-base font-medium leading-[19.36px] text-navy">
                  {paras.map((paragraph, i) => (
                    <p data-payload-subpath={`paragraphs.${i}.text`} key={paragraph.id ?? i}>
                      {marks(paragraph.text)}
                    </p>
                  ))}
                </div>
              )}

              {ctaHeading && (
                <h3
                  className="font-playfair text-2xl font-bold leading-[normal] text-navy-900 [&_sup]:leading-[0]"
                  data-payload-subpath="ctaHeading"
                >
                  {marks(ctaHeading)}
                </h3>
              )}

              {ctaText && (
                <p
                  className="text-base font-medium leading-[19.36px] text-navy"
                  data-payload-subpath="ctaText"
                >
                  {marks(ctaText)}
                </p>
              )}
            </div>

            <div
              className="relative aspect-[142.59/264.81] w-[27%] max-w-[142.59px] shrink-0 sm:w-[142.59px]"
              data-payload-subpath="productImage"
            >
              <ImageSlot
                className="h-full w-full"
                hint="Product shot"
                label="Product"
                resource={productImage}
              />
            </div>
          </div>

          {Array.isArray(links) &&
            links.slice(0, 1).map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className="inline-flex h-[31.57px] items-center gap-[15.28px] rounded-[15.79px] bg-brand-600 px-[15.28px] py-[5.09px] text-[10px] font-bold uppercase leading-[normal] text-white transition-colors hover:bg-brand-dark"
                key={i}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
                <img
                  alt=""
                  className="size-[18px] shrink-0"
                  height={18}
                  src="/icons/why-days/arrow-circle-right-white.svg"
                  width={18}
                />
              </CMSLink>
            ))}
        </div>
      </div>
    </section>
  )
}
