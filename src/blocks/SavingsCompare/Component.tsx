import React from 'react'
import { Check } from 'lucide-react'

import type { SavingsCompareBlock as Props } from '@/payload-types'

export const SavingsCompareBlock: React.FC<Props> = ({
  ctaLabel,
  ctaUrl,
  formulaAnnual,
  formulaBadge,
  formulaFeatures,
  formulaPrice,
  formulaPriceLabel,
  formulaSaveLabel,
  formulaSaveNote,
  formulaSaveValue,
  formulaTitle,
  heading,
  savingsLabel,
  savingsValue,
  separateCostLabel,
  separateColLabel,
  separateRows,
  separateTitle,
  separateTotals,
  subheading,
}) => {
  const rows = Array.isArray(separateRows) ? separateRows : []
  const totals = Array.isArray(separateTotals) ? separateTotals : []
  const features = Array.isArray(formulaFeatures) ? formulaFeatures : []

  return (
    <section className="w-full bg-[#1c2f6e] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
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

        {(savingsLabel || savingsValue) && (
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-white px-6 py-5 text-center">
            {savingsLabel && (
              <p className="text-sm font-bold text-[#0052cc]">{savingsLabel}</p>
            )}
            {savingsValue && (
              <p className="mt-1 text-3xl font-extrabold text-[#1a7f37]">{savingsValue}</p>
            )}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* Buying separately */}
          <div className="rounded-xl bg-white p-5">
            {separateTitle && (
              <p className="text-sm font-bold text-[#1c2f6e]">{separateTitle}</p>
            )}

            <table className="mt-3 w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#e2ecf9] text-slate-500">
                  <th className="py-1.5 font-semibold" scope="col">{separateColLabel}</th>
                  <th className="py-1.5 text-right font-semibold" scope="col">{separateCostLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr className="border-b border-[#f0f5fc]" key={row.id ?? i}>
                    <td className="py-1.5 text-slate-700">{row.name}</td>
                    <td className="py-1.5 text-right text-slate-700">{row.cost}</td>
                  </tr>
                ))}
                {totals.map((total, i) => (
                  <tr className="border-b border-[#e2ecf9] font-bold text-[#1c2f6e]" key={total.id ?? i}>
                    <td className="py-1.5">{total.label}</td>
                    <td className="py-1.5 text-right">{total.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p aria-hidden="true" className="text-center text-2xl font-extrabold text-white">VS</p>

          {/* The formula */}
          <div className="overflow-hidden rounded-xl bg-white">
            {formulaTitle && (
              <p className="bg-[#123a8a] py-2 text-center text-sm font-bold text-white">
                {formulaTitle}
              </p>
            )}

            <div className="p-5">
              {formulaBadge && (
                <p className="flex items-center gap-2 text-xs font-bold text-[#0052cc]">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
                  {formulaBadge}
                </p>
              )}

              <ul className="mt-3 flex flex-col gap-1.5">
                {features.map((feature, i) => (
                  <li className="flex items-start gap-2" key={feature.id ?? i}>
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1a7f37]" strokeWidth={3} />
                    <span className="text-[11px] leading-snug text-slate-700">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-[#e2ecf9] pt-3 text-center">
                {formulaPriceLabel && (
                  <p className="text-[11px] font-semibold text-[#0052cc]">{formulaPriceLabel}</p>
                )}
                {formulaPrice && (
                  <p className="text-2xl font-extrabold text-[#1c2f6e]">{formulaPrice}</p>
                )}
                {formulaAnnual && <p className="text-[11px] text-slate-500">{formulaAnnual}</p>}
              </div>

              {(formulaSaveLabel || formulaSaveValue) && (
                <div className="mt-3 rounded-lg bg-[#eef4fd] px-4 py-3 text-center">
                  {formulaSaveLabel && (
                    <p className="text-[11px] font-semibold text-[#0052cc]">{formulaSaveLabel}</p>
                  )}
                  {formulaSaveValue && (
                    <p className="text-xl font-extrabold text-[#1c2f6e]">{formulaSaveValue}</p>
                  )}
                  {formulaSaveNote && (
                    <p className="text-[11px] text-[#0052cc]">{formulaSaveNote}</p>
                  )}
                  {ctaLabel && (
                    <a
                      className="mt-3 inline-block rounded-md bg-[#1c2f6e] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#162456]"
                      href={ctaUrl || '#'}
                    >
                      {ctaLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
