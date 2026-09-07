import React from 'react'

import type { ClosingCtaBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

export const ClosingCtaBlock: React.FC<Props> = ({
  cards,
  description,
  heading,
  headingTop,
  links,
}) => {
  const items = Array.isArray(cards) ? cards : []

  return (
    <section className="w-full bg-[#e0ecfc] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          {headingTop && (
            <h2
              className="text-3xl font-extrabold leading-tight text-heading sm:text-4xl"
              data-payload-subpath="headingTop"
            >
              {headingTop}
            </h2>
          )}

          {heading && (
            <p
              className="mt-1 font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </p>
          )}

          {description && (
            <p
              className="mx-auto mt-5 max-w-4xl whitespace-pre-line text-sm leading-relaxed text-[#1a2f7c]"
              data-payload-subpath="description"
            >
              {description}
            </p>
          )}
        </header>

        {items.length > 0 && (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((card, i) => (
              <li
                className="overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(16,60,120,0.08)]"
                data-payload-subpath={`cards.${i}.title`}
                key={card.id ?? i}
              >
                <div className="relative aspect-[4/3] w-full">
                  <ImageSlot
                    className="h-full w-full"
                    hint="Lifestyle photo"
                    imgClassName="h-full w-full object-cover"
                    label={`Card ${i + 1} image`}
                    resource={card.image}
                  />
                </div>

                <div className="flex gap-3 p-4">
                  <BrandIcon
                    className="shrink-0 text-brand [&>svg]:h-9 [&>svg]:w-9"
                    name={card.icon}
                  />
                  <div className="min-w-0">
                    <h3 className="font-serif text-sm font-bold leading-tight text-subheading">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p
                        className="mt-1 text-xs leading-relaxed text-slate-700"
                        data-payload-subpath={`cards.${i}.description`}
                      >
                        {card.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className={
                  link.appearance === 'outline'
                    ? 'inline-flex w-full items-center justify-center rounded-md border border-[#9dbde8] bg-white/60 px-10 py-4 text-base text-brand transition-colors hover:bg-white sm:w-auto'
                    : 'inline-flex w-full items-center justify-center rounded-md bg-brand px-10 py-4 text-base text-white transition-colors hover:bg-brand-dark sm:w-auto'
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
