import React from 'react'
import { Check, Star } from 'lucide-react'

import type { Product } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Carousel } from '@/blocks/VideoStories/Carousel'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { BuyBox } from './BuyBox'
import { Composition } from './Composition'
import { DetailSections } from './DetailSections'
import { Gallery } from './Gallery'

export const ProductDetail: React.FC<{ product: Product }> = ({ product }) => {
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
  const layout = Array.isArray(product.layout) ? product.layout : []
  const hasComposition =
    Boolean(product.compositionTitle) && (contains.length > 0 || notContains.length > 0)

  const stars = Math.max(0, Math.min(5, Math.round(product.rating ?? 5)))

  return (
    <>
      <section className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <Gallery badgeLabel={product.badgeLabel} slides={gallery} />
          </div>

          {/* Buy column */}
          <div>
            {/* Review bar */}
            {(product.ratingLabel || ratingNotes.length > 0) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#dbe8fa] pb-3 text-xs text-brand">
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
                  <span className="font-semibold">{product.ratingLabel}</span>
                )}
                {ratingNotes.map((note, i) => (
                  <React.Fragment key={note.id ?? i}>
                    <span aria-hidden="true" className="text-[#c9dcf5]">
                      |
                    </span>
                    <span>{note.text}</span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {product.eyebrow && (
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-[#0052cc]">
                {product.eyebrow}
              </p>
            )}

            <h1 className="mt-1 font-serif text-3xl leading-tight text-heading sm:text-4xl">
              {product.title}
            </h1>

            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-[#1a2f7c]">{product.description}</p>
            )}

            {benefits.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {benefits.map((benefit, i) => (
                  <li
                    className="flex items-center gap-2 rounded-full border border-[#dbe8fa] px-3 py-1.5"
                    key={benefit.id ?? i}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={3} />
                    <span className="text-xs text-brand">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Reported results */}
            {results.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#dbe8fa] bg-[#f7faff] p-5">
                {product.resultsTitle && (
                  <p className="text-center text-sm font-bold uppercase tracking-wide text-brand">
                    {product.resultsTitle}
                  </p>
                )}

                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {results.map((result, i) => (
                    <li className="text-center" key={result.id ?? i}>
                      <p className="text-3xl font-extrabold text-brand">{result.value}</p>
                      <p className="mt-1 text-[11px] font-bold text-brand">{result.label}</p>
                      {result.detail && (
                        <p className="mt-1 text-[10px] leading-tight text-[#0052cc]">
                          {result.detail}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                {product.resultsFootnote && (
                  <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-500">
                    {product.resultsFootnote}
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
                    className="flex items-start gap-3 rounded-lg border border-[#dbe8fa] bg-[#f7faff] p-4"
                    key={note.id ?? i}
                  >
                    <BrandIcon
                      className="shrink-0 text-brand [&>svg]:h-6 [&>svg]:w-6"
                      name={note.icon}
                    />
                    <p className="text-xs leading-relaxed text-[#1a2f7c]">
                      {note.lead && <strong className="font-bold">{note.lead} </strong>}
                      {note.text}
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
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe8fa] text-brand [&>span>svg]:h-5 [&>span>svg]:w-5">
                      <BrandIcon name={item.icon} />
                    </span>
                    <span className="text-xs font-semibold text-brand">{item.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* What you'll feel */}
            {feel.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#dbe8fa] bg-[#f7faff] p-5">
                {product.feelTitle && (
                  <p className="text-center text-base font-bold text-brand">
                    {product.feelTitle}
                  </p>
                )}

                <ul className="mt-4 flex flex-col gap-2">
                  {feel.map((row, i) => (
                    <li
                      className="flex items-center gap-3 rounded-lg bg-white px-4 py-3"
                      key={row.id ?? i}
                    >
                      <BrandIcon
                        className="shrink-0 text-[#1668C4] [&>svg]:h-6 [&>svg]:w-6"
                        name={row.icon}
                      />
                      <span className="min-w-0 grow">
                        <span className="block text-sm font-bold text-brand">{row.title}</span>
                        {row.subtitle && (
                          <span className="block text-[11px] text-[#0052cc]">{row.subtitle}</span>
                        )}
                      </span>
                      {row.percent && (
                        <span className="text-sm font-bold text-brand">{row.percent}</span>
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

            {stories.length > 0 && (
              <div className="border-t border-[#dbe8fa] py-6">
                {product.storiesTitle && (
                  <h2 className="font-serif text-xl text-heading">{product.storiesTitle}</h2>
                )}
                <div className="mt-4">
                  <Carousel itemClassName="w-[62%] sm:w-[38%] lg:w-[30%]" stories={stories} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {layout.length > 0 && <RenderBlocks blocks={layout} />}
    </>
  )
}
