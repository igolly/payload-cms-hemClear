import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { marks } from '@/utilities/marks'

type Resource = MediaType | number | string | null | undefined

/**
 * Renders the uploaded media, or a dashed placeholder box holding its space until an
 * editor sets one. Keeps half-filled blocks looking deliberate rather than broken.
 */
export const ImageSlot: React.FC<{
  className?: string
  hint?: string
  imgClassName?: string
  label: string
  priority?: boolean
  resource: Resource
}> = ({ className = '', hint = 'Upload in the CMS', imgClassName, label, priority, resource }) => {
  if (resource && typeof resource === 'object') {
    return (
      <Media
        className={className}
        imgClassName={imgClassName ?? 'h-full w-full object-contain'}
        priority={priority}
        resource={resource}
      />
    )
  }

  return (
    <div
      aria-label={`${label} placeholder`}
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#C6DAF6] bg-[#F7FAFF] p-6 text-center ${className}`}
      role="img"
    >
      <svg aria-hidden="true" className="h-8 w-8 text-[#9DBDE8]" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="4" />
        <circle cx="8.5" cy="9.5" fill="currentColor" r="1.5" />
        <path
          d="M4 17l5-5 4 4 2.5-2.5L20 17"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      <span className="text-sm font-semibold text-[#3F6FA8]">{marks(label)}</span>
      <span className="text-xs text-[#8AA6C8]">{marks(hint)}</span>
    </div>
  )
}
