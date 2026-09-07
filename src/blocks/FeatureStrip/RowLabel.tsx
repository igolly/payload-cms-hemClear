'use client'
import type { FeatureStripBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const StripRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<FeatureStripBlock['items']>[number]>()
  return <div>{data?.title || 'Item'}</div>
}
