import React from 'react'

import type { ProductSystemBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'
import { cn } from '@/utilities/ui'

type Feature = NonNullable<Props['features']>[number]

/**
 * The card icons drawn for this section in the Figma comp, exported at their 44px size.
 * Shown when an editor has picked a built-in icon and not uploaded a card image.
 */
const featureIcons: Record<NonNullable<Feature['icon']>, string> = {
  flask: '/icons/product-system/ingredients.svg',
  guarantee: '/icons/product-system/guarantee.svg',
  madeInUsa: '/icons/product-system/made-in-usa.svg',
  research: '/icons/product-system/research.svg',
  stethoscope: '/icons/product-system/doctor.svg',
  supportSystem: '/icons/product-system/support-system.svg',
}

/* Below `sm` the cards stand upright (mobile comp): badge titles keep 24px, the rest run 14px. */
const titleSizes = {
  lg: 'text-2xl leading-[22.5px]',
  md: 'text-[14px] leading-[normal] sm:text-lg',
  sm: 'text-[14px] leading-[normal] sm:text-base',
} as const

/** The comp sizes a title by what sits beside it: a number, a subtitle, or nothing. */
const titleSizeFor = (feature: Feature): keyof typeof titleSizes =>
  feature.titleSize ?? (feature.stat ? 'sm' : feature.subtitle ? 'lg' : 'md')

const FeatureIcon: React.FC<{ feature: Feature }> = ({ feature }) => {
  if (feature.image && typeof feature.image === 'object') {
    return (
      <Media
        className="size-11 shrink-0"
        imgClassName="size-11 object-contain"
        resource={feature.image}
        size="44px"
      />
    )
  }

  const src = feature.icon ? featureIcons[feature.icon] : undefined

  if (src) {
    return (
      // The research glyph is narrower than its 44px box; `object-contain` keeps it centred at its drawn ratio.
      // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
      <img
        alt=""
        className="size-11 shrink-0 object-contain"
        decoding="async"
        height={44}
        loading="lazy"
        src={src}
        width={44}
      />
    )
  }

  return (
    <div
      aria-label="Feature image placeholder"
      className="size-11 shrink-0 rounded-lg border-2 border-dashed border-tint-150 bg-mist"
      role="img"
    />
  )
}

export const ProductSystemBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  columnHeading,
  features,
  heading,
  image,
  paragraphs,
  subheading,
}) => {
  const paras = Array.isArray(paragraphs) ? paragraphs : []
  const cards = Array.isArray(features) ? features : []

  return (
    <section
      // `marks` sets ® in a <sup>; pinning its line-height keeps the fixed line boxes from growing.
      className="w-full bg-mist px-[5px] font-inter sm:px-4 [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[18.75px] py-[31.25px] max-sm:pb-0">
        {heading && (
          <h2
            className="hero-heading text-center text-navy-900 max-sm:leading-[43px]! lg:leading-[50px]"
            data-payload-subpath="heading"
          >
            {multiline(heading)}
          </h2>
        )}
        {subheading && (
          <p
            className="text-center text-2xl font-medium leading-6 text-info-dark"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {/* The comp's 6.25px spacer between the header and the three columns. */}
        <div aria-hidden className="h-[6.25px] w-full max-sm:hidden" />

        <div className="flex w-full flex-col items-center justify-center gap-[6.25px] sm:gap-8 xl:flex-row xl:gap-[6.25px] xl:px-[62.5px]">
          {/* Left column — copy. Sits below the diagram on tablet; the mobile comp hides it. */}
          <div className="order-2 flex max-sm:hidden w-full max-w-[500px] flex-col gap-[18.75px] xl:order-1 xl:w-[281.25px] xl:shrink-0">
            {columnHeading && (
              <h3
                className="font-marcellus text-[37px] leading-[34px] text-subheading"
                data-payload-subpath="columnHeading"
              >
                {multiline(columnHeading)}
              </h3>
            )}

            {paras.length > 0 && (
              <div className="flex flex-col gap-[12.5px] text-lg font-medium leading-[22px] text-black">
                {paras.map((paragraph, i) => (
                  <p data-payload-subpath={`paragraphs.${i}.text`} key={paragraph.id ?? i}>
                    {paragraph.lead && (
                      <strong className="font-bold text-info">{marks(paragraph.lead)} </strong>
                    )}
                    {marks(paragraph.text)}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Centre — diagram. First on mobile. */}
          <div
            className="relative order-1 aspect-[500/457.5] w-full max-w-[500px] max-sm:-mx-[5px] max-sm:w-auto max-sm:max-w-none max-sm:self-stretch xl:order-2 xl:w-[500px] xl:shrink-0"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 1000 × 915px"
              label="Inside-out support diagram"
              resource={image}
            />
          </div>

          {/* Right column — feature cards. The mobile comp runs them as one row of upright
              120px cards that runs off the right edge, so there it scrolls sideways. */}
          {cards.length > 0 && (
            <ul className="order-3 flex w-full max-w-[500px] flex-col gap-[6.25px] max-sm:-mr-[5px] max-sm:w-auto max-sm:max-w-none max-sm:snap-x max-sm:flex-row max-sm:gap-2 max-sm:self-stretch max-sm:overflow-x-auto max-sm:pr-[5px] max-sm:[scrollbar-width:none] xl:w-[281.25px] xl:shrink-0">
              {cards.map((feature, i) => (
                <li
                  className="flex items-center gap-[18.75px] overflow-hidden rounded-[18.75px] bg-white p-[18.75px] text-brand-600 shadow-[inset_0_0_0_0.625px_var(--color-tint-50)] max-sm:h-[208px] max-sm:w-[120px] max-sm:shrink-0 max-sm:snap-start max-sm:flex-col max-sm:text-center"
                  data-payload-subpath={`features.${i}.title`}
                  key={feature.id ?? i}
                >
                  <FeatureIcon feature={feature} />

                  <div className="flex min-w-0 flex-1 items-center gap-[6.25px] max-sm:block max-sm:w-full max-sm:flex-none max-sm:text-[14px] max-sm:leading-[normal]">
                    {/* Upright, the number joins the title's line at the title's size. */}
                    {feature.stat && (
                      <p className="shrink-0 whitespace-nowrap text-[42px] font-bold leading-[normal] max-sm:mr-[0.25em] max-sm:inline max-sm:text-[14px]">
                        {marks(feature.stat)}
                      </p>
                    )}
                    <div className={cn('min-w-0 flex-1', feature.stat && 'max-sm:inline')}>
                      <p
                        className={cn(
                          'font-bold',
                          titleSizes[titleSizeFor(feature)],
                          feature.stat && 'max-sm:inline',
                        )}
                      >
                        {marks(feature.title)}
                      </p>
                      {feature.subtitle && (
                        <p className="text-xs font-medium leading-[17px] max-sm:leading-[22.5px]">
                          {marks(feature.subtitle)}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
