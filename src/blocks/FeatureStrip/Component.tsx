import React from 'react'
import { ArrowRight, Check } from 'lucide-react'

import type { FeatureStripBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

type Item = NonNullable<Props['items']>[number]

/**
 * An item's illustrated icon when one is uploaded, falling back to the brand icon — the
 * same precedence `causes` and `totalCare` use, so a strip already built on icons is
 * untouched. Sizes are written out rather than interpolated so Tailwind can see them.
 */
const MARK_SIZE = {
  small: 'h-9 w-9',
  medium: 'h-14 w-14',
  large: 'h-20 w-20',
} as const
const MARK_ICON = {
  small: '[&>svg]:h-9 [&>svg]:w-9',
  medium: '[&>svg]:h-14 [&>svg]:w-14',
  large: '[&>svg]:h-20 [&>svg]:w-20',
} as const

type MarkSize = keyof typeof MARK_SIZE

const ItemMark: React.FC<{ item: Item; size: MarkSize }> = ({ item, size }) =>
  item.image && typeof item.image === 'object' ? (
    <span className={cn('block shrink-0', MARK_SIZE[size])}>
      {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its default `<div>`
          wrapper is not valid inside a span. */}
      <Media
        htmlElement={null}
        imgClassName={cn('object-contain', MARK_SIZE[size])}
        resource={item.image}
      />
    </span>
  ) : (
    <BrandIcon className={cn('shrink-0 text-[#1668C4]', MARK_ICON[size])} name={item.icon} />
  )

export const FeatureStripBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  align,
  background,
  backgroundImage,
  eyebrow,
  footnote,
  heading,
  iconSize,
  items,
  links,
  showRule,
  subheading,
  titleCase,
  variant,
}) => {
  const strip = Array.isArray(items) ? items : []
  /* `split` stacks a title beside the icon and drops the description beneath both, which is
     neither of the original two alignments — so it has to come out of `centred` as well. */
  const split = align === 'split'
  const centred = align !== 'left' && !split
  const style = variant ?? 'divided'
  const hasArtwork = Boolean(backgroundImage && typeof backgroundImage === 'object')
  const markSize: MarkSize =
    iconSize === 'large' ? 'large' : iconSize === 'medium' ? 'medium' : 'small'
  const titleClass = cn(
    'text-xs font-bold leading-tight tracking-wide text-subheading',
    titleCase !== 'none' && 'uppercase',
  )

  const listClass = {
    cards: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6',
    checklist: 'grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3',
    divided: 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-center',
    pills: 'flex flex-wrap items-stretch justify-center gap-3',
  }[style]

  return (
    <section
      className={cn(
        'w-full px-4 py-12 sm:px-6 lg:px-8',
        background === 'light' ? 'bg-[#f2f6fd]' : 'bg-white',
        hasArtwork && 'relative isolate',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      {/* Optional full-bleed artwork behind the section, as the comp's symptoms band has. */}
      {hasArtwork && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Media fill imgClassName="object-cover" resource={backgroundImage} />
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {(eyebrow || heading || subheading) && (
          <header className="text-center">
            {eyebrow && (
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
                data-payload-subpath="eyebrow"
              >
                {marks(eyebrow)}
              </p>
            )}

            {heading && (
              <h2
                className="mt-3 font-serif text-3xl leading-tight text-heading sm:text-4xl"
                data-payload-subpath="heading"
              >
                {multiline(heading)}
              </h2>
            )}

            {subheading && (
              <p
                className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-sm text-[#1a2f7c]"
                data-payload-subpath="subheading"
              >
                {marks(subheading)}
              </p>
            )}
          </header>
        )}

        {strip.length > 0 && (
          <ul className={cn(listClass, (eyebrow || heading || subheading) && 'mt-10')}>
            {strip.map((item, i) => {
              const key = item.id ?? i

              if (style === 'pills') {
                return (
                  <li
                    className="flex items-center gap-2 rounded-lg border border-[#dbe8fa] bg-white px-4 py-3"
                    data-payload-subpath={`items.${i}.title`}
                    key={key}
                  >
                    <ItemMark item={item} size={markSize} />
                    <span className="text-xs font-semibold text-[#0052cc]">
                      {marks(item.title)}
                    </span>
                  </li>
                )
              }

              if (style === 'checklist') {
                return (
                  <li
                    className="flex items-center gap-2"
                    data-payload-subpath={`items.${i}.title`}
                    key={key}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1668C4]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-brand">{marks(item.title)}</span>
                  </li>
                )
              }

              return (
                <li
                  className={cn(
                    style === 'cards'
                      ? 'flex flex-col items-center rounded-xl border border-[#dbe8fa] bg-white px-3 py-5 text-center'
                      : cn(
                          'px-5 lg:flex-1 lg:border-l lg:border-[#dbe8fa] lg:first:border-l-0',
                          centred && 'flex flex-col items-center text-center',
                          split && 'flex flex-col',
                          !centred && !split && 'flex gap-3',
                        ),
                  )}
                  data-payload-subpath={`items.${i}.title`}
                  key={key}
                >
                  {split ? (
                    <div className="flex items-center gap-3">
                      <ItemMark item={item} size={markSize} />
                      <h3 className={cn('min-w-0', titleClass)}>{marks(item.title)}</h3>
                    </div>
                  ) : (
                    <ItemMark item={item} size={markSize} />
                  )}

                  <div
                    className={cn(
                      'min-w-0',
                      (centred || style === 'cards' || split) && 'mt-3',
                      centred && 'flex flex-col items-center',
                    )}
                  >
                    {!split && <h3 className={titleClass}>{marks(item.title)}</h3>}

                    {/* The /why comp sets a short hairline between title and body. */}
                    {showRule && !split && (
                      <span aria-hidden="true" className="mt-3 block h-[3px] w-6 bg-[#C9D9F0]" />
                    )}

                    {item.description && (
                      <p
                        className="mt-2 text-xs leading-relaxed text-slate-600"
                        data-payload-subpath={`items.${i}.description`}
                      >
                        {marks(item.description)}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className={
                  link.appearance === 'outline'
                    ? 'inline-flex items-center gap-3 rounded-full border border-brand py-3 pl-8 pr-4 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:bg-slate-50'
                    : 'inline-flex items-center gap-3 rounded-full bg-[#1a7f37] py-3 pl-8 pr-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#166b2e]'
                }
                key={i}
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CMSLink>
            ))}
          </div>
        )}

        {footnote &&
          (style === 'checklist' ? (
            <p
              className="mx-auto mt-8 max-w-md rounded-lg bg-[#dfeafb] px-5 py-4 text-center text-sm leading-relaxed text-brand"
              data-payload-subpath="footnote"
            >
              {marks(footnote)}
            </p>
          ) : (
            <p
              className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-center text-[13px] leading-relaxed text-[#0052cc]"
              data-payload-subpath="footnote"
            >
              {marks(footnote)}
            </p>
          ))}
      </div>
    </section>
  )
}
