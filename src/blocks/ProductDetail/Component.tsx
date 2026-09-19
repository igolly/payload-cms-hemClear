import React from 'react'
/* eslint-disable @next/next/no-img-element -- static design-system glyphs, nothing to optimise */

import type { ProductDetailBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Carousel } from '@/blocks/VideoStories/Carousel'
import { BuyBox } from '@/components/ProductDetail/BuyBox'
import { Composition } from '@/components/ProductDetail/Composition'
import { DetailSections } from '@/components/ProductDetail/DetailSections'
import { Gallery } from '@/components/ProductDetail/Gallery'
import { StickyBars } from '@/components/ProductDetail/StickyBars'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

import { artworkSrc, feelTile } from './artwork'

/** Info-banner copy: `**phrase**` is set in bold, as the comp bolds its figures. */
const withBold = (text: React.ReactNode): React.ReactNode =>
  typeof text === 'string'
    ? text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong className="font-bold" key={i}>
            {marks(part.slice(2, -2))}
          </strong>
        ) : (
          <React.Fragment key={i}>{marks(part)}</React.Fragment>
        ),
      )
    : text

/**
 * The whole product detail as one page section — Figma 6219:3619 (PRODUCT PAGE).
 *
 * The block's props are the fields themselves, so they are bound to `product` in one go
 * rather than destructured into ~30 locals.
 *
 * Layout: a 1375px row of two 675px columns 25px apart. The buy column carries a #ddd rule
 * on its left and 30/20px padding, and stacks its pieces 10px apart. It is a size container,
 * so the pieces that need ~600px (results row, composition columns) fold on its width rather
 * than the viewport's.
 */
export const ProductDetailBlockComponent: React.FC<ProductDetailBlock> = (product) => {
  const gallery = Array.isArray(product.gallery) ? product.gallery : []
  const benefits = Array.isArray(product.benefits) ? product.benefits : []
  const results = Array.isArray(product.results) ? product.results : []
  const feel = Array.isArray(product.feel) ? product.feel : []
  const notes = Array.isArray(product.notes) ? product.notes : []
  const trustItems = Array.isArray(product.trustItems) ? product.trustItems : []
  const sections = Array.isArray(product.sections) ? product.sections : []
  const ratingNotes = Array.isArray(product.ratingNotes) ? product.ratingNotes : []
  const contains = Array.isArray(product.contains) ? product.contains : []
  const notContains = Array.isArray(product.notContains) ? product.notContains : []
  const stories = Array.isArray(product.stories) ? product.stories : []
  const hasComposition =
    Boolean(product.compositionTitle) && (contains.length > 0 || notContains.length > 0)

  const stars = Math.max(0, Math.min(5, Math.round(product.rating ?? 5)))

  return (
    <section className="w-full bg-white px-4 py-4 font-inter text-navy sm:px-6 lg:px-8 lg:py-2.5">
      {product.stickyEnabled && (
        <StickyBars
          ctaLabel={product.ctaLabel}
          gallery={product.gallery}
          plans={Array.isArray(product.plans) ? product.plans : []}
          stickyCtaUrl={product.stickyCtaUrl}
          title={product.title}
        />
      )}

      <div className="mx-auto grid max-w-[1375px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[25px]">
        {/*
         * Gallery. Pinned on desktop so it stays in view while the much longer buy column
         * beside it scrolls; `self-start` stops the grid item stretching to the row height,
         * which would leave a sticky element no room to travel.
         */}
        <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <Gallery badgeLabel={product.badgeLabel} slides={gallery} />
        </div>

        {/* Buy column — Figma 6207:2522 */}
        <div className="@container flex min-w-0 flex-col gap-2.5 [&_sup]:leading-[0] lg:border-l lg:border-ash-200 lg:px-5 lg:py-[30px]">
          {/* Intro — Figma 6207:2819 */}
          <div className="flex flex-col gap-2.5">
            {(product.ratingLabel || ratingNotes.length > 0) && (
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 border-y border-navy-600 py-1.5">
                <span
                  aria-label={`${stars} out of 5 stars`}
                  className="text-base leading-4 text-navy"
                  role="img"
                >
                  {'★'.repeat(stars)}
                  {stars < 5 && <span className="text-steel-200">{'★'.repeat(5 - stars)}</span>}
                </span>
                <span className="text-xs font-medium leading-[14px] text-brand-600">
                  {[product.ratingLabel, ...ratingNotes.map((note) => note.text)]
                    .filter(Boolean)
                    .map((text, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ' | '}
                        {marks(text)}
                      </React.Fragment>
                    ))}
                </span>
              </div>
            )}

            {product.eyebrow && (
              <p className="text-[16.25px] font-bold uppercase leading-5 text-brand-600">
                {marks(product.eyebrow)}
              </p>
            )}

            <h1 className="font-marcellus text-[32px] leading-[1.1] text-navy sm:text-[38px] sm:leading-[38px]">
              {marks(product.title)}
            </h1>

            {product.description && (
              <p className="text-lg leading-[22px] text-navy">{marks(product.description)}</p>
            )}

            {benefits.length > 0 && (
              /* Figma 6207:2811: 38px pills, 1.25px brand-300 rule, 8px apart, #ccc rule beneath. */
              <ul className="flex flex-wrap items-center gap-2 border-b border-ash-300 py-4">
                {benefits.map((benefit, i) => (
                  <li
                    className="flex h-[38px] items-center gap-2 rounded-[20px] border-[1.25px] border-brand-300 px-[18.75px]"
                    key={benefit.id ?? i}
                  >
                    <span
                      aria-hidden="true"
                      className="w-4 text-center text-lg font-medium leading-[1.21]"
                    >
                      ✓
                    </span>
                    <span className="text-xs font-medium leading-3">{marks(benefit.text)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reported results — Figma 6207:2832 */}
          {results.length > 0 && (
            <div className="flex flex-col gap-4 rounded-[20px] border border-navy bg-mist-100 p-5">
              {product.resultsTitle && (
                <p className="text-center text-[16.25px] font-bold uppercase leading-5 text-brand-600">
                  {marks(product.resultsTitle)}
                </p>
              )}

              <ul className="grid grid-cols-2 gap-x-2 gap-y-6 @min-[600px]:grid-cols-4">
                {results.map((result, i) => (
                  <li
                    className="flex flex-col gap-[5px] text-center @min-[600px]:h-[141px]"
                    key={result.id ?? i}
                  >
                    <p className="font-fraunces text-[50px] font-bold leading-[50px]">
                      {marks(result.value)}
                    </p>
                    <p className="text-[13px] font-bold leading-4">{marks(result.label)}</p>
                    {result.detail && (
                      <p className="text-xs font-medium leading-[14px] text-brand-300">
                        {marks(result.detail)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              {product.resultsFootnote && (
                <p className="text-center text-sm leading-4 text-ash-600">
                  {marks(product.resultsFootnote)}
                </p>
              )}
            </div>
          )}

          <BuyBox
            ctaLabel={product.ctaLabel}
            oneTimeLabel={product.oneTimeLabel}
            plans={Array.isArray(product.plans) ? product.plans : []}
            variants={Array.isArray(product.variants) ? product.variants : []}
            variantsTitle={product.variantsTitle}
          />

          {/* Info banners — Figma 6215:3048 / 6216:3051 */}
          {notes.map((note, i) => {
            const src = artworkSrc(note.artwork)
            // A lead saved with its dash ("Your purchase gives back —") keeps the dash out of the bold.
            const lead =
              typeof note.lead === 'string' ? note.lead.replace(/\s*[—–-]\s*$/, '') : note.lead

            return (
              <div
                className="flex items-center gap-2 rounded-lg border border-navy bg-mist-100 px-5 py-[13px]"
                key={note.id ?? i}
              >
                {src ? (
                  <img alt="" className="size-7 shrink-0" height={28} src={src} width={28} />
                ) : (
                  <BrandIcon className="shrink-0 text-navy [&>svg]:size-7" name={note.icon} />
                )}
                <p className="text-xs leading-[14px] text-navy">
                  {lead && <strong className="font-bold">{marks(lead)}</strong>}
                  {lead && ' — '}
                  {withBold(note.text)}
                </p>
              </div>
            )
          })}

          {/* Trust icons — Figma 6216:3062: 150px boxes, 64px ringed tiles with 28px glyphs */}
          {trustItems.length > 0 && (
            <ul className="flex justify-center gap-2.5 p-2.5">
              {trustItems.map((item, i) => {
                const src = artworkSrc(item.artwork)

                return (
                  <li
                    className="flex w-[150px] min-w-0 flex-col items-center gap-2.5 text-center"
                    key={item.id ?? i}
                  >
                    <span className="flex size-16 items-center justify-center rounded-[20px] border border-ash-300 text-navy">
                      {src ? (
                        <img alt="" className="size-7" height={28} src={src} width={28} />
                      ) : (
                        <BrandIcon className="[&>svg]:size-7" name={item.icon} />
                      )}
                    </span>
                    <span className="text-sm font-bold leading-[14px]">{marks(item.label)}</span>
                  </li>
                )
              })}
            </ul>
          )}

          {/* What you'll feel — Figma 6216:3078. The 8px radius is written out because
              `rounded-lg` is the shadcn scale here and lands on 10px. */}
          {feel.length > 0 && (
            <div className="flex flex-col gap-4 rounded-[8px] border border-navy bg-mist-100 px-5 py-[13px]">
              {product.feelTitle && (
                <p className="text-center text-lg font-bold leading-[22px]">
                  {marks(product.feelTitle)}
                </p>
              )}

              <ul className="flex flex-col">
                {feel.map((row, i) => {
                  const src = artworkSrc(row.artwork)
                  const tile = row.artwork ? feelTile[row.artwork] : undefined

                  return (
                    <li
                      className="flex items-center justify-between gap-4 border-b border-ash-300 py-2 last:border-b-0"
                      key={row.id ?? i}
                    >
                      <span className="flex min-w-0 items-center gap-[13px]">
                        <span
                          className={cn(
                            'flex size-[38px] shrink-0 items-center justify-center rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
                            !tile && 'bg-white',
                          )}
                          style={tile ? { backgroundImage: tile } : undefined}
                        >
                          {src ? (
                            <img alt="" className="size-[18px]" height={18} src={src} width={18} />
                          ) : (
                            <BrandIcon
                              className="text-brand-400 [&>svg]:size-[18px]"
                              name={row.icon}
                            />
                          )}
                        </span>
                        <span className="flex min-w-0 flex-col gap-[5px]">
                          <span className="text-base font-bold leading-4 text-black">
                            {marks(row.title)}
                          </span>
                          {row.subtitle && (
                            <span className="text-xs leading-3 text-navy">
                              {marks(row.subtitle)}
                            </span>
                          )}
                        </span>
                      </span>
                      {row.percent && (
                        <span className="shrink-0 text-lg leading-3 text-black">
                          {marks(row.percent)}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Accordions + stories — Figma 6216:3145, stacked with no gap */}
          {(sections.length > 0 || hasComposition || stories.length > 0) && (
            <div className="flex flex-col">
              {sections.length > 0 && <DetailSections sections={sections} />}

              {hasComposition && (
                <Composition
                  contains={contains}
                  containsTitle={product.containsTitle}
                  notContains={notContains}
                  notContainsTitle={product.notContainsTitle}
                  note={product.compositionNote}
                  title={product.compositionTitle}
                />
              )}

              {/* Customer stories — Figma 6216:3153: 16px padding and gap, navy rule beneath. */}
              {stories.length > 0 && (
                <div className="flex flex-col gap-4 border-b border-navy py-4">
                  {product.storiesTitle && (
                    <h2 className="text-[22px] font-bold leading-[22px] text-navy">
                      {marks(product.storiesTitle)}
                    </h2>
                  )}
                  <Carousel
                    posterIncludesChrome={Boolean(product.storiesPosterIncludesChrome)}
                    stories={stories}
                    tone="light"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
