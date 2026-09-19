import React from 'react'

import type { PricingOfferBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

export type Plan = NonNullable<PricingOfferBlock['plans']>[number]

/** The comp sets the " + " in a bundle name in the sans face, between two serif names. */
const planName = (name: React.ReactNode): React.ReactNode => {
  if (typeof name !== 'string') return name

  return name.split(/(\s\+\s)/).map((part, i) =>
    part.trim() === '+' ? (
      <span className="font-inter font-normal" key={i}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{marks(part)}</React.Fragment>
    ),
  )
}

/**
 * One plan. `selected` switches the card to the selectable layout: no per-card button or
 * footnote (the section has one shared button), shorter fixed heights, and the white
 * "chosen" treatment follows the selection rather than the popular flag.
 */
export const PlanCard: React.FC<{ index: number; plan: Plan; selected?: boolean }> = ({
  index,
  plan,
  selected,
}) => {
  const popular = Boolean(plan.popular)
  const selectable = selected !== undefined
  const emphasised = selectable ? selected : popular

  return (
    <div
      className={cn(
        // `marks` sets ® in a <sup>, which would otherwise grow every line box it sits in and
        // push the bottom-aligned content past the fixed card height.
        'flex w-full flex-col items-center justify-end gap-[6.25px] rounded-[18.75px] border-2 px-[21.875px] py-[6.25px] transition-colors [&_sup]:leading-[0]',
        emphasised
          ? 'border-brand-600 bg-white drop-shadow-[0_0_5.625px_rgba(0,0,0,0.25)]'
          : cn(
              'border-[rgba(221,221,221,0.87)] bg-mist-100',
              // Below xl (Figma mobile) the unchosen cards drop the grey rule: white in the
              // per-card layout, pale blue in the selectable one.
              'max-xl:border-transparent max-xl:drop-shadow-[0_0_5.625px_rgba(0,0,0,0.25)]',
              selectable ? 'max-xl:bg-tint-50' : 'max-xl:bg-white',
            ),
        // Below xl every card shares the comp's mobile height, so the carousel's cards line up.
        selectable ? 'max-xl:min-h-[480px]' : 'max-xl:min-h-[542.5px]',
        selectable
          ? popular
            ? 'xl:h-[525px]'
            : 'xl:h-[494px]'
          : popular
            ? 'xl:h-[543px]'
            : 'xl:h-[522px]',
      )}
      data-payload-subpath={`plans.${index}.name`}
    >
      <p
        className={cn(
          'text-center font-playfair font-bold leading-normal text-heading',
          // Selectable cards break a long bundle name onto two lines, as in the comp; the
          // original layout runs it into the side padding instead.
          selectable
            ? 'whitespace-pre-line text-balance'
            : 'text-balance xl:-mx-[21.875px] xl:w-[calc(100%+43.75px)] xl:whitespace-nowrap',
          popular ? 'text-[2rem]' : 'text-[1.625rem]',
        )}
      >
        {planName(plan.name)}
      </p>

      <div
        className={cn('relative shrink-0', popular ? 'h-[200px] w-[300px]' : 'h-[187px] w-[280px]')}
      >
        {plan.image && typeof plan.image === 'object' ? (
          <Media fill imgClassName="object-cover" resource={plan.image} size="300px" />
        ) : (
          <span className="flex h-full items-center justify-center text-[11px] text-steel-400">
            Product image
          </span>
        )}
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="inline-flex flex-col items-start gap-[6.25px] py-[9.375px] text-navy-900">
          {plan.priceLead && (
            <p className="text-[12.5px] leading-[15px]">{marks(plan.priceLead)}</p>
          )}
          {/* Pinned to the comp's line height: the two sizes sit on one baseline, which would otherwise stretch the line. */}
          <p className="flex h-[37.5px] w-full items-baseline justify-center leading-[37.5px]">
            <span className="text-[46.875px] font-bold">{marks(plan.price)}</span>
            {plan.priceSuffix && (
              <span className="whitespace-pre text-[12.5px]"> {marks(plan.priceSuffix)}</span>
            )}
          </p>
        </div>

        {Array.isArray(plan.features) && plan.features.length > 0 && (
          // No right padding below xl: the comp's longest phone line fits its 345px card by ~1px.
          <ul className="flex w-full flex-col gap-[9.375px] border-t-[0.625px] border-ash-400 px-[9.375px] py-[12.5px] max-xl:pr-0">
            {plan.features.map((feature, f) => (
              <li className="flex items-center gap-[6.25px]" key={feature.id ?? f}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
                <img
                  alt=""
                  className="size-4 shrink-0"
                  decoding="async"
                  height={16}
                  loading="lazy"
                  src="/icons/pricing/check.svg"
                  width={16}
                />
                <span
                  className={cn(
                    'text-left text-xs font-medium leading-[15px]',
                    feature.highlight ? 'text-brand-600' : 'text-navy-900',
                  )}
                >
                  {marks(feature.text)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!selectable && (
          <>
            <a
              className={cn(
                'flex h-[38.75px] w-full items-center justify-center rounded-[15.625px] p-[6.25px] text-lg uppercase text-white transition-colors',
                popular
                  ? 'bg-success-bright font-bold hover:bg-success-deep'
                  : 'bg-brand-600 font-medium hover:bg-brand-dark',
              )}
              href={plan.ctaUrl || '#'}
            >
              {plan.ctaLabel || 'Buy Now'}
            </a>

            {/* Reserved even when empty, so a plan without a footnote keeps its height. */}
            <p className="flex h-[28.125px] items-center justify-center text-center text-xs font-medium text-brand-600">
              {marks(plan.footnote)}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/** The blue frame and ribbon that sit behind the most-popular plan. */
export const PopularFrame: React.FC<{
  children: React.ReactNode
  label?: string | null
  selectable?: boolean
}> = ({ children, label, selectable }) => (
  <div
    className={cn(
      'flex w-full flex-col items-center justify-end gap-[6.25px] rounded-[18.75px] border-2 border-ash-200 bg-brand-600 max-xl:border-0',
      selectable ? 'max-xl:min-h-[515px] xl:h-[561px]' : 'max-xl:min-h-[575px] xl:h-[576px]',
    )}
  >
    {label && (
      <p className="whitespace-pre text-center text-[15px] font-bold uppercase leading-[15px] text-white">
        {`★   ${label}   ★`}
      </p>
    )}
    {children}
  </div>
)
