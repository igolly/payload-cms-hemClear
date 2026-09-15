'use client'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

import { type Plan, PlanCard, PopularFrame } from './PlanCard'
import { PlanCarousel } from './PlanCarousel'

/**
 * The "select a plan" layout: the cards act as radio options and one shared button buys
 * the chosen plan, with that plan's footnote under it. The most popular plan starts selected.
 */
export const SelectablePlans: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  const initial = Math.max(
    0,
    plans.findIndex((plan) => plan.popular),
  )
  const [selected, setSelected] = useState(initial)
  const chosen = plans[selected]

  return (
    <>
      {/* Below xl the plans are a carousel and the centred card is the chosen one (Figma 6400:613). */}
      <PlanCarousel
        initial={initial}
        itemWidth="345px"
        onSettle={setSelected}
        trackProps={{ 'aria-label': 'Choose a plan', role: 'radiogroup' }}
      >
        {plans.map((plan, i) => {
          const card = <PlanCard index={i} plan={plan} selected={i === selected} />
          // A <div> with the radio role rather than a <button>: the card holds block content
          // (paragraphs, a list), which a button may not contain.
          return (
            <div
              aria-checked={i === selected}
              className={cn(
                'w-[345px] max-w-full cursor-pointer xl:max-w-[411px] rounded-[18.75px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua-200',
                plan.popular ? 'xl:w-[411px]' : 'xl:w-[345px]',
              )}
              key={plan.id ?? i}
              onClick={(event) => {
                setSelected(i)
                // In the carousel, bring the chosen card to the centre so the scroll doesn't re-pick another.
                const track = event.currentTarget.parentElement
                if (track && track.scrollWidth > track.clientWidth) {
                  event.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  })
                }
              }}
              onKeyDown={(event) => {
                const step = { ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1 }[event.key]
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault()
                  setSelected(i)
                } else if (step) {
                  event.preventDefault()
                  const next = (i + step + plans.length) % plans.length
                  setSelected(next)
                  ;(
                    event.currentTarget.parentElement?.children[next] as HTMLElement | undefined
                  )?.focus()
                }
              }}
              role="radio"
              tabIndex={i === selected ? 0 : -1}
            >
              {plan.popular ? (
                <PopularFrame label={plan.popularLabel} selectable>
                  {card}
                </PopularFrame>
              ) : (
                card
              )}
            </div>
          )
        })}
      </PlanCarousel>

      {chosen && (
        <>
          <a
            className="flex h-[38.75px] w-full items-center justify-center rounded-[15.625px] bg-success-bright p-[6.25px] text-lg font-medium uppercase sm:h-[38px] sm:max-w-[504px] sm:font-bold text-white transition-colors hover:bg-success-deep"
            href={chosen.ctaUrl || '#'}
          >
            {chosen.ctaLabel || 'Buy Now'}
          </a>
          {/* Reserved even when the chosen plan has no footnote, so the trust strip doesn't jump.
              White rather than the comp's #0329b2, which disappears against the navy band. */}
          <p
            aria-live="polite"
            className="hidden h-[34px] items-center justify-center text-center sm:flex text-xs font-medium text-white [&_sup]:leading-[0]"
          >
            {marks(chosen.footnote)}
          </p>
        </>
      )}
    </>
  )
}
