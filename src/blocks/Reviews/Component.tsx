import React from 'react'

import type { ReviewsBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { FeaturedCarousel } from './FeaturedCarousel'
import { ReviewGrid } from './ReviewGrid'
import { Stars } from './Stars'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Source = NonNullable<NonNullable<Props['featured']>[number]['source']>

/** Figma logo boxes (review-logo-* 1), all 31.25px tall. */
const SOURCE_LOGOS: Record<Source, { alt: string; width: number }> = {
  amazon: { alt: 'Amazon', width: 100 },
  google: { alt: 'Google', width: 95.63 },
  hemclear: { alt: 'HemClear.com', width: 125.63 },
  reddit: { alt: 'Reddit', width: 96.25 },
  trustpilot: { alt: 'Trustpilot', width: 127.5 },
}

const FEATURE_ICONS = {
  comfort: '/icons/reviews/feature-comfort.png',
  customers: '/icons/reviews/feature-customers.png',
  guarantee: '/icons/reviews/feature-guarantee.png',
  rating: '/icons/reviews/feature-rating.png',
} as const

export const ReviewsBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  description,
  disclaimer,
  featured,
  features,
  heading,
  headingAccent,
  initialCount,
  reviews,
  showLessLabel,
  showMoreLabel,
  showMoreStep,
  verifiedLabel,
}) => {
  const featuredItems = Array.isArray(featured) ? featured : []
  const featureItems = Array.isArray(features) ? features : []
  const gridItems = Array.isArray(reviews) ? reviews : []

  const slides = featuredItems.map((item, i) => {
    const logo = item.source ? SOURCE_LOGOS[item.source] : null
    return (
      <li
        // Gradient stroke drawn as a border-box background so it can sit outside the Figma
        // box: the card is 208.75 + 2×1.25 wide (190 + 2.5 on phones).
        className="flex h-[452.5px] w-[192.5px] shrink-0 snap-start flex-col items-center justify-between gap-[12.5px] rounded-[20px] border-[1.25px] border-transparent px-3 py-[18.75px] text-center shadow-[0_0_6.25px_rgba(0,0,0,0.15)] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(180deg,#006db0_0%,#9cf0ff_50%,#006db0_100%)_border-box] sm:w-[211.25px] sm:px-[15.63px] [&_sup]:leading-[0]"
        data-featured-card
        data-payload-subpath={`featured.${i}.title`}
        key={item.id ?? i}
      >
        <div className="flex h-[29px] shrink-0 items-center justify-center gap-[7px] text-[24px] font-medium leading-[normal] text-navy">
          {item.score && (
            <span data-payload-subpath={`featured.${i}.score`}>{marks(item.score)}</span>
          )}
          <Stars className="text-gold" count={item.stars} gap="gap-0" size="size-6" />
        </div>

        <h3
          className="font-playfair text-[24px] font-bold leading-[normal] text-navy"
          data-payload-subpath={`featured.${i}.title`}
        >
          {marks(item.title)}
        </h3>

        <p
          className="whitespace-pre-line text-[16px] font-medium leading-[19px] text-navy"
          data-payload-subpath={`featured.${i}.quote`}
        >
          {marks(item.quote)}
        </p>

        <p className="text-[16px] font-medium leading-[19px] text-navy">
          <span className="font-bold" data-payload-subpath={`featured.${i}.author`}>
            &mdash; {item.author}
          </span>
          {item.authorNote && (
            <>
              <br />
              <span data-payload-subpath={`featured.${i}.authorNote`}>
                {marks(item.authorNote)}
              </span>
            </>
          )}
        </p>

        {item.sourceLogo && typeof item.sourceLogo === 'object' ? (
          <div
            className="flex h-[31.25px] shrink-0 items-center justify-center"
            data-payload-subpath={`featured.${i}.sourceLogo`}
          >
            <Media
              htmlElement={null}
              imgClassName="h-[31.25px] w-auto object-contain"
              resource={item.sourceLogo}
            />
          </div>
        ) : (
          logo && (
            // eslint-disable-next-line @next/next/no-img-element -- 2x crop of the Figma logo, nothing to optimise
            <img
              alt={logo.alt}
              className="h-[31.25px] shrink-0"
              data-payload-subpath={`featured.${i}.source`}
              height={31.25}
              src={`/icons/reviews/logo-${item.source}.png`}
              style={{ width: logo.width }}
              width={logo.width}
            />
          )
        )}
      </li>
    )
  })

  const featureStrip =
    featureItems.length > 0 ? (
      <ul
        className="mx-auto flex w-full max-w-[408px] flex-col items-center rounded-[18.75px] border-[0.63px] border-aqua-200 py-[18px] md:grid md:max-w-[640px] md:grid-cols-2 md:justify-items-center xl:flex xl:w-[1113.75px] xl:max-w-none xl:flex-row xl:justify-center"
        data-features
      >
        {featureItems.map((item, i) => (
          <li
            className={cn(
              'flex w-[268px] items-center gap-2 px-4 py-2 xl:w-auto xl:gap-[6.25px] xl:py-0',
              i > 0 && 'xl:border-l xl:border-brand-300',
            )}
            key={item.id ?? i}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 2x crop of the Figma icon, nothing to optimise */}
            <img
              alt=""
              className="size-[58px] shrink-0"
              height={58}
              src={FEATURE_ICONS[item.icon] ?? FEATURE_ICONS.customers}
              width={58}
            />
            <div className="flex flex-col gap-[1.88px] [&_sup]:leading-[0]">
              <p
                className="text-[16px] font-bold leading-[19px] text-brand-600"
                data-payload-subpath={`features.${i}.title`}
              >
                {marks(item.title)}
              </p>
              {item.text && (
                <p
                  className="text-[12px] font-medium leading-[15px] text-navy"
                  data-payload-subpath={`features.${i}.text`}
                >
                  {marks(item.text)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <section
      className="w-full bg-white px-4 py-5 font-inter text-navy xl:py-[31.25px]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-[1400px]">
        {(heading || headingAccent) && (
          <h2 className="text-center font-marcellus text-[clamp(30px,8.2vw,36px)] font-normal leading-[normal] sm:text-[42px] xl:text-[51px]">
            {heading && (
              <span className="block text-navy" data-payload-subpath="heading">
                {marks(heading)}
              </span>
            )}
            {headingAccent && (
              <span className="block text-brand-300" data-payload-subpath="headingAccent">
                {marks(headingAccent)}
              </span>
            )}
          </h2>
        )}

        {description && (
          <p
            className="mx-auto mt-[12.5px] max-w-[750px] whitespace-pre-line [&_sup]:leading-[0] text-center text-[16px] font-medium leading-[19px] text-navy"
            data-payload-subpath="description"
          >
            {marks(description)}
          </p>
        )}

        {slides.length > 0 && (
          <div className="mt-[12.5px]">
            <FeaturedCarousel slides={slides} />
          </div>
        )}

        {gridItems.length > 0 ? (
          <ReviewGrid
            features={featureStrip}
            initialCount={initialCount}
            reviews={gridItems}
            showLessLabel={showLessLabel}
            showMoreLabel={showMoreLabel}
            showMoreStep={showMoreStep}
            verifiedLabel={verifiedLabel}
          />
        ) : (
          featureStrip && <div className="mt-[12.5px]">{featureStrip}</div>
        )}

        {disclaimer && (
          <p
            className="mx-auto mt-2.5 whitespace-pre-line py-[12.5px] text-center text-[11.25px] leading-[15px] text-black xl:mt-[18px]"
            data-payload-subpath="disclaimer"
          >
            {marks(disclaimer)}
          </p>
        )}
      </div>
    </section>
  )
}
