import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * The brand plus mark, drawn from `/plus.png`.
 *
 * The asset is a white glyph on transparency, so it is applied as a CSS mask rather than
 * rendered as an `<img>`: the shape comes from the file's alpha channel and the colour
 * from `currentColor`. That keeps the existing `text-*` classes and hover states working,
 * so the same mark reads correctly on the blue circles and on white panels alike.
 *
 * The glyph fills its box edge to edge, where the icon-set plus it replaced sat in ~58% of
 * its viewBox, so call sites use a smaller box to land on the same optical size.
 */
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden="true"
    className={cn('inline-block shrink-0 bg-current', className)}
    style={{
      WebkitMaskImage: 'url(/plus.png)',
      WebkitMaskPosition: 'center',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      maskImage: 'url(/plus.png)',
      maskPosition: 'center',
      maskRepeat: 'no-repeat',
      maskSize: 'contain',
    }}
  />
)
