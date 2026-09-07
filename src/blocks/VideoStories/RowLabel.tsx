'use client'
import type { VideoStoriesBlock } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const StoryRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<NonNullable<VideoStoriesBlock['stories']>[number]>()
  const prefix = rowNumber !== undefined ? `${rowNumber + 1}. ` : ''
  return <div>{data?.name ? `${prefix}${data.name}` : 'Story'}</div>
}
