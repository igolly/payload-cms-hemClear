'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ShoppingCart, User } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'
import { hasMenu } from '../Nav'

type NavItem = NonNullable<HeaderType['navItems']>[number]

/**
 * The small-screen nav.
 *
 * The desktop dropdown is hover-driven, which a touch screen has no equivalent for, so here
 * the same `megaMenu` cards are an accordion the visitor taps open instead. Everything is
 * driven by the same Header global — there is no second set of links to maintain.
 */
const MobileItem: React.FC<{ item: NavItem; onNavigate: () => void }> = ({ item, onNavigate }) => {
  const [open, setOpen] = useState(false)
  const cards = item.megaMenu ?? []

  if (!hasMenu(item)) {
    return (
      <li className="border-b border-border">
        <CMSLink
          {...item.link}
          appearance="inline"
          className="block py-4 font-inter text-base font-bold text-[#182F7C]"
          onClick={onNavigate}
        />
      </li>
    )
  }

  return (
    <li className="border-b border-border">
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-inter text-base font-bold text-[#182F7C]"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {marks(item.link?.label)}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-5 shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Grid-rows trick: animates to the content's natural height without measuring it. */}
      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <ul className="overflow-hidden">
          {cards.map((card, i) => (
            <li key={card.id ?? i} className="pb-3 first:pt-1">
              <CMSLink
                {...card.link}
                appearance="inline"
                className="flex items-center gap-3 rounded-xl bg-[#F4F8FF] p-3"
                label={null}
                onClick={onNavigate}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-base leading-tight text-heading">
                    {marks(card.title)}
                  </span>
                  {card.description && (
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                      {marks(card.description)}
                    </span>
                  )}
                </span>
                {card.image && typeof card.image === 'object' && (
                  <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    {/* `htmlElement={null}` so `Media` emits its `<picture>` bare — its
                        default `<div>` wrapper is not valid inside a span. */}
                    <Media
                      htmlElement={null}
                      imgClassName="h-14 w-14 object-cover"
                      resource={card.image}
                    />
                  </span>
                )}
              </CMSLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const MobileNav: React.FC<{
  data: HeaderType
  onClose: () => void
  open: boolean
}> = ({ data, onClose, open }) => (
  <div
    className={cn(
      'absolute inset-x-0 top-full z-30 origin-top border-b border-border bg-white shadow-[0_18px_40px_rgba(16,60,120,0.10)] lg:hidden',
      'transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
      open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
    )}
    id="mobile-nav"
  >
    <div className="container max-h-[calc(100dvh-8rem)] overflow-y-auto py-2">
      <ul>
        {(data?.navItems ?? []).map((item, i) => (
          <MobileItem item={item} key={i} onNavigate={onClose} />
        ))}
      </ul>

      <div className="flex items-center justify-between py-5">
        <Link
          className="flex items-center gap-2 font-inter text-base font-bold text-[#182F7C]"
          href="#"
          onClick={onClose}
        >
          <User className="size-5" />
          Sign In
        </Link>

        <Link className="relative flex items-center text-[#182F7C]" href="#" onClick={onClose}>
          <span className="sr-only">Cart</span>
          <ShoppingCart className="size-6" />
          <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#006DB0] text-[10px] font-bold text-white">
            0
          </span>
        </Link>
      </div>
    </div>
  </div>
)
