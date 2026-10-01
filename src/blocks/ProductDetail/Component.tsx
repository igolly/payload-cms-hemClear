'use client'
import React, { useState } from 'react'
/* eslint-disable @next/next/no-img-element -- static design-system glyphs, nothing to optimise */

import type { ProductDetailBlock } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Carousel } from '@/blocks/VideoStories/Carousel'
import { BuyBox } from '@/components/ProductDetail/BuyBox'
import { CartPanel } from '@/components/Cart/CartPanel'
import { CartProvider, useCart } from '@/components/Cart/CartProvider'
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

/**
 * The fields a variant may carry instead of the product's own. Anything left empty on the
 * variant falls through to the product, so an editor fills in only what actually differs.
 */
const OVERRIDABLE = new Set([
  'badgeLabel',
  'benefits',
  'compositionNote',
  'compositionTitle',
  'contains',
  'containsTitle',
  'ctaLabel',
  'description',
  'eyebrow',
  'feel',
  'feelTitle',
  'gallery',
  'notContains',
  'notContainsTitle',
  'plans',
  'results',
  'resultsFootnote',
  'resultsTitle',
  'title',
])

/** `block` with the chosen variant's filled-in fields laid over it. */
const withVariant = (block: ProductDetailBlock, index: number): ProductDetailBlock => {
  const variant = Array.isArray(block.variants) ? block.variants[index] : undefined
  if (!variant) return block

  const filled = Object.entries(variant).filter(([key, value]) => {
    if (!OVERRIDABLE.has(key)) return false
    // An empty array or a blank string is "not set", not "set to nothing": either would
    // otherwise blank out the product's own copy for that variant.
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined && value !== ''
  })

  return filled.length > 0 ? { ...block, ...Object.fromEntries(filled) } : block
}

/**
 * The cart lives above this block so the buy box, the bottom strip and the panel itself all
 * read the same state. It is scoped to the block rather than the whole site because this is
 * the only page that can put anything in it.
 */
export const ProductDetailBlockComponent: React.FC<ProductDetailBlock> = (block) => (
  <CartProvider>
    <ProductDetail {...block} />
    <CartPanel
      crossSell={(Array.isArray(block.cartCrossSell) ? block.cartCrossSell : []).map((item) => ({
        description: item.description,
        id: item.id,
        image: item.image,
        name: item.name,
        price: item.price,
      }))}
      freeShippingThreshold={block.cartFreeShippingThreshold}
      paymentMethods={block.cartPaymentMethods}
    />
  </CartProvider>
)

const ProductDetail: React.FC<ProductDetailBlock> = (block) => {
  const cart = useCart()
  const [variant, setVariant] = useState(0)
  /*
   * The chosen package lives here, beside the chosen variant, because two things buy it: the
   * card in the buy box and the strip along the bottom. Each used to keep its own idea of it
   * — the strip started on whichever package was flagged best value and never heard about a
   * click — so the strip offered the 90-day price while the reader had the 30-day card open.
   */
  const [plan, setPlan] = useState(0)
  const product = withVariant(block, variant)

  /*
   * A variant may price differently, and two variants need not offer the same number of
   * packages, so the choice is clamped rather than left pointing past the end of a shorter
   * list. Resolved once here so the buy box and the strip cannot disagree about it.
   */
  const activePlans = Array.isArray(product.plans) ? product.plans : []
  const planIndex = Math.min(plan, Math.max(activePlans.length - 1, 0))

  /*
   * Where a buy button goes. The chosen package's own link is the only one that knows which
   * product and package the reader settled on, so it wins; the block's sticky link is the
   * fallback for a package nobody has given a link to yet.
   */
  const buyUrl = activePlans[planIndex]?.ctaUrl || product.stickyCtaUrl

  /*
   * What goes in the cart: the chosen variant and the chosen package, keyed by both so
   * picking a different package adds a line rather than quietly increasing the wrong one.
   * The prices, the struck price and the billing terms are the package's own — the cart
   * states what the card above it states, or it is lying about one of the two.
   */
  const chosen = activePlans[planIndex]
  const variantName = Array.isArray(block.variants) ? block.variants[variant]?.name : undefined
  const addToCart = cart
    ? () =>
        cart.add({
          billingNote: chosen?.billingNote,
          bonusLabel: [chosen?.bonusHighlight, chosen?.bonusTitle].filter(Boolean).join(' ') || null,
          checkoutUrl: buyUrl,
          comparePrice: chosen?.comparePrice,
          id: `${variant}-${planIndex}`,
          image: Array.isArray(block.variants) ? block.variants[variant]?.image : undefined,
          name: variantName || product.title || 'Product',
          packageName: chosen?.name,
          price: chosen?.price ?? '',
          priceSuffix: chosen?.priceSuffix,
          saveLabel: chosen?.saveLabel,
        })
    : undefined

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
          addToCart={addToCart}
          buyUrl={buyUrl}
          ctaLabel={product.ctaLabel}
          gallery={product.gallery}
          onPlanChange={setPlan}
          plan={planIndex}
          plans={activePlans}
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
            {/*
             * Stars over the claim, as its own row rather than a wrapped one. The claim is too
             * long to sit beside the stars at any width this column is ever given, so wrapping
             * decided that already — but it decided it by measuring, and once the type below
             * was sized to fit it came within a few pixels of sharing the line and was squeezed
             * instead. Two rows, stated.
             */}
            {(product.ratingLabel || ratingNotes.length > 0) && (
              <div className="flex flex-col items-start gap-y-1 border-y border-navy-600 py-1.5">
                <span
                  aria-label={`${stars} out of 5 stars`}
                  className="text-base leading-4 text-navy"
                  role="img"
                >
                  {'★'.repeat(stars)}
                  {stars < 5 && <span className="text-steel-200">{'★'.repeat(5 - stars)}</span>}
                </span>
                {/*
                 * The whole claim reads as one line on any phone. Set at 12px it measures
                 * 340px, against 343px of row on a 375px screen — so it held together there
                 * by three pixels and broke "15 Years / Trusted" across two lines on anything
                 * narrower. Sized against the column instead it keeps that proportion all the
                 * way down, and the cap stops it growing past the drawing on a wide one. The
                 * line measures a little over 28px of width per 1px of type, so it clears its
                 * row at 3.5cqw; 3.3 leaves room for the font to land differently.
                 *
                 * Each claim is also unbreakable in itself, so an editor adding a fourth one
                 * gets a clean break at a rule rather than a phrase split down the middle.
                 */}
                <span className="w-full text-[min(12px,3.3cqw)] font-medium leading-[14px] text-brand-600">
                  {[product.ratingLabel, ...ratingNotes.map((note) => note.text)]
                    .filter(Boolean)
                    .map((text, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ' | '}
                        <span className="whitespace-nowrap">{marks(text)}</span>
                      </React.Fragment>
                    ))}
                </span>
              </div>
            )}

            {product.eyebrow && (
              <p className="text-[min(16.25px,3.98cqw)] font-bold uppercase leading-[1.23] text-brand-600">
                {marks(product.eyebrow)}
              </p>
            )}

            {/*
             * The intro is set against the width of the buy column rather than the
             * viewport, which is why these are `cqw` and why the column is a container.
             * The frame draws this name, its eyebrow and the copy beneath on one, one and
             * four lines in a 408px column; held at fixed sizes they each took a line more
             * as the column narrowed, so a 375px phone read as a different design rather
             * than the same one smaller. Each is capped at the size the frame gives it, so
             * nothing grows past the drawing on a wide column.
             */}
            <h1 className="text-balance font-marcellus text-[min(38px,9.31cqw)] leading-[1] text-navy">
              {marks(product.title)}
            </h1>

            {product.description && (
              <p className="text-[min(18px,4.41cqw)] leading-[1.22] text-navy">
                {marks(product.description)}
              </p>
            )}

            {benefits.length > 0 && (
              /* Figma 6207:2811: 38px pills, 1.25px brand-300 rule, 8px apart, #ccc rule beneath. */
              /* Hidden on a phone: the mobile frame marks this row `hidden`, and left in it
                   wraps to three rows of pills and costs the intro 225px. */
              <ul className="hidden flex-wrap items-center gap-2 border-b border-ash-300 py-4 @min-[600px]:flex">
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

          {/*
           * The offer sits above the reported results, so the packages are the first thing
           * under the product's own description rather than something to scroll past a wall
           * of figures for. The results still read as the evidence for the price — they are
           * simply on the other side of it.
           */}
          <BuyBox
            addToCart={addToCart}
            buyUrl={buyUrl}
            ctaLabel={product.ctaLabel}
            oneTimeLabel={product.oneTimeLabel}
            onPlanChange={setPlan}
            onVariantChange={setVariant}
            plan={planIndex}
            plans={activePlans}
            variant={variant}
            variants={Array.isArray(block.variants) ? block.variants : []}
            variantsTitle={product.variantsTitle}
          />

          {/* Reported results — Figma 6207:2832. The frame sets the figures in Gentium Book
              Basic Bold; Google Fonts retired that name and ships the same face as Gentium
              Book Plus, which is what `font-gentium` loads. */}
          {results.length > 0 && (
            <div className="flex flex-col gap-[9px] rounded-[20px] border border-navy bg-mist-100 p-2.5 @min-[600px]:gap-4 @min-[600px]:p-5">
              {product.resultsTitle && (
                <p className="text-center text-[16.25px] font-bold uppercase leading-5 text-brand-600">
                  {marks(product.resultsTitle)}
                </p>
              )}

              <ul className="grid grid-cols-4 gap-x-[7px] gap-y-6 @min-[600px]:gap-x-2">
                {results.map((result, i) => (
                  <li
                    className="flex flex-col gap-[5px] text-center @min-[600px]:h-[141px]"
                    key={result.id ?? i}
                  >
                    <p className="font-gentium text-[min(36px,8.82cqw)] font-bold leading-[1] @min-[600px]:text-[50px] @min-[600px]:leading-[50px]">
                      {marks(result.value)}
                    </p>
                    <p className="text-[min(13px,3.19cqw)] font-bold leading-[1.23]">
                      {marks(result.label)}
                    </p>
                    {result.detail && (
                      <p className="hidden text-xs font-medium leading-[14px] text-brand-300 @min-[600px]:block">
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
                  <img
                    alt=""
                    className="size-7 shrink-0"
                    decoding="async"
                    height={28}
                    loading="lazy"
                    src={src}
                    width={28}
                  />
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
                        <img
                          alt=""
                          className="size-7"
                          decoding="async"
                          height={28}
                          loading="lazy"
                          src={src}
                          width={28}
                        />
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
                            <img
                              alt=""
                              className="size-[18px]"
                              decoding="async"
                              height={18}
                              loading="lazy"
                              src={src}
                              width={18}
                            />
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
