import React from 'react'

import type { SolutionSystemBlock as Props } from '@/payload-types'

import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { BrandIcon } from '@/components/BrandIcons'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

type Card = NonNullable<Props['cards']>[number]

/**
 * One highlight card: icon, an optional oversized lead-in number, title and subtitle.
 *
 * `index` is the row's real position in `cards`, not its position in the column, so
 * click-to-edit still opens the right row after the array has been sliced in two.
 */
const HighlightCard: React.FC<{ card: Card; index: number }> = ({ card, index }) => (
  <li
    className="flex items-center gap-4 rounded-2xl border border-[#E2ECFB] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(16,60,120,0.05)]"
    data-payload-subpath={`cards.${index}.title`}
  >
    <BrandIcon className="block h-9 w-9 shrink-0 text-[#1668C4] [&>svg]:h-full [&>svg]:w-full" name={card.icon} />
    <div className="min-w-0">
      <p className="text-[15px] font-bold leading-snug text-[#123A6B]">
        {card.stat && (
          <span className="mr-1.5 align-middle text-3xl font-extrabold text-[#1668C4]">
            {marks(card.stat)}
          </span>
        )}
        {marks(card.title)}
      </p>
      {card.subtitle && (
        <p className="mt-0.5 text-xs leading-tight text-[#6B86A8]">{marks(card.subtitle)}</p>
      )}
    </div>
  </li>
)

export const SolutionSystemBlockComponent: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  cards,
  heading,
  image,
  subheading,
}) => {
  const items = Array.isArray(cards) ? cards : []

  /*
   * The two columns are derived from position rather than stored on each row — the same
   * reason `waysGrid` numbers itself. An editor reorders the array and the layout follows,
   * with no second field to fall out of sync. An odd count leans the extra card left.
   */
  const split = Math.ceil(items.length / 2)
  const left = items.slice(0, split)
  const right = items.slice(split)

  return (
    <section
      className="w-full bg-[#F4F8FF] px-4 py-16 sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      {(heading || subheading) && (
        <header className="mx-auto max-w-4xl text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-heading sm:text-4xl lg:text-5xl"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}
          {subheading && (
            <p
              className="mt-4 text-base font-semibold text-[#1668C4] sm:text-lg"
              data-payload-subpath="subheading"
            >
              {marks(subheading)}
            </p>
          )}
        </header>
      )}

      <div className="mx-auto mt-12 grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Left column. Sits below the diagram on mobile, alongside it from lg up. */}
        {left.length > 0 && (
          <ul className="order-2 space-y-4 lg:order-1">
            {left.map((card, i) => (
              <HighlightCard card={card} index={i} key={card.id ?? i} />
            ))}
          </ul>
        )}

        {/* Centre — diagram. First on mobile. */}
        <div
          className="relative order-1 aspect-square w-full lg:order-2"
          data-payload-subpath="image"
        >
          <ImageSlot
            className="h-full w-full"
            hint="Recommended 1000 × 1000px, transparent PNG"
            label="Inside-out support diagram"
            resource={image}
          />
        </div>

        {right.length > 0 && (
          <ul className="order-3 space-y-4">
            {right.map((card, i) => (
              <HighlightCard card={card} index={split + i} key={card.id ?? i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
