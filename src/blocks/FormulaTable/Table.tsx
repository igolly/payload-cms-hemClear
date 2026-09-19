'use client'
import React, { useState } from 'react'

import type { FormulaTableBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Formula = NonNullable<FormulaTableBlock['formulas']>[number]

/** The 30px radio drawn under each product tile in the Figma COMBO frame (exported artwork). */
const TileRadio: React.FC<{ checked: boolean }> = ({ checked }) => (
  // eslint-disable-next-line @next/next/no-img-element -- static artwork, nothing to optimise
  <img
    alt=""
    className="size-[30px] shrink-0"
    decoding="async"
    height={30}
    loading="lazy"
    src={`/icons/formula-table/radio-${checked ? 'checked' : 'unchecked'}.png`}
    width={30}
  />
)

export const Table: React.FC<{ formulas: Formula[] }> = ({ formulas }) => {
  const [index, setIndex] = useState(0)
  const formula = formulas[index]
  const rows = Array.isArray(formula?.rows) ? formula.rows : []

  return (
    <div className="flex w-full flex-col items-center">
      {formulas.length > 1 && (
        // Phone comp: one white 340×280 card (radius 30) holding two 170×280 tiles, only the selected one filled.
        // Desktop comp: two 165×199 tiles butted together, each with a #ddd inside stroke and a 0 0 7 shadow.
        <div
          className="mt-[12.5px] flex overflow-hidden rounded-[30px] bg-white shadow-[inset_0_0_0_1.25px_var(--color-ash-50)] lg:overflow-visible lg:bg-transparent lg:shadow-none"
          role="group"
        >
          {formulas.map((item, i) => {
            const selected = i === index
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  'relative flex h-[280px] w-[170px] flex-col items-center justify-end gap-[12.5px] overflow-hidden rounded-[30px] p-[31.25px] transition-colors lg:h-[199px] lg:w-[165px] lg:border lg:border-ash-200 lg:pt-0 lg:pb-3 lg:shadow-[0_0_7px_rgba(0,0,0,0.15)]',
                  selected
                    ? 'bg-linear-to-b from-brand-500 to-brand-600'
                    : 'bg-transparent lg:bg-white',
                )}
                data-payload-subpath={`formulas.${i}.image`}
                key={item.id ?? i}
                onClick={() => setIndex(i)}
                type="button"
              >
                <span className="relative flex h-[168px] w-[110px] shrink-0 items-end justify-center lg:h-[130px] lg:w-[70px]">
                  {item.image && typeof item.image === 'object' ? (
                    <Media
                      className="relative size-full"
                      fill
                      imgClassName="object-contain object-bottom"
                      // 110px tab artwork on a phone, 70px from `lg`.
                      size="110px"
                      resource={item.image}
                    />
                  ) : (
                    <span
                      className={cn(
                        'self-center text-xs font-semibold',
                        selected ? 'text-white' : 'text-navy',
                      )}
                    >
                      {marks(item.name)}
                    </span>
                  )}
                </span>
                <span className="sr-only">{item.name}</span>
                <TileRadio checked={selected} />
              </button>
            )
          })}
        </div>
      )}

      {formula && (
        <>
          <header
            className={cn(
              'flex w-full flex-col items-center text-center',
              formulas.length > 1 ? 'mt-[34.75px] lg:mt-[20.75px]' : 'mt-0',
            )}
          >
            <h3 className="text-balance font-marcellus text-5xl leading-[60px] font-normal text-navy-900 lg:text-[52px] lg:leading-[66px] [&_sup]:leading-[0]">
              {formula.titleBefore && <span>{marks(formula.titleBefore)} </span>}
              {formula.titleAccent && (
                <span className="text-brand-300">{marks(formula.titleAccent)}</span>
              )}
              {formula.titleAfter && <span> {marks(formula.titleAfter)}</span>}
            </h3>
            {formula.subtitle && (
              <p className="mt-3 text-2xl leading-[normal] font-medium text-brand-500 lg:mt-[12.5px] lg:leading-[29px]">
                {marks(formula.subtitle)}
              </p>
            )}
            {/* Figma "Line 1": 62.5px, 2.5px round-capped stroke that takes no layout height. */}
            <span
              aria-hidden="true"
              className="mt-[10.75px] block h-[2.5px] w-[65px] rounded-full bg-brand-300 lg:mt-[11.25px]"
            />
          </header>

          {rows.length > 0 && (
            // Figma: #f8f9fd card, 0.625px #999 inside stroke, radius 31.25, every row ruled underneath.
            <div
              aria-label={`${formula.name} ingredients`}
              className="mt-[10.75px] flex w-full max-w-[937.5px] flex-col overflow-hidden rounded-[31.25px] bg-mist text-left shadow-[inset_0_0_0_0.625px_var(--color-ash-500)] lg:mt-[11.25px]"
              role="table"
            >
              {rows.map((row, i) => (
                <div
                  className="flex items-center gap-2 py-2 shadow-[inset_0_-0.625px_0_var(--color-ash-500)] lg:h-[55px] lg:gap-[31.25px]"
                  key={row.id ?? i}
                  role="row"
                >
                  {/* Phone: 110px column, 81.25×62.5 art. Desktop: 162.5px column, 63.25×48.65 art. */}
                  <span
                    className="flex w-[110px] shrink-0 justify-center lg:w-[162.5px]"
                    role="cell"
                  >
                    <span className="relative flex h-[62.5px] w-[81.25px] items-center justify-center lg:h-[48.65px] lg:w-[63.25px]">
                      {row.image && typeof row.image === 'object' ? (
                        <Media
                          className="relative size-full"
                          fill
                          imgClassName="object-contain"
                          // 81.25px ingredient art on a phone, 63.25px from `lg`.
                          size="82px"
                          resource={row.image}
                        />
                      ) : (
                        <span className="size-6 rounded-full bg-mist-100" />
                      )}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-[60px] w-[0.625px] shrink-0 bg-ash-500 lg:h-[39px]"
                  />
                  <span
                    className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-center lg:gap-[31.25px]"
                    role="none"
                  >
                    <span
                      className="block font-playfair text-[28px] leading-[normal] font-semibold text-brand-600 lg:w-[312.5px] lg:shrink-0 lg:text-2xl"
                      role="rowheader"
                    >
                      {marks(row.name)}
                    </span>
                    <span
                      className="block min-w-0 text-base leading-[normal] font-medium text-black lg:flex-1"
                      role="cell"
                    >
                      {marks(row.benefit)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
