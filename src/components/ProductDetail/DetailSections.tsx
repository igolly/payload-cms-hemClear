'use client'
import React, { useState } from 'react'

import type { ProductDetailBlock } from '@/payload-types'
import { marks } from '@/utilities/marks'

import { Toggle } from './Toggle'

type Section = NonNullable<ProductDetailBlock['sections']>[number]

/**
 * Figma 6216:3121 / 6216:3138 / 6219:3264: each section is a 50px header over a bulleted
 * 16/20 body with 16px beneath it, closed off by a navy rule. All open by default, as drawn.
 */
export const DetailSections: React.FC<{ sections: Section[] }> = ({ sections }) => {
  const [open, setOpen] = useState<Set<number>>(() => new Set(sections.map((_, i) => i)))

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <>
      {sections.map((section, i) => {
        const isOpen = open.has(i)
        const panelId = `product-section-${section.id ?? i}`

        return (
          <div className="border-b border-navy" key={section.id ?? i}>
            <Toggle controls={panelId} onClick={() => toggle(i)} open={isOpen}>
              {marks(section.title)}
            </Toggle>

            {isOpen && Array.isArray(section.items) && section.items.length > 0 && (
              <ul
                className="list-disc pb-4 pl-6 text-base leading-5 text-navy [&_sup]:leading-[0]"
                id={panelId}
              >
                {section.items.map((item, j) => (
                  <li key={item.id ?? j}>{marks(item.text)}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </>
  )
}
