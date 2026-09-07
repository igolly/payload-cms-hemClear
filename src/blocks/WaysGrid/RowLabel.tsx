'use client'
import type { WaysGridBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const WayRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<WaysGridBlock['ways']>[number]>()
  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''
  return <div>{data?.title ? `${prefix}${data.title}` : 'Way'}</div>
}
