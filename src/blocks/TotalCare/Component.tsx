import React from 'react'
import { Plus } from 'lucide-react'

import type { TotalCareBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import RichText from '@/components/RichText'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

export const TotalCareBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  items,
  showConnector,
  subheading,
}) => {
  const sides = Array.isArray(items) ? items : []

  return (
    <section className="w-full bg-[#f4f7fc] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          {eyebrow && (
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {eyebrow}
            </p>
          )}

          {heading && (
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}

          <span aria-hidden="true" className="mx-auto mt-3 block h-0.5 w-16 bg-[#2d80e2]" />

          {subheading && (
            <div data-payload-subpath="subheading">
              <RichText
                className="mx-auto mt-4 max-w-3xl text-base text-brand"
                data={subheading}
                enableGutter={false}
              />
            </div>
          )}
        </header>

        {sides.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[#c9dcf5] bg-white p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4">
              {sides.map((side, i) => (
                <React.Fragment key={side.id ?? i}>
                  {i > 0 && showConnector !== false && (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-brand text-white"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                    </span>
                  )}

                  <div
                    className="flex-1 rounded-xl border border-[#dbe8fa] p-5 text-center"
                    data-payload-subpath={`items.${i}.label`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-brand">
                      {side.label}
                    </p>

                    <div className="relative mx-auto mt-4 aspect-square w-40 overflow-hidden rounded-full bg-[#f4f8ff]">
                      <ImageSlot
                        className="h-full w-full"
                        hint="Transparent PNG"
                        label={side.label}
                        resource={side.image}
                      />
                    </div>

                    {Array.isArray(side.features) && side.features.length > 0 && (
                      <ul className="mt-4 flex flex-col gap-2 text-left">
                        {side.features.map((feature, f) => (
                          <li className="flex items-center gap-2" key={feature.id ?? f}>
                            <BrandIcon
                              className="shrink-0 text-[#1668C4] [&>svg]:h-5 [&>svg]:w-5"
                              name={feature.icon}
                            />
                            <span className="text-xs font-medium text-brand">
                              {feature.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {side.caption && (
                      <p
                        className="mt-4 text-xs leading-relaxed text-[#1a2f7c]"
                        data-payload-subpath={`items.${i}.caption`}
                      >
                        {side.caption}
                      </p>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
