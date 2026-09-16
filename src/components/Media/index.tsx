import React, { Fragment } from 'react'

import type { Props } from './types'

import { cn } from '@/utilities/ui'
import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, fill, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            // A `fill` image is laid out against this wrapper, so by default the wrapper covers
            // the caller's (positioned) box. A caller that passes its own classes keeps them —
            // those call sites size the wrapper themselves.
            className: fill && !className ? 'absolute inset-0' : className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
