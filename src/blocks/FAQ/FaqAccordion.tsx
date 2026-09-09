'use client'
import React, { useState } from 'react'
import { Minus } from 'lucide-react'

import type { FAQBlock } from '@/payload-types'
import { PlusIcon } from '@/components/PlusIcon'
import { marks } from '@/utilities/marks'

type Item = NonNullable<FAQBlock['items']>[number]

const initialOpen = (count: number, defaultState: FAQBlock['defaultState']): Set<number> => {
  if (defaultState === 'allClosed') return new Set()
  if (defaultState === 'firstOpen') return new Set(count > 0 ? [0] : [])
  return new Set(Array.from({ length: count }, (_, i) => i))
}

export const FaqAccordion: React.FC<{
  defaultState: FAQBlock['defaultState']
  items: Item[]
}> = ({ defaultState, items }) => {
  const [open, setOpen] = useState(() => initialOpen(items.length, defaultState))

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })

  return (
    <ul className="flex flex-col gap-5">
      {items.map((item, i) => {
        const isOpen = open.has(i)
        const panelId = `faq-panel-${item.id ?? i}`
        const buttonId = `faq-button-${item.id ?? i}`

        return (
          <li
            className="rounded-2xl border border-[#e5edf9] bg-white shadow-[0_1px_3px_rgba(16,60,120,0.06)]"
            data-payload-subpath={`items.${i}.question`}
            key={item.id ?? i}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-6 py-5 text-left"
                id={buttonId}
                onClick={() => toggle(i)}
                type="button"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0329b2] text-sm font-semibold text-white">
                  {i + 1}
                </span>

                <span className="grow text-base font-bold text-subheading">{marks(item.question)}</span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6279cf] text-[#6279cf]">
                  {isOpen ? <Minus className="h-4 w-4" /> : <PlusIcon className="h-3 w-3" />}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div
                aria-labelledby={buttonId}
                className="px-6 pb-6 text-[15px] leading-relaxed text-slate-700"
                data-payload-subpath={`items.${i}.answer`}
                id={panelId}
                role="region"
              >
                {item.answer.split('\n\n').map((paragraph, p) => (
                  <p className={p > 0 ? 'mt-4' : undefined} key={p}>
                    {marks(paragraph)}
                  </p>
                ))}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
