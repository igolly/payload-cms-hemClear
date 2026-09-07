'use client'
import type { FAQBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const FaqRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<FAQBlock['items']>[number]>()

  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''

  return <div>{data?.question ? `${prefix}${data.question}` : 'Question'}</div>
}
