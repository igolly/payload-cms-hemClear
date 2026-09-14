'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { marks } from '@/utilities/marks'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type Card = NonNullable<NavItem['megaMenu']>[number]

/**
 * The product list that drops out of a nav item on hover.
 *
 * Rendered as a sibling of the header's container rather than inside the nav, so it can
 * span the full width of the bar while still being positioned against it.
 */
export const MegaMenu: React.FC<{ cards: Card[]; onClose: () => void; open: boolean }> = ({
  cards,
  onClose,
  open,
}) => (
  <div
    /*
     * Kept mounted and hidden rather than unmounted, so the panel can transition in and
     * out. `invisible` (not `hidden`) keeps it out of the a11y tree and out of the way of
     * the pointer while closed, without costing the animation.
     */
    className={[
      'absolute inset-x-0 top-full z-30 origin-top border-b border-border bg-white shadow-[0_18px_40px_rgba(16,60,120,0.10)]',
      'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
      open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
    ].join(' ')}
    onMouseLeave={onClose}
  >
    <div className="container py-8">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card, i) => (
          <li key={card.id ?? i}>
            {/*
             * `label` is deliberately dropped from the spread: `CMSLink` renders it as its
             * own node ahead of `children`, which put the link text in the card as a stray
             * first column. The card's own title is the accessible name.
             */}
            <CMSLink
              {...card.link}
              appearance="inline"
              className="group flex h-full items-center gap-4 rounded-2xl bg-mist p-4 transition-colors hover:bg-tint-50"
              label={null}
              onClick={onClose}
            >
              <span className="min-w-0 flex-1">
                {card.eyebrow && (
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-info-dark">
                    {marks(card.eyebrow)}
                  </span>
                )}
                <span className="mt-0.5 block font-serif text-lg leading-tight text-heading">
                  {marks(card.title)}
                </span>
                {card.description && (
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {marks(card.description)}
                  </span>
                )}
              </span>

              {card.image && typeof card.image === 'object' && (
                <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its
                      default `<div>` wrapper is not valid inside a span. */}
                  <Media
                    htmlElement={null}
                    imgClassName="h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
                    resource={card.image}
                  />
                </span>
              )}
            </CMSLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
