'use client'
import type { IngredientExplorerBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const GroupRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<NonNullable<IngredientExplorerBlock['groups']>[number]>()
  const count = data?.ingredients?.length ?? 0
  return <div>{data?.name ? `${data.name} (${count})` : 'Formula'}</div>
}

export const IngredientRowLabel: React.FC<RowLabelProps> = () => {
  const { data } = useRowLabel<
    NonNullable<NonNullable<IngredientExplorerBlock['groups']>[number]['ingredients']>[number]
  >()
  return <div>{data?.name || 'Ingredient'}</div>
}
