import React from 'react'

import type { ProductSystemBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

const multiline = (value: string) =>
  value.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ))

export const ProductSystemBlock: React.FC<Props> = ({
  columnHeading,
  features,
  heading,
  image,
  paragraphs,
  subheading,
}) => {
  const paras = Array.isArray(paragraphs) ? paragraphs : []
  const cards = Array.isArray(features) ? features : []

  return (
    <section className="w-full bg-[#F4F8FF] px-4 py-16 sm:px-6 lg:px-8">
      {(heading || subheading) && (
        <header className="mx-auto max-w-3xl text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}
          {subheading && (
            <p
              className="mt-3 text-base font-semibold text-[#1668C4] sm:text-lg"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}
        </header>
      )}

      <div className="mx-auto mt-12 grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Left column — copy. Sits below the diagram on mobile. */}
        <div className="order-2 lg:order-1">
          {columnHeading && (
            <h3
              className="font-serif text-2xl leading-tight text-heading"
              data-payload-subpath="columnHeading"
            >
              {multiline(columnHeading)}
            </h3>
          )}

          {paras.length > 0 && (
            <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-[#4A5B72]">
              {paras.map((paragraph, i) => (
                <p data-payload-subpath={`paragraphs.${i}.text`} key={paragraph.id ?? i}>
                  {paragraph.lead && (
                    <strong className="font-bold text-[#1668C4]">{paragraph.lead} </strong>
                  )}
                  {paragraph.text}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Centre — diagram. First on mobile. */}
        <div className="relative order-1 aspect-square w-full lg:order-2" data-payload-subpath="image">
          <ImageSlot
            className="h-full w-full"
            hint="Recommended 1000 × 1000px, transparent PNG"
            label="Inside-out support diagram"
            resource={image}
          />
        </div>

        {/* Right column — feature cards. */}
        {cards.length > 0 && (
          <ul className="order-3 space-y-3">
            {cards.map((feature, i) => (
              <li
                className="flex items-center gap-3 rounded-xl border border-[#DBE8FA] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(16,60,120,0.06)]"
                data-payload-subpath={`features.${i}.title`}
                key={feature.id ?? i}
              >
                <BrandIcon
                  className="shrink-0 text-[#1668C4] [&>svg]:h-7 [&>svg]:w-7"
                  name={feature.icon}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight text-[#123A6B]">
                    {feature.stat && (
                      <span className="mr-1 text-2xl font-extrabold text-[#1668C4]">
                        {feature.stat}
                      </span>
                    )}
                    {feature.title}
                  </p>
                  {feature.subtitle && (
                    <p className="mt-0.5 text-[11px] leading-tight text-[#6B86A8]">
                      {feature.subtitle}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
