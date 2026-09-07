import React from 'react'

import type { ComparisonBlock as Props } from '@/payload-types'

import { BrandIcon } from '@/components/BrandIcons'
import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { cn } from '@/utilities/ui'

export const ComparisonBlock: React.FC<Props> = ({ heading, products, rows, subheading }) => {
  const columns = Array.isArray(products) ? products : []
  const featureRows = Array.isArray(rows) ? rows : []

  return (
    <section className="w-full bg-brand px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          {heading && (
            <h2
              className="font-serif text-3xl leading-tight text-white sm:text-4xl"
              data-payload-subpath="heading"
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="mt-2 text-sm text-white/85" data-payload-subpath="subheading">
              {subheading}
            </p>
          )}
        </header>

        {columns.length > 0 && (
          // The table keeps its own horizontal scroll so the page never scrolls sideways.
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white">
            <table className="w-full min-w-[46rem] border-collapse text-center">
              <caption className="sr-only">
                {heading || 'Product comparison'}
              </caption>

              <thead>
                <tr>
                  <th className="w-56 bg-[#f6f8fc]" scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  {columns.map((product, i) => (
                    <th
                      className={cn('p-3 align-bottom', product.highlight && 'bg-[#e8f0fc]')}
                      data-payload-subpath={`products.${i}.name`}
                      key={product.id ?? i}
                      scope="col"
                    >
                      <div className="relative mx-auto aspect-[3/4] w-20">
                        <ImageSlot
                          className="h-full w-full"
                          hint=""
                          label={product.name}
                          resource={product.image}
                        />
                      </div>
                      <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-brand">
                        {product.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {featureRows.map((row, r) => (
                  <tr className="border-t border-[#e7edf7]" key={row.id ?? r}>
                    <th
                      className="bg-[#f6f8fc] px-4 py-3 text-left"
                      data-payload-subpath={`rows.${r}.label`}
                      scope="row"
                    >
                      <span className="flex items-center gap-2">
                        <BrandIcon
                          className="shrink-0 text-[#1668C4] [&>svg]:h-5 [&>svg]:w-5"
                          name={row.icon}
                        />
                        <span className="text-xs font-bold leading-tight text-brand">
                          {row.label}
                        </span>
                      </span>
                    </th>

                    {columns.map((product, c) => {
                      const value = row.values?.[c]?.value
                      const isYes = value === 'yes'

                      return (
                        <td
                          className={cn(
                            'border-l border-[#e7edf7] px-4 py-3 text-xs font-bold',
                            product.highlight
                              ? 'bg-brand text-white'
                              : 'bg-white text-brand',
                          )}
                          key={product.id ?? c}
                        >
                          {value ? (isYes ? 'YES' : 'NO') : '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
