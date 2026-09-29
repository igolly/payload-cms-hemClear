'use client'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'

import { type Plan, PlanCard, PopularFrame } from './PlanCard'
import { PlanCarousel } from './PlanCarousel'

/**
 * The "select a plan" layout: the cards act as radio options, and the buy button belongs to
 * whichever card is chosen rather than sitting below the row — so the thing you press is
 * attached to the thing you are buying. The most popular plan starts selected.
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
                // The buy button lives inside this card. Enter on it must follow the link,
                // not be swallowed by the card's own "choose me" handling.
                if (event.target !== event.currentTarget) return

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

      {/* Said once, for a reader who cannot see which card is highlighted. */}
      <p aria-live="polite" className="sr-only">
        {chosen ? `${chosen.name} selected` : ''}
      </p>
    </>
  )
}
