'use client'
import type { SupportTabsBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const AreaRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<SupportTabsBlock['items']>[number]>()
  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''
  return <div>{data?.title ? `${prefix}${data.title}` : 'Area'}</div>
}
