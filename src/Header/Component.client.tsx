'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { MegaMenu } from './MegaMenu'
import { MobileNav } from './MobileNav'
import { HeaderNav, hasMenu } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /*
   * Which nav item's dropdown is showing, held here rather than in `HeaderNav` because the
   * panel is a sibling of the container: it has to span the full width of the bar, which a
   * child of the centred nav cannot do.
   */
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = data?.navItems || []
  const open = openIndex !== null ? navItems[openIndex] : undefined
  const cards = open && hasMenu(open) ? (open.megaMenu ?? []) : []

  // Escape closes whichever is showing, as for any other transient overlay.
  useEffect(() => {
    if (openIndex === null && !mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenIndex(null)
      setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, openIndex])

  // The drawer scrolls on its own; the page behind it should not.
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  return (
    <header className="relative z-20 w-full bg-white" onMouseLeave={() => setOpenIndex(null)}>
      {/* Figma `Header Container` (desktop 2002:31, mobile 6246:2938): 1400px max, 92.5px
          tall, 50px sides on desktop; mobile centres the logo inside 16px sides. */}
      <div className="relative mx-auto flex h-[92.5px] w-full max-w-[1400px] items-center justify-center px-4 md:px-8 lg:justify-between lg:px-[50px]">
        {/* Figma `logo 4`/`logo 5` is a 234 x 66.86 box whose artwork is inset 5% / 1.36% — the
            PNG is that artwork, so it sits at 60.17px tall inside the same box. */}
        <Link
          href="/"
          className="flex h-[66.86px] w-[234px] shrink-0 items-center justify-center"
          onClick={() => setMobileOpen(false)}
        >
          <Logo className="h-[60.17px]" loading="eager" priority="high" />
        </Link>

        <HeaderNav
          className="hidden lg:flex"
          data={data}
          onOpenChange={setOpenIndex}
          openIndex={openIndex}
        />

        <button
          aria-controls="mobile-nav"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-mist md:right-6 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <MegaMenu cards={cards} onClose={() => setOpenIndex(null)} open={cards.length > 0} />
      <MobileNav data={data} onClose={() => setMobileOpen(false)} open={mobileOpen} />
    </header>
  )
}
