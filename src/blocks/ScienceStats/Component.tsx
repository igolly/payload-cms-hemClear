import React from 'react'

import type { ScienceStatsBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

export const ScienceStatsBlock: React.FC<Props> = ({
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
    <section className="w-full bg-[#f5f8fd] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className="mx-auto mt-3 max-w-3xl text-sm text-slate-600"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-square w-full" data-payload-subpath="image">
            <ImageSlot
              className="h-full w-full"
              hint="Science / formula visual"
              label="Formula visual"
              resource={image}
            />
          </div>

          <div>
            <ul className="flex flex-col gap-6">
              {items.map((stat, i) => (
                <li
                  className="flex items-start gap-4"
                  data-payload-subpath={`stats.${i}.title`}
                  key={stat.id ?? i}
                >
                  <span className="w-24 shrink-0 font-serif text-3xl font-bold leading-none text-brand">
                    {stat.value}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#0052cc]">{stat.title}</span>
                    {stat.description && (
                      <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                        {stat.description}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {links.map(({ link }, i) => (
                  <CMSLink
                    {...link}
                    appearance="inline"
                    className={
                      link.appearance === 'outline'
                        ? 'inline-flex items-center rounded-full border border-brand px-5 py-2 text-xs font-semibold text-brand transition-colors hover:bg-white'
                        : 'inline-flex items-center rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark'
                    }
                    key={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {chips.map((chip, i) => (
              <li
                className="border-[#c9dcf5] pl-6 text-sm font-semibold text-brand first:pl-0 sm:border-l sm:first:border-l-0"
                key={chip.id ?? i}
              >
                {chip.text}
              </li>
            ))}
          </ul>
        )}

        {footnote && (
          <p className="mt-4 text-center text-[11px] text-slate-500">{footnote}</p>
        )}
      </div>
    </section>
  )
}
