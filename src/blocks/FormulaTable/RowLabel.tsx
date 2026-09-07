'use client'
import type { FormulaTableBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const FormulaRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<FormulaTableBlock['formulas']>[number]>()
  const count = data?.rows?.length ?? 0
  return <div>{data?.name ? `${data.name} (${count})` : 'Formula'}</div>
}

export const IngredientRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<
    NonNullable<NonNullable<FormulaTableBlock['formulas']>[number]['rows']>[number]
  >()
  return <div>{data?.name || 'Ingredient'}</div>
}
