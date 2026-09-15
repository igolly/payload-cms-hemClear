import React from 'react'

import type { PricingOfferBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

import { PlanCard, PopularFrame } from './PlanCard'
import { PlanCarousel } from './PlanCarousel'
import { SelectablePlans } from './SelectablePlans'

/**
 * Trust-strip badges drawn for this section in the Figma comp (filled, two-tone), which the
 * line icons in `BrandIcons` don't match. Any other icon an editor picks falls back to the
 * shared set.
 */
const trustBadges: Record<string, string> = {
  flask: '/icons/pricing/flask.svg',
  guarantee: '/icons/pricing/guarantee.svg',
  leaf: '/icons/pricing/leaf.svg',
  madeInUsa: '/icons/pricing/made-in-usa.svg',
}

/** Renders *asterisked* words in the highlight colour. */
const highlight = (text: React.ReactNode): React.ReactNode => {
  // An inline-editable field arrives as an element; there is nothing to scan for markers.
  if (typeof text !== 'string') return text

  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <span className="text-aqua-200" key={i}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{marks(part)}</React.Fragment>
    ),
  )
}

export const PricingOfferBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  bannerImage,
  bannerText,
  bannerTitle,
  bannerValue,
  bannerValueLabel,
  layout,
  plans,
  trustItems,
}) => {
  const cards = Array.isArray(plans) ? plans : []
  const trust = Array.isArray(trustItems) ? trustItems : []

  return (
    <section
      // Inter throughout, as in the comp — the global rule only reaches <p>, not list items or links.
      className="w-full bg-navy p-4 font-inter sm:px-6 sm:py-8 lg:px-8 lg:py-[18.75px]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[6.25px]">
        {(bannerTitle || bannerText) && (
          <div className="flex w-full max-w-[1152px] flex-col items-center justify-center gap-[10px] rounded-[18px] bg-[#30489d] px-[31.25px] py-[12.5px] shadow-[0_0_11.25px_rgba(0,0,0,0.25)] lg:flex-row lg:gap-[92px] lg:rounded-[18.75px]">
            <div className="flex w-full flex-col items-center gap-[10px] lg:w-auto lg:flex-row lg:gap-[31.25px]">
              <span className="flex h-[57px] w-[58px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_12.5px_15.625px_rgba(255,255,255,0.25),0_12.5px_15.625px_rgba(0,0,0,0.25)] lg:size-[112.5px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
                <img alt="" className="size-10 lg:size-[70px]" height={70} src="/icons/pricing/gift.svg" width={70} />
              </span>

              <div className="flex w-full flex-col gap-[3.125px] border-l border-white pl-[30px] text-left text-white lg:w-auto">
                {bannerTitle && (
                  <p className="font-marcellus text-[length:min(32px,calc((100vw-124.5px)*0.1014))] whitespace-nowrap uppercase leading-[normal] sm:text-[32px] lg:text-[40px] lg:leading-none">
                    {marks(bannerTitle)}
                  </p>
                )}
                {bannerText && (
                  <p className="text-center text-2xl font-bold leading-[normal] lg:max-w-[27rem] lg:text-left lg:leading-normal">
                    {highlight(bannerText)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-[25px] lg:w-auto lg:justify-end">
              {bannerImage && typeof bannerImage === 'object' && (
                <span className="relative h-[112.5px] w-[155px] shrink-0">
                  <Media fill imgClassName="object-cover" resource={bannerImage} size="155px" />
                </span>
              )}

              {bannerValue && (
                <span className="flex size-[112.5px] shrink-0 flex-col items-center justify-center rounded-full bg-white text-center text-navy shadow-[0_2.5px_2.5px_rgba(255,255,255,0.25),0_12.5px_15.625px_rgba(0,0,0,0.25)]">
                  <span className="text-2xl font-extrabold">{marks(bannerValue)}</span>
                  <span className="text-lg font-medium uppercase">{marks(bannerValueLabel)}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {cards.length > 0 && layout === 'select' && <SelectablePlans plans={cards} />}

        {cards.length > 0 && layout !== 'select' && (
          <PlanCarousel initial={Math.max(0, cards.findIndex((plan) => plan.popular))} itemWidth="353.125px">
            {cards.map((plan, i) =>
              plan.popular ? (
                <div className="w-[353.125px] max-w-full xl:w-[411px] xl:max-w-[411px]" key={plan.id ?? i}>
                  <PopularFrame label={plan.popularLabel}>
                    <PlanCard index={i} plan={plan} />
                  </PopularFrame>
                </div>
              ) : (
                <div className="w-[353.125px] max-w-full xl:w-[345px] xl:max-w-[411px]" key={plan.id ?? i}>
                  <PlanCard index={i} plan={plan} />
                </div>
              ),
            )}
          </PlanCarousel>
        )}

        {trust.length > 0 && (
          <ul className="grid w-full max-w-[1106.25px] grid-cols-1 gap-[10px] rounded-[18.75px] bg-white py-4 shadow-[0_0_11.25px_rgba(0,0,0,0.25)] sm:grid-cols-2 sm:gap-4 sm:px-4 sm:py-5 lg:flex lg:h-[76.25px] lg:items-center lg:justify-center lg:gap-0 lg:py-0">
            {trust.map((item, i) => (
              <li
                className="flex items-center gap-[12.5px] px-4 lg:border-l lg:border-navy lg:first:border-l-0"
                key={item.id ?? i}
              >
                {item.icon && trustBadges[item.icon] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
                  <img alt="" className="size-10 shrink-0" height={40} src={trustBadges[item.icon]} width={40} />
                ) : (
                  <BrandIcon className="shrink-0 text-navy [&>svg]:size-10" name={item.icon} />
                )}
                <span className="whitespace-pre-line text-base font-bold leading-[normal] text-navy sm:leading-normal">
                  {marks(item.label)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
