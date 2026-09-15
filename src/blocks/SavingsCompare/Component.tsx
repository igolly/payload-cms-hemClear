import React from 'react'

import type { SavingsCompareBlock as Props } from '@/payload-types'
import { backgroundStyle } from '@/fields/background'
import { marks } from '@/utilities/marks'

/**
 * Two price cards either side of a "VS", under a savings headline — Figma `2002:16`
 * (COMPARISON COST).
 *
 * Geometry is the comp's: an 812px column holds the savings banner and the card row;
 * the row is two 364.58px cards and a 51px "VS" with 15.63px gaps. Neutral greys (#aaa
 * rules, #ddd sub-heading, the #d8e0ff savings wash) are the comp's own values — there is
 * no brand token near them.
 */

/** The comp's card shadow: `0 0 7.81 1.56 rgba(0,0,0,.25)`. */
const CARD_SHADOW = 'shadow-[0_0_7.81px_1.56px_rgba(0,0,0,0.25)]'

/**
 * Splits a price like "$37.27/month" or "$48.97 Per Month" into the figure and the unit
 * the comp sets smaller. The unit keeps its leading "/" or space.
 */
const splitPrice = (value?: string | null): [string, string] => {
  const text = String(value ?? '').trim()
  const match = text.match(/^([^\s/]+)([\s/].*)?$/)
  if (!match) return [text, '']
  return [match[1], match[2] ?? '']
}

/** The comp's list marker: a navy disc with a white tick, 13.54px. */
const Tick = () => (
  // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimise
  <img
    alt=""
    aria-hidden="true"
    className="size-[13.54px] shrink-0"
    height={14}
    src="/icons/savings-compare/check.svg"
    width={14}
  />
)

export const SavingsCompareBlock: React.FC<Props> = ({
  bgColor,
  bgColorCustom,
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

  /*
   * The comp sets the figure in green and the unit that trails it in navy, but the field
   * is one string. Split at the first space: "$2,000+ per year" → "$2,000+" + "per year".
   */
  const [savingsFigure, ...savingsRest] = String(savingsValue ?? '')
    .trim()
    .split(/\s+/)
  const savingsUnit = savingsRest.join(' ')

  const [priceFigure, priceUnit] = splitPrice(formulaPrice)
  const [saveFigure, saveUnit] = splitPrice(formulaSaveValue)

  return (
    <section
      className="w-full bg-navy px-4 py-[26px] font-inter sm:px-[26px] [&_sup]:leading-[0]"
      style={backgroundStyle(bgColor, bgColorCustom)}
    >
      <div className="mx-auto flex max-w-[1348px] flex-col items-center gap-[10.42px]">
        {heading && (
          <h2
            className="text-center font-marcellus text-[34px] font-normal leading-[normal] text-white sm:text-[44px] lg:text-[55px]"
            data-payload-subpath="heading"
          >
            {marks(heading)}
          </h2>
        )}
        {subheading && (
          <p
            className="text-center text-base font-medium leading-[19px] text-ash-200"
            data-payload-subpath="subheading"
          >
            {marks(subheading)}
          </p>
        )}

        {(savingsLabel || savingsValue) && (
          <div
            className={`flex w-full max-w-[812px] flex-col items-center gap-[2.6px] rounded-[15.63px] border-[1.04px] border-brand-300 bg-white px-4 py-[9.38px] text-center sm:px-[25px] ${CARD_SHADOW}`}
          >
            {savingsLabel && (
              <p
                className="text-lg font-bold leading-[22px] text-brand-500"
                data-payload-subpath="savingsLabel"
              >
                {marks(savingsLabel)}
              </p>
            )}
            {savingsFigure && (
              <p
                className="text-[30px] font-bold leading-[normal] sm:text-[42px] sm:leading-[51px]"
                data-payload-subpath="savingsValue"
              >
                <span className="text-success-bright">{marks(savingsFigure)}</span>
                {savingsUnit && <span className="text-navy-900"> {marks(savingsUnit)}</span>}
              </p>
            )}
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-[15.63px] py-[10.42px] lg:flex-row lg:items-stretch lg:justify-center">
          {/* Buying separately. */}
          <div
            className={`flex w-full max-w-[364.58px] flex-col items-center gap-[5.21px] overflow-hidden rounded-[15.63px] border-[1.04px] border-ash-400 bg-white p-[14.59px] text-navy lg:shrink-0 ${CARD_SHADOW}`}
          >
            {separateTitle && (
              <p
                className="text-center text-lg font-bold leading-[22px]"
                data-payload-subpath="separateTitle"
              >
                {marks(separateTitle)}
              </p>
            )}

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[0.52px] border-ash-400 text-[12.5px] font-bold leading-[17px]">
                  <th className="py-[5.21px] pl-[10.42px] font-bold" scope="col">
                    {marks(separateColLabel)}
                  </th>
                  <th className="py-[5.21px] pr-[10.42px] text-right font-bold" scope="col">
                    {marks(separateCostLabel)}
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs leading-[14px]">
                {rows.map((row, i) => (
                  <tr
                    className="border-b-[0.52px] border-ash-400 last:border-b-0"
                    key={row.id ?? i}
                  >
                    <td className="py-[5.21px] pl-[10.42px]">{marks(row.name)}</td>
                    <td className="py-[5.21px] pr-[10.42px] text-right">{marks(row.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totals.length > 0 && (
              <dl className="w-full overflow-hidden rounded-[10.42px] border-[0.52px] border-ash-400 bg-shell">
                {totals.map((total, i) => {
                  const [figure, unit] = splitPrice(total.value)
                  return (
                    <div
                      className="flex items-center justify-between gap-[5.73px] border-b-[0.52px] border-ash-400 px-[10.42px] py-[5.21px] last:h-[26.9px] last:border-b-0 h-[27.42px]"
                      key={total.id ?? i}
                    >
                      <dt className="text-sm font-bold leading-[16px]">{marks(total.label)}</dt>
                      <dd className="text-right text-sm font-bold leading-[16px]">
                        {marks(figure)}
                        {unit && <span className="text-xs font-normal">{marks(unit)}</span>}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            )}
          </div>

          <p
            aria-hidden="true"
            className="w-[51px] shrink-0 self-center text-center text-4xl font-bold leading-[44px] text-white"
          >
            VS
          </p>

          {/* The formula: a 3.65px white ring around a cyan-bordered card. */}
          <div
            className={`flex w-full max-w-[364.58px] flex-col overflow-hidden rounded-[15.63px] bg-white p-[3.65px] lg:shrink-0 ${CARD_SHADOW}`}
          >
            <div
              className={`flex flex-1 flex-col overflow-hidden rounded-[13.02px] border-[1.56px] border-aqua-200 ${CARD_SHADOW}`}
            >
              {formulaTitle && (
                <p
                  className="bg-[linear-gradient(90deg,var(--color-navy-900),var(--color-brand-600))] px-[5.21px] py-[9.38px] text-center text-lg font-bold leading-[22px] text-white"
                  data-payload-subpath="formulaTitle"
                >
                  {marks(formulaTitle)}
                </p>
              )}

              <div className="flex flex-1 flex-col items-center justify-between px-[15.63px] py-[26.04px]">
                <div className="flex items-start gap-[7.81px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static asset, nothing to optimise */}
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-[31.77px] w-[27.08px] shrink-0"
                    height={32}
                    src="/icons/savings-compare/formula.png"
                    width={27}
                  />

                  <div className="flex min-w-0 flex-col gap-[4.17px] py-[10.42px]">
                    {formulaBadge && (
                      <p
                        className="pb-[15px] text-xs font-bold leading-[15px] text-brand-600"
                        data-payload-subpath="formulaBadge"
                      >
                        {marks(formulaBadge)}
                      </p>
                    )}

                    {features.length > 0 && (
                      <ul className="flex flex-col gap-[4.17px]">
                        {features.map((feature, i) => (
                          <li className="flex items-center gap-[5.21px]" key={feature.id ?? i}>
                            <Tick />
                            <span className="text-xs font-medium leading-[15px] text-navy-900">
                              {marks(feature.text)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* The comp's three stacks overflow their column by 11.58px, which
                    auto-layout absorbs as two -5.79px gaps. */}
                {(formulaPriceLabel || formulaPrice || formulaAnnual) && (
                  <div className="-mt-[5.79px] flex w-full flex-col items-center gap-[5.21px] border-t-[1.04px] border-ash-400 px-[26.04px] py-[10.42px] text-center text-navy">
                    {formulaPriceLabel && (
                      <p
                        className="text-xs font-bold leading-[15px] text-brand-500"
                        data-payload-subpath="formulaPriceLabel"
                      >
                        {marks(formulaPriceLabel)}
                      </p>
                    )}
                    {priceFigure && (
                      <p
                        className="text-[32px] font-bold leading-[39px]"
                        data-payload-subpath="formulaPrice"
                      >
                        {marks(priceFigure)}
                        {priceUnit && <span className="text-xl">{marks(priceUnit)}</span>}
                      </p>
                    )}
                    {formulaAnnual && (
                      <p
                        className="text-[14.58px] font-medium leading-[19.79px]"
                        data-payload-subpath="formulaAnnual"
                      >
                        {marks(formulaAnnual)}
                      </p>
                    )}
                  </div>
                )}

                {(formulaSaveLabel || formulaSaveValue || ctaLabel) && (
                  <div className="-mt-[5.79px] flex w-full flex-col items-center gap-[5.21px] rounded-[15.63px] border-[1.04px] border-brand-300 bg-[linear-gradient(90deg,var(--color-tint-250)_0%,var(--color-ash-50)_50%,var(--color-tint-250)_100%)] px-4 py-[9.38px] text-center sm:px-[25px]">
                    {formulaSaveLabel && (
                      <p
                        className="text-xs font-bold leading-[15px] text-brand-500"
                        data-payload-subpath="formulaSaveLabel"
                      >
                        {marks(formulaSaveLabel)}
                      </p>
                    )}
                    {saveFigure && (
                      <p
                        className="text-[32px] font-bold leading-[39px] text-navy"
                        data-payload-subpath="formulaSaveValue"
                      >
                        {marks(saveFigure)}
                        {saveUnit && <span className="text-xl">{marks(saveUnit)}</span>}
                      </p>
                    )}
                    {formulaSaveNote && (
                      <p
                        className="text-sm font-bold leading-[17px] text-brand-500"
                        data-payload-subpath="formulaSaveNote"
                      >
                        {marks(formulaSaveNote)}
                      </p>
                    )}
                    {ctaLabel && (
                      <a
                        className="inline-flex h-[32.29px] w-[156.25px] items-center justify-center rounded-[16.15px] bg-brand-600 p-[5.21px] text-xs font-bold leading-[15px] text-white transition-colors hover:bg-brand-dark"
                        href={ctaUrl || '#'}
                      >
                        {marks(ctaLabel)}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
