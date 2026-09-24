import React from 'react'

import type { ClosingCtaBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

import { CardsCarousel } from './Carousel'

/**
 * Figma "APPROACH" (desktop 2002:21, mobile 6246:3859).
 *
 * Desktop: a 1400px container padded 31.25px with every row 11.75px apart; four 250×281
 * cards whose photo fills the whole card and a 110px white panel sits on its lower edge.
 * Mobile: 16px gutters, 20px top/bottom, rows 18.75px apart, the cards become a two-up swipe
 * track with arrows, and the buttons stack.
 */
export const ClosingCtaBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  cards,
  description,
  heading,
  headingTop,
  links,
}) => {
  const items = Array.isArray(cards) ? cards : []

  const slides = items.map((card, i) => (
    <li
      className="relative h-[281.25px] w-[calc((100%-17.5px)/2)] shrink-0 snap-start overflow-hidden rounded-xl bg-white shadow-[0_0_6.25px_rgba(0,0,0,0.15)] sm:w-[250px]"
      data-payload-subpath={`cards.${i}.title`}
      key={card.id ?? i}
    >
      <div className="absolute inset-0">
        <ImageSlot
          className="h-full w-full"
          hint="Lifestyle photo"
          imgClassName="h-full w-full object-cover"
          label={`Card ${i + 1} image`}
          resource={card.image}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex min-h-[110px] gap-2 rounded-xl bg-white p-2.5 sm:gap-[12.5px] sm:p-[12.5px] lg:h-[110px]">
        {/* Uploaded mark wins; the icon is the fallback, so a card without one
            renders exactly as before. */}
        {card.iconImage && typeof card.iconImage === 'object' ? (
          <span
            className="block size-9 shrink-0 sm:size-[50px]"
            data-payload-subpath={`cards.${i}.iconImage`}
          >
            <Media
              htmlElement={null}
              imgClassName="size-9 object-contain sm:size-[50px]"
              resource={card.iconImage}
            />
          </span>
        ) : (
          <BrandIcon
            className="shrink-0 text-navy [&>svg]:size-9 sm:[&>svg]:size-[50px]"
            name={card.icon}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-[6.25px]">
          <h3 className="text-xs font-bold leading-[15px] text-navy [&_sup]:leading-[0]">
            {marks(card.title)}
          </h3>
          {card.description && (
            <p
              className="text-[10px] leading-[12px] text-black"
              data-payload-subpath={`cards.${i}.description`}
            >
              {marks(card.description)}
            </p>
          )}
        </div>
      </div>
    </li>
  ))

  return (
    <section
      className="w-full bg-tint-50 px-4 py-5 font-inter lg:px-5 lg:py-[31.25px]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[18.75px] lg:gap-[11.75px] lg:px-[31.25px]">
        {(headingTop || heading) && (
          <header className="flex flex-col text-center font-marcellus text-[32px] leading-[40px] font-normal text-navy-900 lg:gap-[11.75px] lg:text-[51px]">
            {headingTop && (
              // Figma thickens this line with a 1px outside stroke rather than a bold weight:
              // a 2px centred stroke painted under the fill leaves exactly 1px outside.
              <h2
                className="[-webkit-text-stroke:1.4px_currentColor] [paint-order:stroke_fill] lg:leading-[55px] lg:[-webkit-text-stroke:2px_currentColor]"
                data-payload-subpath="headingTop"
              >
                {marks(headingTop)}
              </h2>
            )}

            {heading && (
              <p
                className="font-marcellus lg:leading-[56px] [&_sup]:leading-[0]"
                data-payload-subpath="heading"
              >
                {marks(heading)}
              </p>
            )}
          </header>
        )}

        {description && (
          <p
            className="text-center text-base leading-[19px] font-medium whitespace-pre-line text-navy [&_sup]:leading-[0]"
            data-payload-subpath="description"
          >
            {marks(description)}
          </p>
        )}

        {slides.length > 0 && (
          <div className="mx-auto w-full xl:w-auto">
            <CardsCarousel slides={slides} />
          </div>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-[18.75px]">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className={
                  link.appearance === 'outline'
                    ? 'cta-gleam [--cta-gleam-color:color-mix(in_oklab,currentcolor_10%,transparent)] inline-flex h-[56.25px] w-[287.5px] max-w-full items-center justify-center rounded-[6.25px] border-[0.63px] border-navy text-lg leading-[22px] font-medium text-navy transition-colors hover:bg-white/60'
                    : 'cta-gleam [--cta-glow:var(--color-navy)] inline-flex h-[56.25px] w-[287.5px] max-w-full items-center justify-center rounded-[6.25px] bg-navy text-lg leading-[22px] font-medium text-white transition-colors hover:bg-brand-dark'
                }
                key={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
