'use client'
import type { TotalCareBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const SideRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<TotalCareBlock['items']>[number]>()
  return <div>{data?.label || 'Side'}</div>
}
