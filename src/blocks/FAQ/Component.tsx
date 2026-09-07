import React from 'react'

import type { FAQBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { FaqAccordion } from './FaqAccordion'
import { ImageSlot } from './ImagePlaceholder'

export const FAQBlock: React.FC<Props> = ({
  backgroundImage,
  defaultState,
  description,
  heading,
  image,
  items,
}) => {
  const questions = Array.isArray(items) ? items : []
  const hasHeader = Boolean(heading || description || image || backgroundImage)

  return (
    <section className="w-full">
      {hasHeader && (
        <div className="relative overflow-hidden border-b-2 border-[#0d8ce9] bg-white">
          {/* Decorative background — falls back to a soft brand gradient until one is set. */}
          <div aria-hidden="true" className="absolute inset-0" data-payload-subpath="backgroundImage">
            {backgroundImage && typeof backgroundImage === 'object' ? (
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={backgroundImage}
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(60%_80%_at_20%_40%,#eaf3ff_0%,#ffffff_70%)]" />
            )}
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-12 lg:grid-cols-[2fr_3fr] lg:px-8">
            {/* Product image */}
            <div className="relative min-h-80" data-payload-subpath="image">
              <ImageSlot
                className="h-full min-h-80 w-full"
                hint="Product shot — upload in the CMS"
                label="Product image"
                priority
                resource={image}
              />
            </div>

            {/* Heading + intro */}
            <div>
              {heading && (
                <h2
                  className="font-serif text-4xl leading-tight text-[#1c2f6e] sm:text-5xl"
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

              {description && (
                <p
                  className="mt-6 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-slate-800"
                  data-payload-subpath="description"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <FaqAccordion defaultState={defaultState} items={questions} />
        </div>
      )}
    </section>
  )
}
