'use client'
import type { ComparisonBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ProductRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ComparisonBlock['products']>[number]>()
  return <div>{data?.name ? `${data.name}${data.highlight ? ' ★' : ''}` : 'Column'}</div>
}

export const FeatureRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ComparisonBlock['rows']>[number]>()
  return <div>{data?.label || 'Row'}</div>
}
