import React from 'react'

import type { CausesBlock as Props } from '@/payload-types'

import { Check } from 'lucide-react'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

export const CausesBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  description,
  eyebrow,
  factorStyle,
  factors,
  footnote,
  gridLabel,
  heading,
  image,
  imagePosition,
  links,
}) => {
  const items = Array.isArray(factors) ? factors : []
  const imageRight = imagePosition === 'right'
  const noImage = imagePosition === 'none'
  const checklist = factorStyle === 'checklist'

  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div
        className={cn(
          'mx-auto max-w-6xl items-center gap-10 lg:gap-14',
          noImage ? 'flex flex-col' : 'grid lg:grid-cols-2',
        )}
      >
        {!noImage && (
          <div
            className={cn('relative aspect-[9/7] w-full', imageRight && 'lg:order-2')}
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 900 × 700px, transparent PNG"
              label="Vein anatomy illustration"
              resource={image}
            />
          </div>
        )}

        <div className={cn(imageRight && 'lg:order-1', noImage && 'w-full text-center')}>
          {eyebrow && (
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {heading && (
            <h2
              className="mt-2 font-serif text-3xl leading-tight text-subheading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {/* Short rule under the heading, per the comp: 90x5 there, scaled to 80x4 here. */}
          {heading && <span aria-hidden="true" className="mt-5 block h-1 w-20 bg-[#2d80e2]" />}

          {description && (
            <p
              className="mt-6 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-black"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {gridLabel && (
            <p className="mt-7 text-[15px] font-medium text-[#2d80e2]" data-payload-subpath="gridLabel">
              {marks(gridLabel)}
            </p>
          )}

          {items.length > 0 && (
            <ul
              className={cn(
                'mt-6',
                checklist
                  ? 'flex flex-col gap-3 text-left'
                  : cn(
                      'grid grid-cols-2 gap-2.5 sm:grid-cols-3',
                      noImage && 'sm:grid-cols-4 lg:grid-cols-5',
                    ),
              )}
            >
              {items.map((factor, i) =>
                checklist ? (
                  <li
                    className="flex items-center gap-3"
                    data-payload-subpath={`factors.${i}.label`}
                    key={factor.id ?? i}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1668C4]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-[#123A6B]">{marks(factor.label)}</span>
                  </li>
                ) : (
                  <li
                    className="flex flex-col items-center justify-start gap-2 rounded-xl border border-[#2d80e2] bg-white px-3 py-4 text-center"
                    data-payload-subpath={`factors.${i}.label`}
                    key={factor.id ?? i}
                  >
                    {/*
                     * The uploaded illustration wins when there is one, and the icon is
                     * the fallback — so pages still on icons (`/why`,
                     * `/about-hemorrhoids`) render exactly as before. The art carries its
                     * own pale disc, so the slot stays unstyled rather than drawing one.
                     */}
                    {factor.image && typeof factor.image === 'object' ? (
                      <span
                        className="block h-16 w-16"
                        data-payload-subpath={`factors.${i}.image`}
                      >
                        {/* `htmlElement={null}` so `Media` emits its `<picture>` bare —
                            its default `<div>` wrapper is not valid inside a span. */}
                        <Media
                          htmlElement={null}
                          imgClassName="h-16 w-16 object-contain"
                          resource={factor.image}
                        />
                      </span>
                    ) : (
                      <BrandIcon
                        className="text-[#1668C4] [&>svg]:h-7 [&>svg]:w-7"
                        name={factor.icon}
                      />
                    )}
                    <span className="text-[13px] font-bold leading-tight text-subheading">
                      {marks(factor.label)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}

          {footnote && (
            <p
              className="mt-6 flex items-start gap-2 whitespace-pre-line text-[11px] leading-relaxed text-[#8397AE]"
              data-payload-subpath="footnote"
            >
              <BrandIcon
                className="mt-px shrink-0 text-[#1668C4] [&>svg]:h-4 [&>svg]:w-4"
                name="info"
              />
              {marks(footnote)}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className={cn('mt-6 flex flex-wrap gap-3', noImage && 'justify-center')}>
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
          )}
        </div>
      </div>
    </section>
  )
}
