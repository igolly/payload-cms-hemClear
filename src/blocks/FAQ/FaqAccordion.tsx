'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Minus } from 'lucide-react'

import type { FAQBlock } from '@/payload-types'
import { PlusIcon } from '@/components/PlusIcon'
import { cn } from '@/utilities/ui'
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
  /**
   * `card` is the site's own treatment: a white rounded card per question with a numbered
   * badge. `panel` is the ruled list that sits in the navy column of the split layout,
   * where a stack of white cards on navy would be a second surface inside the panel.
   */
  tone?: 'card' | 'panel'
}> = ({ defaultState, items, tone = 'card' }) => {
  const [openIndex, setOpenIndex] = useState<null | number>(() =>
    defaultState === 'firstOpen' && items.length > 0 ? 0 : null,
  )

  const toggle = (index: number) => setOpenIndex((current) => (current === index ? null : index))

  if (tone === 'panel') return <PanelList items={items} onToggle={toggle} openIndex={openIndex} />

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

/**
 * The ruled list in the split layout's navy panel, beside the product photo.
 *
 * The photo fills the band's height, so anything that changed that height re-sized and
 * re-cropped it — and opening a question did exactly that, the photo growing and shrinking
 * with every click. Side by side, the list therefore reserves room for its tallest state
 * up front: every question plus the longest answer. Opening, closing or switching questions
 * then happens inside space that is already there, and the band, and the photo, stay put.
 * Stacked on a narrow screen the photo has its own fixed height, so nothing is reserved.
 */
const PanelList: React.FC<{
  items: Item[]
  onToggle: (index: number) => void
  openIndex: null | number
}> = ({ items, onToggle, openIndex }) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [reserve, setReserve] = useState<number | undefined>(undefined)

  const measure = useCallback(() => {
    const list = listRef.current
    if (!list) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return setReserve(undefined)

    let closed = 0
    let longest = 0
    list.querySelectorAll<HTMLElement>(':scope > li').forEach((li) => {
      const button = li.querySelector<HTMLElement>(':scope > h3')
      const answer = li.querySelector<HTMLElement>('[data-answer]')
      // Each row is its button plus the 1px rule beneath it.
      closed += (button?.offsetHeight ?? 0) + 1
      longest = Math.max(longest, answer?.offsetHeight ?? 0)
    })
    setReserve(Math.ceil(closed + longest))
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (listRef.current) observer.observe(listRef.current)
    // Web fonts arriving re-wrap the answers; measure again once they have.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [measure])

  return (
    <ul className="flex flex-col" ref={listRef} style={{ minHeight: reserve }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `faq-panel-${item.id ?? i}`
        const buttonId = `faq-button-${item.id ?? i}`

        return (
          <li
            className="border-b border-white/70"
            data-payload-subpath={`items.${i}.question`}
            key={item.id ?? i}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-6 py-3.5 text-left text-white transition-opacity hover:opacity-85"
                id={buttonId}
                onClick={() => onToggle(i)}
                type="button"
              >
                <span className="grow text-[15px] font-semibold leading-[1.3] tracking-[0.01em] [&_sup]:leading-[0]">
                  {marks(item.question)}
                </span>
                <span aria-hidden="true" className="shrink-0 text-white">
                  {isOpen ? (
                    <Minus className="size-5" strokeWidth={2.25} />
                  ) : (
                    <PlusIcon className="size-[18px]" />
                  )}
                </span>
              </button>
            </h3>

            {/* Every answer stays in the page, collapsed to nothing, so the list can measure
                the longest; the grid-rows trick animates it open without a fixed height. */}
            <div
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
              id={panelId}
              inert={!isOpen}
              role="region"
            >
              <div className="overflow-hidden">
                <div
                  className="pb-4 pr-8 text-[13.5px] leading-[1.55] text-white/80"
                  data-answer
                  data-payload-subpath={`items.${i}.answer`}
                >
                  {typeof item.answer === 'string' ? (
                    item.answer.split('\n\n').map((paragraph, p) => (
                      <p className={p > 0 ? 'mt-3' : undefined} key={p}>
                        {marks(paragraph)}
                      </p>
                    ))
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
