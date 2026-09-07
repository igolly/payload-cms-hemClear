import React from 'react'
import { ArrowRight, Check } from 'lucide-react'

import type { FeatureStripBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const FeatureStripBlock: React.FC<Props> = ({
  align,
  background,
  eyebrow,
  footnote,
  heading,
  items,
  links,
  subheading,
  variant,
}) => {
  const strip = Array.isArray(items) ? items : []
  const centred = align !== 'left'
  const style = variant ?? 'divided'

  const listClass = {
    cards: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6',
    checklist: 'grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3',
    divided: 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-center',
    pills: 'flex flex-wrap items-stretch justify-center gap-3',
  }[style]

  return (
    <section
      className={cn(
        'w-full px-4 py-12 sm:px-6 lg:px-8',
        background === 'light' ? 'bg-[#f2f6fd]' : 'bg-white',
      )}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || heading || subheading) && (
          <header className="text-center">
            {eyebrow && (
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
                data-payload-subpath="eyebrow"
              >
                {eyebrow}
              </p>
            )}

            {heading && (
              <h2
                className="mt-3 font-serif text-3xl leading-tight text-heading sm:text-4xl"
                data-payload-subpath="heading"
              >
                {heading.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h2>
            )}

            {subheading && (
              <p
                className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-sm text-[#1a2f7c]"
                data-payload-subpath="subheading"
              >
                {subheading}
              </p>
            )}
          </header>
        )}

        {strip.length > 0 && (
          <ul className={cn(listClass, (eyebrow || heading || subheading) && 'mt-10')}>
            {strip.map((item, i) => {
              const key = item.id ?? i

              if (style === 'pills') {
                return (
                  <li
                    className="flex items-center gap-2 rounded-lg border border-[#dbe8fa] bg-white px-4 py-3"
                    data-payload-subpath={`items.${i}.title`}
                    key={key}
                  >
                    <BrandIcon
                      className="shrink-0 text-[#1668C4] [&>svg]:h-6 [&>svg]:w-6"
                      name={item.icon}
                    />
                    <span className="text-xs font-semibold text-[#0052cc]">{item.title}</span>
                  </li>
                )
              }

              if (style === 'checklist') {
                return (
                  <li
                    className="flex items-center gap-2"
                    data-payload-subpath={`items.${i}.title`}
                    key={key}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1668C4]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-brand">{item.title}</span>
                  </li>
                )
              }

              return (
                <li
                  className={cn(
                    style === 'cards'
                      ? 'flex flex-col items-center rounded-xl border border-[#dbe8fa] bg-white px-3 py-5 text-center'
                      : cn(
                          'px-5 lg:flex-1 lg:border-l lg:border-[#dbe8fa] lg:first:border-l-0',
                          centred ? 'flex flex-col items-center text-center' : 'flex gap-3',
                        ),
                  )}
                  data-payload-subpath={`items.${i}.title`}
                  key={key}
                >
                  <BrandIcon
                    className="shrink-0 text-[#1668C4] [&>svg]:h-9 [&>svg]:w-9"
                    name={item.icon}
                  />

                  <div className={cn('min-w-0', (centred || style === 'cards') && 'mt-3')}>
                    <h3 className="text-xs font-bold uppercase tracking-wide leading-tight text-heading">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="mt-2 text-xs leading-relaxed text-slate-600"
                        data-payload-subpath={`items.${i}.description`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {links.map(({ link }, i) => (
              <CMSLink
                {...link}
                appearance="inline"
                className={
                  link.appearance === 'outline'
                    ? 'inline-flex items-center gap-3 rounded-full border border-brand py-3 pl-8 pr-4 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:bg-slate-50'
                    : 'inline-flex items-center gap-3 rounded-full bg-[#1a7f37] py-3 pl-8 pr-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#166b2e]'
                }
                key={i}
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </CMSLink>
            ))}
          </div>
        )}

        {footnote &&
          (style === 'checklist' ? (
            <p
              className="mx-auto mt-8 max-w-md rounded-lg bg-[#dfeafb] px-5 py-4 text-center text-sm leading-relaxed text-brand"
              data-payload-subpath="footnote"
            >
              {footnote}
            </p>
          ) : (
            <p
              className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-center text-[13px] leading-relaxed text-[#0052cc]"
              data-payload-subpath="footnote"
            >
              {footnote}
            </p>
          ))}
      </div>
    </section>
  )
}
