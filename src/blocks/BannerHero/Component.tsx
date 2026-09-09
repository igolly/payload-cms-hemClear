import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { BannerHeroBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks, multiline } from '@/utilities/marks'

export const BannerHeroBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  backgroundImage,
  description,
  eyebrow,
  heading,
  height,
  links,
  overlay,
}) => {
  const hasImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-[#0d2050]',
        height === 'short' ? 'min-h-72' : 'min-h-[26rem]',
      )}
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      {hasImage ? (
        <Media
          className="absolute inset-0"
          fill
          // imgClassName="object-cover"
          priority
          resource={backgroundImage}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#0d2050_0%,#123a8a_60%,#1b57c4_100%)]" />
      )}

      {overlay !== 'none' && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0',
            overlay === 'even'
              ? 'bg-[#0d2050]/55'
              : 'bg-[linear-gradient(90deg,rgba(13,32,80,0.92)_0%,rgba(13,32,80,0.75)_45%,rgba(13,32,80,0.15)_100%)]',
          )}
        />
      )}

      <div
        className={cn(
          'relative mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8',
          height === 'short' ? 'min-h-72 py-12' : 'min-h-[26rem] py-16',
        )}
      >
        <div className="max-w-xl">
          {eyebrow && (
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#7fb2ff]"
              data-payload-subpath="eyebrow"
            >
              {marks(eyebrow)}
            </p>
          )}

          {heading && (
            <h2
              className="hero-heading mt-4 text-white"
              data-payload-subpath="heading"
            >
              {multiline(heading)}
            </h2>
          )}

          <span aria-hidden="true" className="mt-6 block h-0.5 w-16 bg-[#7fb2ff]" />

          {description && (
            <p
              className="mt-5 max-w-md whitespace-pre-line text-sm leading-relaxed text-white/85"
              data-payload-subpath="description"
            >
              {marks(description)}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {links.map(({ link }, i) => (
                <CMSLink
                  {...link}
                  appearance="inline"
                  className="inline-flex items-center gap-3 rounded-full bg-[#1b57c4] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1746a0]"
                  key={i}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CMSLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
