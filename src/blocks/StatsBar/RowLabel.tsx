'use client'
import type { StatsBarBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const StatRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<StatsBarBlock['stats']>[number]>()
  const label = [data?.value, data?.label].filter(Boolean).join(' — ')
  return <div>{label || 'Stat'}</div>
}
