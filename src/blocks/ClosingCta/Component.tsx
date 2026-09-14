import React from 'react'

import type { ClosingCtaBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

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

  return (
    <section
      className="w-full bg-tint-50 px-4 py-9 sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          {headingTop && (
            <h2
              className="font-marcellus text-3xl font-bold leading-[1.08] text-navy-900 sm:text-[3rem]"
              data-payload-subpath="headingTop"
            >
              {marks(headingTop)}
            </h2>
          )}

          {heading && (
            <p
              className="mt-1 font-marcellus text-3xl leading-[1.08] text-navy-900/85 sm:text-[3rem]"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </p>
          )}

          {description && (
            <p
              className="mx-auto mt-4 max-w-4xl whitespace-pre-line text-[16px] leading-snug text-navy"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}
        </header>

        {items.length > 0 && (
          <ul className="mx-auto mt-6 grid max-w-[1056px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((card, i) => (
              <li
                className="overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(16,60,120,0.08)]"
                data-payload-subpath={`cards.${i}.title`}
                key={card.id ?? i}
              >
                <div className="relative aspect-[3/2] w-full">
                  <ImageSlot
                    className="h-full w-full object-top"
                    hint="Lifestyle photo"
                    imgClassName="h-full w-full object-cover object-top"
                    label={`Card ${i + 1} image`}
                    resource={card.image}
                  />
                </div>

                <div className="flex gap-2.5 p-3">
                  {/* Uploaded mark wins; the icon is the fallback, so a card without one
                      renders exactly as before. */}
                  {card.iconImage && typeof card.iconImage === 'object' ? (
                    <span
                      className="block h-9 w-9 shrink-0"
                      data-payload-subpath={`cards.${i}.iconImage`}
                    >
                      <Media
                        htmlElement={null}
                        imgClassName="h-9 w-9 object-contain"
                        resource={card.iconImage}
                      />
                    </span>
                  ) : (
                    <BrandIcon
                      className="shrink-0 text-brand [&>svg]:h-9 [&>svg]:w-9"
                      name={card.icon}
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-serif text-xs font-bold leading-tight text-navy">
                      {marks(card.title)}
                    </h3>
                    {card.description && (
                      <p
                        className="mt-1 text-[10px] leading-snug text-slate-700"
                        data-payload-subpath={`cards.${i}.description`}
                      >
                        {marks(card.description)}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className={
                  link.appearance === 'outline'
                    ? 'inline-flex w-full items-center justify-center rounded-md border border-tint-300 bg-white/60 px-10 py-3.5 text-base text-brand transition-colors hover:bg-white sm:w-auto'
                    : 'inline-flex w-full items-center justify-center rounded-md bg-navy px-10 py-3.5 text-base text-white transition-colors hover:bg-brand-dark sm:w-auto'
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
