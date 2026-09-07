'use client'
import type { MedicalReviewBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const HighlightRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<MedicalReviewBlock['highlights']>[number]>()
  return <div>{data?.title || 'Highlight'}</div>
}

export const DoctorRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<MedicalReviewBlock['doctors']>[number]>()
  return <div>{data?.name || 'Reviewer'}</div>
}
