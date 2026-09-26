import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'

import { AboutHero } from './About'
import { WhyHero } from './Why'

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

export const HighImpactHero: React.FC<Page['hero']> = (props) => {
  // The About and Why comps are different compositions, not tweaks of this one; each lives
  // on its own.
  if (props.variant === 'about') return <AboutHero {...props} />
  if (props.variant === 'why') return <WhyHero {...props} />
  return <SplitHero {...props} />
}

const SplitHero: React.FC<Page['hero']> = ({
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
   * The stacked box takes the photo's own ratio so nothing is cut off at phone and tablet
   * widths; the comp's 685:580 stands in until an editor's upload reports its size.
   */
  const mediaRatio =
    hasMedia && media.width && media.height ? `${media.width} / ${media.height}` : '685 / 580'
  /*
   * The `/why` comp stacks each trust point's icon over its label AND lifts the row above
   * the buttons. Those move together there, so one control drives both rather than leaving
   * an editor to pair two settings correctly.
   */
  const stackedTrust = trustPointsStyle === 'stacked'

  /*
   * From `xl` the photo runs to the screen's own edge while the copy stays in the 1400px
   * column the header uses. The copy keeps its 700px and the gutter that column gave it, so
   * it sits exactly where an even split put it; the photo takes everything left over and
   * grows with the window instead of stopping at the container. Below `xl` the two stack:
   * side by side there, the copy column is far taller than the photo and the photo became a
   * hard-cropped sliver. Media on the right mirrors both halves.
   */
  const columns = mediaRight
    ? 'xl:max-w-none xl:grid-cols-[minmax(0,calc(700px+max(0px,(100%-1400px)/2)))_1fr]'
    : 'xl:max-w-none xl:grid-cols-[1fr_minmax(0,calc(700px+max(0px,(100%-1400px)/2)))]'

  /*
   * The gutter the 1400px column used to give the copy, now that the grid spans the screen.
   * The copy's own column carries it as well as the margin, so the words keep their 700px
   * and move outward rather than narrowing.
   */
  const copyGutter = mediaRight
    ? 'xl:ml-[max(0px,calc((100%-1400px)/2))]'
    : 'xl:mr-[max(0px,calc((100%-1400px)/2))]'

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
      <div className={cn('mx-auto grid w-full max-w-[1400px] grid-cols-1 items-stretch', columns)}>
        {/*
         * Image column. Stacked, the spacer carries the photo's own ratio and the photo is
         * fitted inside it, so the whole picture shows across the viewport — nothing is cut.
         * Side by side, the column is as tall as the copy (at least the comp's 580px) and the
         * photo fills it: a photo wider than the column would otherwise letterbox against the
         * hero colour. It is covered from the centre, so the trim comes off both edges evenly
         * and the subject stays put.
         */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            !hasMedia && 'bg-slate-100',
            mediaRight && 'xl:order-2',
          )}
        >
          <div
            aria-hidden="true"
            className="w-full xl:aspect-auto! xl:h-full xl:min-h-[580px]"
            style={{ aspectRatio: mediaRatio }}
          />
          {hasMedia && (
            <div className="absolute inset-0" data-payload-subpath="media">
              <Media
                // `Media` wraps its <picture> in a div of its own; without a height here
                // that div collapses to content height and the `h-full` below resolves
                // against nothing.
                className="h-full w-full"
                /*
                 * Stacked, the photo is framed tighter than it was shot: it is a wide
                 * kitchen scene, and at a phone's width the woman and the two products were
                 * a small group in the middle of it. Half again the size, held a little up
                 * and to the left, shows the middle two thirds — source 9-75% across and
                 * 11-78% down — and the column's `overflow-hidden` takes the rest. The
                 * source is 1320px wide, so 880 of them still land on a 390px screen and
                 * nothing is upscaled. Side by side from `xl` it is covered as before.
                 */
                imgClassName="h-full w-full origin-[26%_34%] scale-150 object-contain object-center xl:origin-center xl:scale-100 xl:object-cover"
                pictureClassName="block h-full w-full"
                priority
                resource={media}
              />
            </div>
          )}
        </div>

        {/* Copy column: 31.25px side padding, 12.5px between every part. Stacked it's centred
            (the mobile comp keeps the 31.25px sides with only 16px above and below); side by
            side it's at most 700px wide and pinned to the centre line, beside the photo. */}
        <div
          className={cn(
            'mx-auto flex w-full min-w-0 max-w-[715px] flex-col items-start justify-center gap-[12.5px] px-[31.25px] py-4 md:px-6 md:py-10 xl:mx-0 xl:max-w-[700px] xl:px-[31.25px] xl:py-[35.9375px]',
            copyGutter,
            mediaRight ? 'xl:order-1 xl:justify-self-end' : 'xl:justify-self-start',
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
                    className="shrink-0 text-center text-[15px] font-semibold leading-[15px] text-heading"
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
                      'cta-gleam inline-flex h-[50px] max-w-full items-center justify-center gap-[12.5px] rounded-[6.25px] px-[12.5px] md:rounded-[25px] text-center text-[13.75px] font-medium leading-[13.75px] [&_sup]:leading-[0]',
                      isOutline
                        ? // A white band would vanish on the light fill, so the outline button
                          // sweeps a tint of its own ink instead.
                          'border-[0.625px] border-subheading text-subheading hover:bg-white [--cta-gleam-color:color-mix(in_oklab,currentcolor_10%,transparent)]'
                        : 'bg-brand text-white hover:bg-brand-dark [--cta-glow:var(--color-brand)]',
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
