'use client'
import React, { useState } from 'react'
import { Check } from 'lucide-react'

import type { FormulaTableBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Formula = NonNullable<FormulaTableBlock['formulas']>[number]

export const Table: React.FC<{ formulas: Formula[] }> = ({ formulas }) => {
  const [index, setIndex] = useState(0)
  const formula = formulas[index]
  const rows = Array.isArray(formula?.rows) ? formula.rows : []

  return (
    <div>
      {formulas.length > 1 && (
        <div className="flex justify-center gap-3">
          {formulas.map((item, i) => (
            <button
              aria-pressed={i === index}
              className={cn(
                'relative flex h-24 w-24 items-center justify-center rounded-lg border-2 transition-colors',
                i === index
                  ? 'border-brand bg-brand'
                  : 'border-[#dbe8fa] bg-white hover:border-[#9dbde8]',
              )}
              key={item.id ?? i}
              onClick={() => setIndex(i)}
              type="button"
            >
              {item.image && typeof item.image === 'object' ? (
                <Media
                  className="absolute inset-2"
                  fill
                  imgClassName="object-contain"
                  resource={item.image}
                />
              ) : (
                <span className={cn('text-[10px]', i === index ? 'text-white' : 'text-[#8AA6C8]')}>
                  {marks(item.name)}
                </span>
              )}

              <span
                className={cn(
                  'absolute bottom-1 flex h-5 w-5 items-center justify-center rounded-full border',
                  i === index ? 'border-white bg-white' : 'border-[#c9dcf5] bg-white',
                )}
              >
                {i === index && <Check className="h-3 w-3 text-brand" strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      )}

      {formula && (
        <>
          <header className="mt-8 text-center">
            <h3 className="font-serif text-3xl leading-tight sm:text-4xl">
              {formula.titleBefore && <span className="text-heading">{marks(formula.titleBefore)} </span>}
              {formula.titleAccent && <span className="text-[#2d80e2]">{marks(formula.titleAccent)}</span>}
              {formula.titleAfter && <span className="text-heading"> {marks(formula.titleAfter)}</span>}
            </h3>
            {formula.subtitle && (
              <>
                <p className="mt-3 text-sm font-semibold text-[#0052cc]">{marks(formula.subtitle)}</p>
                <span aria-hidden="true" className="mx-auto mt-3 block h-0.5 w-16 bg-[#2d80e2]" />
              </>
            )}
          </header>

          {rows.length > 0 && (
            <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-xl border border-[#e2ecf9]">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{formula.name} ingredients</caption>
                <tbody>
                  {rows.map((row, i) => (
                    <tr className="border-t border-[#e2ecf9] first:border-t-0" key={row.id ?? i}>
                      <td className="w-20 p-2">
                        <span className="relative flex h-10 w-14 items-center justify-center">
                          {row.image && typeof row.image === 'object' ? (
                            <Media fill imgClassName="object-contain" resource={row.image} />
                          ) : (
                            <span className="h-6 w-6 rounded-full bg-[#e8f0fc]" />
                          )}
                        </span>
                      </td>
                      <th className="p-2 font-serif text-base font-semibold text-[#0052cc]" scope="row">
                        {marks(row.name)}
                      </th>
                      <td className="p-2 text-right text-xs text-slate-600 sm:text-left">
                        {marks(row.benefit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
