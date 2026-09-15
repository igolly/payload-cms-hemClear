import React from 'react'

import type { TotalCareBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
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
      <Media
        htmlElement={null}
        imgClassName={cn('object-contain', size)}
        resource={feature.image}
      />
    </span>
  ) : (
    <BrandIcon className={cn('shrink-0 text-brand-400', iconClass)} name={feature.icon} />
  )

/**
 * The About comp's TYPES OF HEMORRHOIDS band (2002:77): a centred display heading and plain
 * intro line, then two 468.75px white cards 31.25px apart, each a 125px round photo beside the
 * side's name (Playfair) and its caption. No rule under the heading and no "+" between cards.
 */
const AboutTypes: React.FC<
  Pick<Props, 'bgColor' | 'bgColorCustom' | 'heading' | 'subheading'> & { sides: Side[] }
> = ({ bgColor, bgColorCustom, heading, sides, subheading }) => (
  <section
    className="w-full bg-mist px-4 pb-[62.5px] pt-10 font-inter sm:px-6 lg:pt-[43.5px] [&_sup]:leading-[0]"
    style={backgroundStyle(bgColor, bgColorCustom)}
  >
    <div className="mx-auto max-w-[968.75px]">
      <header className="flex flex-col items-center gap-[11px] text-center">
        {heading && (
          <h2
            className="font-marcellus text-[38px] leading-[48px] text-navy sm:text-[46px] sm:leading-[60px] lg:text-[57.5px] lg:leading-[72px]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}
        {subheading && (
          <div data-payload-subpath="subheading">
            <RichText
              className="text-[16px] leading-[normal] text-black sm:text-[18.75px] [&_p]:m-0 [&_strong]:font-bold"
              data={subheading}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}
      </header>

      {sides.length > 0 && (
        <div className="mt-[30px] grid gap-[31.25px] lg:grid-cols-2">
          {sides.map((side, i) => (
            <div
              className="flex flex-col items-center gap-5 rounded-[18.75px] bg-white px-6 pb-[18.75px] pt-[18.75px] shadow-[0_0_5px_rgba(0,0,0,0.25)] sm:flex-row sm:items-start sm:gap-[31.25px] sm:pl-[37.5px] sm:pr-[37.5px]"
              data-payload-subpath={`items.${i}.label`}
              key={side.id ?? i}
            >
              <div className="relative size-[125px] shrink-0 overflow-hidden rounded-full">
                <ImageSlot
                  className="h-full w-full"
                  hint="Recommended 250 × 250px photo"
                  imgClassName="h-full w-full object-cover"
                  label={side.label}
                  resource={side.image}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-[8.5px] text-center sm:text-left">
                <p className="font-playfair text-[22.5px] font-semibold leading-[25px] text-brand-500">
                  {marks(side.label)}
                </p>
                {side.caption && (
                  <p
                    className="text-[15px] leading-5 text-black"
                    data-payload-subpath={`items.${i}.caption`}
                  >
                    {marks(side.caption)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
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
  if (variant === 'about') {
    return (
      <AboutTypes
        bgColor={bgColor}
        bgColorCustom={bgColorCustom}
        heading={heading}
        sides={sides}
        subheading={subheading}
      />
    )
  }

  return (
    <section
      className={cn(
        'w-full bg-mist font-inter sm:px-6 lg:px-8 [&_sup]:leading-[0]',
        // The comp's band: 30px above the intro, 64px below the card — 30px on the phone comp
        // (6666:230), which also keeps a 50px side gutter.
        showcase ? 'px-4 py-14' : 'px-[50px] pb-[30px] pt-[30px] sm:pb-[64px]',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className={cn('mx-auto', showcase ? 'max-w-6xl' : 'max-w-[1102px]')}>
        <header className={cn('text-center', !showcase && 'flex flex-col items-center gap-2.5')}>
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase text-brand-500',
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
                  : 'font-marcellus text-[38px] leading-[normal] text-navy-900 sm:text-[42px] sm:leading-[1.25] lg:text-[52px]',
              )}
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}

          {/* The showcase comp lets the display heading stand on its own, as `causes` does. */}
          {!showcase && (
            // The comp's exported rule: a zero-height line with a 2.9px round-capped stroke, so it
            // takes no space in the 10px-gap stack.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              aria-hidden="true"
              className="-my-[1.458px] block h-[2.917px] w-[75.833px] max-w-none"
              height={3}
              src="/icons/totalCare/line.svg"
              width={76}
            />
          )}

          {subheading && (
            // The phone comp lets the heading and rule stand alone above the card.
            <div className={cn(!showcase && 'max-sm:hidden')} data-payload-subpath="subheading">
              <RichText
                className={cn(
                  showcase
                    ? 'mx-auto mt-3 max-w-3xl text-brand text-[17px]'
                    : 'text-[17px] font-medium leading-[1.21] text-navy sm:text-[20px] lg:text-[24px] [&_p]:m-0 [&_strong]:font-bold',
                )}
                data={subheading}
                enableGutter={false}
                enableProse={showcase}
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
                            <FeatureMark
                              feature={feature}
                              iconClass="[&>svg]:h-[50px] [&>svg]:w-[50px]"
                              size="h-[50px] w-[50px]"
                            />
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
                      className="px-5 pb-5 text-center text-xs leading-relaxed text-navy"
                      data-payload-subpath={`items.${i}.caption`}
                    >
                      {marks(side.caption)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-4 w-full max-w-[700px] rounded-[20px] border border-brand-300 bg-white p-5">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-0">
                {sides.map((side, i) => (
                  <React.Fragment key={side.id ?? i}>
                    {i > 0 && showConnector !== false && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt=""
                        aria-hidden="true"
                        className="block size-8 shrink-0"
                        height={32}
                        src="/icons/totalCare/plus.svg"
                        width={32}
                      />
                    )}

                    <div
                      className="flex w-full min-w-0 flex-1 flex-col items-center gap-2.5 px-4 text-center"
                      data-payload-subpath={`items.${i}.label`}
                    >
                      <p className="text-[18px] font-bold uppercase leading-[22px] text-navy">
                        {marks(side.label)}
                      </p>

                      <div className="relative h-[175px] w-[180px] shrink-0 overflow-hidden">
                        <ImageSlot
                          className="h-full w-full"
                          hint="Recommended 850 × 830px photo"
                          imgClassName="h-full w-full object-cover"
                          label={side.label}
                          resource={side.image}
                        />
                      </div>

                      {Array.isArray(side.features) && side.features.length > 0 && (
                        <ul className="flex flex-col gap-2 text-left">
                          {side.features.map((feature, f) => (
                            <li className="flex items-center gap-2" key={feature.id ?? f}>
                              <FeatureMark
                                feature={feature}
                                iconClass="[&>svg]:h-5 [&>svg]:w-5"
                                size="h-5 w-5"
                              />
                              <span className="text-xs font-medium text-navy">
                                {marks(feature.label)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {side.caption && (
                        <p
                          className="text-[14px] font-medium leading-[17px] text-navy"
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
