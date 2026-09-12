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

  return (
    <section
      className={cn(
        'w-full bg-white',
        overlay ? 'px-0 py-0' : cn('px-4 sm:px-6 lg:px-8', showcase ? 'py-8' : 'py-14'),
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl items-center',
          showcase ? 'gap-8' : 'gap-10 lg:gap-14',
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
              : 'grid lg:grid-cols-2',
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
                  )
                : 'aspect-[9/7]',
              imageRight && 'lg:order-2',
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
            imageRight && 'lg:order-1',
            noImage && 'w-full text-center',
            /* The copy sits opposite the photo's subject, which `imagePosition` already
               names — image on the left means the column goes right, and vice versa. */
            overlay && cn('w-full max-w-[469px]', imageRight ? 'mr-auto' : 'ml-auto'),
          )}
        >
          {eyebrow && (
            <p
              className={cn(
                'font-bold uppercase text-subheading',
                showcase ? 'text-[18px] leading-5' : 'text-xs tracking-[0.15em] text-[#0052cc]',
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
                    : 'mt-2 font-serif text-3xl text-subheading sm:text-4xl',
              )}
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          {/* Short rule under the heading, per the comp: 90x5 there, scaled to 80x4 here.
              The showcase comp drops it — the display heading carries the section on its own. */}
          {heading && !showcase && (
            <span aria-hidden="true" className="mt-5 block h-1 w-20 bg-[#2d80e2]" />
          )}

          {description && (
            <p
              className={cn(
                'whitespace-pre-line',
                overlay
                  ? 'mt-3 text-[15px] leading-[18.75px] text-heading'
                  : showcase
                    ? 'mt-3 text-[18px] leading-[25px] text-heading'
                    : 'mt-6 max-w-xl text-[15px] leading-relaxed text-black',
              )}
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {gridLabel && (
            <p
              className="mt-7 text-[15px] font-medium text-[#2d80e2]"
              data-payload-subpath="gridLabel"
            >
              {marks(gridLabel)}
            </p>
          )}

          {items.length > 0 && (
            <ul
              className={cn(
                'mt-6',
                checklist
                  ? 'flex flex-col gap-3 text-left'
                  : showcase
                    ? cn('grid grid-cols-2 gap-y-5', SHOWCASE_COLUMNS[columns])
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
                    className={cn(
                      'flex flex-col items-center justify-start text-center',
                      showcase
                        ? 'gap-1 px-3 sm:border-l sm:border-[#C9D9F0]'
                        : 'gap-2 rounded-xl border border-[#2d80e2] bg-white px-3 py-4',
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
                        className={cn('block', showcase ? 'h-14 w-14' : 'h-16 w-16')}
                        data-payload-subpath={`factors.${i}.image`}
                      >
                        {/* `htmlElement={null}` so `Media` emits its `<picture>` bare —
                            its default `<div>` wrapper is not valid inside a span. */}
                        <Media
                          htmlElement={null}
                          imgClassName={cn('object-contain', showcase ? 'h-14 w-14' : 'h-16 w-16')}
                          resource={factor.image}
                        />
                      </span>
                    ) : (
                      <BrandIcon
                        className={cn(
                          'text-[#1668C4]',
                          showcase ? '[&>svg]:h-14 [&>svg]:w-14' : '[&>svg]:h-7 [&>svg]:w-7',
                        )}
                        name={factor.icon}
                      />
                    )}
                    <span
                      className={cn(
                        'font-bold',
                        showcase
                          ? 'text-[12.5px] leading-[15px] text-heading'
                          : 'text-[13px] leading-tight text-subheading',
                      )}
                    >
                      {marks(factor.label)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}

          {footnote && (
            <p
              className={cn(
                'flex whitespace-pre-line',
                showcase
                  ? 'mt-5 items-center gap-4 rounded-2xl bg-[#E0ECFC] p-[18px] text-[12.5px] leading-[17.5px] text-subheading'
                  : 'mt-6 items-start gap-2 text-[11px] leading-relaxed text-[#8397AE]',
              )}
              data-payload-subpath="footnote"
            >
              <BrandIcon
                className={cn(
                  'shrink-0 text-[#1668C4]',
                  showcase ? '[&>svg]:h-9 [&>svg]:w-9' : 'mt-px [&>svg]:h-4 [&>svg]:w-4',
                )}
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
