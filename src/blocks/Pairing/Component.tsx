import React from 'react'

import type { PairingBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import RichText from '@/components/RichText'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'

type Feature = NonNullable<Props['features']>[number]

const FeatureList: React.FC<{ features: Feature[]; offset: number }> = ({ features, offset }) => (
  <ul className="flex flex-col gap-8">
    {features.map((feature, i) => (
      <li
        className="flex gap-4"
        data-payload-subpath={`features.${offset + i}.title`}
        key={feature.id ?? i}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8effb] text-brand [&>span>svg]:h-7 [&>span>svg]:w-7">
          <BrandIcon name={feature.icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-snug text-subheading">{feature.title}</h3>
          {feature.description && (
            <p
              className="mt-2 text-sm leading-relaxed text-[#1a2f7c]"
              data-payload-subpath={`features.${offset + i}.description`}
            >
              {feature.description}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>
)

export const PairingBlock: React.FC<Props> = ({
  features,
  heading,
  headingAccent,
  image,
  intro,
}) => {
  const items = Array.isArray(features) ? features : []
  const half = Math.ceil(items.length / 2)
  const left = items.slice(0, half)
  const right = items.slice(half)

  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}

          {headingAccent && (
            <p
              className="mt-1 font-serif text-2xl leading-tight text-[#c91b00] sm:text-3xl"
              data-payload-subpath="headingAccent"
            >
              {headingAccent}
            </p>
          )}

          <span aria-hidden="true" className="mx-auto mt-4 block h-0.5 w-80 max-w-full bg-brand" />

          {intro && (
            <div data-payload-subpath="intro">
              <RichText
                className="mx-auto mt-4 max-w-3xl text-base text-brand"
                data={intro}
                enableGutter={false}
              />
            </div>
          )}
        </header>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr_1fr]">
          <div className="order-2 lg:order-1">
            <FeatureList features={left} offset={0} />
          </div>

          <div className="relative order-1 aspect-square w-full lg:order-2" data-payload-subpath="image">
            <ImageSlot
              className="h-full w-full"
              hint="Product shot, transparent PNG"
              label="Product"
              resource={image}
            />
          </div>

          <div className="order-3">
            <FeatureList features={right} offset={half} />
          </div>
        </div>
      </div>
    </section>
  )
}
