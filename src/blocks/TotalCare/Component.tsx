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
 *
 * ABOUT MOBILE (6252:4459) keeps the photo beside the copy on a phone rather than above it,
 * which holds each card to about half the height a stacked one takes.
 */
const AboutTypes: React.FC<
  Pick<Props, 'bgColor' | 'bgColorCustom' | 'heading' | 'subheading'> & { sides: Side[] }
> = ({ bgColor, bgColorCustom, heading, sides, subheading }) => (
  <section
    className="w-full bg-mist px-4 py-5 font-inter sm:px-6 sm:pb-[62.5px] sm:pt-10 lg:pt-[43.5px] [&_sup]:leading-[0]"
    style={backgroundStyle(bgColor, bgColorCustom)}
  >
    <div className="mx-auto max-w-[968.75px]">
      <header className="flex flex-col items-center gap-[11px] text-center">
        {heading && (
          <h2
            className="font-marcellus text-[48px] leading-[52px] text-navy sm:text-[46px] sm:leading-[60px] lg:text-[57.5px] lg:leading-[72px]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}
        {subheading && (
          <div data-payload-subpath="subheading">
            <RichText
              className="text-[18.75px] leading-5 text-black sm:leading-[normal] [&_p]:m-0 [&_strong]:font-bold"
              data={subheading}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}
      </header>

      {sides.length > 0 && (
        <div className="mt-3 grid gap-2.5 sm:mt-[30px] sm:gap-[31.25px] lg:grid-cols-2">
          {sides.map((side, i) => (
            <div
              className="flex items-start gap-3 rounded-[18.75px] bg-white px-[25px] py-4 shadow-[0_0_4.688px_rgba(0,0,0,0.25)] sm:gap-[31.25px] sm:px-[37.5px] sm:py-[18.75px] sm:shadow-[0_0_5px_rgba(0,0,0,0.25)]"
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

              <div className="flex min-w-0 flex-1 flex-col gap-[6.25px] text-left sm:gap-[8.5px]">
                <p className="font-playfair text-[22.5px] font-semibold leading-[27.5px] text-brand-500 sm:leading-[25px]">
                  {marks(side.label)}
                </p>
                {side.caption && (
                  <p
                    className="text-[16.25px] leading-5 text-black sm:text-[15px]"
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
        'w-full font-inter sm:px-6 [&_sup]:leading-[0]',
        // The comp's band: 30px above the intro, 64px below the card — 30px on the phone comp
        // (6666:230), which also keeps a 50px side gutter.
        showcase
          ? // The /why comp puts this band on the page white, inside the page's 1200px column
            // with 43.75px of padding all round.
            'bg-white px-4 py-4 sm:py-[43.75px] lg:px-[43.75px]'
          : 'bg-mist px-[50px] pb-[30px] pt-[30px] sm:pb-[64px] lg:px-8',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className={cn('mx-auto', showcase ? 'max-w-[1112.5px]' : 'max-w-[1102px]')}>
        <header className={cn('text-center', !showcase && 'flex flex-col items-center gap-2.5')}>
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase',
                showcase
                  ? 'text-[15px] leading-5 text-subheading sm:text-[18.75px]'
                  : 'text-xs tracking-[0.15em] text-brand-500',
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
                  ? 'mt-[12.5px] font-marcellus text-[34px] leading-[1.25] sm:text-[46px] lg:text-[57.5px]'
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
              decoding="async"
              height={3}
              loading="lazy"
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
                    ? 'mx-auto mt-[12.5px] max-w-3xl text-[16px] leading-5 text-black sm:text-[18.75px] [&_p]:m-0 [&_strong]:font-bold'
                    : 'text-[17px] font-medium leading-[1.21] text-navy sm:text-[20px] lg:text-[24px] [&_p]:m-0 [&_strong]:font-bold',
                )}
                data={subheading}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          )}
        </header>

        {sides.length > 0 &&
          (showcase ? (
            // 500px cards, 31.25px apart, centred under the intro — fixed cards rather than a
            // stretched grid, as the comp draws them.
            <div className="mt-[12.5px] flex flex-wrap justify-center gap-[31.25px] px-[6.25px] py-[18.75px]">
              {sides.map((side, i) => (
                <div
                  className="flex w-full max-w-[500px] flex-col items-center gap-[18.75px] rounded-[18.75px] bg-white pt-[12.5px] shadow-[0_0_9.375px_rgba(0,0,0,0.25)] sm:min-h-[360px]"
                  data-payload-subpath={`items.${i}.label`}
                  key={side.id ?? i}
                >
                  <p className="px-4 text-center font-playfair text-[26px] font-semibold leading-[35px] text-subheading sm:text-[30px]">
                    {marks(side.label)}
                  </p>

                  {/* Photo and features share the row at the comp's 300:200 split, but only
                      once there is width for it — at phone size the 40% feature column is
                      too narrow for two-word labels, so the card stacks instead. */}
                  <div className="flex w-full flex-col items-center sm:flex-row">
                    <div
                      className="relative aspect-[300/288] w-full max-w-[300px] shrink-0 overflow-hidden rounded-[18.75px] sm:max-w-none sm:w-3/5"
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
                      <ul className="grid min-w-0 flex-1 grid-cols-2 justify-center gap-x-3 gap-y-[12.5px] p-[6.25px] sm:flex sm:flex-col sm:gap-[12.5px]">
                        {side.features.map((feature, f) => (
                          <li className="flex items-center gap-[12.5px]" key={feature.id ?? f}>
                            <FeatureMark
                              feature={feature}
                              iconClass="[&>svg]:h-[50px] [&>svg]:w-[50px]"
                              size="h-[50px] w-[50px]"
                            />
                            <span className="min-w-0 text-[11.25px] font-medium leading-[normal] text-heading">
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
                        decoding="async"
                        height={32}
                        loading="lazy"
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
