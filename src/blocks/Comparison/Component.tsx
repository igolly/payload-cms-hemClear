import React from 'react'

import type { ComparisonBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { cn } from '@/utilities/ui'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/**
 * Figma 2002:19 (COMPARISON), phone comp 6595:2065.
 *
 * The table is 937.5px wide on desktop and the phone comp is the very same table scaled to
 * 400px (every box × 0.4267), so it is drawn once in table units: `--u` is 1 Figma px at
 * 937.5 wide, derived from the table's own width with container units. It never scrolls
 * sideways and keeps the comp's proportions at any width.
 *
 * Geometry (desktop px): 23.96 side inset, a 239.58 label column, 130 per product; the
 * highlighted product image is 90 × 167.14, the others 80 × 138.4, bottom-aligned.
 */
const u = (n: number) => `calc(${n} * var(--u))`

const STROKE = '0.5px'
const GREY = '#999999'

export const ComparisonBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
  heading,
  products,
  rows,
  subheading,
}) => {
  const columns = Array.isArray(products) ? products : []
  const featureRows = Array.isArray(rows) ? rows : []
  const last = columns.length - 1

  /** Figma's inside strokes: product columns except the last carry a right rule. */
  const cellShadow = (c: number, bottom?: string) =>
    [
      c < last && !columns[c]?.highlight ? `inset -${STROKE} 0 ${GREY}` : '',
      bottom ? `inset 0 -${STROKE} ${bottom}` : '',
    ]
      .filter(Boolean)
      .join(', ') || undefined

  return (
    <section
      className="w-full bg-navy px-5 font-inter sm:px-6"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[10px] py-5 lg:gap-[10.42px] lg:py-[26.04px]">
        {heading && (
          <h2
            className="text-center font-marcellus text-[34px] font-normal leading-[42px] text-white sm:leading-[normal] sm:text-[44px] lg:text-[57px] lg:leading-[71px] [&_sup]:leading-[0]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}

        {subheading && (
          <p
            className="text-center text-[min(24px,calc((100vw-40px)/15.4))] font-medium leading-[normal] text-steel-200 sm:text-2xl"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {columns.length > 0 && (
          <div className="w-full max-w-[937.5px] [container-type:inline-size]">
            <div
              className="relative overflow-hidden bg-gradient-to-r from-[#f3f6fb] via-white to-[#f3f6fb] text-black"
              style={
                {
                  '--u': 'calc(100cqw / 937.5)',
                  borderRadius: u(26.04),
                  boxShadow: `0 ${u(2.08)} ${u(7.81)} rgba(0,0,0,0.25)`,
                } as React.CSSProperties
              }
            >
              {/* Figma's 1.04px aqua stroke sits inside the box, over the cells. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
                style={{ boxShadow: `inset 0 0 0 max(${u(1.04)}, 0.5px) var(--color-aqua-200)` }}
              />
              <table className="w-full table-fixed border-collapse text-center">
                <caption className="sr-only">{heading || 'Product comparison'}</caption>

                <colgroup>
                  <col style={{ width: u(23.96) }} />
                  <col style={{ width: u(239.58) }} />
                  {columns.map((product, i) => (
                    <col key={product.id ?? i} style={{ width: u(130) }} />
                  ))}
                  <col />
                </colgroup>

                <thead>
                  <tr>
                    <td aria-hidden="true" />
                    <td aria-hidden="true" />
                    {columns.map((product, i) => (
                      <td
                        className={cn('align-bottom', product.highlight && 'bg-tint-200')}
                        key={product.id ?? i}
                        style={{
                          boxShadow: cellShadow(i),
                          height: u(188.83),
                          padding: `${u(10.42)} ${u(5.21)}`,
                        }}
                      >
                        <div
                          className="relative mx-auto"
                          style={
                            product.highlight
                              ? { height: u(167.14), width: u(90) }
                              : { height: u(138.4), width: u(80) }
                          }
                        >
                          <ImageSlot
                            className="h-full w-full"
                            hint=""
                            label={product.name}
                            resource={product.image}
                          />
                        </div>
                      </td>
                    ))}
                    <td aria-hidden="true" />
                  </tr>

                  <tr>
                    <td aria-hidden="true" style={{ boxShadow: `inset 0 -${STROKE} ${GREY}` }} />
                    <td style={{ boxShadow: `inset 0 -${STROKE} ${GREY}` }}>
                      <span className="sr-only">Feature</span>
                    </td>
                    {columns.map((product, i) => (
                      <th
                        className={cn(
                          'uppercase leading-[normal] [&_sup]:leading-[0]',
                          product.highlight ? 'bg-tint-200 font-bold' : 'font-semibold',
                        )}
                        data-payload-subpath={`products.${i}.name`}
                        key={product.id ?? i}
                        scope="col"
                        style={{
                          boxShadow: cellShadow(i, product.highlight ? '#ffffff' : GREY),
                          fontSize: u(16),
                          height: u(39.83),
                          lineHeight: u(19),
                          padding: `${u(10.42)} ${u(5.21)}`,
                        }}
                      >
                        {marks(product.name)}
                      </th>
                    ))}
                    <td aria-hidden="true" style={{ boxShadow: `inset 0 -${STROKE} ${GREY}` }} />
                  </tr>
                </thead>

                <tbody>
                  {featureRows.map((row, r) => (
                    <tr key={row.id ?? r}>
                      <td aria-hidden="true" style={{ boxShadow: `inset 0 -${STROKE} ${GREY}` }} />
                      <th
                        className="text-left"
                        data-payload-subpath={`rows.${r}.label`}
                        scope="row"
                        style={{
                          boxShadow: `inset -${STROKE} 0 ${GREY}, inset 0 -${STROKE} ${GREY}`,
                          padding: `${u(10.42)} ${u(5.21)}`,
                        }}
                      >
                        <span className="flex items-center" style={{ gap: u(5.21) }}>
                          <span
                            className="flex shrink-0 items-center justify-center rounded-full border-navy text-navy"
                            style={{
                              borderWidth: `max(${u(1.2)}, 0.5px)`,
                              height: u(33),
                              width: u(33),
                            }}
                          >
                            <span className="flex" style={{ height: u(19), width: u(19) }}>
                              <BrandIcon
                                className="flex size-full [&>svg]:size-full"
                                name={row.icon}
                              />
                            </span>
                          </span>
                          <span
                            className="min-w-0 flex-1 font-bold text-navy"
                            style={{ fontSize: u(14), lineHeight: u(18) }}
                          >
                            {marks(row.label)}
                          </span>
                        </span>
                      </th>

                      {columns.map((product, c) => {
                        const value = row.values?.[c]?.value

                        return (
                          <td
                            className={cn(
                              product.highlight
                                ? 'bg-navy font-bold text-white'
                                : 'font-normal text-black',
                            )}
                            key={product.id ?? c}
                            style={{
                              boxShadow: cellShadow(c, product.highlight ? '#ffffff' : GREY),
                              fontSize: u(17.71),
                              lineHeight: u(17.71),
                              padding: `${u(10.42)} ${u(5.21)}`,
                            }}
                          >
                            {value ? (value === 'yes' ? 'YES' : 'NO') : '—'}
                          </td>
                        )
                      })}
                      <td aria-hidden="true" style={{ boxShadow: `inset 0 -${STROKE} ${GREY}` }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
