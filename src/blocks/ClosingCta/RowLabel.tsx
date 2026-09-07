'use client'
import type { ClosingCtaBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const CtaCardRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ClosingCtaBlock['cards']>[number]>()
  return <div>{data?.title || 'Card'}</div>
}
