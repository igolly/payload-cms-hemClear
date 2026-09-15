'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

type NavItem = NonNullable<HeaderType['navItems']>[number]

/** A nav row only opens a dropdown once it actually has cards to show. */
export const hasMenu = (item: NavItem) => Array.isArray(item.megaMenu) && item.megaMenu.length > 0

/* eslint-disable @next/next/no-img-element */

/** Figma `sign in` (2002:62): 25px user glyph, 5px gap, 6.25px padding. */
export const SignInLink: React.FC<{ className?: string; onClick?: () => void }> = ({
  className,
  onClick,
}) => (
  <Link
    className={cn(
      'flex items-center gap-[5px] p-[6.25px] font-inter text-base font-semibold leading-[normal] text-navy-900 transition-colors hover:text-info-dark',
      className,
    )}
    href="#"
    onClick={onClick}
  >
    <img alt="" className="size-[25px] shrink-0" height={25} src="/icons/header/user.svg" width={25} />
    Sign In
  </Link>
)

/** Figma `action cart` (2002:70): a 43.75 x 36.25 box, 25px cart glyph, 18.75px badge. */
export const CartLink: React.FC<{ className?: string; onClick?: () => void }> = ({
  className,
  onClick,
}) => (
  <Link
    className={cn('relative block h-[36.25px] w-[43.75px] shrink-0', className)}
    href="#"
    onClick={onClick}
  >
    <span className="sr-only">Cart</span>
    <img
      alt=""
      className="absolute left-[9.25px] top-[5.38px] size-[25px]"
      height={25}
      src="/icons/header/cart.svg"
      width={25}
    />
    <span className="absolute left-[25px] top-[1.25px] flex size-[18.75px] items-center justify-center rounded-full bg-info font-inter text-[8.75px] font-semibold leading-[normal] text-white">
      0
    </span>
  </Link>
)

export const HeaderNav: React.FC<{
  className?: string
  data: HeaderType
  onOpenChange: (index: number | null) => void
  openIndex: number | null
}> = ({ className, data, onOpenChange, openIndex }) => {
  const navItems = data?.navItems || []

  return (
    <nav className={cn('flex h-9 items-center gap-5', className)}>
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
             *
             * No chevron: the Figma header shows every item as plain text, dropdown or not.
             */
            onFocus={() => onOpenChange(menu ? i : null)}
            onMouseEnter={() => onOpenChange(menu ? i : null)}
          >
            <CMSLink
              {...item.link}
              appearance="inline"
              aria-expanded={menu ? open : undefined}
              className={cn(
                'link-underline whitespace-nowrap font-inter text-base font-semibold leading-[normal] text-navy-900 transition-colors hover:text-info-dark',
                open && 'text-info-dark',
              )}
            />
          </div>
        )
      })}

      <SignInLink />

      {/* Figma `Line` (2002:69): a 31.25px hairline rule. */}
      <div aria-hidden="true" className="h-[31.25px] w-[0.625px] bg-steel-300" />

      <CartLink />
    </nav>
  )
}
