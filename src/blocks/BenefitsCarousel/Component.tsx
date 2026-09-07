import React from 'react'

import type { BenefitsCarouselBlock as Props } from '@/payload-types'

import { Cards } from './Cards'

export const BenefitsCarouselBlock: React.FC<Props> = ({ heading, items, subheading }) => {
  const benefits = Array.isArray(items) ? items : []

  return (
    <section className="w-full bg-[#cfe0f7] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-[#1c2f6e] sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className="mt-2 text-base font-semibold text-[#0052cc]"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>

        {benefits.length > 0 && (
          <div className="mt-8">
            <Cards items={benefits} />
          </div>
        )}
      </div>
    </section>
  )
}
