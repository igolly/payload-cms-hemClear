'use client'
import type { BenefitsCarouselBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const BenefitRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<BenefitsCarouselBlock['items']>[number]>()
  return <div>{data?.title || 'Benefit'}</div>
}
