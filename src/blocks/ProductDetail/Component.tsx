import React from 'react'
import { Check, Star } from 'lucide-react'

import type { ProductDetailBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Carousel } from '@/blocks/VideoStories/Carousel'
import { BuyBox } from '@/components/ProductDetail/BuyBox'
import { Composition } from '@/components/ProductDetail/Composition'
import { DetailSections } from '@/components/ProductDetail/DetailSections'
import { Gallery } from '@/components/ProductDetail/Gallery'
import { StickyBars } from '@/components/ProductDetail/StickyBars'
import { marks } from '@/utilities/marks'

/**
 * The whole product detail as one page section.
 *
 * The block's props are the fields themselves, so they are bound to `product` in one go
 * rather than destructured into ~30 locals — the body below reads exactly as it did when
 * this took a `Product` document.
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
    <section className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8">
      {product.stickyEnabled && (
        <StickyBars
          ctaLabel={product.ctaLabel}
          gallery={product.gallery}
          offerNote={product.stickyOfferNote}
          offerText={product.stickyOfferText}
          plans={Array.isArray(product.plans) ? product.plans : []}
          stickyCtaLabel={product.stickyCtaLabel}
          stickyCtaUrl={product.stickyCtaUrl}
          title={product.title}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/*
           * Gallery.
           *
           * Pinned on desktop so it stays in view while the buy column beside it — which
           * runs to several screens of buy box, notes, detail sections and stories — is
           * scrolled. `self-start` is what makes that work: a grid item stretches to the
           * full row height by default, and a sticky element that already fills its
           * containing block has no room left to travel. Left alone below `lg`, where the
           * two columns stack and there is nothing to scroll past.
           */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Gallery badgeLabel={product.badgeLabel} slides={gallery} />
          </div>

          {/* Buy column */}
          <div>
            {/* Review bar */}
            {(product.ratingLabel || ratingNotes.length > 0) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-tint-100 pb-3 text-xs text-brand">
                <span
                  aria-label={`${stars} out of 5 stars`}
                  className="flex items-center"
                  role="img"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      aria-hidden="true"
                      className={
                        i < stars ? 'h-3.5 w-3.5 text-brand' : 'h-3.5 w-3.5 text-slate-200'
                      }
                      fill="currentColor"
                      key={i}
                      strokeWidth={0}
                    />
                  ))}
                </span>
                {product.ratingLabel && (
                  <span className="font-semibold">{marks(product.ratingLabel)}</span>
                )}
                {ratingNotes.map((note, i) => (
                  <React.Fragment key={note.id ?? i}>
                    <span aria-hidden="true" className="text-tint-150">
                      |
                    </span>
                    <span>{marks(note.text)}</span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {product.eyebrow && (
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-brand-500">
                {marks(product.eyebrow)}
              </p>
            )}

            <h1 className="mt-1 font-serif text-3xl leading-tight text-heading sm:text-4xl">
              {marks(product.title)}
            </h1>

            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-navy">{marks(product.description)}</p>
            )}

            {benefits.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {benefits.map((benefit, i) => (
                  <li
                    className="flex items-center gap-2 rounded-full border border-tint-100 px-3 py-1.5"
                    key={benefit.id ?? i}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={3} />
                    <span className="text-xs text-brand">{marks(benefit.text)}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Reported results */}
            {results.length > 0 && (
              <div className="mt-6 rounded-xl border border-tint-100 bg-mist p-5">
                {product.resultsTitle && (
                  <p className="text-center text-sm font-bold uppercase tracking-wide text-brand">
                    {marks(product.resultsTitle)}
                  </p>
                )}

                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {results.map((result, i) => (
                    <li className="text-center" key={result.id ?? i}>
                      <p className="text-3xl font-extrabold text-brand">{marks(result.value)}</p>
                      <p className="mt-1 text-[11px] font-bold text-brand">{marks(result.label)}</p>
                      {result.detail && (
                        <p className="mt-1 text-[10px] leading-tight text-brand-500">
                          {marks(result.detail)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                {product.resultsFootnote && (
                  <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-500">
                    {marks(product.resultsFootnote)}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <BuyBox
                ctaLabel={product.ctaLabel}
                oneTimeLabel={product.oneTimeLabel}
                plans={Array.isArray(product.plans) ? product.plans : []}
                variants={Array.isArray(product.variants) ? product.variants : []}
                variantsTitle={product.variantsTitle}
              />
            </div>

            {/* Info banners */}
            {notes.length > 0 && (
              <ul className="mt-4 flex flex-col gap-3">
                {notes.map((note, i) => (
                  <li
                    className="flex items-start gap-3 rounded-lg border border-tint-100 bg-mist p-4"
                    key={note.id ?? i}
                  >
                    <BrandIcon
                      className="shrink-0 text-brand [&>svg]:h-6 [&>svg]:w-6"
                      name={note.icon}
                    />
                    <p className="text-xs leading-relaxed text-navy">
                      {note.lead && <strong className="font-bold">{marks(note.lead)} </strong>}
                      {marks(note.text)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Trust icons */}
            {trustItems.length > 0 && (
              <ul className="mt-6 flex flex-wrap items-start justify-center gap-8">
                {trustItems.map((item, i) => (
                  <li
                    className="flex w-28 flex-col items-center gap-2 text-center"
                    key={item.id ?? i}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-tint-100 text-brand [&>span>svg]:h-5 [&>span>svg]:w-5">
                      <BrandIcon name={item.icon} />
                    </span>
                    <span className="text-xs font-semibold text-brand">{marks(item.label)}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* What you'll feel */}
            {feel.length > 0 && (
              <div className="mt-6 rounded-xl border border-tint-100 bg-mist p-5">
                {product.feelTitle && (
                  <p className="text-center text-base font-bold text-brand">
                    {marks(product.feelTitle)}
                  </p>
                )}

                <ul className="mt-4 flex flex-col gap-2">
                  {feel.map((row, i) => (
                    <li
                      className="flex items-center gap-3 rounded-lg bg-white px-4 py-3"
                      key={row.id ?? i}
                    >
                      <BrandIcon
                        className="shrink-0 text-brand-400 [&>svg]:h-6 [&>svg]:w-6"
                        name={row.icon}
                      />
                      <span className="min-w-0 grow">
                        <span className="block text-sm font-bold text-brand">
                          {marks(row.title)}
                        </span>
                        {row.subtitle && (
                          <span className="block text-[11px] text-brand-500">
                            {marks(row.subtitle)}
                          </span>
                        )}
                      </span>
                      {row.percent && (
                        <span className="text-sm font-bold text-brand">{marks(row.percent)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
            {/*
             * Customer stories close the buy column, as the comp has them. Five cards fit
             * across it once they are sized off the column rather than the page and the
             * arrows step aside — the earlier squeeze came from page-width cards being asked
             * to fit here, not from the column being too narrow for the row.
             */}
            {stories.length > 0 && (
              <div className="mt-10 border-t border-tint-100 pt-8">
                {product.storiesTitle && (
                  <h2 className="text-xl font-extrabold tracking-tight text-heading sm:text-2xl">
                    {marks(product.storiesTitle)}
                  </h2>
                )}
                <div className="mt-5 border-b border-tint-100 pb-8">
                  <Carousel
                    arrows={false}
                    itemClassName="w-[46%] sm:w-[30%] lg:w-[calc((100%-4rem)/5)]"
                    stories={stories}
                    tone="light"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
