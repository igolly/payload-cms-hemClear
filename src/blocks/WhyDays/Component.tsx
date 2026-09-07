import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { WhyDaysBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

export const WhyDaysBlock: React.FC<Props> = ({
  ctaHeading,
  ctaText,
  heading,
  image,
  links,
  paragraphs,
  productImage,
}) => {
  const paras = Array.isArray(paragraphs) ? paragraphs : []

  return (
    <section className="w-full bg-[#f2f5fa]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Left image */}
        <div className="relative aspect-[4/3] w-full" data-payload-subpath="image">
          <ImageSlot
            className="h-full w-full"
            hint="Hand / lifestyle photo"
            label="Section image"
            resource={image}
          />
        </div>

        {/* Copy + product shot */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div>
            {heading && (
              <h2
                className="font-serif text-3xl leading-tight text-brand sm:text-4xl"
                data-payload-subpath="heading"
              >
                {heading.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h2>
            )}

            <span aria-hidden="true" className="mt-4 block h-0.5 w-full bg-[#1668C4]" />

            {paras.length > 0 && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#1a2f7c]">
                {paras.map((paragraph, i) => (
                  <p data-payload-subpath={`paragraphs.${i}.text`} key={paragraph.id ?? i}>
                    {paragraph.text}
                  </p>
                ))}
              </div>
            )}

            {ctaHeading && (
              <h3
                className="mt-5 font-serif text-lg font-bold text-brand"
                data-payload-subpath="ctaHeading"
              >
                {ctaHeading}
              </h3>
            )}

            {ctaText && (
              <p
                className="mt-1 text-sm leading-relaxed text-[#1a2f7c]"
                data-payload-subpath="ctaText"
              >
                {ctaText}
              </p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-5">
                {links.map(({ link }, i) => (
                  <CMSLink
                    {...link}
                    appearance="inline"
                    className="inline-flex items-center gap-3 rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
                    key={i}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CMSLink>
                ))}
              </div>
            )}
          </div>

          <div className="relative aspect-[3/4] w-full" data-payload-subpath="productImage">
            <ImageSlot
              className="h-full w-full"
              hint="Product shot"
              label="Product"
              resource={productImage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
