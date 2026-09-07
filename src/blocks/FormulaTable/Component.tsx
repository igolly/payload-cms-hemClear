import React from 'react'

import type { FormulaTableBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Table } from './Table'

export const FormulaTableBlock: React.FC<Props> = ({ footnote, formulas, heading }) => {
  const items = Array.isArray(formulas) ? formulas : []

  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {heading && (
          <h2
            className="mb-8 text-center font-serif text-3xl leading-tight text-heading sm:text-4xl"
            data-payload-subpath="heading"
          >
            {heading}
          </h2>
        )}

        {items.length > 0 && <Table formulas={items} />}

        {footnote && (
          <p className="mx-auto mt-6 flex max-w-2xl items-start justify-center gap-3 text-xs leading-relaxed text-slate-600">
            <BrandIcon
              className="shrink-0 text-[#1668C4] [&>svg]:h-7 [&>svg]:w-7"
              name="shieldCheck"
            />
            {footnote}
          </p>
        )}
      </div>
    </section>
  )
}
