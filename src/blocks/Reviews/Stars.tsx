import React from 'react'
import { Star } from 'lucide-react'

import { cn } from '@/utilities/ui'

/**
 * Renders a fixed 5-star row with `count` of them filled.
 * Shared by the server-rendered featured cards and the client-side review grid,
 * so it must stay free of hooks and browser APIs.
 */
export const Stars: React.FC<{
  className?: string
  count?: number | null
  size?: string
}> = ({ className, count, size = 'h-5 w-5' }) => {
  const filled = Math.max(0, Math.min(5, Math.round(count ?? 5)))

  return (
    <div aria-label={`${filled} out of 5 stars`} className="flex items-center gap-0.5" role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          aria-hidden="true"
          className={cn(size, i < filled ? className : 'text-slate-200')}
          fill="currentColor"
          key={i}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}
