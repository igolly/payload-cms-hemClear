'use client'
import React, { useMemo, useState } from 'react'
import { Minus } from 'lucide-react'

import type { IngredientExplorerBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { PlusIcon } from '@/components/PlusIcon'
import { marks } from '@/utilities/marks'

type Group = NonNullable<IngredientExplorerBlock['groups']>[number]

export const Explorer: React.FC<{ allLabel?: string | null; groups: Group[] }> = ({
  allLabel,
  groups,
}) => {
  const [groupIndex, setGroupIndex] = useState(0)
  const [category, setCategory] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const group = groups[groupIndex]
  const ingredients = useMemo(
    () => (Array.isArray(group?.ingredients) ? group.ingredients : []),
    [group],
  )

  // Categories come from the ingredients themselves, in first-appearance order,
  // so there is no second list for editors to keep in sync.
  const categories = useMemo(() => {
    const seen: string[] = []
    for (const item of ingredients) {
      const value = item.category?.trim()
      if (value && !seen.includes(value)) seen.push(value)
    }
    return seen
  }, [ingredients])

  const visible = category
    ? ingredients.filter((item) => item.category?.trim() === category)
    : ingredients

  const selectGroup = (index: number) => {
    setGroupIndex(index)
    setCategory(null)
    setExpanded(null)
  }

  return (
    <div>
      {/* Formula toggle */}
      {groups.length > 1 && (
        <div className="flex justify-center">
          <div className="flex rounded-full border border-[#c9dcf5] bg-white p-1">
            {groups.map((item, i) => (
              <button
                aria-pressed={i === groupIndex}
                className={cn(
                  'rounded-full px-8 py-2.5 text-sm font-bold transition-colors',
                  i === groupIndex ? 'bg-brand text-white' : 'text-brand hover:bg-slate-50',
                )}
                key={item.id ?? i}
                onClick={() => selectGroup(i)}
                type="button"
              >
                {marks(item.name)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      {categories.length > 0 && (
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {[null, ...categories].map((value) => {
            const active = category === value
            return (
              <li key={value ?? '__all'}>
                <button
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-[#c9dcf5] bg-white text-brand hover:bg-slate-50',
                  )}
                  onClick={() => setCategory(value)}
                  type="button"
                >
                  {value ?? allLabel ?? 'All'}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* Heading for the selected formula */}
      {(group?.heading || group?.description) && (
        <header className="mt-8 text-center">
          {group.heading && (
            <h2 className="font-serif text-3xl leading-tight text-heading sm:text-4xl">
              {marks(group.heading)}
            </h2>
          )}
          <span aria-hidden="true" className="mx-auto mt-3 block h-0.5 w-16 bg-[#2d80e2]" />
          {group.description && (
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#0052cc]">
              {marks(group.description)}
            </p>
          )}
        </header>
      )}

      {/* Cards */}
      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((item, i) => {
          const key = String(item.id ?? `${groupIndex}-${i}`)
          const isOpen = expanded === key
          // The + appears only when there is genuinely more to read, so it never
          // expands into nothing. Fill an ingredient's `details` field to enable it.
          const canExpand = Boolean(item.details)

          return (
            <li
              className="flex flex-col overflow-hidden rounded-xl border border-[#e2ecf9] bg-white shadow-[0_1px_3px_rgba(16,60,120,0.06)]"
              key={key}
            >
              <div className="relative aspect-[4/3] w-full bg-[#f2f6fd]">
                {item.image && typeof item.image === 'object' ? (
                  <Media fill imgClassName="object-cover" resource={item.image} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[11px] text-[#8AA6C8]">
                    Ingredient image
                  </span>
                )}
              </div>

              <div className="flex grow flex-col p-4">
                <h3 className="text-base font-bold leading-tight text-subheading">{marks(item.name)}</h3>
                {item.latin && <p className="text-xs italic text-slate-500">{marks(item.latin)}</p>}

                {item.description && (
                  <p className="mt-3 text-xs leading-relaxed text-[#1a2f7c]">{marks(item.description)}</p>
                )}

                {isOpen && item.details && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{marks(item.details)}</p>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  {item.benefit && (
                    <p className="text-[11px] font-semibold leading-tight text-[#0052cc]">
                      Benefit: {item.benefit}
                    </p>
                  )}

                  {canExpand && (
                    <button
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} more about ${item.name}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand text-brand transition-colors hover:bg-brand hover:text-white"
                      onClick={() => setExpanded(isOpen ? null : key)}
                      type="button"
                    >
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <PlusIcon className="h-2.5 w-2.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
