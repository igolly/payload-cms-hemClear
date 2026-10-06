import React from 'react'

import type { FAQBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { FaqAccordion } from './FaqAccordion'
import { ImageSlot } from './ImagePlaceholder'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

export const FAQBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  backgroundImage,
  headerStyle,
  supportIcon,
  supportLinkIcon,
  supportLinkLabel,
  supportLinkUrl,
  supportText,
  supportTitle,
  defaultState,
  description,
  fullWidth,
  heading,
  image,
  items,
}) => {
  const questions = Array.isArray(items) ? items : []
  /*
   * The compact header is for a FAQ that is one section of a longer page — the comp's
   * product-page FAQ is a heading over a collapsed accordion, with no image panel and no
   * banner band. `banner` stays the default so `/faq`, which is the whole page, is unchanged.
   */
  const compact = headerStyle === 'compact'
  /*
   * The banner's product panel only appears when a product shot is actually set. The /faq
   * comp bakes the bottle into its background artwork, so rendering the panel as well put
   * two bottles side by side — and an empty panel would draw a dashed placeholder over the
   * art. Without it the copy keeps the right-hand column and the band keeps its height.
   */
  const hasPanel = Boolean(image && typeof image === 'object')
  const hasHeader = Boolean(heading || description || (!compact && (image || backgroundImage)))

  /*
   * The split band: the questions in a navy column with the product photo filling the rest.
   * It is its own return rather than another branch threaded through the banner markup —
   * the two share no structure beyond the accordion, and the questions live *inside* the
   * panel here instead of below the header.
   */
  if (headerStyle === 'split') {
    return (
      <section
        className={cn('w-full', !fullWidth && 'px-4 py-10 sm:px-6 lg:px-8')}
        style={backgroundStyle(bgColor, bgColorCustom)}
      >
        {/*
         * Two halves: the questions on a navy panel, the product photo filling the other. Edge
         * to edge on the home page (its reference, FAQ.png, runs the band across the window);
         * otherwise held to the page column as a rounded card, as the product page wants.
         * `overflow-hidden` keeps the photo inside the rounded corner.
         */}
        {/*
         * The photo is square and fills its half at the band's height, so the band is kept
         * near that half's width: tight padding where the questions set the height, and a
         * floor of 45vw (90% of the half) where a wide screen would otherwise make it a
         * letterbox. Between the two, close to all of the photo shows at every width.
         */}
        <div
          className={cn(
            'grid grid-cols-1 overflow-hidden lg:grid-cols-2',
            !fullWidth && 'mx-auto max-w-[1400px] rounded-2xl',
          )}
        >
          <div className="relative isolate overflow-hidden bg-steel-800 px-6 py-12 sm:px-10 lg:flex lg:min-h-[45vw] lg:flex-col lg:justify-center lg:py-[clamp(36px,4.5vw,96px)] lg:pl-[9%] lg:pr-[7%] xl:pl-[14%] xl:pr-[11%]">
            {/* The reference's two soft shapes: a lighter diagonal falling from the top
                right, and a large circle half off the panel's top edge. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-info-dark/35 [clip-path:polygon(58%_0,100%_0,100%_100%,90%_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-[22%] -top-[38%] -z-10 aspect-square w-[78%] rounded-full bg-info/20"
            />

            {heading && (
              <h2
                className="font-marcellus text-[40px] leading-[1.1] text-white sm:text-[48px] lg:text-[clamp(40px,3.4vw,64px)]"
                data-payload-subpath="heading"
              >
                {multiline(heading)}
              </h2>
            )}

            {description && (
              <p
                className="mt-3 max-w-md whitespace-pre-line text-sm leading-relaxed text-white/75"
                data-payload-subpath="description"
              >
                {marks(description)}
              </p>
            )}

            {questions.length > 0 && (
              <div className="mt-6 lg:mt-[clamp(20px,2.5vw,48px)]">
                <FaqAccordion defaultState={defaultState} items={questions} tone="panel" />
              </div>
            )}
          </div>

          {/*
           * The photo fills its half at whatever height the band is. That height no longer
           * moves when a question opens — the accordion reserves room for its longest answer
           * up front — so the photo is the same size and crop through every click. Stacked on
           * a narrow screen it takes a fixed slice instead of running the list's length.
           */}
          {hasPanel ? (
            <div className="relative h-64 sm:h-96 lg:h-auto" data-payload-subpath="image">
              <Media
                fill
                imgClassName="object-cover"
                resource={image}
                size="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ) : (
            <div aria-hidden="true" className="hidden bg-mist-100 lg:block" />
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full" style={backgroundStyle(bgColor, bgColorCustom)}>
      {hasHeader && compact && (
        <div className="mx-auto max-w-3xl px-6 pt-12 text-center lg:px-8">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}
          {description && (
            <p
              className="mx-auto mt-4 whitespace-pre-line text-[15px] leading-relaxed text-slate-800"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}
        </div>
      )}

      {hasHeader && !compact && (
        <div className="relative overflow-hidden border-b-2 border-brand-300 bg-white">
          {/*
           * The hero sits in the site's 6xl content column rather than bleeding to the
           * window edge, so the artwork is what sets the band's height: at 1152px wide its
           * 1920x900 aspect comes out around 540px, close to the comp's 562px, and nothing
           * is cropped. The blue rule below stays full width.
           */}
          <div className={cn('relative mx-auto max-w-6xl', !hasPanel && 'lg:aspect-[1920/900]')}>
            {/* Decorative background — falls back to a soft brand gradient until one is set. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              data-payload-subpath="backgroundImage"
            >
              {backgroundImage && typeof backgroundImage === 'object' ? (
                <Media
                  fill
                  imgClassName="object-cover"
                  priority
                  resource={backgroundImage}
                  // The hero panel is capped at the 1152px `max-w-6xl` column.
                  size="(max-width: 1152px) 100vw, 1152px"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(60%_80%_at_20%_40%,var(--color-mist-100)_0%,#fff_70%)]" />
              )}
            </div>

            <div
              className={cn(
                'relative grid grid-cols-1 items-center gap-8 px-6 py-12 lg:grid-cols-[2fr_3fr] lg:px-8',
                !hasPanel && 'lg:h-full lg:py-0',
              )}
            >
              {/* Product image */}
              {hasPanel ? (
                <div className="relative min-h-80" data-payload-subpath="image">
                  <ImageSlot
                    className="h-full min-h-80 w-full"
                    hint="Product shot — upload in the CMS"
                    label="Product image"
                    priority
                    resource={image}
                  />
                </div>
              ) : (
                <div aria-hidden="true" className="hidden lg:block" />
              )}

              {/* Heading + intro */}
              <div>
                {heading && (
                  <h2
                    className="font-serif text-4xl leading-tight text-heading sm:text-5xl"
                    data-payload-subpath="heading"
                  >
                    {multiline(heading)}
                  </h2>
                )}

                {description && (
                  <p
                    className="mt-6 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-slate-800"
                    data-payload-subpath="description"
                  >
                    {marks(description)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <FaqAccordion defaultState={defaultState} items={questions} />

          {/* Closing callout: an icon, a line of copy and one button, per the comp. */}
          {(supportTitle || supportText || supportLinkLabel) && (
            <div className="mt-2.5 flex flex-col items-center gap-2.5 rounded-[18.75px] border-[1.875px] border-tint-50 bg-white p-4 text-center sm:flex-row sm:gap-5 sm:p-6 sm:text-left">
              {supportIcon && typeof supportIcon === 'object' && (
                <span className="block h-20 w-20 shrink-0" data-payload-subpath="supportIcon">
                  {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default
                      `<div>` wrapper is not valid inside a span. */}
                  <Media
                    htmlElement={null}
                    imgClassName="h-20 w-20 object-contain"
                    resource={supportIcon}
                  />
                </span>
              )}

              <div className="grow">
                {supportTitle && (
                  <p
                    className="text-[22.5px] font-bold leading-[normal] text-brand-600"
                    data-payload-subpath="supportTitle"
                  >
                    {marks(supportTitle)}
                  </p>
                )}
                {supportText && (
                  <p
                    className="mt-1.5 text-[17.5px] leading-[normal] text-black"
                    data-payload-subpath="supportText"
                  >
                    {marks(supportText)}
                  </p>
                )}
              </div>

              {supportLinkLabel && (
                <a
                  className="cta-gleam [--cta-glow:var(--color-brand-500)] inline-flex h-[56.25px] shrink-0 items-center gap-[6.25px] rounded-[6.25px] bg-brand-500 px-[18.75px] text-[18.75px] font-medium text-white transition-colors hover:bg-brand-600"
                  href={supportLinkUrl || '#'}
                >
                  {supportLinkIcon && typeof supportLinkIcon === 'object' && (
                    <span className="block h-6 w-6 shrink-0">
                      <Media
                        htmlElement={null}
                        imgClassName="h-6 w-6 object-contain"
                        resource={supportLinkIcon}
                      />
                    </span>
                  )}
                  {marks(supportLinkLabel)}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
