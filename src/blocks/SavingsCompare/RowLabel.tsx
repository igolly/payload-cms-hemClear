'use client'
import type { SavingsCompareBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

/**
 * Collapsed rows here are a name and a price, so the label shows both: a column of "Row 01,
 * Row 02" tells an editor nothing about which line they are opening.
 */
export const CostRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<SavingsCompareBlock['separateRows']>[number]>()
  if (!data?.name) return <div>Row</div>
  return <div>{data.cost ? `${data.name} — ${data.cost}` : data.name}</div>
}

export const TotalRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<SavingsCompareBlock['separateTotals']>[number]>()
  if (!data?.label) return <div>Total</div>
  return <div>{data.value ? `${data.label} — ${data.value}` : data.label}</div>
}
