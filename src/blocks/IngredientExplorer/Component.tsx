import React from 'react'

import type { IngredientExplorerBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Explorer } from './Explorer'

export const IngredientExplorerBlock: React.FC<Props> = ({
  allLabel,
  disclaimer,
  disclaimerTitle,
  groups,
}) => {
  const formulas = Array.isArray(groups) ? groups : []

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {formulas.length > 0 && <Explorer allLabel={allLabel} groups={formulas} />}

        {(disclaimerTitle || disclaimer) && (
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-[#dbe8fa] bg-[#f7faff] p-5">
            <BrandIcon
              className="mt-0.5 shrink-0 text-[#1668C4] [&>svg]:h-5 [&>svg]:w-5"
              name="info"
            />
            <div className="min-w-0">
              {disclaimerTitle && (
                <p className="text-xs font-bold text-brand">{disclaimerTitle}</p>
              )}
              {disclaimer && (
                <p
                  className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600"
                  data-payload-subpath="disclaimer"
                >
                  {disclaimer}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
