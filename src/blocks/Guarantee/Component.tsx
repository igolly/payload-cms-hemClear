import React from 'react'

import type { GuaranteeBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'

export const GuaranteeBlock: React.FC<Props> = ({
  badgeLabel,
  badges,
  heading,
  points,
  sealLabel,
  sealValue,
  subheading,
}) => {
  const pointItems = Array.isArray(points) ? points : []
  const pills = Array.isArray(badges) ? badges : []

  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col items-center text-center">
          <BrandIcon
            className="text-[#1668C4] [&>svg]:h-12 [&>svg]:w-12"
            name="shieldCheck"
          />

          {badgeLabel && (
            <span
              className="-mt-2 rounded-full bg-brand px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
              data-payload-subpath="badgeLabel"
            >
              {badgeLabel}
            </span>
          )}

          {heading && (
            <h2
              className="mt-4 font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}

          {subheading && (
            <p
              className="mt-2 text-base font-semibold text-[#0052cc]"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>

        {pointItems.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-[#dbe8fa] bg-[#fbfcfe] p-6 sm:flex-row sm:gap-8 sm:p-8">
            {/* Seal */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-dotted border-[#9dc0ee]"
              />
              <span className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#1668C4] leading-none text-white">
                <span className="font-serif text-2xl font-bold">{sealValue}</span>
                <span className="mt-0.5 text-[10px] font-bold tracking-widest">{sealLabel}</span>
              </span>
            </div>

            <ul className="flex grow flex-col gap-3">
              {pointItems.map((point, i) => (
                <li
                  className="flex items-center gap-3"
                  data-payload-subpath={`points.${i}.text`}
                  key={point.id ?? i}
                >
                  <BrandIcon
                    className="shrink-0 text-[#1668C4] [&>svg]:h-6 [&>svg]:w-6"
                    name={point.icon}
                  />
                  <span className="font-serif text-sm text-brand">{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pills.length > 0 && (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {pills.map((pill, i) => (
              <li
                className="flex items-center gap-2 rounded-full border border-[#b8d3ef] px-5 py-2"
                data-payload-subpath={`badges.${i}.label`}
                key={pill.id ?? i}
              >
                <BrandIcon
                  className="shrink-0 text-[#1668C4] [&>svg]:h-5 [&>svg]:w-5"
                  name={pill.icon}
                />
                <span className="text-xs font-bold uppercase tracking-wide text-brand">
                  {pill.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
