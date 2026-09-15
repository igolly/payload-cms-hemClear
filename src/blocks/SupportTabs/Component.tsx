import React from 'react'

import type { SupportTabsBlock as Props } from '@/payload-types'

import { Tabs } from './Tabs'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

export const SupportTabsBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  disclaimer,
  eyebrow,
  footerLine,
  heading,
  items,
  subheading,
}) => {
  const areas = Array.isArray(items) ? items : []

  return (
    <section
      className="w-full bg-mist px-4 py-[60px] font-inter sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4">
        {eyebrow && (
          <span
            className="flex h-[31.25px] items-center justify-center rounded-[15.625px] border-[1.25px] border-brand-300 px-[31.25px] text-center text-xs font-bold uppercase tracking-[2.4px] text-brand-600"
            data-payload-subpath="eyebrow"
          >
            {marks(eyebrow)}
          </span>
        )}

        {heading && (
          <h2
            className="text-center font-marcellus text-[44px] font-normal leading-[normal] text-navy-900 lg:text-[52px] lg:leading-normal [&_sup]:leading-[0]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {subheading && (
          <p
            className="whitespace-pre-line text-center text-2xl font-medium leading-[normal] text-brand-500 lg:leading-normal"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {areas.length > 0 && <Tabs items={areas} />}

        {footerLine && (
          <p
            className="text-center text-2xl font-medium leading-[normal] text-brand-500 lg:leading-normal"
            data-payload-subpath="footerLine"
          >
            {marks(footerLine)}
          </p>
        )}

        {disclaimer && (
          <p
            className="whitespace-pre-line text-center text-[11.667px] leading-[16.042px] text-brand-600"
            data-payload-subpath="disclaimer"
          >
            {marks(disclaimer)}
          </p>
        )}
      </div>
    </section>
  )
}
