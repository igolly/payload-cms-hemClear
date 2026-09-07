'use client'
import type { PricingOfferBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const PlanRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<PricingOfferBlock['plans']>[number]>()
  return <div>{[data?.name, data?.price].filter(Boolean).join(' — ') || 'Plan'}</div>
}
