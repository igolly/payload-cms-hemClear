'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Puts the window at the very top after a link opens another page.
 *
 * `<Link>` keeps the scroll position when any of the new page shows in the viewport, and
 * otherwise scrolls only as far as the page's own content, which starts below the header.
 * Both leave a CTA landing partway down the product page instead of on its hero.
 *
 * Back and forward are left alone, so the browser can restore where the reader was, and so
 * is a URL with a hash, whose target is the point of the link.
 */
export const ScrollToTop: React.FC = () => {
  const pathname = usePathname()
  const isFirst = useRef(true)
  const fromHistory = useRef(false)

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (fromHistory.current) {
      fromHistory.current = false
      return
    }
    if (window.location.hash) return
    // `instant`, not the stylesheet's smooth: a page change should not play out as a glide.
    window.scrollTo({ behavior: 'instant', left: 0, top: 0 })
  }, [pathname])

  return null
}
