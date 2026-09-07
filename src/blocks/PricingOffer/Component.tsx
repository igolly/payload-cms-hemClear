import React from 'react'
import { Check, Gift } from 'lucide-react'

import type { PricingOfferBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

/** Renders *asterisked* words in the highlight colour. */
const highlight = (text: string) =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <span className="text-[#ffe066]" key={i}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )

export const PricingOfferBlock: React.FC<Props> = ({
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

  return (
    <section className="w-full bg-[#1c2f6e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {(bannerTitle || bannerText) && (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-[#2a3f86] px-6 py-5 sm:flex-row sm:gap-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <Gift className="h-7 w-7" />
            </span>

            <div className="grow text-center sm:text-left">
              {bannerTitle && (
                <p className="text-xl font-extrabold uppercase tracking-wide text-white">
                  {bannerTitle}
                </p>
              )}
              {bannerText && (
                <p className="text-sm leading-snug text-white/90">{highlight(bannerText)}</p>
              )}
            </div>

            {bannerImage && typeof bannerImage === 'object' && (
              <span className="relative h-16 w-20 shrink-0">
                <Media fill imgClassName="object-contain" resource={bannerImage} />
              </span>
            )}

            {bannerValue && (
              <span className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-white text-[#1c2f6e]">
                <span className="text-base font-extrabold leading-none">{bannerValue}</span>
                <span className="text-[10px] font-bold uppercase">{bannerValueLabel}</span>
              </span>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
            {cards.map((plan, i) => (
              <li
                className={cn(
                  'overflow-hidden rounded-xl',
                  plan.popular ? 'bg-white ring-4 ring-[#4d7fe0]' : 'bg-[#e8f0fc]',
                )}
                data-payload-subpath={`plans.${i}.name`}
                key={plan.id ?? i}
              >
                {plan.popular && plan.popularLabel && (
                  <p className="bg-[#123a8a] py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-white">
                    ★ {plan.popularLabel} ★
                  </p>
                )}

                <div className="p-5 text-center">
                  <p className="font-serif text-lg font-bold text-[#1c2f6e]">{plan.name}</p>

                  <div className="relative mx-auto mt-3 h-28 w-full">
                    {plan.image && typeof plan.image === 'object' ? (
                      <Media fill imgClassName="object-contain" resource={plan.image} />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[11px] text-[#8AA6C8]">
                        Product image
                      </span>
                    )}
                  </div>

                  {plan.priceLead && (
                    <p className="mt-3 text-[11px] text-slate-500">{plan.priceLead}</p>
                  )}
                  <p className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold text-[#1c2f6e]">{plan.price}</span>
                    {plan.priceSuffix && (
                      <span className="text-xs text-slate-500">{plan.priceSuffix}</span>
                    )}
                  </p>

                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-1.5 text-left">
                      {plan.features.map((feature, f) => (
                        <li className="flex items-start gap-2" key={feature.id ?? f}>
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1c2f6e]"
                            strokeWidth={3}
                          />
                          <span
                            className={cn(
                              'text-[11px] leading-snug',
                              feature.highlight ? 'text-[#0052cc]' : 'text-slate-700',
                            )}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    className={cn(
                      'mt-5 block rounded-md py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors',
                      plan.popular
                        ? 'bg-[#1a7f37] hover:bg-[#166b2e]'
                        : 'bg-[#1c2f6e] hover:bg-[#162456]',
                    )}
                    href={plan.ctaUrl || '#'}
                  >
                    {plan.ctaLabel || 'Buy Now'}
                  </a>

                  {plan.footnote && (
                    <p className="mt-2 text-[10px] text-[#0052cc]">{plan.footnote}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {trust.length > 0 && (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-xl bg-white px-6 py-4">
            {trust.map((item, i) => (
              <li
                className="flex items-center gap-2 border-[#dbe8fa] pl-6 first:pl-0 sm:border-l sm:first:border-l-0"
                key={item.id ?? i}
              >
                <BrandIcon
                  className="shrink-0 text-[#1668C4] [&>svg]:h-6 [&>svg]:w-6"
                  name={item.icon}
                />
                <span className="whitespace-pre-line text-xs font-bold leading-tight text-[#1c2f6e]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
