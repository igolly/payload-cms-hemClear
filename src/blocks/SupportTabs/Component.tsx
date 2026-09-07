import React from 'react'

import type { SupportTabsBlock as Props } from '@/payload-types'

import { Tabs } from './Tabs'

export const SupportTabsBlock: React.FC<Props> = ({
  disclaimer,
  eyebrow,
  footerLine,
  heading,
  items,
  subheading,
}) => {
  const areas = Array.isArray(items) ? items : []

  return (
    <section className="w-full bg-[#f5f8fd] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          {eyebrow && (
            <span
              className="inline-block rounded-full border border-[#9dc0ee] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {eyebrow}
            </span>
          )}

          {heading && (
            <h2
              className="mt-5 font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}

          {subheading && (
            <p
              className="mt-2 whitespace-pre-line text-base font-semibold text-[#0052cc]"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>

        {areas.length > 0 && (
          <div className="mt-8">
            <Tabs items={areas} />
          </div>
        )}

        {footerLine && (
          <p
            className="mt-8 text-center text-base font-semibold text-[#0052cc]"
            data-payload-subpath="footerLine"
          >
            {footerLine}
          </p>
        )}

        {disclaimer && (
          <p
            className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-center text-[11px] leading-relaxed text-slate-500"
            data-payload-subpath="disclaimer"
          >
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  )
}
