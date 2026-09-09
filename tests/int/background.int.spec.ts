import { describe, expect, it } from 'vitest'
import { backgroundStyle, backgroundOptions } from '@/fields/background'

describe('backgroundStyle', () => {
  it('returns undefined when unset, so the section keeps its designed default', () => {
    expect(backgroundStyle(undefined, undefined)).toBeUndefined()
    expect(backgroundStyle(null, null)).toBeUndefined()
    expect(backgroundStyle('', '')).toBeUndefined()
  })
  it('resolves presets to their hex', () => {
    expect(backgroundStyle('navy')).toEqual({ backgroundColor: '#192f7c' })
    expect(backgroundStyle('white')).toEqual({ backgroundColor: '#ffffff' })
    expect(backgroundStyle('brand')).toEqual({ backgroundColor: '#0023a3' })
  })
  it('uses the custom value when the preset is "custom"', () => {
    expect(backgroundStyle('custom', '#abcdef')).toEqual({ backgroundColor: '#abcdef' })
    expect(backgroundStyle('custom', '  #abcdef  ')).toEqual({ backgroundColor: '#abcdef' })
  })
  it('falls back to the default when custom is selected but left blank', () => {
    expect(backgroundStyle('custom', '')).toBeUndefined()
    expect(backgroundStyle('custom', '   ')).toBeUndefined()
  })
  it('ignores an unknown stored value rather than painting it', () => {
    expect(backgroundStyle('someRemovedPreset')).toBeUndefined()
  })
  it('offers the palette plus a custom escape hatch', () => {
    expect(backgroundOptions.map((o) => o.value)).toEqual([
      'white', 'offWhite', 'paleBlue', 'lightBlue', 'skyBlue', 'brand', 'navy', 'deepNavy', 'custom',
    ])
  })
})

/**
 * End-to-end wiring check on one representative block: the field value has to survive the
 * trip from block data through the component to the rendered `<section>`. Uses
 * `createElement` rather than JSX so the file stays a `.ts` and matches the runner's
 * `*.int.spec.ts` include pattern.
 */
describe('a block section wired to the background field', () => {
  const render = async (props: Record<string, unknown>) => {
    const { createElement } = await import('react')
    const { renderToStaticMarkup } = await import('react-dom/server')
    const { StatsBarBlock } = await import('@/blocks/StatsBar/Component')
    return renderToStaticMarkup(
      createElement(StatsBarBlock as never, {
        blockType: 'statsBar',
        stats: [{ id: '1', value: '20', label: 'Years' }],
        ...props,
      }),
    )
  }

  it('keeps its designed class and adds no inline style when unset', async () => {
    const html = await render({})
    expect(html).toContain('bg-[#F7FAFF]')
    expect(html).not.toContain('style=')
  })

  it('paints the chosen preset over that class', async () => {
    const html = await render({ bgColor: 'navy' })
    expect(html).toContain('bg-[#F7FAFF]')
    expect(html).toContain('style="background-color:#192f7c"')
  })

  it('paints a custom colour', async () => {
    const html = await render({ bgColor: 'custom', bgColorCustom: '#123456' })
    expect(html).toContain('style="background-color:#123456"')
  })
})
