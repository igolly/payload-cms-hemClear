import React from 'react'

import type { WaysGridBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

type Way = NonNullable<Props['ways']>[number]

const Row: React.FC<{ offset: number; ways: Way[] }> = ({ offset, ways }) => (
  <ul className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:flex lg:items-start lg:justify-center">
    {ways.map((way, i) => (
      <li
        className="flex flex-col items-center px-5 text-center lg:flex-1 lg:border-l lg:border-[#dbe8fa] lg:first:border-l-0"
        data-payload-subpath={`ways.${offset + i}.title`}
        key={way.id ?? i}
      >
        <div className="relative h-28 w-28">
          <ImageSlot
            className="h-full w-full rounded-full"
            hint="Circular icon"
            imgClassName="h-full w-full rounded-full object-contain"
            label={`Icon ${offset + i + 1}`}
            resource={way.image}
          />
        </div>

        <h3 className="mt-4 text-sm font-bold leading-tight text-subheading">
          {offset + i + 1}. {way.title}
        </h3>

        {way.description && (
          <p
            className="mt-2 text-xs leading-relaxed text-[#1236b6]"
            data-payload-subpath={`ways.${offset + i}.description`}
          >
            {way.description}
          </p>
        )}
      </li>
    ))}
  </ul>
)

export const WaysGridBlock: React.FC<Props> = ({
  eyebrow,
  firstRowCount,
  footnote,
  headingAccent,
  headingAfter,
  headingBefore,
  subheading,
  ways,
}) => {
  const items = Array.isArray(ways) ? ways : []
  const split = Math.min(Math.max(1, firstRowCount ?? 4), items.length)

  const firstRow = items.slice(0, split)
  const secondRow = items.slice(split)

  return (
    <section className="w-full bg-[#F4F8FF] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          {eyebrow && (
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {eyebrow}
            </p>
          )}

          {(headingBefore || headingAccent || headingAfter) && (
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              {headingBefore && (
                <span className="text-heading" data-payload-subpath="headingBefore">
                  {headingBefore}{' '}
                </span>
              )}
              {headingAccent && (
                <span className="text-[#2d80e2]" data-payload-subpath="headingAccent">
                  {headingAccent}
                </span>
              )}
              {headingAfter && (
                <span className="text-heading" data-payload-subpath="headingAfter">
                  {' '}
                  {headingAfter}
                </span>
              )}
            </h2>
          )}

          <span aria-hidden="true" className="mx-auto mt-4 block h-0.5 w-16 bg-[#2d80e2]" />

          {subheading && (
            <p
              className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-base font-semibold text-[#0052cc]"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>

        {firstRow.length > 0 && (
          <div className="mt-12">
            <Row offset={0} ways={firstRow} />
          </div>
        )}

        {secondRow.length > 0 && (
          <div className="mt-12">
            <Row offset={split} ways={secondRow} />
          </div>
        )}

        {footnote && (
          <p
            className="mx-auto mt-10 flex max-w-3xl items-start justify-center gap-2 whitespace-pre-line rounded-lg bg-white/70 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-500"
            data-payload-subpath="footnote"
          >
            <BrandIcon className="shrink-0 text-[#1668C4] [&>svg]:h-4 [&>svg]:w-4" name="shieldCheck" />
            {footnote}
          </p>
        )}
      </div>
    </section>
  )
}
