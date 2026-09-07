'use client'
import type { CausesBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const FactorRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<CausesBlock['factors']>[number]>()
  return <div>{data?.label || 'Factor'}</div>
}
