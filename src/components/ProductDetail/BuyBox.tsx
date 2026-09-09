'use client'
import React, { useState } from 'react'
import { Check } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Variant = NonNullable<ProductDetailBlock['variants']>[number]
type Plan = NonNullable<ProductDetailBlock['plans']>[number]

export const BuyBox: React.FC<{
  ctaLabel?: string | null
  oneTimeLabel?: string | null
  plans: Plan[]
  variants: Variant[]
  variantsTitle?: string | null
}> = ({ ctaLabel, oneTimeLabel, plans, variants, variantsTitle }) => {
  const [variant, setVariant] = useState(0)
  const [plan, setPlan] = useState(0)

  return (
    <div>
      {variants.length > 0 && (
        <div>
          {variantsTitle && (
            <p className="text-sm font-semibold text-brand">{marks(variantsTitle)}</p>
          )}

          <ul className="mt-3 flex flex-wrap gap-6">
            {variants.map((item, i) => (
              <li key={item.id ?? i}>
                <button
                  aria-current={i === variant}
                  className="flex w-24 flex-col items-center gap-2"
                  onClick={() => setVariant(i)}
                  type="button"
                >
                  <span
                    className={cn(
                      'relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-white',
                      i === variant ? 'border-brand' : 'border-[#dbe8fa]',
                    )}
                  >
                    {item.image && typeof item.image === 'object' ? (
                      <Media fill imgClassName="object-contain p-2" resource={item.image} />
                    ) : (
                      <span className="text-[10px] text-slate-400">No image</span>
                    )}
                  </span>
                  <span className="text-center text-xs font-semibold text-brand">
                    {marks(item.name)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plans.length > 0 && (
        <ul className="mt-6 flex flex-col gap-4">
          {plans.map((item, i) => {
            const selected = i === plan

            return (
              <li key={item.id ?? i}>
                <div
                  className={cn(
                    'rounded-xl border p-5',
                    selected ? 'border-brand bg-[#f4f8ff]' : 'border-[#dbe8fa] bg-white',
                  )}
                >
                  <button
                    aria-pressed={selected}
                    className="flex w-full items-center gap-3 text-left"
                    onClick={() => setPlan(i)}
                    type="button"
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                        selected ? 'border-brand' : 'border-[#9dbde8]',
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-brand" />}
                    </span>

                    <span className="text-lg font-bold text-brand">{marks(item.name)}</span>

                    {item.saveLabel && (
                      <span className="rounded-full border border-brand px-2.5 py-0.5 text-[11px] font-bold text-brand">
                        {marks(item.saveLabel)}
                      </span>
                    )}

                    {item.bestValue && (
                      <span className="ml-auto rounded bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {item.bestValueLabel || 'Best Value'}
                      </span>
                    )}
                  </button>

                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-brand">{marks(item.price)}</span>
                    {item.comparePrice && (
                      <span className="text-lg text-slate-400 line-through">
                        {marks(item.comparePrice)}
                      </span>
                    )}
                    {item.priceSuffix && (
                      <span className="text-lg text-slate-500">{marks(item.priceSuffix)}</span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-[#0052cc]">
                    {item.billingNote && <span>{marks(item.billingNote)}</span>}
                    {item.perServing && (
                      <span className="font-semibold text-brand">{marks(item.perServing)}</span>
                    )}
                  </div>

                  {selected && Array.isArray(item.features) && item.features.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2 border-t border-[#dbe8fa] pt-4">
                      {item.features.map((feature, f) => (
                        <li className="flex items-start gap-2" key={feature.id ?? f}>
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={3} />
                          <span className="text-xs font-semibold text-brand">
                            {marks(feature.text)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selected && (item.bonusTitle || item.bonusImage) && (
                    <div className="mt-4">
                      {item.bonusHeading && (
                        <p className="text-center text-[10px] font-bold uppercase tracking-wide text-brand">
                          {marks(item.bonusHeading)}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 rounded-lg bg-brand p-4">
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                          {item.bonusImage && typeof item.bonusImage === 'object' && (
                            <Media fill imgClassName="object-contain" resource={item.bonusImage} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-extrabold text-white">
                            {item.bonusHighlight && (
                              <span className="text-[#ffe066]">{marks(item.bonusHighlight)} </span>
                            )}
                            {marks(item.bonusTitle)}
                          </span>
                          {item.bonusSubtitle && (
                            <span className="block text-xs text-white/80">
                              {marks(item.bonusSubtitle)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {oneTimeLabel && (
        <p className="mt-4 text-sm font-semibold text-brand underline">{marks(oneTimeLabel)}</p>
      )}

      <button
        className="mt-4 w-full rounded-lg bg-brand px-6 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
        type="button"
      >
        {ctaLabel || 'Add to Cart'}
      </button>
    </div>
  )
}
