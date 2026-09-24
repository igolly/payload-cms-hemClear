import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { BrandIcon, SocialIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { marks } from '@/utilities/marks'

/* eslint-disable @next/next/no-img-element */

/*
 * Figma `FOOTER` — desktop 2002:22 (1920 frame, 1400 container), mobile 6246:3893 (440).
 *
 * - `footer menus`: a wrapping row, 62.5px gaps, 31.25px vertical padding, 0.625px white
 *   rule under it. Desktop centres the row; mobile left-aligns it, so Support + Shop and
 *   Our Promise + Social share a row at 440. The column gap shrinks below 440 (clamp) so
 *   those pairs still share a row at 390.
 * - Every link list hugs its longest label: the chevrons line up at that label's width
 *   plus 18.75px, which is why they sit at a different x in each column.
 * - `footer bottom`: logo/tagline/copyright (346 x 195.75, copyright pinned to the bottom)
 *   beside a 592px legal column on desktop; stacked and centred on mobile.
 */

/** Figma exports (public/icons/footer), keyed by the Footer global's icon select values. */
const promiseIcons: Record<string, string> = {
  stethoscope: '/icons/footer/promise-doctor.svg',
  madeInUsa: '/icons/footer/promise-usa.svg',
  gmp: '/icons/footer/promise-gmp.svg',
  packageBox: '/icons/footer/promise-package.svg',
  guarantee: '/icons/footer/promise-guarantee.svg',
}

const socialIcons: Record<string, string> = {
  facebook: '/icons/footer/social-facebook.svg',
  instagram: '/icons/footer/social-instagram.svg',
  youtube: '/icons/footer/social-youtube.svg',
  tiktok: '/icons/footer/social-tiktok.svg',
}

/** The comp's Kosugi ">" (6 x 12, aqua), drawn so no extra font is needed. */
const Chevron = () => (
  <svg
    aria-hidden="true"
    className="h-3 w-1.5 shrink-0 text-aqua-200"
    fill="none"
    viewBox="0 0 6 12"
  >
    <path d="M1 3l4 3.25L1 9.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
  </svg>
)

/**
 * Blank-line-separated copy as paragraphs.
 *
 * Total in the same way `marks` and `multiline` are: editing the footer on the Puck canvas
 * hands this an element rather than a string, and an element has no paragraphs to split —
 * it is returned untouched instead of throwing.
 */
const paragraphs = (value: React.ReactNode): React.ReactNode => {
  if (typeof value !== 'string') return value

  return value
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, i) => <p key={i}>{marks(paragraph)}</p>)
}

const headingClass = 'text-sm font-bold uppercase leading-[normal] text-aqua-200'
const itemText = 'text-xs font-medium leading-3 text-white'

/**
 * The footer, rendered from data it is handed rather than data it fetches.
 *
 * `Component.tsx` reads the global and hands it over; the Puck canvas hands over the props
 * an editor is currently typing into. Keeping the markup here is what lets the same footer
 * appear in both places without the editor needing a second implementation to drift from.
 */
export const FooterView: React.FC<{ data: FooterType }> = ({ data: footer }) => {
  const columns = footer?.columns || []
  const promiseItems = footer?.promiseItems || []
  const socialItems = footer?.socialItems || []
  const legalLinks = footer?.legalLinks || []

  return (
    <footer className="mt-auto bg-navy-950 font-inter text-white [&_sup]:leading-[0]">
      <div className="mx-auto flex max-w-[1432px] flex-col gap-[12.5px] px-4 lg:py-[6.25px]">
        <div className="flex flex-wrap items-start gap-x-[clamp(12px,calc(100vw-377.5px),62.5px)] gap-y-[62.5px] border-b-[0.625px] border-white py-[31.25px] lg:justify-center">
          {/* Link columns */}
          {columns.map((column, i) => (
            <div className="flex flex-col gap-[9.375px]" key={column.id ?? i}>
              <h2 className={headingClass}>{marks(column.title)}</h2>
              <ul className="flex w-fit flex-col gap-[9.375px]">
                {(column.items || []).map((item, j) => (
                  <li key={item.id ?? j}>
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className={`flex items-center justify-between gap-[18.75px] whitespace-nowrap transition-opacity hover:opacity-80 ${itemText}`}
                    >
                      <Chevron />
                    </CMSLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Our promise */}
          {promiseItems.length > 0 && (
            <div className="flex flex-col gap-[9.375px]">
              <h2 className={headingClass}>{footer?.promiseTitle || 'Our Promise'}</h2>
              <ul className="flex flex-col gap-[9.375px]">
                {promiseItems.map((item, i) => (
                  <li className="flex items-center gap-[12.5px]" key={item.id ?? i}>
                    {promiseIcons[item.icon] ? (
                      <img
                        alt=""
                        className="size-[25px] shrink-0"
                        height={25}
                        decoding="async"
                        loading="lazy"
                        src={promiseIcons[item.icon]}
                        width={25}
                      />
                    ) : (
                      <span className="flex size-[25px] shrink-0 items-center justify-center rounded-full border border-white/60 [&>span>svg]:size-3.5">
                        <BrandIcon name={item.icon} />
                      </span>
                    )}
                    <span className={`whitespace-nowrap ${itemText}`}>{marks(item.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social */}
          {socialItems.length > 0 && (
            <div className="flex flex-col gap-[9.375px]">
              <h2 className={headingClass}>{footer?.socialTitle || 'Social Links'}</h2>
              <ul className="flex flex-col gap-[9.375px]">
                {socialItems.map((item, i) => (
                  <li key={item.id ?? i}>
                    <a
                      className={`flex items-center gap-[6.25px] whitespace-nowrap transition-opacity hover:opacity-80 ${itemText}`}
                      href={item.url || '#'}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {socialIcons[item.platform] ? (
                        <span className="flex size-[15px] shrink-0 items-center justify-center">
                          <img
                            alt=""
                            className="max-h-[15px] max-w-[15px]"
                            decoding="async"
                            loading="lazy"
                            src={socialIcons[item.platform]}
                          />
                        </span>
                      ) : (
                        <SocialIcon className="shrink-0 [&>svg]:size-[15px]" name={item.platform} />
                      )}
                      {marks(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-[31.25px] py-[31.25px] lg:flex-row lg:items-stretch lg:justify-center">
          {/* Logo, tagline, copyright — copyright pinned to the column's foot. */}
          <div className="flex min-h-[195.75px] w-[346px] max-w-full flex-col items-center justify-between">
            <div className="flex flex-col items-center gap-[6.25px]">
              <Link
                aria-label="HemClear home"
                className="flex h-[71.43px] w-[250px] items-center justify-center"
                href="/"
              >
                <Logo className="h-[64.29px] brightness-0 invert" />
              </Link>

              {footer?.tagline && (
                <p className="whitespace-pre-line text-center text-2xl font-medium leading-[normal] text-white">
                  {marks(footer.tagline)}
                </p>
              )}
            </div>

            {footer?.copyright && (
              <p className="text-xs font-medium leading-[normal] text-white">
                {marks(footer.copyright)}
              </p>
            )}
          </div>

          {/* Legal links + disclaimer */}
          <div className="flex w-full flex-col gap-[18.75px] lg:w-[592px]">
            {legalLinks.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-y-2 lg:justify-start">
                {legalLinks.map((item, i) => (
                  <li
                    className={i > 0 ? 'border-l border-white px-2.5' : 'px-2.5'}
                    key={item.id ?? i}
                  >
                    <CMSLink
                      {...item.link}
                      appearance="inline"
                      className={`block whitespace-nowrap transition-opacity hover:opacity-80 ${itemText}`}
                    />
                  </li>
                ))}
              </ul>
            )}

            {footer?.disclaimer && (
              // The comp runs the paragraphs together — no gap beyond the line height.
              <div className="text-xs font-medium leading-[15px] text-white">
                {paragraphs(footer.disclaimer)}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
