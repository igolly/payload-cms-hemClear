import React from 'react'

import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="HemClear"
      width={484}
      height={128}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      // `cn` (tailwind-merge), not `clsx`: the footer passes an explicit width, and
      // with plain clsx that would sit alongside `w-auto` instead of replacing it.
      className={cn('w-auto h-9', className)}
      src="/logo.png"
    />
  )
}
