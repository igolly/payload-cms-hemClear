'use client'
import type { GuaranteeBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const PointRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<GuaranteeBlock['points']>[number]>()
  return <div>{data?.text || 'Point'}</div>
}

export const BadgeRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<GuaranteeBlock['badges']>[number]>()
  return <div>{data?.label || 'Pill'}</div>
}
