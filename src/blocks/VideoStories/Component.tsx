import React from 'react'

import type { VideoStoriesBlock as Props } from '@/payload-types'

import { Carousel } from './Carousel'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/**
 * Figma 2002:10 (SOCIAL PROOF). A 1400px container with 31.25px padding and a 12.5px
 * rhythm: pill → intro (20px padding, 13px gap) → carousel → dots.
 *
 * Mobile (6246:3119, 440 wide): 30px vertical padding, a 42px heading over a 32px
 * brand-300 italic line, and a 208.75px-card track centred on its middle story.
 */
export const VideoStoriesBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  eyebrow,
  heading,
  posterIncludesChrome,
  stories,
  subheading,
}) => {
  const items = Array.isArray(stories) ? stories : []

  return (
    <section
      className="w-full bg-navy px-4 font-inter sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[12.5px] py-[30px] lg:py-[31.25px]">
        {eyebrow && (
          <span
            className="flex h-[31.25px] max-w-full items-center justify-center rounded-[15.625px] border-[1.25px] border-brand-300 whitespace-nowrap px-[clamp(4px,calc((100vw-351px)/2),31.25px)] text-center text-xs font-bold uppercase leading-[1.25] tracking-[3.6px] text-white max-[374px]:tracking-[1.5px] sm:px-[31.25px] [&_sup]:leading-[0]"
            data-payload-subpath="eyebrow"
          >
            {/* Wrapped so the flex pill doesn't turn the text runs either side of the ®
                into separate flex items and swallow the space after it. */}
            <span>{marks(eyebrow)}</span>
          </span>
        )}

        {(heading || subheading) && (
          <header className="flex flex-col items-center gap-[13px] py-5 text-center">
            {heading && (
              <h2
                className="font-marcellus text-[42px] font-normal leading-[53px] text-white lg:text-5xl lg:leading-[1.25] [&_sup]:leading-[0]"
                data-payload-subpath="heading"
              >
                {marks(heading)}
              </h2>
            )}

            {subheading && (
              <p
                className="font-playfair text-[32px] font-normal italic leading-[1.34] text-brand-200 max-sm:text-brand-300"
                data-payload-subpath="subheading"
              >
                {marks(subheading)}
              </p>
            )}
          </header>
        )}

        {items.length > 0 && (
          <div className="w-full">
            <Carousel posterIncludesChrome={Boolean(posterIncludesChrome)} stories={items} />
          </div>
        )}
      </div>
    </section>
  )
}
