'use client'
import React, { useState } from 'react'

import type { ProductDetailBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Variant = NonNullable<ProductDetailBlock['variants']>[number]
type Plan = NonNullable<ProductDetailBlock['plans']>[number]

/**
 * Figma 6210:2888 → 6215:3044: "Select Your System", the plan cards, the one-time link and
 * the cart button. Rendered as a flex fragment of the buy column so each piece keeps the
 * column's 10px rhythm, as the comp stacks them.
 */
export const BuyBox: React.FC<{
  ctaLabel?: string | null
  oneTimeLabel?: string | null
  /** The chosen variant, held by the block so the gallery and the copy follow it too. */
  onVariantChange: (index: number) => void
  plans: Plan[]
  variant: number
  variants: Variant[]
  variantsTitle?: string | null
}> = ({ ctaLabel, oneTimeLabel, onVariantChange, plans, variant, variants, variantsTitle }) => {
  const [plan, setPlan] = useState(0)

  /*
   * A variant may price differently. When it carries plans of its own those are what the
   * cards show; otherwise the block's shared plans stand for every variant, which is how
   * this behaved before variants could be priced at all.
   */
  const variantPlans = variants[variant]?.plans
  const activePlans = Array.isArray(variantPlans) && variantPlans.length > 0 ? variantPlans : plans

  /*
   * Plans are chosen by position, and two variants need not offer the same number of them,
   * so the choice is clamped rather than left pointing past the end of a shorter list.
   */
  const planIndex = Math.min(plan, Math.max(activePlans.length - 1, 0))

  return (
    <>
      {variants.length > 0 && (
        /* Figma 6210:2888: 10px vertical padding, 16px gap, #ccc rule beneath. */
        <div className="flex flex-col gap-4 border-b border-ash-300 py-2.5">
          {variantsTitle && (
            <p className="text-[16.25px] font-bold leading-5 text-navy">{marks(variantsTitle)}</p>
          )}

          <ul className="flex flex-wrap gap-4 @min-[480px]:gap-[30px]">
            {variants.map((item, i) => {
              const selected = i === variant

              return (
                <li key={item.id ?? i}>
                  <button
                    aria-current={selected}
                    className="flex w-[100px] flex-col items-center gap-[5px] @min-[480px]:w-[110px]"
                    onClick={() => onVariantChange(i)}
                    type="button"
                  >
                    {/* 110px disc, 3px ring: navy on a pale fill when chosen, pale blue otherwise. */}
                    <span
                      className={cn(
                        'relative block aspect-square w-full overflow-hidden rounded-full border-[3px]',
                        selected ? 'border-navy bg-mist-100' : 'border-tint-50 bg-white',
                      )}
                    >
                      {item.image && typeof item.image === 'object' ? (
                        <Media
                          className="absolute inset-0"
                          pictureClassName="absolute inset-0"
                          fill
                          /*
                           * The chosen variant's artwork grows because its padding shrinks,
                           * and evenly on both axes. Insetting the sides instead only grew
                           * the tall bottle, which is bound by its height: the wider jar and
                           * the square bundle are bound by their width, so the same rule
                           * shrank them on the click that was meant to pick them out.
                           */
                          imgClassName={cn('object-contain', selected ? 'p-1.5' : 'p-3')}
                          resource={item.image}
                          size="110px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] text-steel-400">
                          No image
                        </span>
                      )}
                    </span>
                    <span className="text-center text-sm font-bold leading-5 text-navy [&_sup]:leading-[0]">
                      {marks(item.name)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {activePlans.map((item, i) => {
        const selected = i === planIndex

        return (
          /* Figma 6210:2922 / 6214:2990: 30/20px padding, 16px gap, 20px radius. The chosen
             card is pale blue with a navy rule, the other white with a #ccc rule. */
          <div
            className={cn(
              'flex flex-col gap-4 rounded-[20px] border px-4 py-[30px] text-navy sm:px-5 [&_sup]:leading-[0]',
              selected ? 'border-navy bg-mist-100' : 'border-ash-300 bg-white',
            )}
            key={item.id ?? i}
          >
            <button
              aria-pressed={selected}
              className="flex w-full flex-wrap items-start justify-between gap-2.5 text-left"
              onClick={() => setPlan(i)}
              type="button"
            >
              <span className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    'size-5 shrink-0 rounded-full border-navy bg-white',
                    selected ? 'border-[6px]' : 'border-2',
                  )}
                />
                <span className="text-[22px] font-bold leading-6">{marks(item.name)}</span>
                {item.saveLabel && (
                  <span
                    className={cn(
                      'flex h-6 items-center rounded-xl px-3 text-base font-bold uppercase leading-[18px]',
                      selected ? 'bg-navy text-white' : 'border border-navy bg-white',
                    )}
                  >
                    {marks(item.saveLabel)}
                  </span>
                )}
              </span>

              {item.bestValue && (
                <span className="flex h-6 items-center rounded-tr-xl rounded-bl-xl bg-navy px-3 text-base font-bold uppercase leading-[18px] text-white">
                  {item.bestValueLabel || 'Best Value'}
                </span>
              )}
            </button>

            {/* Price row: 50/48 bold price, the struck regular price 20px after it, bottom-aligned. */}
            <div className="flex flex-wrap items-end gap-x-5">
              <span className="text-[50px] font-bold leading-[48px]">{marks(item.price)}</span>
              {(item.comparePrice || item.priceSuffix) && (
                <span className="py-1 text-[22px] font-medium leading-[22px]">
                  {item.comparePrice && <s>{marks(item.comparePrice)}</s>}
                  {item.priceSuffix && marks(item.priceSuffix)}
                </span>
              )}
            </div>

            {(item.billingNote || item.perServing) && (
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm leading-4 text-brand-600">
                {item.billingNote && <span>{marks(item.billingNote)}</span>}
                {item.perServing && <span className="font-bold">{marks(item.perServing)}</span>}
              </div>
            )}

            {selected && Array.isArray(item.features) && item.features.length > 0 && (
              <ul className="flex flex-col gap-1 border-y border-ash-300 py-2.5">
                {item.features.map((feature, f) => (
                  <li className="flex items-center gap-2" key={feature.id ?? f}>
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 text-center text-lg font-bold leading-[22px]"
                    >
                      ✓
                    </span>
                    <span className="text-sm font-bold leading-4">{marks(feature.text)}</span>
                  </li>
                ))}
              </ul>
            )}

            {selected && (item.bonusTitle || item.bonusImage) && (
              /* Figma 6214:2989: heading, then a navy 16px-radius box hugging a 110x96
                 image and a 205px copy column, 20px apart. */
              <div className="flex flex-col items-center gap-2.5">
                {item.bonusHeading && (
                  <p className="text-center text-sm font-bold uppercase leading-4">
                    {marks(item.bonusHeading)}
                  </p>
                )}
                <div className="flex max-w-full items-center gap-3 rounded-2xl bg-navy px-4 py-2.5 sm:gap-5 sm:px-[30px]">
                  {item.bonusImage && typeof item.bonusImage === 'object' && (
                    <span className="relative block h-[76px] w-[72px] shrink-0 sm:m-2.5 sm:w-[90px]">
                      <Media
                        className="absolute inset-0"
                        pictureClassName="absolute inset-0"
                        fill
                        imgClassName="object-contain"
                        resource={item.bonusImage}
                        size="90px"
                      />
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col gap-[5px] text-white sm:w-[205px]">
                    <span className="text-2xl font-bold leading-6">
                      {item.bonusHighlight && (
                        <span className="text-highlight">{marks(item.bonusHighlight)} </span>
                      )}
                      {marks(item.bonusTitle)}
                    </span>
                    {item.bonusSubtitle && (
                      <span className="text-sm font-bold leading-4">
                        {marks(item.bonusSubtitle)}
                      </span>
                    )}
                    {item.bonusNote && (
                      <span className="text-sm leading-4">{marks(item.bonusNote)}</span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {oneTimeLabel && (
        /* Figma 6215:3035: a 581px row centred in the 634px column, 8px vertical padding. */
        <p className="mx-auto flex w-full max-w-[581px] py-2">
          <button
            className="text-sm font-semibold leading-4 text-brand-600 underline underline-offset-2"
            type="button"
          >
            {marks(oneTimeLabel)}
          </button>
        </p>
      )}

      <button
        className="flex h-10 w-full items-center justify-center rounded-[20px] bg-navy px-[18.75px] text-base font-extrabold uppercase leading-4 text-white transition-colors hover:bg-navy-900"
        type="button"
      >
        {ctaLabel || 'Add to Cart'}
      </button>
    </>
  )
}
