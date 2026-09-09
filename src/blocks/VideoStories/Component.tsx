import React from 'react'

import type { VideoStoriesBlock as Props } from '@/payload-types'

import { Carousel } from './Carousel'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

export const VideoStoriesBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  eyebrow,
  heading,
  stories,
  subheading,
}) => {
  const items = Array.isArray(stories) ? stories : []

  return (
    <section className="w-full bg-navy px-4 py-14 sm:px-6 lg:px-8" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          {eyebrow && (
            <span
              className="inline-block rounded-full border border-white/40 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </span>
          )}

          {heading && (
            <h2
              className="mt-6 font-serif text-3xl leading-tight text-white sm:text-4xl"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}

          {subheading && (
            <p
              className="mt-3 font-serif text-lg italic text-[#69aeff]"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}
        </header>

        {items.length > 0 && (
          <div className="mt-10">
            <Carousel stories={items} />
          </div>
        )}
      </div>
    </section>
  )
}
