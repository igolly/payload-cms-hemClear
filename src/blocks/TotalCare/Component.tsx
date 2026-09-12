import React from 'react'

import type { TotalCareBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { PlusIcon } from '@/components/PlusIcon'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Side = NonNullable<Props['items']>[number]
type Feature = NonNullable<Side['features']>[number]

/**
 * A feature's illustrated icon when one is uploaded, falling back to the brand icon —
 * the same precedence `causes` uses, so a side already built on icons keeps rendering
 * exactly as it did.
 */
const FeatureMark: React.FC<{ feature: Feature; iconClass: string; size: string }> = ({
  feature,
  iconClass,
  size,
}) =>
  feature.image && typeof feature.image === 'object' ? (
    <span className={cn('block shrink-0', size)}>
      {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default `<div>`
          wrapper is not valid inside a span. */}
      <Media htmlElement={null} imgClassName={cn('object-contain', size)} resource={feature.image} />
    </span>
  ) : (
    <BrandIcon className={cn('shrink-0 text-[#1668C4]', iconClass)} name={feature.icon} />
  )

export const TotalCareBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  eyebrow,
  heading,
  items,
  showConnector,
  subheading,
  variant,
}) => {
  const sides = Array.isArray(items) ? items : []
  /*
   * The `/why` comp breaks the single bordered panel into two standalone cards and turns
   * each side's round icon into a wide photo beside its features. That is one coordinated
   * change of shape, so it rides on a named variant; `default` reproduces the original for
   * `/home` and `/about-hemorrhoids`, which are still on it.
   */
  const showcase = variant === 'showcase'

  return (
    <section
      className="w-full bg-[#f4f7fc] px-4 py-14 sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className={cn('mx-auto', showcase ? 'max-w-6xl' : 'max-w-4xl')}>
        <header className="text-center">
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase text-[#0052cc]',
                showcase ? 'text-[15px] tracking-[0.12em]' : 'text-xs tracking-[0.15em]',
              )}
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {heading && (
            <h2
              className={cn(
                'leading-tight text-heading',
                showcase
                  ? 'mt-3 font-marcellus text-[34px] sm:text-[46px] lg:text-[57px]'
                  : 'mt-2 font-serif text-3xl sm:text-4xl',
              )}
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}

          {/* The showcase comp lets the display heading stand on its own, as `causes` does. */}
          {!showcase && (
            <span aria-hidden="true" className="mx-auto mt-3 block h-0.5 w-16 bg-[#2d80e2]" />
          )}

          {subheading && (
            <div data-payload-subpath="subheading">
              <RichText
                className={cn(
                  'mx-auto max-w-3xl text-brand',
                  showcase ? 'mt-3 text-[17px]' : 'mt-4 text-base',
                )}
                data={subheading}
                enableGutter={false}
              />
            </div>
          )}
        </header>

        {sides.length > 0 &&
          (showcase ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {sides.map((side, i) => (
                <div
                  className="flex flex-col items-center gap-4 rounded-[19px] bg-white pt-3 shadow-[0_0_5px_rgba(0,0,0,0.25)]"
                  data-payload-subpath={`items.${i}.label`}
                  key={side.id ?? i}
                >
                  <p className="font-serif text-[30px] font-semibold leading-[35px] text-subheading">
                    {marks(side.label)}
                  </p>

                  {/* Photo and features share the row at the comp's 300:200 split, but only
                      once there is width for it — at phone size the 40% feature column is
                      too narrow for two-word labels, so the card stacks instead. */}
                  <div className="flex w-full flex-col items-center sm:flex-row">
                    <div
                      className="relative aspect-[300/288] w-full shrink-0 overflow-hidden rounded-[19px] sm:w-3/5"
                      data-payload-subpath={`items.${i}.image`}
                    >
                      <ImageSlot
                        className="h-full w-full"
                        hint="Recommended 900 × 860px photo"
                        imgClassName="h-full w-full object-cover"
                        label={side.label}
                        resource={side.image}
                      />
                    </div>

                    {Array.isArray(side.features) && side.features.length > 0 && (
                      <ul className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-1.5">
                        {side.features.map((feature, f) => (
                          <li className="flex items-center gap-3" key={feature.id ?? f}>
                            <FeatureMark feature={feature} iconClass="[&>svg]:h-[50px] [&>svg]:w-[50px]" size="h-[50px] w-[50px]" />
                            <span className="min-w-0 text-[11.25px] font-medium leading-normal text-heading">
                              {marks(feature.label)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {side.caption && (
                    <p
                      className="px-5 pb-5 text-center text-xs leading-relaxed text-[#1a2f7c]"
                      data-payload-subpath={`items.${i}.caption`}
                    >
                      {marks(side.caption)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#c9dcf5] bg-white p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4">
                {sides.map((side, i) => (
                  <React.Fragment key={side.id ?? i}>
                    {i > 0 && showConnector !== false && (
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-brand text-white"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <div
                      className="flex-1 rounded-xl border border-[#dbe8fa] p-5 text-center"
                      data-payload-subpath={`items.${i}.label`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-brand">
                        {marks(side.label)}
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
                              <FeatureMark feature={feature} iconClass="[&>svg]:h-5 [&>svg]:w-5" size="h-5 w-5" />
                              <span className="text-xs font-medium text-brand">
                                {marks(feature.label)}
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
                          {marks(side.caption)}
                        </p>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
