import React from 'react'
import { CircleCheck, Gift } from 'lucide-react'

import type { PricingOfferBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/** Renders *asterisked* words in the highlight colour. */
const highlight = (text: string) =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <span className="text-[#6fd2f5]" key={i}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{marks(part)}</React.Fragment>
    ),
  )

export const PricingOfferBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  bannerImage,
  bannerText,
  bannerTitle,
  bannerValue,
  bannerValueLabel,
  plans,
  trustItems,
}) => {
  const cards = Array.isArray(plans) ? plans : []
  const trust = Array.isArray(trustItems) ? trustItems : []

  // The featured plan is drawn wider than the two beside it. That only works as a fixed
  // column ratio when it actually is the middle one of three, so fall back to even
  // columns for any other shape of the array.
  const featuredIsCenter = cards.length === 3 && Boolean(cards[1]?.popular)

  return (
    <section className="w-full bg-navy px-4 py-12 sm:px-6 lg:px-8" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div className="mx-auto max-w-5xl">
        {(bannerTitle || bannerText) && (
          <div className="flex flex-col items-center gap-5 rounded-xl bg-[#31509f] px-6 py-5 sm:flex-row sm:gap-6">
            <span className="flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-[0_0_28px_rgba(255,255,255,0.35)]">
              <Gift className="h-11 w-11" strokeWidth={1.75} />
            </span>

            <span aria-hidden="true" className="hidden h-16 w-px shrink-0 bg-white/30 sm:block" />

            <div className="grow text-center sm:text-left">
              {bannerTitle && (
                <p className="text-2xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-[1.75rem]">
                  {marks(bannerTitle)}
                </p>
              )}
              {bannerText && (
                <p className="mt-1 text-base font-bold leading-snug text-white sm:text-[1.0625rem]">
                  {highlight(bannerText)}
                </p>
              )}
            </div>

            {bannerImage && typeof bannerImage === 'object' && (
              <span className="relative h-24 w-36 shrink-0">
                <Media fill imgClassName="object-contain" resource={bannerImage} />
              </span>
            )}

            {bannerValue && (
              <span className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-white text-heading">
                <span className="text-xl font-extrabold leading-none">{marks(bannerValue)}</span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-wide">
                  {marks(bannerValueLabel)}
                </span>
              </span>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <ul
            className={cn(
              'mt-8 grid grid-cols-1 gap-5 md:items-end',
              featuredIsCenter ? 'md:grid-cols-[1fr_1.2fr_1fr]' : 'md:grid-cols-3',
            )}
          >
            {cards.map((plan, i) => (
              <li
                className={cn(
                  'overflow-hidden rounded-xl',
                  plan.popular ? 'bg-white ring-4 ring-[#4d7fe0]' : 'bg-[#eaf2fe]',
                )}
                data-payload-subpath={`plans.${i}.name`}
                key={plan.id ?? i}
              >
                {plan.popular && plan.popularLabel && (
                  <p className="bg-[#0a2fa8] py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                    ★ {plan.popularLabel} ★
                  </p>
                )}

                <div className={cn('pb-5 text-center', plan.popular ? 'px-6 pt-5' : 'px-5 pt-6')}>
                  {/*
                   * Two lines of title height are reserved whether or not the name wraps,
                   * so the cards beside the featured one stay the same height and line up
                   * along the top as in the design.
                   */}
                  <p
                    className={cn(
                      'flex min-h-[2.5em] items-center justify-center font-serif font-bold leading-tight text-heading',
                      plan.popular ? 'text-[1.7rem]' : 'text-2xl',
                    )}
                  >
                    {marks(plan.name)}
                  </p>

                  <div
                    className={cn('relative mx-auto mt-4 w-full', plan.popular ? 'h-44' : 'h-40')}
                  >
                    {plan.image && typeof plan.image === 'object' ? (
                      <Media fill imgClassName="object-contain" resource={plan.image} />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[11px] text-[#8AA6C8]">
                        Product image
                      </span>
                    )}
                  </div>

                  {plan.priceLead && (
                    <p className="mt-4 text-xs text-slate-500">{marks(plan.priceLead)}</p>
                  )}
                  <p className="mt-1 flex items-baseline justify-center gap-1">
                    <span className="text-[2.5rem] font-extrabold leading-none text-heading">
                      {marks(plan.price)}
                    </span>
                    {plan.priceSuffix && (
                      <span className="text-sm text-slate-500">{marks(plan.priceSuffix)}</span>
                    )}
                  </p>

                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2.5 border-t border-[#cfe0f7] pt-4 text-left">
                      {plan.features.map((feature, f) => (
                        <li className="flex items-start gap-2.5" key={feature.id ?? f}>
                          <CircleCheck
                            className="mt-px h-[18px] w-[18px] shrink-0 fill-[#0f3bbd] text-white"
                            strokeWidth={2.5}
                          />
                          <span
                            className={cn(
                              'text-[13px] leading-snug',
                              feature.highlight ? 'text-[#0052cc]' : 'text-[#1a2340]',
                            )}
                          >
                            {marks(feature.text)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    className={cn(
                      'mt-5 block rounded-md py-3.5 text-[15px] font-bold uppercase tracking-wide text-white transition-colors',
                      plan.popular
                        ? 'bg-[#1a7f37] hover:bg-[#166b2e]'
                        : 'bg-brand hover:bg-brand-dark',
                    )}
                    href={plan.ctaUrl || '#'}
                  >
                    {plan.ctaLabel || 'Buy Now'}
                  </a>

                  {/* Reserved even when empty, so a plan without a footnote keeps its height. */}
                  <p className="mt-2.5 min-h-4 text-xs text-[#0052cc]">{marks(plan.footnote)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {trust.length > 0 && (
          <ul className="mx-auto mt-6 flex max-w-[97%] flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-xl bg-white px-8 py-5">
            {trust.map((item, i) => (
              <li
                className="flex items-center gap-3 border-[#dbe8fa] pl-8 first:pl-0 sm:border-l sm:first:border-l-0"
                key={item.id ?? i}
              >
                <BrandIcon
                  className="shrink-0 text-[#1668C4] [&>svg]:h-8 [&>svg]:w-8"
                  name={item.icon}
                />
                <span className="whitespace-pre-line text-sm font-bold leading-tight text-heading">
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
