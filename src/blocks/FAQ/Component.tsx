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
        <div className="relative overflow-hidden border-b-2 border-[#0d8ce9] bg-white">
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
                <Media fill imgClassName="object-cover" priority resource={backgroundImage} />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(60%_80%_at_20%_40%,#eaf3ff_0%,#ffffff_70%)]" />
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
            <div className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-[#e5edf9] bg-white p-6 text-center shadow-[0_1px_3px_rgba(16,60,120,0.06)] sm:flex-row sm:text-left">
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
                    className="font-serif text-xl font-bold text-heading"
                    data-payload-subpath="supportTitle"
                  >
                    {marks(supportTitle)}
                  </p>
                )}
                {supportText && (
                  <p
                    className="mt-1 text-[15px] leading-relaxed text-slate-700"
                    data-payload-subpath="supportText"
                  >
                    {marks(supportText)}
                  </p>
                )}
              </div>

              {supportLinkLabel && (
                <a
                  className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-brand px-5 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
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
