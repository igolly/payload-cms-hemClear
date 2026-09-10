import React from 'react'
import { ArrowRight, Check } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'
import Image from 'next/image'

/**
 * Trust point icons are uploaded images. Until an editor sets one, a dashed square holds
 * the icon's space so the row keeps its rhythm rather than collapsing.
 */
const TrustIcon: React.FC<{ resource: NonNullable<Page['hero']['trustPoints']>[number]['icon'] }> = ({
  resource,
}) => {
  if (resource && typeof resource === 'object') {
    return (
      <Media
        className="h-6 w-6 shrink-0"
        imgClassName="h-full w-full object-contain"
        resource={resource}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="block h-6 w-6 shrink-0 rounded-md border-2 border-dashed border-[#C6DAF6] bg-[#F7FAFF]"
    />
  )
}


export const HighImpactHero: React.FC<Page['hero']> = ({
  media,
  links,
  badgeTitle,
  badgeDescription,
  calloutText,
  calloutTitle,
  eyebrow,
  heading,
  mediaPosition,
  subheading,
  description,
  benefits,
  trustPoints,
}) => {
  const mediaRight = mediaPosition === 'right'
  const hasMedia = media && typeof media === 'object'

  /*
   * The 562.5px track has to be the one the image lands in, so the template flips with
   * the media position rather than staying fixed. `order-2` alone is not enough: it
   * moves the image into the *second* track, so with a `562.5px 1fr` template a
   * right-hand image would take the flexible column and leave the copy in the narrow
   * fixed one. `minmax(0, 1fr)` rather than plain `1fr` so long words cannot force the
   * copy column wider than its share.
   */
  const columns = mediaRight
    ? 'lg:grid-cols-[minmax(0,1fr)_562.5px]'
    : 'lg:grid-cols-[562.5px_minmax(0,1fr)]'

  return (
    <section className="w-full bg-[#F5F5F7]">
      <div
        className={cn(
          'mx-auto grid max-w-[1400px] grid-cols-1 items-stretch px-6 lg:gap-10 lg:px-8',
          columns,
        )}
      >

        {/*
         * Left: product image.
         *
         * Fills the band — flush to its top and bottom edges, as in `public/hero.png`.
         * The photo is cropped to manage that, but only barely: the column's height is set
         * by the copy beside it, and on every page using this hero the image already stands
         * within a few pixels of that height (home 588 against 596; `/why` and
         * `/about-hemorrhoids` exactly 0), so the crop is ~1% of the width at most.
         *
         * That margin is the whole reason this is safe. Pair this hero with a much taller
         * copy column and the crop grows with the difference — measure it there rather than
         * assuming this still holds. The placeholder tint is drawn only while no image is
         * set, otherwise it would show as bands around the photo.
         */}
        <div
          className={cn(
            'relative flex w-full items-stretch overflow-hidden',
            !hasMedia && 'min-h-105 bg-slate-100',
            mediaRight && 'lg:order-2',
          )}
        >
          {hasMedia && (
            <div className="h-full w-full" data-payload-subpath="media">
              <Media
                // `Media` wraps its <picture> in a div of its own; without a height here
                // that div collapses to content height and the `h-full` below resolves
                // against nothing.
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
                pictureClassName="block h-full w-full"
                priority
                resource={media}
              />
            </div>
          )}
        </div>

        {/* Right: content */}
        <div
          className={cn(
            // No bottom padding at desktop: this column sets the band's height, so its
            // `pb` showed as a strip of empty hero colour above whatever section came
            // next. The following section brings its own padding.
            'flex flex-col items-start justify-center py-10 lg:pb-0 lg:pt-14',
            mediaRight && 'lg:order-1',
          )}
        >
          {eyebrow && (
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}
          {/* Badge */}
          {(badgeTitle || badgeDescription) && (
            <div className="mb-2 flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5">
              {badgeTitle && (
                <>
                  <Image
                    alt="Laurel"
                    // Vector, so it stays crisp at any size. `unoptimized` because
                    // Next will not put SVGs through the optimiser, and a vector has
                    // nothing to gain from it. Intrinsic 116x256 with `w-auto` keeps
                    // the ornament's true aspect at a 30px height.
                    className="h-[30px] w-auto shrink-0"
                    height={256}
                    src="/flower-vector.svg"
                    unoptimized
                    width={116}
                  />
                  <span
                    className="font-serif text-sm font-semibold leading-tight text-brand"
                    data-payload-subpath="badgeTitle"
                  >
                    {multiline(badgeTitle)}
                  </span>
                  <Image
                    alt="Laurel"
                    // Vector, so it stays crisp at any size. `unoptimized` because
                    // Next will not put SVGs through the optimiser, and a vector has
                    // nothing to gain from it. Intrinsic 116x256 with `w-auto` keeps
                    // the ornament's true aspect at a 30px height.
                    className="h-[30px] w-auto shrink-0"
                    height={256}
                    src="/flower.svg"
                    unoptimized
                    width={116}
                  />
                </>
              )}
              {badgeTitle && badgeDescription && <span className="h-8 w-px bg-slate-200" />}
              {badgeDescription && (
                <span
                  className="max-w-60 text-xs font-medium leading-snug text-slate-700"
                  data-payload-subpath="badgeDescription"
                >
                  {marks(badgeDescription)}
                </span>
              )}
            </div>
          )}

          {/* Headline */}
          {heading && (
            <h1
              className="hero-heading text-heading"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h1>
          )}

          {subheading && (
            <p
              className="mt-2 font-serif text-lg text-brand"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}

          {/* Description */}
          {description && (
            <p
              className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-slate-700"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {/* Benefits checklist */}
          {Array.isArray(benefits) && benefits.length > 0 && (
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {benefits.map((benefit, i) => (
                <li
                  className="flex items-center gap-3"
                  data-payload-subpath={`benefits.${i}.text`}
                  key={benefit.id ?? i}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] font-medium text-slate-900">{marks(benefit.text)}</span>
                </li>
              ))}
            </ul>
          )}

          {(calloutTitle || calloutText) && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#eef4fd] px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="min-w-0">
                {calloutTitle && (
                  <span className="block text-sm font-bold text-brand">{marks(calloutTitle)}</span>
                )}
                {calloutText && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#1a2f7c]">
                    {marks(calloutText)}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* CTAs */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map(({ link }, i) => {
                const isOutline = link.appearance === 'outline'
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className={
                      isOutline
                        ? 'inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-brand py-1.5 pl-6 pr-1.5 text-sm font-semibold text-brand transition-colors hover:bg-slate-50'
                        : 'inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'
                    }
                  >
                    <span
                      className={
                        isOutline
                          ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand text-brand'
                          : 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand'
                      }
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CMSLink>
                )
              })}
            </div>
          )}

          {/* Trust points */}
          {Array.isArray(trustPoints) && trustPoints.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6">
              {trustPoints.map((point, i) => (
                <div
                  className="flex items-center gap-4 sm:gap-6"
                  data-payload-subpath={`trustPoints.${i}.label`}
                  key={point.id ?? i}
                >
                  {i !== 0 && <span className="h-8 w-px bg-slate-200" />}
                  <div className="flex items-center gap-2">
                    <TrustIcon resource={point.icon} />
                    <span className="text-sm font-semibold text-slate-900">{marks(point.label)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
