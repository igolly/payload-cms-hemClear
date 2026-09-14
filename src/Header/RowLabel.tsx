'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import { marks } from '@/utilities/marks'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{marks(label)}</div>
}

export const MegaMenuRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } =
    useRowLabel<NonNullable<NonNullable<Header['navItems']>[number]['megaMenu']>[number]>()
  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''
  return <div>{data?.title ? marks(`${prefix}${data.title}`) : 'Card'}</div>
}
