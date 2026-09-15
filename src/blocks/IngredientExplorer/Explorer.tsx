'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { IngredientExplorerBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { asText, marks } from '@/utilities/marks'
import { Disclaimer } from './Disclaimer'

type Group = NonNullable<IngredientExplorerBlock['groups']>[number]
type Ingredient = NonNullable<Group['ingredients']>[number]

/** Both faces of a card share this chrome (Figma "ingredient box": 264 × 420). */
const face =
  'overflow-hidden rounded-[22.93px] border-[0.76px] border-ash-400 bg-white shadow-[0_3.06px_11.46px_rgba(0,0,0,0.15)] [backface-visibility:hidden] [grid-area:1/1]'

const roundButton =
  'flex shrink-0 items-center justify-center rounded-full border-brand-300 font-bold text-brand-600 transition-colors hover:bg-brand-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300'

export const Explorer: React.FC<{
  allLabel?: string | null
  disclaimer?: string | null
  disclaimerTitle?: string | null
  groups: Group[]
}> = ({ allLabel, disclaimer, disclaimerTitle, groups }) => {
  const [groupIndex, setGroupIndex] = useState(0)
  const [category, setCategory] = useState<string | null>(null)

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
  }

  // A formula may carry its own disclaimer; the block-level one is the fallback.
  const noteTitle =
    group?.disclaimerTitle || group?.disclaimer ? group.disclaimerTitle : disclaimerTitle
  const noteText = group?.disclaimerTitle || group?.disclaimer ? group.disclaimer : disclaimer

  return (
    <div>
      {/* Head — Figma "INGREDIENT HEAD" 207:1573 */}
      <div className="flex flex-col items-center gap-[18.75px] py-[31.25px] sm:px-[6.25px]">
        {groups.length > 1 && (
          <div className="flex w-full max-w-[587.5px] rounded-[25px] border-[1.25px] border-aqua-200 bg-white p-[5px] shadow-[0_2.5px_9.38px_rgba(0,0,0,0.25)]">
            {groups.map((item, i) => (
              <button
                aria-pressed={i === groupIndex}
                className={cn(
                  'flex h-12 min-w-0 flex-1 items-center justify-center rounded-[18.75px] p-[6.25px] text-lg font-bold leading-[normal] transition-colors sm:h-[56.25px] sm:text-[21.25px] [&_sup]:leading-[0]',
                  i === groupIndex ? 'bg-navy text-white' : 'text-navy hover:bg-mist',
                )}
                key={item.id ?? i}
                onClick={() => selectGroup(i)}
                type="button"
              >
                {marks(item.name)}
              </button>
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <ul className="flex w-full flex-wrap items-start justify-center gap-[12.5px] py-[12.5px]">
            {[null, ...categories].map((value) => {
              const active = category === value
              return (
                <li key={value ?? '__all'}>
                  <button
                    aria-pressed={active}
                    className={cn(
                      'flex h-[37.5px] items-center justify-center rounded-full border-[1.25px] px-[17.5px] text-center text-[12.5px] font-bold leading-[13.75px] transition-colors',
                      active
                        ? 'border-navy bg-navy text-white'
                        : 'border-navy-900 bg-white text-navy hover:bg-mist',
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

        {group?.heading && (
          <h2 className="text-center font-marcellus text-[34px] font-normal leading-[normal] text-navy-900 sm:text-[44px] lg:text-[56.25px] [&_sup]:leading-[0]">
            {marks(group.heading)}
          </h2>
        )}
        {(group?.heading || group?.description) && (
          <span
            aria-hidden="true"
            className="-my-[1.25px] block h-[2.5px] w-[62.5px] bg-brand-300"
          />
        )}
        {group?.description && (
          <p className="max-w-[1187.5px] text-center text-[15px] font-medium leading-[21.25px] text-navy sm:text-[16.25px] [&_sup]:leading-[0]">
            {marks(group.description)}
          </p>
        )}
      </div>

      {/* Cards — Figma "INGREDIENT FRONT" 232:2251 / "INGREDIENT BACK" 7308:115 */}
      <ul className="grid grid-cols-1 gap-[15px] py-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(3,264px)] lg:justify-center xl:grid-cols-[repeat(4,264px)] xl:justify-start xl:px-12">
        {visible.map((item, i) => (
          <IngredientCard item={item} key={`${groupIndex}-${String(item.id ?? i)}`} />
        ))}
      </ul>

      <Disclaimer text={noteText} title={noteTitle} />
    </div>
  )
}

const IngredientCard: React.FC<{ item: Ingredient }> = ({ item }) => {
  const [flipped, setFlipped] = useState(false)
  const openRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const moveFocus = useRef(false)

  // The + only appears when there is research text to turn the card over to.
  const canFlip = Boolean(item.details)
  const references = asText(item.references)
    .split('\n')
    .map((line) => line.replace(/^\s*•\s*/, '').trim())
    .filter(Boolean)

  // Keyboard users follow the card over: focus lands on the face that just came up.
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    ;(flipped ? closeRef : openRef).current?.focus()
  }, [flipped])

  const turn = (next: boolean) => {
    moveFocus.current = true
    setFlipped(next)
  }

  return (
    <li className="[perspective:1600px]">
      <div
        className={cn(
          'grid h-full min-h-[420px] transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        {/* Front */}
        <div
          aria-hidden={flipped || undefined}
          className={cn(face, 'flex flex-col', item.latin ? 'gap-[11px]' : 'gap-[18px]')}
          inert={flipped}
        >
          <div className="relative aspect-[264/152.87] w-full shrink-0 bg-mist-100">
            {item.image && typeof item.image === 'object' && (
              <Media
                fill
                imgClassName="object-cover"
                resource={item.image}
                size="(min-width: 1024px) 264px, (min-width: 640px) 50vw, 100vw"
              />
            )}
          </div>

          <div className="flex flex-col gap-[3.82px] px-[15.29px] py-[7.64px]">
            <h3 className="text-[21.4px] font-bold leading-[24.46px] text-navy [&_sup]:leading-[0]">
              {marks(item.name)}
            </h3>
            {item.latin && (
              <p className="text-[16.82px] font-medium italic leading-[18.34px] text-navy">
                {item.latin}
              </p>
            )}
          </div>

          {item.description && (
            <p className="px-[15.29px] py-[7.64px] text-[15.29px] font-medium leading-[19.87px] text-navy [&_sup]:leading-[0]">
              {marks(item.description)}
            </p>
          )}

          {(item.benefit || canFlip) && (
            <div className="mt-auto flex items-end justify-end gap-[3.82px] p-[15.29px]">
              {item.benefit && (
                <p className="min-w-0 flex-1 text-[13.76px] font-medium leading-[18.34px] text-brand-600 [&_sup]:leading-[0]">
                  Benefit: {marks(item.benefit)}
                </p>
              )}
              {canFlip && (
                <button
                  aria-label={`Show research on ${item.name}`}
                  className={cn(
                    roundButton,
                    'h-[45.86px] w-[45.86px] border-[1.53px] text-[22.93px] leading-none',
                  )}
                  onClick={() => turn(true)}
                  ref={openRef}
                  type="button"
                >
                  +
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back */}
        {canFlip && (
          <div
            aria-hidden={!flipped || undefined}
            className={cn(
              face,
              'flex flex-col justify-between p-[9.59px] [transform:rotateY(180deg)]',
            )}
            inert={!flipped}
          >
            <div className="flex flex-col gap-[5px] py-2.5">
              <p className="text-xl font-bold leading-[normal] text-navy [&_sup]:leading-[0]">
                {marks(item.name)}
              </p>
              {item.latin && (
                <p className="text-base font-medium italic leading-[normal] text-navy">
                  {item.latin}
                </p>
              )}
              <p className="whitespace-pre-line text-xs font-medium leading-[normal] text-navy [&_sup]:leading-[0]">
                {marks(item.details)}
              </p>
            </div>

            <div className="flex items-end justify-end gap-[2.4px] py-[4.79px]">
              {references.length > 0 && (
                <div className="flex min-w-0 flex-1 flex-col gap-[2.4px] py-[4.79px]">
                  <p className="text-[8px] font-bold leading-[normal] text-brand-500">
                    References:
                  </p>
                  <ul className="text-[8px] font-medium leading-[normal] text-black">
                    {references.map((line, i) => (
                      <li key={i}>• {marks(line)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                aria-label={`Hide research on ${item.name}`}
                className={cn(
                  roundButton,
                  'h-[28.76px] w-[28.76px] border-[0.96px] text-[14.38px] leading-none',
                )}
                onClick={() => turn(false)}
                ref={closeRef}
                type="button"
              >
                x
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
