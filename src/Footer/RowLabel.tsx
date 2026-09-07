'use client'
import type { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<Footer['columns']>[number]>()
  return <div>{data?.title || 'Column'}</div>
}

export const PromiseRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<Footer['promiseItems']>[number]>()
  return <div>{data?.label || 'Promise'}</div>
}

export const SocialRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<Footer['socialItems']>[number]>()
  return <div>{data?.label || 'Social Link'}</div>
}
