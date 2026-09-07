'use client'
import type { Product } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const PlanRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<Product['plans']>[number]>()
  return <div>{[data?.name, data?.price].filter(Boolean).join(' — ') || 'Plan'}</div>
}

export const SectionRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<Product['sections']>[number]>()
  return <div>{data?.title || 'Section'}</div>
}

export const StoryRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<Product['stories']>[number]>()
  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''
  return <div>{data?.name ? `${prefix}${data.name}` : 'Story'}</div>
}
