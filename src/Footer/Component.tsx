import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { BrandIcon, SocialIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { marks } from '@/utilities/marks'

/*
 * Laid out against `public/FOOTER.png`. The values that look arbitrary were measured off
 * that file (it is a 1920px-wide comp):
 *
 * - the rule spans a 1400px container, and the content sits in a narrower band centred
 *   inside it, which is why there are two widths rather than one;
 * - the five columns are not equal — `grid-cols-[251fr_218fr_254fr_282fr_95fr]` is the
 *   ratio measured between the headings, with Our Promise widest and Shop narrowest;
 * - each link list is `w-fit`, so its chevrons right-align against the column's longest
 *   label rather than against the column edge. That is what the comp does, and it is why
 *   the chevrons sit at a different x in every column.
 */

export async function Footer() {
  const footer = await getCachedGlobal('footer', 2)()

  const columns = footer?.columns || []
  const promiseItems = footer?.promiseItems || []
  const socialItems = footer?.socialItems || []
  const legalLinks = footer?.legalLinks || []

  const headingClass = 'text-xs font-bold uppercase tracking-wider text-[#9cf0ff]'

  return (
    <footer className="mt-auto bg-[#01193d] text-white">
      {/* 1464 = the comp's 1400px rule plus this container's own lg padding, so the
          rule measures 1400 rather than 1400-minus-padding. */}
      <div className="mx-auto max-w-[1464px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[251fr_218fr_254fr_282fr_95fr] lg:gap-x-0">
            {/* Link columns */}
            {columns.map((column, i) => (
              <div key={column.id ?? i}>
                <h2 className={headingClass}>{marks(column.title)}</h2>
                <ul className="mt-4 w-fit space-y-2">
                  {(column.items || []).map((item, j) => (
                    <li key={item.id ?? j}>
                      <CMSLink
                        {...item.link}
                        appearance="inline"
                        className="flex items-center justify-between gap-6 font-inter text-[13px] text-white/90 transition-colors hover:text-white lg:whitespace-nowrap"
                      >
                        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/50" />
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
                <ul className="mt-4 space-y-2.5">
                  {promiseItems.map((item, i) => (
                    <li className="flex items-center gap-3" key={item.id ?? i}>
                      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-white/30 text-white [&>span>svg]:h-3.5 [&>span>svg]:w-3.5">
                        <BrandIcon name={item.icon} />
                      </span>
                      <span className="text-[13px] text-white/90 lg:whitespace-nowrap">
                        {marks(item.label)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social */}
            {socialItems.length > 0 && (
              <div>
                <h2 className={headingClass}>{footer?.socialTitle || 'Social Links'}</h2>
                <ul className="mt-4 space-y-2.5">
                  {socialItems.map((item, i) => (
                    <li key={item.id ?? i}>
                      <a
                        className="flex items-center gap-3 font-inter text-[13px] text-white/90 transition-colors hover:text-white"
                        href={item.url || '#'}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <SocialIcon className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]" name={item.platform} />
                        {marks(item.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <hr className="my-10 border-0 border-t border-white/60" />

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,453fr)_minmax(0,647fr)] lg:gap-x-0">
          {/* Logo, tagline, copyright — centred as a block, per the comp. */}
          <div className="text-center">
            <Link className="inline-flex items-center" href="/">
              <Logo className="h-auto w-[242px] brightness-0 invert" />
            </Link>

            {footer?.tagline && (
              <p className="mt-4 whitespace-pre-line text-[26px] leading-[1.15] text-white">
                {marks(footer.tagline)}
              </p>
            )}

            {footer?.copyright && (
              <p className="mt-12 text-[13px] text-white/70">{marks(footer.copyright)}</p>
            )}
          </div>

          {/* Legal links + disclaimer */}
          <div>
            {legalLinks.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-inter text-[13px] text-white/90">
                {legalLinks.map((item, i) => (
                  <li className="flex items-center gap-3" key={item.id ?? i}>
                    {i > 0 && (
                      <span aria-hidden="true" className="text-white/30">
                        |
                      </span>
                    )}
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
              // The comp runs the paragraphs together — no gap beyond the line height.
              <div className="mt-5 text-[13px] leading-[1.45] text-white/70">
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
