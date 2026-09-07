'use client'
import type { ProductSystemBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ParagraphRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ProductSystemBlock['paragraphs']>[number]>()
  const preview = data?.text ? `${data.text.slice(0, 50)}…` : ''
  return <div>{[data?.lead, preview].filter(Boolean).join(' ') || 'Paragraph'}</div>
}

export const FeatureRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<ProductSystemBlock['features']>[number]>()
  return <div>{[data?.stat, data?.title].filter(Boolean).join(' ') || 'Feature'}</div>
}
