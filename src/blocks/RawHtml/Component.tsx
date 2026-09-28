import React from 'react'

import type { RawHtmlBlock as Props } from '@/payload-types'

import { backgroundStyle } from '@/fields/background'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

/**
 * Renders the block's markup as written.
 *
 * `dangerouslySetInnerHTML` is the whole purpose here rather than an oversight: the field
 * holds finished HTML — a policy, a set of terms — and anything that parsed and re-emitted
 * it would quietly drop the parts it did not recognise. See the block's config for who is
 * trusted to fill it in, which is the question this raises.
 *
 * The `prose` wrapper is what saves an editor from writing classes: headings, lists, tables
 * and links inherit the site's type rather than the browser's defaults. It is dropped on the
 * full-width setting, where the markup is expected to carry its own layout.
 */
export const RawHtmlBlock: React.FC<Props> = ({ bgColor, bgColorCustom, heading, html, width }) => {
  if (!html?.trim()) return null

  const reading = width !== 'wide'

  return (
    <section
      className="w-full bg-white px-4 py-10 font-inter sm:px-6 lg:px-8"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className={cn('mx-auto', reading ? 'max-w-[768px]' : 'max-w-[1400px]')}>
        {heading && (
          <h2
            className="mb-6 font-marcellus text-[34px] leading-[1.2] text-heading sm:text-[46px]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        <div
          className={cn(
            'text-navy [&_a]:text-brand-500 [&_a]:underline [&_sup]:leading-[0]',
            reading && 'prose prose-headings:font-marcellus prose-headings:text-heading max-w-none',
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}
