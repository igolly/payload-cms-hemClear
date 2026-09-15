import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

/**
 * Ornaments and glyphs exported from the Figma HERO frame (2002:5). They are part of the
 * design rather than content, so they ship as static files instead of Media uploads.
 */
const icons = {
  arrowOutline: '/icons/hero/arrow-color.svg',
  arrowSolid: '/icons/hero/arrow-white.svg',
  check: '/icons/hero/check.svg',
  oatLeft: '/icons/hero/oat-left.svg',
  oatRight: '/icons/hero/oat-right.svg',
}

/**
 * Trust point icons are uploaded images. Until an editor sets one, a dashed square holds
 * the icon's space so the row keeps its rhythm rather than collapsing.
 */
const TrustIcon: React.FC<{
  large?: boolean
  resource: NonNullable<Page['hero']['trustPoints']>[number]['icon']
}> = ({ large, resource }) => {
  // 30px in the comp's inline row; the /why stacked treatment sets a larger icon over its label.
  const size = large ? 'h-10 w-10' : 'h-[30px] w-[30px]'
  if (resource && typeof resource === 'object') {
    return (
      <Media
        className={cn(size, 'shrink-0')}
        imgClassName="h-full w-full object-contain"
        resource={resource}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        size,
        'block shrink-0 rounded-md border-2 border-dashed border-tint-150 bg-mist',
      )}
    />
  )
}

/** The comp's hairline rule (0.625px, #999) between badge parts and trust points. */
const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <span aria-hidden="true" className={cn('block w-[0.625px] shrink-0 bg-ash-500', className)} />
)

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
  calloutIcon,
  trustPoints,
  trustPointsStyle,
}) => {
  const mediaRight = mediaPosition === 'right'
  const hasMedia = media && typeof media === 'object'
  /*
   * The `/why` comp stacks each trust point's icon over its label AND lifts the row above
   * the buttons. Those move together there, so one control drives both rather than leaving
   * an editor to pair two settings correctly.
   */
  const stackedTrust = trustPointsStyle === 'stacked'

  /*
   * Figma: a 1400px container split 685 (image) / 715 (copy). Fractions rather than fixed
   * pixels keep that ratio between `xl` and 1400px. Side by side only from `xl`: below it the
   * copy column is far taller than the photo's box, so the photo was stretched into a tall
   * sliver and cropped hard. The template flips with the media position so the image always
   * lands in its own track.
   */
  const columns = mediaRight
    ? 'xl:grid-cols-[minmax(0,715fr)_minmax(0,685fr)]'
    : 'xl:grid-cols-[minmax(0,685fr)_minmax(0,715fr)]'

  /*
   * Inline trust points: the mobile comp lists them one per row, full width, 10px above and
   * below each and a #ddd rule between; from `md` they sit in one row split by hairlines.
   */
  const trustRow = Array.isArray(trustPoints) && trustPoints.length > 0 && (
    <div
      className={cn(
        'flex',
        stackedTrust
          ? 'flex-wrap items-stretch gap-x-4 gap-y-3 sm:gap-x-6'
          : 'w-full flex-col md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-x-[17.5px] md:gap-y-3',
      )}
    >
      {trustPoints.map((point, i) => (
        <div
          className={cn(
            'flex',
            stackedTrust
              ? 'items-stretch gap-4 sm:gap-6'
              : 'items-center py-[10px] md:gap-[17.5px] md:py-0',
            !stackedTrust && i !== 0 && 'border-t border-ash-200 md:border-t-0',
          )}
          data-payload-subpath={`trustPoints.${i}.label`}
          key={point.id ?? i}
        >
          {i !== 0 && (
            <Divider className={stackedTrust ? 'self-stretch' : 'hidden h-[43.75px] md:block'} />
          )}
          <div
            className={cn(
              'flex',
              stackedTrust
                ? 'w-24 flex-col items-center gap-1 text-center'
                : 'items-center gap-[10px] md:gap-[9.375px]',
            )}
          >
            <TrustIcon large={stackedTrust} resource={point.icon} />
            <span
              className={cn(
                'font-semibold text-black',
                stackedTrust ? 'text-xs leading-tight' : 'text-[12.5px] leading-normal',
              )}
            >
              {marks(point.label)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className="w-full bg-shell font-inter">
      <div className={cn('mx-auto grid max-w-[1400px] grid-cols-1 items-stretch', columns)}>
        {/*
         * Image column. The spacer sets the comp's 685x580 box; the photo is laid over it with
         * `object-cover`, so a copy column taller than that (the /why treatment, with a callout
         * and stacked trust points) grows the band and the photo crops to fill rather than
         * leaving a strip of hero colour under it.
         */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            !hasMedia && 'bg-slate-100',
            mediaRight && 'xl:order-2',
          )}
        >
          {/* Stacked (below `xl`) the photo spans the viewport, so its height is capped: at
              tablet widths the 685:580 box alone would be ~870px tall. */}
          <div aria-hidden="true" className="aspect-[685/580] max-h-[600px] w-full xl:max-h-none" />
          {hasMedia && (
            <div className="absolute inset-0" data-payload-subpath="media">
              <Media
                // `Media` wraps its <picture> in a div of its own; without a height here
                // that div collapses to content height and the `h-full` below resolves
                // against nothing.
                className="h-full w-full"
                // Anchored a little above centre: when the capped, stacked box crops the photo,
                // it keeps the subject's face rather than splitting the crop evenly.
                imgClassName="h-full w-full object-cover object-[50%_35%] xl:object-center"
                pictureClassName="block h-full w-full"
                priority
                resource={media}
              />
            </div>
          )}
        </div>

        {/* Copy column: 31.25px side padding, 12.5px between every part, centred in the band.
            The mobile comp keeps the 31.25px sides with only 16px above and below. */}
        <div
          className={cn(
            'mx-auto flex w-full min-w-0 max-w-[715px] flex-col items-start justify-center gap-[12.5px] px-[31.25px] py-4 md:px-6 md:py-10 xl:mx-0 xl:max-w-none xl:px-[31.25px] xl:py-[35.9375px]',
            mediaRight && 'xl:order-1',
          )}
        >
          {eyebrow && (
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] text-brand-500"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {/* Badge */}
          {(badgeTitle || badgeDescription) && (
            <div className="flex max-w-full items-center gap-[6.25px] rounded-[12.5px] border-[0.625px] border-heading px-[12.5px] py-[9.375px] md:gap-1 md:px-[11.875px] md:py-[8.75px] [&_sup]:leading-[0]">
              {badgeTitle && (
                <>
                  <img
                    alt=""
                    className="h-9 w-4 shrink-0"
                    height={36}
                    src={icons.oatLeft}
                    width={16}
                  />
                  <span
                    className="shrink-0 text-center font-fraunces text-[15px] font-semibold leading-[15px] text-heading"
                    data-payload-subpath="badgeTitle"
                  >
                    {multiline(badgeTitle)}
                  </span>
                  <img
                    alt=""
                    className="h-9 w-4 shrink-0"
                    height={36}
                    src={icons.oatRight}
                    width={16}
                  />
                </>
              )}
              {badgeTitle && badgeDescription && <Divider className="h-[30.625px]" />}
              {badgeDescription && (
                <span
                  className="min-w-0 text-[11.25px] font-semibold leading-[normal] text-heading md:leading-normal"
                  data-payload-subpath="badgeDescription"
                >
                  {multiline(badgeDescription)}
                </span>
              )}
            </div>
          )}

          {/*
           * Headline: Marcellus 50/50 at desktop via `.hero-heading`. Below `md` the mobile comp
           * sets the first line at 46px and the rest at 42px on 50px lines (440px artboard),
           * scaled with the viewport so "Hemorrhoid Support" still fits a 390px phone. Its text
           * box is 396px wide, running into the right padding, so the heading gets 26px more than
           * the column; without it that line wraps and the hero grows a third heading line. `!`
           * because `.hero-heading` is element-qualified and outweighs a bare utility.
           */}
          {heading && (
            <h1
              className="hero-heading text-heading max-md:w-[calc(100%+26px)] max-md:text-[min(42px,9.545vw)]! max-md:leading-[min(50px,11.36vw)]! max-md:first-line:text-[min(46px,10.45vw)]"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h1>
          )}

          {subheading && (
            <p className="font-serif text-lg text-brand" data-payload-subpath="subheading">
              {marks(subheading)}
            </p>
          )}

          {description && (
            <p
              className="w-full whitespace-pre-line text-[15px] leading-[21.25px] text-black"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {/* Benefits checklist */}
          {Array.isArray(benefits) && benefits.length > 0 && (
            <ul className="flex flex-col gap-[9.375px]">
              {benefits.map((benefit, i) => (
                <li
                  className="flex items-center gap-[9.375px]"
                  data-payload-subpath={`benefits.${i}.text`}
                  key={benefit.id ?? i}
                >
                  {benefit.icon && typeof benefit.icon === 'object' ? (
                    <span className="block h-[26px] w-[26px] shrink-0">
                      {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its
                          default `<div>` wrapper is not valid inside a span. */}
                      <Media
                        htmlElement={null}
                        imgClassName="h-[26px] w-[26px] object-contain"
                        resource={benefit.icon}
                      />
                    </span>
                  ) : (
                    <img
                      alt=""
                      className="h-5 w-5 shrink-0"
                      height={20}
                      src={icons.check}
                      width={20}
                    />
                  )}
                  <span className="text-[15px] font-medium leading-[15px] text-black">
                    {marks(benefit.text)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {(calloutTitle || calloutText) && (
            <div className="flex items-start gap-3 rounded-lg bg-mist-100 px-4 py-3">
              {calloutIcon && typeof calloutIcon === 'object' ? (
                <span className="block h-16 w-16 shrink-0">
                  <Media
                    htmlElement={null}
                    imgClassName="h-16 w-16 object-contain"
                    resource={calloutIcon}
                  />
                </span>
              ) : (
                <img alt="" className="h-8 w-8 shrink-0" height={32} src={icons.check} width={32} />
              )}
              <span className="min-w-0">
                {calloutTitle && (
                  <span className="block text-sm font-bold text-brand">{marks(calloutTitle)}</span>
                )}
                {calloutText && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-navy">
                    {marks(calloutText)}
                  </span>
                )}
              </span>
            </div>
          )}

          {stackedTrust && trustRow}

          {/* CTAs: 50px pills, 12.5px inset, 18px arrow glyph after the label. */}
          {Array.isArray(links) && links.length > 0 && (
            // Stacked, 8px apart on mobile; one wrapping row from `md`.
            <div className="flex max-w-full flex-col items-start gap-2 py-[10px] md:flex-row md:flex-wrap md:gap-x-[18.75px] md:gap-y-3 md:py-[12.5px]">
              {links.map(({ link }, i) => {
                const isOutline = link.appearance === 'outline'
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className={cn(
                      'inline-flex h-[50px] max-w-full items-center justify-center gap-[12.5px] rounded-[6.25px] px-[12.5px] md:rounded-[25px] text-center text-[13.75px] font-medium leading-[13.75px] transition-colors [&_sup]:leading-[0]',
                      isOutline
                        ? 'border-[0.625px] border-subheading text-subheading hover:bg-white'
                        : 'bg-brand text-white hover:bg-brand-dark',
                    )}
                  >
                    <img
                      alt=""
                      className="h-[18px] w-[18px] shrink-0"
                      height={18}
                      src={isOutline ? icons.arrowOutline : icons.arrowSolid}
                      width={18}
                    />
                  </CMSLink>
                )
              })}
            </div>
          )}

          {!stackedTrust && trustRow}
        </div>
      </div>
    </section>
  )
}
