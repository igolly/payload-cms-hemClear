'use client'
import type { ReviewsBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import { marks } from '@/utilities/marks'

const rowNumber = (n?: number) => (n !== undefined ? `${n + 1}. ` : '')

export const FeaturedRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber: index } = useRowLabel<NonNullable<ReviewsBlock['featured']>[number]>()

  const label = data?.title
    ? `${rowNumber(index)}${data.title}${data.author ? ` — ${data.author}` : ''}`
    : 'Featured Review'

  return <div>{marks(label)}</div>
}

export const ReviewRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber: index } = useRowLabel<NonNullable<ReviewsBlock['reviews']>[number]>()

  const label = data?.title
    ? `${rowNumber(index)}${data.title}${data.author ? ` — ${data.author}` : ''}`
    : 'Customer Review'

  return <div>{marks(label)}</div>
}
