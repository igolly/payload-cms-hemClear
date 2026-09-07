import React from 'react'
import { Star } from 'lucide-react'

import type { StatsBarBlock as Props } from '@/payload-types'

export const StatsBarBlock: React.FC<Props> = ({ stats }) => {
  const items = Array.isArray(stats) ? stats : []

  if (items.length === 0) return null

  return (
    <section className="w-full bg-[#F7FAFF] px-4 py-8 sm:px-6 lg:px-8">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 lg:flex lg:items-center lg:justify-center">
        {items.map((stat, i) => (
          <li
            className="flex flex-col items-center px-4 text-center lg:flex-1 lg:border-l lg:border-[#c9dcf5] lg:first:border-l-0"
            data-payload-subpath={`stats.${i}.value`}
            key={stat.id ?? i}
          >
            {stat.topLabel && (
              <span
                className="font-serif text-lg leading-none text-[#1c2f6e]"
                data-payload-subpath={`stats.${i}.topLabel`}
              >
                {stat.topLabel}
              </span>
            )}

            <span className="flex items-center gap-1">
              <span className="font-serif text-3xl leading-tight text-[#1c2f6e] sm:text-4xl">
                {stat.value}
              </span>
              {stat.showStar && (
                <Star className="h-6 w-6 text-[#1c2f6e] sm:h-7 sm:w-7" fill="currentColor" strokeWidth={0} />
              )}
            </span>

            {stat.label && (
              <span
                className="font-serif text-sm text-[#1c2f6e] sm:text-base"
                data-payload-subpath={`stats.${i}.label`}
              >
                {stat.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
