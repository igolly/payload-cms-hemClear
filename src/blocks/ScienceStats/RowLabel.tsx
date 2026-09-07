'use client'
import type { ScienceStatsBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const StatRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ScienceStatsBlock['stats']>[number]>()
  return <div>{[data?.value, data?.title].filter(Boolean).join(' — ') || 'Stat'}</div>
}
