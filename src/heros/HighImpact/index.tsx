import React from 'react'
import { ArrowRight, Check, User, FlaskConical, Package } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const trustIcons = {
  user: User,
  flask: FlaskConical,
  package: Package,
} as const

const Laurel = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 2C14 6 11 12 11 20s3 14 9 18"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {[4, 11, 18, 25, 32].map((y) => (
      <ellipse
        key={y}
        cx={14 - (y % 14 === 4 ? 1 : 3)}
        cy={y}
        rx="4"
        ry="2.2"
        transform={`rotate(-35 ${14 - (y % 14 === 4 ? 1 : 3)} ${y})`}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    ))}
  </svg>
)

export const HighImpactHero: React.FC<Page['hero']> = ({
  media,
  links,
  badgeTitle,
  badgeDescription,
  calloutText,
  calloutTitle,
  eyebrow,
  heading,
  mediaPosition,
  subheading,
  description,
  benefits,
  trustPoints,
}) => {
  const mediaRight = mediaPosition === 'right'
  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch px-6 lg:grid-cols-[3fr_4fr] lg:gap-10 lg:px-8">
        {/* Left: product image */}
        <div
          className={cn(
            'relative min-h-105 w-full overflow-hidden bg-slate-100',
            mediaRight && 'lg:order-2',
          )}
        >
          {media && typeof media === 'object' && (
            <div className="absolute inset-0" data-payload-subpath="media">
              <Media fill imgClassName="object-cover" priority resource={media} />
            </div>
          )}
        </div>

        {/* Right: content */}
        <div
          className={cn(
            'flex flex-col items-start justify-center py-10 lg:py-14',
            mediaRight && 'lg:order-1',
          )}
        >
          {eyebrow && (
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#0052cc]"
              data-payload-subpath="eyebrow"
            >
              {eyebrow}
            </p>
          )}
          {/* Badge */}
          {(badgeTitle || badgeDescription) && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5">
              {badgeTitle && (
                <>
                  <Laurel className="h-6 w-3.5 shrink-0 text-brand" />
                  <span
                    className="font-serif text-sm font-semibold leading-tight text-brand"
                    data-payload-subpath="badgeTitle"
                  >
                    {badgeTitle.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </span>
                  <Laurel className="h-6 w-3.5 shrink-0 -scale-x-100 text-brand" />
                </>
              )}
              {badgeTitle && badgeDescription && <span className="h-8 w-px bg-slate-200" />}
              {badgeDescription && (
                <span
                  className="max-w-55 text-xs font-medium leading-snug text-slate-700"
                  data-payload-subpath="badgeDescription"
                >
                  {badgeDescription}
                </span>
              )}
            </div>
          )}

          {/* Headline */}
          {heading && (
            <h1
              className="font-serif text-4xl leading-[1.1] text-heading sm:text-5xl"
              data-payload-subpath="heading"
            >
              {heading.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h1>
          )}

          {subheading && (
            <p
              className="mt-3 font-serif text-lg text-brand"
              data-payload-subpath="subheading"
            >
              {subheading}
            </p>
          )}

          {/* Description */}
          {description && (
            <p
              className="mt-5 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-slate-700"
              data-payload-subpath="description"
            >
              {description}
            </p>
          )}

          {/* Benefits checklist */}
          {Array.isArray(benefits) && benefits.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {benefits.map((benefit, i) => (
                <li
                  className="flex items-center gap-3"
                  data-payload-subpath={`benefits.${i}.text`}
                  key={benefit.id ?? i}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] font-medium text-slate-900">{benefit.text}</span>
                </li>
              ))}
            </ul>
          )}

          {(calloutTitle || calloutText) && (
            <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#eef4fd] px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="min-w-0">
                {calloutTitle && (
                  <span className="block text-sm font-bold text-brand">{calloutTitle}</span>
                )}
                {calloutText && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#1a2f7c]">
                    {calloutText}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* CTAs */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map(({ link }, i) => {
                const isOutline = link.appearance === 'outline'
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className={
                      isOutline
                        ? 'inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-brand py-1.5 pl-6 pr-1.5 text-sm font-semibold text-brand transition-colors hover:bg-slate-50'
                        : 'inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'
                    }
                  >
                    <span
                      className={
                        isOutline
                          ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand text-brand'
                          : 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand'
                      }
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CMSLink>
                )
              })}
            </div>
          )}

          {/* Trust points */}
          {Array.isArray(trustPoints) && trustPoints.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              {trustPoints.map((point, i) => {
                const Icon = trustIcons[point.icon]
                return (
                  <div
                    className="flex items-center gap-4 sm:gap-6"
                    data-payload-subpath={`trustPoints.${i}.label`}
                    key={point.id ?? i}
                  >
                    {i !== 0 && <span className="h-8 w-px bg-slate-200" />}
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-slate-900" strokeWidth={1.5} />
                      <span className="text-sm font-semibold text-slate-900">{point.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
