import React from 'react'

import type { MedicalReviewBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { FeaturedCarousel } from '@/blocks/Reviews/FeaturedCarousel'
import { Media } from '@/components/Media'
import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

import { medicalReviewArtworkSrc } from './artwork'

/* eslint-disable @next/next/no-img-element -- static SVG glyphs, nothing to optimise */

/*
 * Figma TRUSTED BY BEST (6037:80) — a 1200px column on #f9f9f9, 40px above and below,
 * 30px between its parts:
 *
 *   eyebrow        two 35x60 oat sprigs around 32px Marcellus
 *   heading        45px Marcellus in `brand-600`, tracking -0.45
 *   trust strip    a 958px card, three 300px features, each a 58px glyph beside its copy
 *   doctor cards   three 350px cards, 20px apart
 *
 * Sizes below are the comp's own. Everything folds to one column on a phone, where the
 * fixed widths would otherwise run past the screen.
 */

const CARD = 'rounded-[20px] border bg-[#f7fafd] shadow-[0_2px_7.5px_rgba(0,0,0,0.15)]'

/** The comp gives each card its own border tint, left to right. */
const CARD_BORDERS = ['border-[#dff0fb]', 'border-[#c7e7fa]', 'border-[#98d4f8]']

export const MedicalReviewBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  ctaLabel,
  ctaUrl,
  doctors,
  eyebrow,
  heading,
  highlights,
}) => {
  const points = Array.isArray(highlights) ? highlights : []
  const reviewers = Array.isArray(doctors) ? doctors : []

  return (
    <section
      className="w-full bg-[#f9f9f9] p-4 font-inter sm:px-6 lg:px-[30px] lg:py-10 [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      {/* 1200, the comp's own column: at 1140 the 45px headline takes a second line. */}
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 lg:gap-[30px]">
        <header className="flex flex-col items-center gap-4 lg:gap-[30px]">
          {eyebrow && (
            <p
              className="flex max-w-[292px] items-center gap-0.5 text-center font-marcellus text-[28px] leading-[32px] text-navy sm:max-w-none sm:gap-2.5 lg:text-[32px] lg:leading-[15px]"
              data-payload-subpath="eyebrow"
            >
              <img alt="" className="h-[60px] w-[35px] shrink-0" src="/icons/hero/oat-left.svg" />
              {marks(eyebrow)}
              <img alt="" className="h-[60px] w-[35px] shrink-0" src="/icons/hero/oat-right.svg" />
            </p>
          )}

          {heading && (
            <h2
              className="text-center font-marcellus text-[30px] leading-[42px] tracking-[-0.45px] text-brand-600 sm:text-[38px] lg:text-[45px] lg:leading-[normal]"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}
        </header>

        {points.length > 0 && (
          /* One card either way. On a phone the three features share the row as 122px
             columns — glyph over a centred title, the description dropped, as the mobile
             comp has it — and the row becomes icon-beside-copy from `xl`. */
          <div className="flex w-full max-w-[958px] flex-col items-center gap-4 rounded-[18.75px] border border-[#c7e7fa] bg-[#f7fafd] px-4 py-[18px] shadow-[0_2px_5px_rgba(0,0,0,0.15)] xl:gap-[15px]">
            <ul className="flex w-full items-start justify-between xl:items-center xl:justify-center xl:gap-[15px]">
              {points.map((point, i) => {
                const src = medicalReviewArtworkSrc(point.artwork)

                return (
                  <li
                    className="flex w-[122px] flex-col items-center gap-1.5 px-2 sm:px-4 xl:w-full xl:max-w-[300px] xl:flex-row xl:gap-[6.25px]"
                    data-payload-subpath={`highlights.${i}.title`}
                    key={point.id ?? i}
                  >
                    {src ? (
                      <img
                        alt=""
                        className="size-[58px] shrink-0"
                        decoding="async"
                        height={58}
                        loading="lazy"
                        src={src}
                        width={58}
                      />
                    ) : (
                      <span className="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-mist-100 text-brand [&>span>svg]:size-6">
                        <BrandIcon name={point.icon} />
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col gap-[1.875px] text-center leading-[normal] text-black xl:text-left">
                      <span className="text-xs font-bold xl:text-base">{marks(point.title)}</span>
                      {point.description && (
                        <span className="hidden text-xs font-medium xl:block">
                          {marks(point.description)}
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>

            {/* The mobile comp's outline button; the desktop frame has none. */}
            {ctaLabel && (
              <a
                className="flex items-center justify-center rounded-xl border border-brand-600 px-4 py-3 text-center text-base font-bold leading-[normal] text-brand-600 transition-colors hover:bg-brand-600 hover:text-white xl:hidden"
                data-payload-subpath="ctaLabel"
                href={ctaUrl || '#'}
              >
                {marks(ctaLabel)} &gt;
              </a>
            )}
          </div>
        )}

        {reviewers.length > 0 && (
          /* Three 350px cards need 1090px, so below `xl` the comp turns them into a
             swipeable track with arrows over the cards and a dot each — the same carousel
             the reviews section uses, given this section's 20px gap and 16px gutter. */
          <div className="w-full">
            <FeaturedCarousel
              trackClassName="scroll-px-4 gap-5 px-4 py-2 sm:gap-5 xl:gap-5 xl:py-0"
              slides={reviewers.map((doctor, i) => (
                <li
                  className={cn(
                    'flex w-[350px] max-w-[85vw] shrink-0 snap-start flex-col justify-center gap-2.5 p-5',
                    CARD,
                    CARD_BORDERS[i % CARD_BORDERS.length],
                  )}
                  data-payload-subpath={`doctors.${i}.name`}
                  key={doctor.id ?? i}
                >
                  <div className="flex w-full items-center gap-2.5">
                    {/* 58px disc, white behind the cut-out portraits the comp uses. */}
                    <span className="relative block size-[58px] shrink-0 overflow-hidden rounded-full border border-tint-50 bg-white">
                      {doctor.photo && typeof doctor.photo === 'object' && (
                        <Media
                          className="absolute inset-0"
                          fill
                          imgClassName="object-cover"
                          resource={doctor.photo}
                          size="58px"
                        />
                      )}
                    </span>

                    <span className="flex min-w-0 grow flex-col gap-1 leading-[normal] text-black">
                      <span className="text-[11px] font-bold">{marks(doctor.name)}</span>
                      {doctor.role && <span className="text-[10px]">{marks(doctor.role)}</span>}
                    </span>

                    {doctor.tag && (
                      <span className="shrink-0 rounded-xl bg-tint-50 px-2.5 py-1 text-[8px] font-bold leading-[normal] text-navy">
                        {marks(doctor.tag)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-playfair text-lg font-bold leading-[normal] text-navy">
                    &ldquo;{marks(doctor.quoteHeading)}&rdquo;
                  </h3>

                  <p
                    className="text-xs italic leading-[normal] text-black"
                    data-payload-subpath={`doctors.${i}.quote`}
                  >
                    &ldquo;{marks(doctor.quote)}&rdquo;
                  </p>

                  {doctor.readMoreLabel && (
                    <p className="text-xs font-bold leading-[normal] text-brand-500">
                      {marks(doctor.readMoreLabel)} &or;
                    </p>
                  )}

                  {Array.isArray(doctor.tags) && doctor.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-[5px]">
                      {doctor.tags.map((tag, t) => (
                        <li
                          className="flex h-5 items-center justify-center rounded-[5px] border border-tint-50 bg-white px-2.5 py-1 text-[8px] font-bold leading-[normal] text-navy"
                          key={tag.id ?? t}
                        >
                          {marks(tag.text)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* The comp's footer rule stops short of the card's padding: 283 of 310. */}
                  <div className="mt-auto flex w-full max-w-[283px] items-center justify-between gap-3 border-t border-tint-50 py-[5px] text-[10px] font-bold leading-[normal]">
                    {doctor.verifiedLabel && (
                      <span className="text-[#00ae26]">&#10003; {marks(doctor.verifiedLabel)}</span>
                    )}

                    {doctor.profileLabel && (
                      <a
                        className="text-navy transition-opacity hover:opacity-80"
                        href={doctor.profileUrl || '#'}
                      >
                        {marks(doctor.profileLabel)} &gt;
                      </a>
                    )}
                  </div>
                </li>
              ))}
            />
          </div>
        )}
      </div>
    </section>
  )
}
