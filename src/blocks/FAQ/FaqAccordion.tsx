'use client'
import React, { useState } from 'react'
import { Minus } from 'lucide-react'

import type { FAQBlock } from '@/payload-types'
import { PlusIcon } from '@/components/PlusIcon'
import { marks } from '@/utilities/marks'

type Item = NonNullable<FAQBlock['items']>[number]

/**
 * One panel at a time: opening a question closes whichever was open, and clicking the open
 * question closes it, leaving the list fully collapsed. `null` is "nothing open", which is
 * also where the list starts unless the block asks for the first question to be open.
 */
export const FaqAccordion: React.FC<{
  defaultState: FAQBlock['defaultState']
  items: Item[]
}> = ({ defaultState, items }) => {
  const [openIndex, setOpenIndex] = useState<null | number>(() =>
    defaultState === 'firstOpen' && items.length > 0 ? 0 : null,
  )

  const toggle = (index: number) => setOpenIndex((current) => (current === index ? null : index))

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `faq-panel-${item.id ?? i}`
        const buttonId = `faq-button-${item.id ?? i}`

        return (
          <React.Fragment key={item.id ?? i}>
            {/*
             * A ruled group heading, drawn above the question that opens the group. The
             * comp keeps numbering running across groups (13 follows 12 under the shipping
             * rule), so this only interrupts the list visually.
             */}
            {item.groupLabel && (
              <li
                aria-hidden="true"
                className="px-[31.25px] py-[18.75px] text-center text-[22.5px] font-bold leading-[28.75px] text-brand-600"
              >
                {marks(item.groupLabel)}
              </li>
            )}

            <li
              className="rounded-[18.75px] border-[1.875px] border-tint-50 bg-white"
              data-payload-subpath={`items.${i}.question`}
            >
              <h3>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-[18.75px] py-[18.75px] text-left sm:px-[31.25px]"
                  id={buttonId}
                  onClick={() => toggle(i)}
                  type="button"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[20px] bg-brand-600 text-[18.75px] font-semibold leading-[23.75px] text-white">
                    {i + 1}
                  </span>

                  <span className="grow text-[18.75px] font-bold leading-[23.75px] text-brand-600">
                    {marks(item.question)}
                  </span>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[20px] border-[1.25px] border-brand-600 text-brand-600">
                    {isOpen ? (
                      <Minus className="size-5" strokeWidth={3} />
                    ) : (
                      <PlusIcon className="size-4" />
                    )}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <div
                  aria-labelledby={buttonId}
                  className="px-[18.75px] pb-[18.75px] text-[13.75px] leading-[18.75px] text-black sm:px-[31.25px]"
                  data-payload-subpath={`items.${i}.answer`}
                  id={panelId}
                  role="region"
                >
                  {typeof item.answer === 'string' ? (
                    item.answer.split('\n\n').map((paragraph, p) => (
                      <p className={p > 0 ? 'mt-4' : undefined} key={p}>
                        {marks(paragraph)}
                      </p>
                    ))
                  ) : (
                    // Inline-editable on the Puck canvas: already an element, not a string.
                    <p>{item.answer}</p>
                  )}
                </div>
              )}
            </li>
          </React.Fragment>
        )
      })}
    </ul>
  )
}
