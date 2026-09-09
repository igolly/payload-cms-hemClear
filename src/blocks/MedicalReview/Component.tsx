import React from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

import type { MedicalReviewBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { Media } from '@/components/Media'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

const Laurel: React.FC<{ className?: string }> = ({ className }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 40">
    <path d="M20 2C14 6 11 12 11 20s3 14 9 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    {[4, 11, 18, 25, 32].map((y) => (
      <ellipse
        cx={14 - (y % 14 === 4 ? 1 : 3)}
        cy={y}
        key={y}
        rx="4"
        ry="2.2"
        stroke="currentColor"
        strokeWidth="1.2"
        transform={`rotate(-35 ${14 - (y % 14 === 4 ? 1 : 3)} ${y})`}
      />
    ))}
  </svg>
)

export const MedicalReviewBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  doctors,
  eyebrow,
  heading,
  highlights,
}) => {
  const points = Array.isArray(highlights) ? highlights : []
  const reviewers = Array.isArray(doctors) ? doctors : []

  return (
    <section className="w-full bg-[#f5f5f5] px-4 py-14 sm:px-6 lg:px-8" style={backgroundStyle(bgColor, bgColorCustom)}>
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          {eyebrow && (
            <p
              className="flex items-center justify-center gap-3 font-serif text-xl text-brand"
              data-payload-subpath="eyebrow"
            >
              <Laurel className="h-8 w-5 text-brand" />
              {marks(eyebrow)}
              <Laurel className="h-8 w-5 -scale-x-100 text-brand" />
            </p>
          )}

          {heading && (
            <h2
              className="mt-3 font-serif text-3xl leading-tight text-heading sm:text-4xl"
              data-payload-subpath="heading"
            >
              {marks(heading)}
            </h2>
          )}
        </header>

        {points.length > 0 && (
          <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 rounded-xl border border-[#dbe8fa] bg-white p-6 sm:grid-cols-3">
            {points.map((point, i) => (
              <li
                className="flex items-start gap-3"
                data-payload-subpath={`highlights.${i}.title`}
                key={point.id ?? i}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fd] text-brand [&>span>svg]:h-5 [&>span>svg]:w-5">
                  <BrandIcon name={point.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight text-brand">
                    {marks(point.title)}
                  </span>
                  {point.description && (
                    <span className="mt-1 block text-xs leading-snug text-slate-600">
                      {marks(point.description)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {reviewers.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviewers.map((doctor, i) => (
              <li
                className="flex flex-col rounded-xl border border-[#dbe8fa] bg-white p-5"
                data-payload-subpath={`doctors.${i}.name`}
                key={doctor.id ?? i}
              >
                <div className="flex items-center gap-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#eef4fd]">
                    {doctor.photo && typeof doctor.photo === 'object' && (
                      <Media fill imgClassName="object-cover" resource={doctor.photo} />
                    )}
                  </span>

                  <span className="min-w-0 grow">
                    <span className="block text-sm font-bold leading-tight text-brand">
                      {marks(doctor.name)}
                    </span>
                    {doctor.role && (
                      <span className="block text-xs text-slate-500">{marks(doctor.role)}</span>
                    )}
                  </span>

                  {doctor.tag && (
                    <span className="shrink-0 rounded-full bg-[#eef4fd] px-2.5 py-1 text-[10px] font-semibold text-brand">
                      {marks(doctor.tag)}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold leading-snug text-subheading">
                  &ldquo;{doctor.quoteHeading}&rdquo;
                </h3>

                <p
                  className="mt-2 text-xs italic leading-relaxed text-slate-700"
                  data-payload-subpath={`doctors.${i}.quote`}
                >
                  &ldquo;{doctor.quote}&rdquo;
                </p>

                {doctor.readMoreLabel && (
                  <p className="mt-3 flex items-center gap-1 text-xs font-bold text-[#0052cc]">
                    {marks(doctor.readMoreLabel)}
                    <ChevronDown aria-hidden="true" className="h-3 w-3" />
                  </p>
                )}

                {Array.isArray(doctor.tags) && doctor.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {doctor.tags.map((tag, t) => (
                      <li
                        className="rounded bg-[#f2f6fd] px-2 py-1 text-[10px] font-medium text-brand"
                        key={tag.id ?? t}
                      >
                        {marks(tag.text)}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[10px]">
                  {doctor.verifiedLabel && (
                    <span className="flex items-center gap-1 font-semibold text-[#1a8a3c]">
                      <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                      {marks(doctor.verifiedLabel)}
                    </span>
                  )}

                  {doctor.profileLabel && (
                    <a
                      className="flex items-center gap-0.5 font-semibold text-slate-600 transition-colors hover:text-brand"
                      href={doctor.profileUrl || '#'}
                    >
                      {marks(doctor.profileLabel)}
                      <ChevronRight aria-hidden="true" className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
