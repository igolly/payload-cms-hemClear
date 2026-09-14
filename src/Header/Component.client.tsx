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
    <header
      className="relative z-20 w-full border-b border-border bg-white"
      onMouseLeave={() => setOpenIndex(null)}
    >
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
          <Logo loading="eager" priority="high" />
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
          className="-mr-2 flex size-10 items-center justify-center rounded-lg text-navy transition-colors hover:bg-mist lg:hidden"
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
