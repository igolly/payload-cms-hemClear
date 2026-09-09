'use client'
import React, { useState } from 'react'
import { Check, Minus, X } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'
import { PlusIcon } from '@/components/PlusIcon'
import { marks } from '@/utilities/marks'

type Item = NonNullable<ProductDetailBlock['contains']>[number]

export const Composition: React.FC<{
  contains: Item[]
  containsTitle?: string | null
  note?: string | null
  notContains: Item[]
  notContainsTitle?: string | null
  title?: string | null
}> = ({ contains, containsTitle, note, notContains, notContainsTitle, title }) => {
  const [open, setOpen] = useState(true)
  const panelId = 'product-composition'

  return (
    <div className="border-t border-[#dbe8fa] py-4">
      <h2>
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="font-serif text-xl text-heading">{marks(title)}</span>
          {open ? (
            <Minus className="h-5 w-5 shrink-0 text-brand" />
          ) : (
            <PlusIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
          )}
        </button>
      </h2>

      {open && (
        <div id={panelId}>
          {note && (
            <p className="mt-3 text-center text-xs font-bold text-brand">{marks(note)}</p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              {containsTitle && (
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#1a8a3c]">
                  <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
                  {marks(containsTitle)}
                </p>
              )}
              <ul className="mt-3 flex flex-col gap-2">
                {contains.map((item, i) => (
                  <li
                    className="flex items-start gap-2 rounded-full border border-[#cfe6d6] px-3 py-2"
                    key={item.id ?? i}
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a8a3c]"
                      strokeWidth={3}
                    />
                    <span className="text-xs leading-snug text-brand">{marks(item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {notContainsTitle && (
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#c0392b]">
                  <X aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
                  {marks(notContainsTitle)}
                </p>
              )}
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {notContains.map((item, i) => (
                  <li
                    className="flex items-start gap-2 rounded-full border border-[#f0cfcb] px-3 py-2"
                    key={item.id ?? i}
                  >
                    <X
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c0392b]"
                      strokeWidth={3}
                    />
                    <span className="text-xs leading-snug text-[#c0392b]">{marks(item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
