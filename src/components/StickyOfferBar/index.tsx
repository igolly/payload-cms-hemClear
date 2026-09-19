'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

/**
 * The offer strip that slides down once the reader has scrolled past the header.
 *
 * It began as the top half of the product page's `StickyBars` and now runs on every page
 * from the Header global, so the offer follows the reader wherever they are. The product
 * page keeps the other half — the buy strip along the bottom, which needs the block's own
 * plans and gallery and means nothing anywhere else.
 *
 * A zero-height sentinel at the top of the page decides when it appears: once that has left
 * the viewport the site header is behind the reader, which is the moment the bar earns its
 * space — cheaper and steadier than measuring scroll position on every frame.
 */
export const StickyOfferBar: React.FC<{
  ctaLabel?: null | string
  ctaUrl?: null | string
  note?: null | string
  text?: null | string
}> = ({ ctaLabel, ctaUrl, note, text }) => {
  const sentinel = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = sentinel.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!text && !note && !ctaLabel) return null

  return (
    <>
      <div aria-hidden="true" ref={sentinel} />

      <div
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-navy text-white',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          shown ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        {/*
         * One slim strip at every width. The logo is the full site mark, 212x56 — left at
         * that size it takes a third of a 900px bar, squeezes the offer into a 244px
         * column and wraps it onto a second line, so the bar grows and the message stops
         * reading. Held to 32px it keeps its place and the offer keeps the room.
         */}
        <div className="container flex items-center justify-between gap-4 py-2.5">
          <span className="hidden shrink-0 brightness-0 invert lg:block [&_img]:h-8 [&_img]:w-auto">
            <Logo />
          </span>

          <p className="min-w-0 flex-1 text-center text-xs font-semibold text-balance sm:text-sm">
            {text && <span className="text-amber">{marks(text)}</span>}
            {/* The note is the quieter half and the first to go: the two together run to
                about 70 characters, which needs ~500px to stay on one line. Below `lg`
                there is no such room once the logo and button have theirs, and the strip
                would take a second line for copy nobody reads twice. */}
            {text && note && (
              <span aria-hidden="true" className="mx-2 hidden text-white/40 lg:inline">
                |
              </span>
            )}
            {note && (
              <span className="hidden font-normal text-white/90 lg:inline">{marks(note)}</span>
            )}
          </p>

          {ctaLabel && (
            <a
              className="cta-gleam [--cta-gleam-color:color-mix(in_oklab,currentcolor_10%,transparent)] hidden shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-heading transition-colors hover:bg-white/90 sm:inline-flex"
              href={ctaUrl || '#'}
            >
              {marks(ctaLabel)}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </>
  )
}
