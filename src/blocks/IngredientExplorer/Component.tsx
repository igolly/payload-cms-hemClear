import React from 'react'

import type { IngredientExplorerBlock as Props } from '@/payload-types'

import { Disclaimer } from './Disclaimer'
import { Explorer } from './Explorer'
import { backgroundStyle } from '@/fields/background'

/**
 * Figma "PILL INGREDIENT HEAD" (2003:238), "PILL INGREDIENT" (2003:241) and
 * "PILL DISCLAIMER" (2003:240), stacked in one 1200-wide column.
 */
export const IngredientExplorerBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  allLabel,
  disclaimer,
  disclaimerTitle,
  groups,
}) => {
  const formulas = Array.isArray(groups) ? groups : []

  return (
    <section
      className="w-full bg-white px-4 font-inter sm:px-6"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto max-w-[1200px]">
        {formulas.length > 0 ? (
          <Explorer
            allLabel={allLabel}
            disclaimer={disclaimer}
            disclaimerTitle={disclaimerTitle}
            groups={formulas}
          />
        ) : (
          <Disclaimer text={disclaimer} title={disclaimerTitle} />
        )}
      </div>
    </section>
  )
}
