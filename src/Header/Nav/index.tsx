'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-6 md:gap-8">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="font-inter text-sm font-bold text-[#182F7C] hover:text-[#0057A0]"
          />
        )
      })}

      <Link
        href="#"
        className="hidden items-center gap-1.5 font-inter text-sm font-bold text-[#182F7C] hover:text-[#0057A0] sm:flex"
      >
        <User className="size-5" />
        Sign In
      </Link>

      <div className="hidden h-6 w-px bg-border sm:block" />

      <Link href="#" className="relative flex items-center text-[#182F7C] hover:text-[#0057A0]">
        <span className="sr-only">Cart</span>
        <ShoppingCart className="size-5" />
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#006DB0] text-[10px] font-bold text-white">
          0
        </span>
      </Link>
    </nav>
  )
}
