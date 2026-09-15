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

import { CausesAbout } from './About'

/**
 * Showcase column counts, written out so Tailwind's scanner can see every class it has to
 * emit. The hairline divider is suppressed on the first item of each row, which is why the
 * `nth-child` step has to match the column count — and why dividers only appear from `sm`,
 * where the grid is at its full width. Below that the two-column stack has no rows to divide.
 */
const SHOWCASE_COLUMNS: Record<number, string> = {
  1: 'sm:grid-cols-1 sm:[&>li:nth-child(1n+1)]:border-l-0',
  2: 'sm:grid-cols-2 sm:[&>li:nth-child(2n+1)]:border-l-0',
  3: 'sm:grid-cols-3 sm:[&>li:nth-child(3n+1)]:border-l-0',
  4: 'sm:grid-cols-4 sm:[&>li:nth-child(4n+1)]:border-l-0',
}

export const CausesBlock: React.FC<Props> = (props) =>
  /* The About-page cuts are their own layouts; see `About.tsx`. */
  props.variant === 'aboutDiagnosed' || props.variant === 'aboutOffer' ? (
    <CausesAbout {...props} />
  ) : (
    <CausesDefault {...props} />
  )

const CausesDefault: React.FC<Props> = ({
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
  imageFrame,
  imagePosition,
  links,
  variant,
}) => {
  const items = Array.isArray(factors) ? factors : []
  const imageRight = imagePosition === 'right'
  const noImage = imagePosition === 'none'
  const checklist = factorStyle === 'checklist'
  /*
   * The `/why` comp restyles this section in six coordinated ways at once — display
   * heading, no rule, larger eyebrow and body, borderless divided icon columns, tinted
   * note. They only make sense together, so they ride on one named variant rather than
   * six independent toggles, and `default` reproduces the original exactly for the pages
   * already on it (`/home`, `/about-hemorrhoids`).
   */
  const overlay = variant === 'overlay'
  /* A product shot that must not lose its edges keeps its own square frame. */
  const squareFrame = imageFrame === 'square'
  /*
   * Overlay is a second cut of the same restyle — it shares the eyebrow, icon columns and
   * note treatment and only differs in shape, so the two ride together here and part
   * company where the comps actually diverge (heading and body size, and the shell below).
   */
  const showcase = variant === 'showcase' || overlay

  /*
   * Showcase divides the icon columns with hairlines, which means knowing where a row
   * starts. A wrapping flex cannot tell CSS that, so the columns are an explicit grid and
   * the divider is suppressed on the first item of each row. Four across is the comp's
   * widest row; a shorter list keeps its own count so three items read as three columns
   * rather than three quarters of a row.
   */
  const columns = Math.min(Math.max(items.length, 1), 4)

  /*
   * The default treatment is the home PROBLEM comp: a 611.5px illustration with the footnote
   * set beneath it, beside a 437.5px copy column stacked on an 18.75px rhythm. With an image
   * the footnote belongs to the image column, so the three pieces are grid children that
   * reflow — image, copy, note — when the columns stack below `lg`.
   */
  const split = !showcase && !noImage

  const footnoteNode = footnote ? (
    <div
      className={cn(
        'flex flex-col gap-[12.5px]',
        /* The mobile PROBLEM comp ends on the factor cards — the note is desktop-only there. */
        split ? 'w-full max-lg:hidden sm:px-[62.5px] lg:col-start-1 lg:row-start-2' : undefined,
        split && imageRight && 'lg:col-start-2',
      )}
    >
      {split && (
        <span
          aria-hidden="true"
          className="-my-[1.25px] block h-[2.5px] w-full rounded-full bg-shell"
        />
      )}
      <p
        className="flex items-start gap-[12.5px] whitespace-pre-line text-left text-[10px] font-medium leading-[13.75px] text-ash-500 sm:text-center"
        data-payload-subpath="footnote"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static 32px icon, nothing to optimise */}
        <img
          alt=""
          className="size-[15px] shrink-0"
          height={15}
          src="/icons/causes/info.png"
          width={15}
        />
        <span className="flex-1">{marks(footnote)}</span>
      </p>
    </div>
  ) : null

  return (
    <section
      className={cn(
        'w-full bg-white',
        overlay
          ? 'px-0 py-0'
          : showcase
            ? 'px-4 py-8 sm:px-6 lg:px-8'
            : // Mobile comp: 16px band padding around a 437.5px column that pads itself 16px.
              'px-[17.25px] py-4 font-inter sm:px-[31.25px] lg:py-[31.25px] [&_sup]:leading-[0]',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'mx-auto items-center',
          showcase ? 'max-w-6xl gap-8' : 'max-w-[1400px]',
          overlay
            ? /*
               * The photo spans the content column, not the viewport — the comp's band is
               * a 1200×338 image sitting in the centred 1200px column, so letting it bleed
               * to the window edge would scale it up and crop the subject out of frame.
               * The column takes the image's own aspect from `lg`, where there is room for
               * the copy inside it; below that it is a backdrop behind flowing content.
               */
              'relative isolate flex overflow-hidden px-6 py-10 lg:aspect-[1200/338] lg:px-[62px] lg:py-0'
            : noImage
              ? 'flex flex-col'
              : showcase
                ? 'grid lg:grid-cols-2'
                : cn(
                    /*
                     * Stacked (mobile comp) the copy column dissolves into this grid so the
                     * illustration can sit between the heading and the body, on a 6px rhythm.
                     */
                    'grid grid-cols-[minmax(0,1fr)] gap-y-[6px] lg:justify-center lg:gap-x-[30px] lg:gap-y-5',
                    imageRight
                      ? 'lg:grid-cols-[437.5px_minmax(0,611.5px)]'
                      : 'lg:grid-cols-[minmax(0,611.5px)_437.5px]',
                  ),
        )}
      >
        {overlay && !noImage && (
          <div className="absolute inset-0 -z-10" data-payload-subpath="image">
            <ImageSlot
              className="h-full w-full"
              hint="Recommended 1200 × 338px photo, subject on the side away from the copy"
              imgClassName="h-full w-full object-cover"
              label="Section background"
              resource={image}
            />
          </div>
        )}

        {!noImage && !overlay && (
          <div
            className={cn(
              'relative w-full',
              showcase
                ? cn(
                    'overflow-hidden rounded-[19px]',
                    squareFrame ? 'aspect-square' : 'aspect-[503/606]',
                    imageRight && 'lg:order-2',
                  )
                : cn(
                    'aspect-[964/773] lg:row-start-1',
                    imageRight ? 'lg:col-start-2' : 'lg:col-start-1',
                  ),
            )}
            data-payload-subpath="image"
          >
            <ImageSlot
              className="h-full w-full"
              hint={
                showcase
                  ? 'Recommended 1000 × 1200px, fills the frame'
                  : 'Recommended 900 × 700px, transparent PNG'
              }
              imgClassName={
                showcase
                  ? cn('h-full w-full', squareFrame ? 'object-contain' : 'object-cover')
                  : undefined
              }
              label="Vein anatomy illustration"
              resource={image}
            />
          </div>
        )}

        <div
          className={cn(
            !showcase && 'flex flex-col gap-[18.75px]',
            showcase && imageRight && 'lg:order-1',
            split &&
              cn(
                'w-full max-lg:contents lg:row-span-2 lg:row-start-1 lg:self-center',
                imageRight ? 'lg:col-start-1' : 'lg:col-start-2',
              ),
            noImage && 'w-full items-center text-center',
            /* The copy sits opposite the photo's subject, which `imagePosition` already
               names — image on the left means the column goes right, and vice versa. */
            overlay && cn('w-full max-w-[469px]', imageRight ? 'mr-auto' : 'ml-auto'),
          )}
        >
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase text-subheading',
                showcase ? 'text-[18px] leading-5' : 'text-xs tracking-[0.15em] text-brand-500',
                split && 'max-lg:order-first',
              )}
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {heading && (
            <h2
              className={cn(
                'leading-tight',
                overlay
                  ? 'mt-3 font-marcellus text-[26px] text-heading sm:text-[31px]'
                  : showcase
                    ? 'mt-3 font-marcellus text-[34px] text-heading sm:text-[46px] lg:text-[57px]'
                    : 'font-marcellus text-[36px] leading-[42px] text-subheading max-lg:text-center lg:text-[40px] lg:leading-[1.25]',
                split && 'max-lg:order-first',
              )}
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {/* Short rule under the heading, per the comp: 90x5 there, scaled to 80x4 here.
              The showcase comp drops it — the display heading carries the section on its own. */}
          {heading && !showcase && (
            <span
              aria-hidden="true"
              className={cn(
                '-my-[1.25px] block h-[2.5px] w-[62.5px] rounded-full bg-brand-300',
                split && 'max-lg:hidden',
              )}
            />
          )}

          {description && (
            <p
              className={cn(
                'whitespace-pre-line',
                overlay
                  ? 'mt-3 text-[15px] leading-[18.75px] text-heading'
                  : showcase
                    ? 'mt-3 text-[18px] leading-[25px] text-heading'
                    : 'text-[12px] font-medium leading-4 text-black',
              )}
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {gridLabel && (
            <p
              className={cn(
                'font-medium text-brand-300',
                showcase ? 'mt-7 text-[15px]' : 'text-[12px] leading-4',
              )}
              data-payload-subpath="gridLabel"
            >
              {marks(gridLabel)}
            </p>
          )}

          {items.length > 0 && (
            <ul
              className={cn(
                showcase && 'mt-6',
                checklist
                  ? 'flex flex-col gap-3 text-left'
                  : showcase
                    ? cn('grid grid-cols-2 gap-y-5', SHOWCASE_COLUMNS[columns])
                    : cn(
                        /* The comp's cards are a fixed 140px, three across the 437.5px column;
                           the mobile comp sets 125px, centred, shrinking on narrower phones. */
                        'grid grid-cols-[repeat(3,minmax(0,125px))] gap-2 self-stretch max-sm:justify-center sm:grid-cols-[repeat(3,140px)]',
                        noImage &&
                          'sm:grid-cols-[repeat(4,140px)] sm:justify-center lg:grid-cols-[repeat(5,140px)]',
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
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-steel-800">{marks(factor.label)}</span>
                  </li>
                ) : (
                  <li
                    className={cn(
                      'flex flex-col items-center justify-start text-center',
                      showcase
                        ? 'gap-1 px-3 sm:border-l sm:border-tint-150'
                        : 'min-h-[105px] gap-[3.125px] sm:h-[103px] sm:min-h-0 overflow-hidden rounded-[9.375px] border-[0.625px] border-brand-300 bg-white px-[6.25px] py-[9.375px]',
                    )}
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
                        className={cn('block shrink-0', showcase ? 'h-14 w-14' : 'size-[50px]')}
                        data-payload-subpath={`factors.${i}.image`}
                      >
                        {/* `htmlElement={null}` so `Media` emits its `<picture>` bare —
                            its default `<div>` wrapper is not valid inside a span. */}
                        <Media
                          htmlElement={null}
                          imgClassName={cn(
                            'object-contain',
                            showcase ? 'h-14 w-14' : 'size-[50px]',
                          )}
                          resource={factor.image}
                        />
                      </span>
                    ) : (
                      <BrandIcon
                        className={cn(
                          'text-brand-400',
                          showcase
                            ? '[&>svg]:h-14 [&>svg]:w-14'
                            : 'flex size-[50px] shrink-0 items-center justify-center [&>svg]:h-7 [&>svg]:w-7',
                        )}
                        name={factor.icon}
                      />
                    )}
                    <span
                      className={cn(
                        'font-bold',
                        showcase
                          ? 'text-[12.5px] leading-[15px] text-heading'
                          : 'text-[12px] leading-[15px] text-subheading',
                      )}
                    >
                      {/* A line break in the label sets the wrap, as the comp does. */}
                      {multiline(factor.label)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}

          {footnote && showcase && (
            <p
              className="mt-5 flex items-center gap-4 whitespace-pre-line rounded-2xl bg-tint-50 p-[18px] text-[12.5px] leading-[17.5px] text-subheading"
              data-payload-subpath="footnote"
            >
              <BrandIcon className="shrink-0 text-brand-400 [&>svg]:h-9 [&>svg]:w-9" name="info" />
              {marks(footnote)}
            </p>
          )}

          {!showcase && noImage && footnoteNode}

          {Array.isArray(links) && links.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap gap-3',
                showcase && 'mt-6',
                noImage && 'justify-center',
              )}
            >
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

        {split && footnoteNode}
      </div>
    </section>
  )
}
