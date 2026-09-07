'use client'
import type { PairingBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const PairingRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<PairingBlock['features']>[number]>()
  return <div>{data?.title || 'Feature'}</div>
}
