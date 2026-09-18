import React from 'react'

import type { CausesBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

/**
 * The `/why` cuts of this section, kept apart from `Component.tsx` so the pages on
 * `default`/`showcase` (home PROBLEM, the total-care system page) cannot drift with them.
 *
 * - `quality` — WHY QUALITY: a 503 × 606 photo beside a 562.5px column: 18.75px eyebrow,
 *   57.5px Marcellus heading, 18.75px body, the icon features in centred rows split by
 *   hairlines, and the footnote as a tinted note card.
 * - `overlay` — WHY INTERNAL / EXTERNAL: a 1200 × 337.5 photo band with a 468.75px copy
 *   column 62.5px in from the side opposite the subject (`imagePosition` names the subject's
 *   side) and a single left-aligned row of icon features.
 *
 * Both stack below `lg`, where the comp has no frame: the photo leads, the copy follows.
 */

type Factor = NonNullable<Props['factors']>[number]

/** One feature: a 56px icon over a bold label whose line breaks set its width. */
const Feature: React.FC<{ factor: Factor; gap: string; i: number; tall?: boolean }> = ({
  factor,
  gap,
  i,
  tall,
}) => (
  <li
    className={cn(
      /* 100px on a phone, as the comp has it: left to size themselves the labels
         wrap and the row breaks into two. */
      'flex flex-col items-center text-center max-sm:w-[100px]',
      gap,
      tall && 'sm:h-[112.5px]',
    )}
    data-payload-subpath={`factors.${i}.label`}
  >
    {factor.image && typeof factor.image === 'object' ? (
      <span className="block size-14 shrink-0" data-payload-subpath={`factors.${i}.image`}>
        <Media
          htmlElement={null}
          imgClassName="size-14 object-contain"
          loading="eager"
          resource={factor.image}
        />
      </span>
    ) : (
      <BrandIcon className="text-brand-400 [&>svg]:size-14" name={factor.icon} />
    )}
    <span className="whitespace-nowrap text-[12.5px] font-bold leading-[15px] text-heading">
      {multiline(factor.label)}
    </span>
  </li>
)

/** The comp's 0.63px #aaa rule, drawn 1px wide at matching coverage so it never drops out. */
const Divider: React.FC = () => (
  <li aria-hidden="true" className="h-[81.25px] w-px shrink-0 bg-ash-400/[0.63]" />
)

/** A row of features with a hairline between neighbours. */
const FeatureRow: React.FC<{
  className?: string
  factors: { factor: Factor; i: number }[]
  gap: string
  tall?: boolean
}> = ({ className, factors, gap, tall }) => (
  <ul className={cn('flex flex-wrap items-center gap-x-[18.75px] gap-y-4', className)}>
    {factors.map(({ factor, i }, n) => (
      <React.Fragment key={factor.id ?? i}>
        {n > 0 && <Divider />}
        <Feature factor={factor} gap={gap} i={i} tall={tall} />
      </React.Fragment>
    ))}
  </ul>
)

const Links: React.FC<{ links: Props['links'] }> = ({ links }) =>
  Array.isArray(links) && links.length > 0 ? (
    <div className="flex flex-wrap gap-3">
      {links.map(({ link }, i) => (
        <CMSLink
          {...link}
          appearance="inline"
          className={
            link.appearance === 'outline'
              ? 'inline-flex items-center rounded-md border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-slate-50'
              : 'inline-flex items-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'
          }
          key={i}
        />
      ))}
    </div>
  ) : null

const Eyebrow: React.FC<{ value: Props['eyebrow'] }> = ({ value }) =>
  value ? (
    <p
      className="text-[18.75px] font-bold uppercase leading-5 text-subheading"
      data-payload-subpath="eyebrow"
    >
      {marks(value)}
    </p>
  ) : null

export const CausesWhy: React.FC<Props> = (props) =>
  props.variant === 'quality' ? <Quality {...props} /> : <Overlay {...props} />

const Quality: React.FC<Props> = ({
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
}) => {
  const items = (Array.isArray(factors) ? factors : []).map((factor, i) => ({ factor, i }))
  /* The comp wraps seven features as three over four; four or fewer sit on one row. */
  const split = items.length > 4 ? Math.floor(items.length / 2) : items.length
  const rows = [items.slice(0, split), items.slice(split)].filter((row) => row.length > 0)
  const noImage = imagePosition === 'none'

  return (
    <section
      className="w-full bg-white px-4 font-inter sm:px-6 [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[31.25px] py-8 lg:flex-row lg:justify-center lg:py-[31.25px]">
        {!noImage && (
          <div
            className={cn(
              'relative aspect-[503.13/606.25] w-full max-w-[503.13px] shrink-0 overflow-hidden rounded-[18.75px]',
              imagePosition === 'right' && 'lg:order-2',
            )}
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 1000 × 1200px, fills the frame"
              imgClassName="h-full w-full object-cover"
              label="Section photo"
              resource={image}
            />
          </div>
        )}

        <div className="flex w-full flex-col gap-[12.5px] lg:w-[562.5px] lg:shrink-0 lg:py-[18.75px]">
          <Eyebrow value={eyebrow} />

          {heading && (
            <h2
              className="font-marcellus text-[34px] leading-[1.25] text-heading sm:text-[46px] lg:text-[57.5px] lg:leading-[72px]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {description && (
            <p
              className="whitespace-pre-line text-[18.75px] leading-[25px] text-heading"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {rows.length > 0 && (
            <div className="flex flex-col gap-[18.75px] p-[6.25px]">
              {rows.map((row, r) => (
                <FeatureRow
                  className="justify-center"
                  factors={row}
                  gap="gap-[3.125px]"
                  key={r}
                  tall
                />
              ))}
            </div>
          )}

          {footnote && (
            <p
              className="flex items-center gap-[18.75px] whitespace-pre-line rounded-[15.625px] bg-tint-50 p-[18.75px] text-[12.5px] leading-[17.5px] text-subheading"
              data-payload-subpath="footnote"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static 70px icon from the comp */}
              <img
                alt=""
                className="size-[35px] shrink-0"
                height={35}
                src="/icons/causes-why/info.png"
                width={35}
              />
              <span className="flex-1">{marks(footnote)}</span>
            </p>
          )}

          <Links links={links} />
        </div>
      </div>
    </section>
  )
}

const Overlay: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  description,
  eyebrow,
  factors,
  heading,
  image,
  imagePosition,
  links,
}) => {
  const items = (Array.isArray(factors) ? factors : []).map((factor, i) => ({ factor, i }))
  const noImage = imagePosition === 'none'
  /* `imagePosition` names the side the photo's subject is on; the copy takes the other. */
  const subjectLeft = imagePosition === 'left'

  return (
    <section
      className="w-full bg-white font-inter lg:px-4 [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'relative isolate mx-auto flex max-w-[1200px] flex-col overflow-hidden lg:h-[337.5px] lg:flex-row lg:items-center lg:px-[62.5px]',
          subjectLeft ? 'lg:justify-end' : 'lg:justify-start',
        )}
      >
        {!noImage && (
          <div
            className="relative aspect-[4/3] w-full sm:aspect-[16/7] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto"
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 1200 × 338px photo, subject on the side away from the copy"
              imgClassName={cn(
                'h-full w-full object-cover',
                subjectLeft ? 'object-left' : 'object-right',
              )}
              label="Section background"
              resource={image}
            />
          </div>
        )}

        <div className="flex w-full flex-col gap-[12.5px] px-4 py-8 sm:px-6 lg:w-[468.75px] lg:shrink-0 lg:p-0">
          <Eyebrow value={eyebrow} />

          {heading && (
            <h2
              className="font-marcellus text-[26px] leading-[1.25] text-heading sm:text-[31.25px] sm:leading-[39px]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {description && (
            <p
              className="whitespace-pre-line text-[15px] leading-[18.75px] text-heading"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {items.length > 0 && (
            <FeatureRow className="p-[6.25px]" factors={items} gap="gap-[6.25px]" />
          )}

          <Links links={links} />
        </div>
      </div>
    </section>
  )
}
