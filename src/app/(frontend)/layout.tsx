import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Fraunces, Gentium_Book_Plus, Inter, Marcellus, Playfair_Display } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Body copy font. Exposed as a CSS variable so `globals.css` can hand it to every
// paragraph, and so the `font-inter` utility is available for one-off elements.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-sans',
})

// Display face for the home page hero headline. Marcellus ships a single 400 weight,
// so the weight has to be named explicitly — it is not a variable font.
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-marcellus-display',
})

// Serif display face: section subheads (400 italic), card titles (500/600), product names (700).
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
})

// Hero "Doctor's Choice" badge title. Variable font, so the weight range is loaded as one file.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces-display',
})

// The figures on the product page's customer report. The comp names Gentium Book Basic,
// which Google Fonts retired in favour of Gentium Book Plus — the same SIL typeface under
// its current name. Only the bold is used, so only the bold is loaded.
const gentium = Gentium_Book_Plus({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-gentium-book',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        inter.variable,
        marcellus.variable,
        playfair.variable,
        fraunces.variable,
        gentium.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
