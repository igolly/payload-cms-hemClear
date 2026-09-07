'use client'
import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import type { Product } from '@/payload-types'

type Section = NonNullable<Product['sections']>[number]

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
    <ul className="mt-8 flex flex-col">
      {sections.map((section, i) => {
        const isOpen = open.has(i)
        const panelId = `product-section-${section.id ?? i}`

        return (
          <li className="border-t border-[#dbe8fa] py-4" key={section.id ?? i}>
            <h2>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => toggle(i)}
                type="button"
              >
                <span className="font-serif text-xl text-heading">{section.title}</span>
                {isOpen ? (
                  <Minus className="h-5 w-5 shrink-0 text-brand" />
                ) : (
                  <Plus className="h-5 w-5 shrink-0 text-brand" />
                )}
              </button>
            </h2>

            {isOpen && Array.isArray(section.items) && section.items.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5" id={panelId}>
                {section.items.map((item, j) => (
                  <li className="text-sm leading-relaxed text-[#1a2f7c]" key={item.id ?? j}>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
