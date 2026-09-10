'use client'
import type { SolutionSystemBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const CardRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<SolutionSystemBlock['cards']>[number]>()
  return <div>{[data?.stat, data?.title].filter(Boolean).join(' ') || 'Card'}</div>
}
