import React from 'react'

import type { PairingBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import RichText from '@/components/RichText'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Feature = NonNullable<Props['features']>[number]

/**
 * Badges drawn for this section in the Figma comp (filled circle, bolder glyph), which the
 * line icons in `BrandIcons` don't match. Any other icon an editor picks falls back to the
 * shared set, drawn in the same circle.
 */
const featureBadges: Record<string, string> = {
  droplet: '/icons/pairing/droplet.svg',
  leaf: '/icons/pairing/leaf.svg',
  shieldCheck: '/icons/pairing/shield.svg',
  snowflake: '/icons/pairing/cool.svg',
}

const FeatureBadge: React.FC<{ icon: Feature['icon'] }> = ({ icon }) => {
  const src = icon ? featureBadges[icon] : undefined

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
      <img
        alt=""
        className="size-[100px] shrink-0"
        decoding="async"
        height={100}
        loading="lazy"
        src={src}
        width={100}
      />
    )
  }

  return (
    <span className="flex size-[100px] shrink-0 items-center justify-center rounded-full bg-mist-100 text-navy [&>span>svg]:size-12">
      <BrandIcon name={icon} />
    </span>
  )
}

const FeatureList: React.FC<{
  className?: string
  features: Feature[]
  /** The last row on the page drops its rule; a list's own last row keeps it on phones. */
  isFinal?: boolean
  offset: number
}> = ({ className, features, isFinal, offset }) => (
  <ul className={cn('flex flex-col gap-[10px] xl:px-[10px]', className)}>
    {features.map((feature, i) => (
      <li
        className={cn(
          'flex gap-[10px] border-tint-50 py-5 max-xl:border-b xl:min-h-px xl:w-[380px] xl:flex-[1_0_0]',
          isFinal && i === features.length - 1 && 'max-xl:border-b-0',
        )}
        data-payload-subpath={`features.${offset + i}.title`}
        key={feature.id ?? i}
      >
        <FeatureBadge icon={feature.icon} />
        <div className="flex min-w-0 flex-1 flex-col gap-[10px] text-navy">
          <h3 className="text-xl font-semibold leading-[30px]">{marks(feature.title)}</h3>
          {feature.description && (
            <p
              className="text-lg leading-[28px]"
              data-payload-subpath={`features.${offset + i}.description`}
            >
              {marks(feature.description)}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>
)

export const PairingBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
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
    <section
      className="w-full bg-white px-[50px] py-[30px] font-inter sm:px-6 lg:px-8 xl:px-[65px] xl:pb-0"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1270px] flex-col items-center gap-[5px]">
        <header className="flex w-full flex-col items-center gap-[10px] text-center">
          {heading && (
            <h2
              className="font-marcellus text-[38px] font-normal leading-[normal] text-navy-900 lg:text-[52px] lg:leading-[65px]"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}

          {headingAccent && (
            <p
              className="font-marcellus text-[28px] leading-[normal] text-danger-bright lg:text-[38px] lg:leading-[48px]"
              data-payload-subpath="headingAccent"
            >
              {marks(headingAccent)}
            </p>
          )}

          {/* Phones get the comp's short blue rule; wider screens the long navy one. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="-my-[1.46px] block h-[2.917px] w-[75.833px] lg:hidden"
            decoding="async"
            height={3}
            loading="lazy"
            src="/icons/pairing/line-mobile.svg"
            width={76}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
          <img
            alt=""
            className="-my-[1.46px] hidden h-[2.92px] w-[500px] max-w-full lg:block"
            decoding="async"
            height={3}
            loading="lazy"
            src="/icons/pairing/line.svg"
            width={500}
          />

          {intro && (
            <div data-payload-subpath="intro">
              <RichText
                className="text-lg font-medium leading-[normal] text-navy lg:text-2xl lg:leading-[29px] [&_p]:m-0 [&_strong]:font-bold"
                data={intro}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          )}
        </header>

        <div className="mt-[11px] grid w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 xl:mt-0 xl:flex xl:h-[407px] xl:w-auto xl:items-end xl:justify-center xl:gap-[5px]">
          <FeatureList
            className="order-2 xl:order-1 xl:h-[400px] xl:pt-5 xl:pb-[10px]"
            features={left}
            offset={0}
          />

          <div
            className="relative order-1 mx-auto aspect-[454/422] w-full max-w-[454px] md:col-span-2 xl:order-2 xl:mx-0 xl:h-[353px] xl:w-[379px] xl:shrink-0"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Product shot"
              imgClassName="h-full w-full object-contain"
              label="Product"
              resource={image}
            />
          </div>

          <FeatureList
            className="order-3 py-[10px] xl:h-[388px]"
            features={right}
            isFinal
            offset={half}
          />
        </div>
      </div>
    </section>
  )
}
