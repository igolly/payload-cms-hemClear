import React from 'react'

import type { CausesBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

/**
 * The two About-page cuts of this section, kept apart from the home/why treatments in
 * `Component.tsx` so neither can drift the other.
 *
 * - `aboutDiagnosed` — ABOUT DIAGNOSED: a 480 × 587.5 photo beside a 562.5px column holding
 *   a 58px Marcellus heading, a ruled checklist and the footnote as a tinted note card.
 * - `aboutOffer` — ABOUT OFFER: the product photo fills the 1400px band (its left side fades
 *   to the band colour) and the copy sits over that fade, 50px in.
 *
 * Both fall back to a stacked column below the width the comp needs.
 */

/** Filled check badge exported from the comp (26px). */
const CheckBadge: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
  <img
    alt=""
    className="size-[26px] shrink-0"
    decoding="async"
    height={26}
    loading="lazy"
    src="/icons/about/diagnosed-check.svg"
    width={26}
  />
)

const Checklist: React.FC<{
  factors: NonNullable<Props['factors']>
  size: 'diagnosed' | 'offer'
}> = ({ factors, size }) => {
  const diagnosed = size === 'diagnosed'

  return (
    <ul className={cn('flex w-full flex-col', diagnosed ? 'lg:w-[562.5px]' : 'max-w-[410px]')}>
      {factors.map((factor, i) => (
        <li
          className="flex items-center gap-[12.5px]"
          data-payload-subpath={`factors.${i}.label`}
          key={factor.id ?? i}
        >
          <CheckBadge />
          {/* The rule runs under the text only, and the last row drops it. */}
          <span
            className={cn(
              'flex min-w-0 flex-1 items-center self-stretch',
              /* Drawn as an inset shadow, as the comp's rule sits inside the row: a
                 0.625px border snaps to a whole pixel and would add up down the list. */
              i < factors.length - 1 && 'shadow-[inset_0_-0.625px_0_var(--color-tint-50)]',
              diagnosed
                ? 'py-[12.5px] text-[15px] font-medium leading-[15px] text-subheading'
                : 'py-[8.75px] text-[15px] leading-[16.25px] text-navy',
            )}
          >
            {marks(factor.label)}
          </span>
        </li>
      ))}
    </ul>
  )
}

const Links: React.FC<{ links: Props['links'] }> = ({ links }) => {
  if (!Array.isArray(links) || links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-[18.75px]">
      {links.map(({ link }, i) => (
        <CMSLink
          {...link}
          appearance="inline"
          className={cn(
            'cta-gleam inline-flex h-14 items-center rounded-[6.25px] px-5 text-[18.75px] leading-[normal] transition-colors',
            link.appearance === 'outline'
              ? 'border-[1.25px] border-brand-500 bg-white px-[18.75px] text-brand-500 hover:bg-mist'
              : 'bg-brand-500 text-white hover:bg-brand',
          )}
          key={i}
        />
      ))}
    </div>
  )
}

export const CausesAbout: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  description,
  eyebrow,
  factors,
  footnote,
  heading,
  image,
  imagePosition,
  links,
  variant,
}) => {
  const items = Array.isArray(factors) ? factors : []
  const noImage = imagePosition === 'none'

  if (variant === 'aboutOffer') {
    return (
      <section
        className="w-full bg-ash-50 px-4 py-8 font-inter sm:px-6 xl:px-5 xl:py-0 [&_sup]:leading-[0]"
        style={backgroundStyle(bgColor, bgColorCustom)}
      >
        <div className="relative isolate mx-auto flex max-w-[1400px] flex-col gap-6 xl:h-[635px] xl:justify-center xl:pb-3 xl:pl-[50px]">
          <div className="flex w-full max-w-[500px] flex-col">
            {eyebrow && (
              <p
                className="text-[16px] font-semibold uppercase leading-[normal] text-navy sm:text-[17.5px]"
                data-payload-subpath="eyebrow"
              >
                {marks(eyebrow)}
              </p>
            )}

            {heading && (
              <h2
                className="mt-4 font-marcellus text-[40px] leading-[1.1] text-brand-500 sm:text-[52px] xl:mt-[11.5px] xl:text-[57.5px] xl:leading-[62.5px]"
                data-payload-subpath="heading"
              >
                {multiline(heading)}
              </h2>
            )}

            {description && (
              <p
                className="mt-4 whitespace-pre-line text-[17px] font-semibold leading-[1.25] text-navy xl:mt-[13.5px] xl:text-[18.75px] xl:leading-[23.25px]"
                data-payload-subpath="description"
              >
                {marks(description)}
              </p>
            )}

            {items.length > 0 && (
              <div className="mt-5 xl:mt-[12.5px]">
                <Checklist factors={items} size="offer" />
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-7 xl:mt-[22px]">
                <Links links={links} />
              </div>
            )}
          </div>

          {!noImage && (
            <div
              className="relative aspect-[1920/1016] w-full xl:absolute xl:inset-0 xl:-z-10 xl:aspect-auto"
              data-payload-subpath="image"
            >
              <ImageSlot
                className="h-full w-full"
                hint="Recommended 1920 × 1016px, product on the right, left side faded to the band colour"
                imgClassName="h-full w-full object-cover"
                label="Product photo"
                resource={image}
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  /* aboutDiagnosed */
  const imageRight = imagePosition === 'right'

  return (
    <section
      className="w-full bg-mist px-4 py-8 font-inter sm:px-6 lg:px-5 lg:py-0 [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1400px] flex-col items-center gap-6 lg:justify-center lg:gap-[6.25px]',
          imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row',
        )}
      >
        {!noImage && (
          <div
            className="relative aspect-[480/587.5] w-full max-w-[480px] shrink-0 lg:h-[587.5px] lg:w-[480px]"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 960 × 1175px"
              imgClassName="h-full w-full object-cover"
              label="Diagnosis illustration"
              resource={image}
            />
          </div>
        )}

        <div className="flex w-full min-w-0 flex-col gap-[12.5px] lg:w-[562.5px] lg:py-[18.75px]">
          {heading && (
            <h2
              className="font-marcellus text-[40px] leading-[1.05] text-navy sm:text-[48px] lg:text-[58px] lg:leading-[58px]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {description && (
            <p
              className="whitespace-pre-line text-[15px] leading-[20px] text-subheading"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {items.length > 0 && <Checklist factors={items} size="diagnosed" />}

          {footnote && (
            <p
              className="flex items-center gap-[18.75px] rounded-[15.625px] bg-tint-50 p-[18.75px] text-[12.5px] leading-[17.5px] text-subheading"
              data-payload-subpath="footnote"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise */}
              <img
                alt=""
                className="size-[35px] shrink-0"
                decoding="async"
                height={35}
                loading="lazy"
                src="/icons/about/diagnosed-info.svg"
                width={35}
              />
              <span className="min-w-0 flex-1 whitespace-pre-line">{marks(footnote)}</span>
            </p>
          )}

          <Links links={links} />
        </div>
      </div>
    </section>
  )
}
