import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { BrandIcon, SocialIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { marks } from '@/utilities/marks'

export async function Footer() {
  const footer = await getCachedGlobal('footer', 2)()

  const columns = footer?.columns || []
  const promiseItems = footer?.promiseItems || []
  const socialItems = footer?.socialItems || []
  const legalLinks = footer?.legalLinks || []

  const headingClass = 'text-xs font-bold uppercase tracking-wider text-[#9cf0ff]'

  return (
    <footer className="mt-auto bg-[#01193c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Link columns */}
          {columns.map((column, i) => (
            <div key={column.id ?? i}>
              <h2 className={headingClass}>{marks(column.title)}</h2>
              <ul className="mt-4 space-y-2.5">
                {(column.items || []).map((item, j) => (
                  <li key={item.id ?? j}>
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className="flex items-center justify-between gap-4 font-inter text-sm text-white/90 transition-colors hover:text-white"
                    >
                      <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-white/50" />
                    </CMSLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Our promise */}
          {promiseItems.length > 0 && (
            <div>
              <h2 className={headingClass}>{footer?.promiseTitle || 'Our Promise'}</h2>
              <ul className="mt-4 space-y-3">
                {promiseItems.map((item, i) => (
                  <li className="flex items-center gap-3" key={item.id ?? i}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 text-white [&>span>svg]:h-4 [&>span>svg]:w-4">
                      <BrandIcon name={item.icon} />
                    </span>
                    <span className="text-sm text-white/90">{marks(item.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social */}
          {socialItems.length > 0 && (
            <div>
              <h2 className={headingClass}>{footer?.socialTitle || 'Social Links'}</h2>
              <ul className="mt-4 space-y-3">
                {socialItems.map((item, i) => (
                  <li key={item.id ?? i}>
                    <a
                      className="flex items-center gap-3 font-inter text-sm text-white/90 transition-colors hover:text-white"
                      href={item.url || '#'}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon className="[&>svg]:h-5 [&>svg]:w-5" name={item.platform} />
                      {marks(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <hr className="my-10 border-white/20" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Logo, tagline, copyright */}
          <div className="text-center lg:text-left">
            <Link className="inline-flex items-center" href="/">
              <Logo className="brightness-0 invert" />
            </Link>

            {footer?.tagline && (
              <p className="mt-4 whitespace-pre-line text-xl leading-snug text-white">
                {marks(footer.tagline)}
              </p>
            )}

            {footer?.copyright && (
              <p className="mt-6 text-xs text-white/70">{marks(footer.copyright)}</p>
            )}
          </div>

          {/* Legal links + disclaimer */}
          <div>
            {legalLinks.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-inter text-sm text-white/90">
                {legalLinks.map((item, i) => (
                  <li className="flex items-center gap-3" key={item.id ?? i}>
                    {i > 0 && <span aria-hidden="true" className="text-white/30">|</span>}
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className="transition-colors hover:text-white"
                    />
                  </li>
                ))}
              </ul>
            )}

            {footer?.disclaimer && (
              <div className="mt-5 space-y-2 text-xs leading-relaxed text-white/70">
                {footer.disclaimer.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{marks(paragraph)}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
