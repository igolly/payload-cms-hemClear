'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ChevronDown, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/utilities/ui'

type NavItem = NonNullable<HeaderType['navItems']>[number]

/** A nav row only opens a dropdown once it actually has cards to show. */
export const hasMenu = (item: NavItem) => Array.isArray(item.megaMenu) && item.megaMenu.length > 0

export const HeaderNav: React.FC<{
  className?: string
  data: HeaderType
  onOpenChange: (index: number | null) => void
  openIndex: number | null
}> = ({ className, data, onOpenChange, openIndex }) => {
  const navItems = data?.navItems || []

  return (
    <nav className={cn('flex items-center gap-6 md:gap-8', className)}>
      {navItems.map((item, i) => {
        const menu = hasMenu(item)
        const open = menu && openIndex === i

        return (
          <div
            className="flex items-center"
            key={i}
            /*
             * Hover opens it, and focus does too so it is reachable from the keyboard.
             * Closing is handled by the header as a whole rather than here — leaving this
             * item to enter the panel below it would otherwise close the panel underneath
             * the pointer.
             */
            onFocus={() => onOpenChange(menu ? i : null)}
            onMouseEnter={() => onOpenChange(menu ? i : null)}
          >
            <CMSLink
              {...item.link}
              appearance="link"
              aria-expanded={menu ? open : undefined}
              className={cn(
                /* `no-underline` kills the button `link` variant's own `hover:underline`,
                   which otherwise drew a second, tighter rule under this one. */
                'link-underline font-inter text-sm font-bold text-navy no-underline transition-colors hover:text-info-dark hover:no-underline',
                open && 'text-info-dark',
              )}
            />
            {menu && (
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'ml-1 size-4 shrink-0 text-navy transition-transform duration-200',
                  open && 'rotate-180 text-info-dark',
                )}
              />
            )}
          </div>
        )
      })}

      <Link
        href="#"
        className="link-underline flex items-center gap-1.5 font-inter text-sm font-bold text-navy transition-colors hover:text-info-dark"
      >
        <User className="size-5" />
        Sign In
      </Link>

      <div className="h-6 w-px bg-border" />

      <Link
        href="#"
        className="relative flex items-center text-navy transition-colors hover:text-info-dark"
      >
        <span className="sr-only">Cart</span>
        <ShoppingCart className="size-5" />
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-info text-[10px] font-bold text-white">
          0
        </span>
      </Link>
    </nav>
  )
}
