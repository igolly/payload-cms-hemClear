'use client'
import React, { useState } from 'react'

import type { ProductDetailBlock } from '@/payload-types'
import { marks } from '@/utilities/marks'

import { Toggle } from './Toggle'

type Item = NonNullable<ProductDetailBlock['contains']>[number]

/** The comp's glyphs are type, not icons: a bold ✓ in green and a bold × in red. */
const Tick = () => (
  <span
    aria-hidden="true"
    className="w-[18px] shrink-0 text-center text-xl font-bold leading-5 text-[#00ae26]"
  >
    ✓
  </span>
)
const Cross = () => (
  <span
    aria-hidden="true"
    className="w-[15px] shrink-0 text-center text-[22px] font-bold leading-5 text-[#d30000]"
  >
    ×
  </span>
)

/**
 * Figma 6243:685: centred note, then two equal columns 10px apart. "Contains" stacks
 * full-width outlined pills (10px apart); "Does not contain" wraps hugging white pills.
 * Both columns stack below ~560px of buy column.
 */
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
    <div className="border-b border-navy">
      <Toggle controls={panelId} onClick={() => setOpen((v) => !v)} open={open}>
        {marks(title)}
      </Toggle>

      {open && (
        <div className="flex flex-col gap-4 pb-4 text-navy [&_sup]:leading-[0]" id={panelId}>
          {note && <p className="text-center text-base font-bold leading-5">{marks(note)}</p>}

          <div className="grid grid-cols-1 gap-x-2.5 gap-y-6 @min-[560px]:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2.5">
              {containsTitle && (
                <p className="flex items-center gap-1.5 text-base font-bold uppercase leading-5">
                  <Tick />
                  {marks(containsTitle)}
                </p>
              )}
              <ul className="flex flex-col gap-2.5">
                {contains.map((item, i) => (
                  <li
                    className="flex items-center gap-2 rounded-[50px] border border-aqua-200 px-2.5 py-1"
                    key={item.id ?? i}
                  >
                    <Tick />
                    <span className="text-sm leading-5">{marks(item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-w-0 flex-col gap-2.5">
              {notContainsTitle && (
                <p className="flex items-center gap-1.5 text-base font-bold uppercase leading-5">
                  <Cross />
                  {marks(notContainsTitle)}
                </p>
              )}
              <ul className="flex flex-wrap content-start gap-2.5">
                {notContains.map((item, i) => (
                  <li
                    className="flex items-center gap-2 rounded-[50px] border border-[#fcc] bg-white px-2.5 py-1"
                    key={item.id ?? i}
                  >
                    <Cross />
                    <span className="text-sm leading-5 text-[#d30000]">{marks(item.text)}</span>
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
