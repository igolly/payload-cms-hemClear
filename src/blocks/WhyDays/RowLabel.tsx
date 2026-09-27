'use client'
import type { WhyDaysBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

/** Collapsed, a paragraph row shows its opening words rather than "Paragraph 01". */
export const ParagraphRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<WhyDaysBlock['paragraphs']>[number]>()
  const text = data?.text?.trim()
  if (!text) return <div>Paragraph</div>
  return <div>{text.length > 60 ? `${text.slice(0, 60)}…` : text}</div>
}
