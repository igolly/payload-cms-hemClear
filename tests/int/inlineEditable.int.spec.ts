import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { asText } from '@/utilities/marks'
import { GuaranteeBlock } from '@/blocks/Guarantee/Component'
import { ScienceStatsBlock } from '@/blocks/ScienceStats/Component'

/**
 * Puck's inline editing hands a component a React element in place of a text prop's
 * string (see `isInlineEditable` in `src/puck/fields.tsx`). A block that calls a string
 * method straight on such a prop throws, and because the whole canvas renders in one tree
 * that one throw stops the editor loading at all.
 *
 * These render the blocks the way the canvas does — every text prop an element — and
 * assert only that they produce markup. The output itself is not the point; not throwing
 * is.
 */
const inline = (text: string) => React.createElement('span', null, text) as unknown as string

describe('blocks survive inline-editable props', () => {
  it('asText reads through an element to the empty string', () => {
    expect(asText('Learn more')).toBe('Learn more')
    expect(asText(inline('Learn more'))).toBe('')
    expect(asText(undefined)).toBe('')
    expect(asText(null)).toBe('')
  })

  it('Science Stats renders when a link label is an element', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScienceStatsBlock, {
        blockType: 'scienceStats',
        links: [{ id: '1', link: { type: 'custom', label: inline('See the research'), url: '#' } }],
      } as never),
    )
    expect(html).toContain('→')
  })

  it('Guarantee renders when the seal wording is an element', () => {
    const html = renderToStaticMarkup(
      React.createElement(GuaranteeBlock, {
        blockType: 'guarantee',
        heading: inline('90-Day Risk-Free Guarantee'),
        sealLabel: inline('DAY'),
        sealValue: inline('90'),
      } as never),
    )
    expect(html.length).toBeGreaterThan(0)
  })
})
