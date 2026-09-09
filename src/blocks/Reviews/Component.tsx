import React from 'react'

import type { ReviewsBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { ReviewGrid } from './ReviewGrid'
import { Stars } from './Stars'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

export const ReviewsBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  description,
  disclaimer,
  featured,
  heading,
  headingAccent,
  initialCount,
  reviews,
  showLessLabel,
  showMoreLabel,
  verifiedLabel,
}) => {
  const featuredItems = Array.isArray(featured) ? featured : []
  const gridItems = Array.isArray(reviews) ? reviews : []

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 lg:px-8" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        {(heading || headingAccent) && (
          <h2 className="text-center font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {heading && (
              <span className="block text-heading" data-payload-subpath="heading">
                {marks(heading)}
              </span>
            )}
            {headingAccent && (
              <span className="block text-[#2d80e2]" data-payload-subpath="headingAccent">
                {marks(headingAccent)}
              </span>
            )}
          </h2>
        )}

        {description && (
          <p
            className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-center text-sm leading-relaxed text-brand"
            data-payload-subpath="description"
          >
            {marks(description)}
          </p>
        )}

        {/* Featured reviews with source logos */}
        {featuredItems.length > 0 && (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredItems.map((item, i) => (
              <li
                className="flex flex-col items-center rounded-xl border border-[#e7e7e7] bg-white p-6 text-center"
                data-payload-subpath={`featured.${i}.title`}
                key={item.id ?? i}
              >
                <div className="flex items-center gap-2">
                  {item.score && (
                    <span
                      className="font-serif text-xl font-semibold text-brand"
                      data-payload-subpath={`featured.${i}.score`}
                    >
                      {marks(item.score)}
                    </span>
                  )}
                  <Stars className="text-[#f7a304]" count={item.stars} />
                </div>

                <h3
                  className="mt-5 font-serif text-xl font-bold leading-snug text-subheading"
                  data-payload-subpath={`featured.${i}.title`}
                >
                  {marks(item.title)}
                </h3>

                <p
                  className="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand"
                  data-payload-subpath={`featured.${i}.quote`}
                >
                  {marks(item.quote)}
                </p>

                <div className="mt-auto pt-6">
                  <p className="text-sm font-bold text-brand" data-payload-subpath={`featured.${i}.author`}>
                    &mdash; {item.author}
                  </p>
                  {item.authorNote && (
                    <p className="text-sm text-brand" data-payload-subpath={`featured.${i}.authorNote`}>
                      {marks(item.authorNote)}
                    </p>
                  )}
                </div>

                {item.sourceLogo && typeof item.sourceLogo === 'object' && (
                  <div
                    className="mt-4 flex h-8 items-center justify-center"
                    data-payload-subpath={`featured.${i}.sourceLogo`}
                  >
                    <Media
                      htmlElement={null}
                      imgClassName="h-8 w-auto object-contain"
                      resource={item.sourceLogo}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Expandable customer review grid */}
        {gridItems.length > 0 && (
          <div className="mt-6">
            <ReviewGrid
              initialCount={initialCount}
              reviews={gridItems}
              showLessLabel={showLessLabel}
              showMoreLabel={showMoreLabel}
              verifiedLabel={verifiedLabel}
            />
          </div>
        )}

        {disclaimer && (
          <p
            className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-center text-[11px] leading-relaxed text-slate-600"
            data-payload-subpath="disclaimer"
          >
            {marks(disclaimer)}
          </p>
        )}
      </div>
    </section>
  )
}
