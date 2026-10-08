'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import {
  ChevronDown,
  CircleHelp,
  Lock,
  type LucideIcon,
  Package,
  Repeat,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import type { CheckoutBlock as Props } from '@/payload-types'

import { type CartLine, formatAmount, toAmount, useCart } from '@/components/Cart/CartProvider'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

/* eslint-disable @next/next/no-img-element -- static SVG marks */

const TRUST_ICONS: Record<string, LucideIcon> = {
  lock: Lock,
  package: Package,
  repeat: Repeat,
  shield: ShieldCheck,
  truck: Truck,
}

const CARD_MARKS: Record<string, string> = {
  amex: 'American Express',
  mastercard: 'Mastercard',
  visa: 'Visa',
}

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
] // prettier-ignore

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The address fields a delivery cannot go out without. */
const REQUIRED = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip'] as const
type Required = (typeof REQUIRED)[number]

const str = (value: unknown) => (typeof value === 'string' ? value : '')

/* ---------- shared field styling, after the reference's 8px-radius outlined inputs ---------- */

const inputClass =
  'peer h-[50px] w-full rounded-lg border border-ash-300 bg-white px-3.5 text-[15px] text-heading outline-none transition-colors placeholder:text-steel-500 focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:bg-ash-50 disabled:text-steel-400'

const Field: React.FC<{
  className?: string
  error?: boolean
  help?: boolean
  icon?: React.ReactNode
  input: React.InputHTMLAttributes<HTMLInputElement>
}> = ({ className, error, help, icon, input }) => (
  <label className={cn('relative block', className)}>
    <span className="sr-only">{input.placeholder}</span>
    <input
      {...input}
      aria-invalid={error || undefined}
      className={cn(inputClass, (help || icon) && 'pr-10', error && 'border-danger')}
    />
    {(help || icon) && (
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-steel-500">
        {icon ?? <CircleHelp aria-hidden="true" className="size-[18px]" />}
      </span>
    )}
  </label>
)

const Select: React.FC<{
  children: React.ReactNode
  className?: string
  error?: boolean
  label: string
  showLabel?: boolean
  select: React.SelectHTMLAttributes<HTMLSelectElement>
}> = ({ children, className, error, label, select, showLabel }) => (
  <label className={cn('relative block', className)}>
    {showLabel ? (
      <span className="pointer-events-none absolute left-3.5 top-2 text-xs text-steel-500">
        {label}
      </span>
    ) : (
      <span className="sr-only">{label}</span>
    )}
    <select
      {...select}
      aria-invalid={error || undefined}
      className={cn(
        inputClass,
        'appearance-none pr-9',
        showLabel && 'pt-4',
        !select.value && 'text-steel-500',
        error && 'border-danger',
      )}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-navy"
    />
  </label>
)

const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h2 className={cn('text-[21px] font-bold leading-tight text-heading', className)}>
    {marks(children)}
  </h2>
)

/* ---------- express payment buttons ---------- */

const ExpressButton: React.FC<{ method: string; onClick: () => void }> = ({ method, onClick }) => {
  const base =
    'flex h-12 min-w-0 flex-1 items-center justify-center rounded-md transition-[filter] hover:brightness-95'

  switch (method) {
    case 'shopPay':
      return (
        <button
          aria-label="Shop Pay"
          className={cn(base, 'bg-shoppay')}
          onClick={onClick}
          type="button"
        >
          <span className="text-[26px] font-extrabold leading-none tracking-tight text-white">
            shop
          </span>
        </button>
      )
    case 'paypal':
      return (
        <button
          aria-label="PayPal"
          className={cn(base, 'bg-paypal-gold')}
          onClick={onClick}
          type="button"
        >
          <span className="text-[24px] font-black italic leading-none tracking-tight">
            <span className="text-paypal-navy">Pay</span>
            <span className="text-paypal-blue">Pal</span>
          </span>
        </button>
      )
    case 'googlePay':
    case 'applePay':
      return (
        <button
          aria-label={method === 'googlePay' ? 'Google Pay' : 'Apple Pay'}
          className={cn(base, 'bg-black')}
          onClick={onClick}
          type="button"
        >
          <span className="text-[24px] font-medium leading-none text-white">
            {method === 'googlePay' ? 'G Pay' : ' Pay'}
          </span>
        </button>
      )
    default:
      return null
  }
}

/* ---------- the form ---------- */

type Values = Record<Required | 'apartment' | 'phone', string>

const EMPTY: Values = {
  address: '',
  apartment: '',
  city: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  state: '',
  zip: '',
}

export const CheckoutForm: React.FC<Props> = (props) => {
  const {
    cardBrands,
    contactTitle,
    deliveryTitle,
    emptyLinkUrl,
    emptyMessage,
    expressMethods,
    expressNote,
    expressTitle,
    guaranteeLinkLabel,
    guaranteeText,
    guaranteeTitle,
    guaranteeUrl,
    legalLead,
    legalLinks,
    newsletterLabel,
    offerPaypal,
    orderTitle,
    payLabel,
    paymentNote,
    paymentTitle,
    shippingLabel,
    shippingNote,
    shippingPrice,
    shippingTitle,
    showDiscount,
    signInUrl,
    subscriptionNote,
    subscriptionTitle,
    taxNote,
    testimonials,
    testimonialsFootnote,
    testimonialsTitle,
    trustItems,
    unavailableMessage,
  } = props

  const cart = useCart()
  const [values, setValues] = useState<Values>(EMPTY)
  const [newsletter, setNewsletter] = useState(false)
  const [method, setMethod] = useState<'card' | 'paypal'>('card')
  const [billingSame, setBillingSame] = useState(true)
  const [errors, setErrors] = useState<Partial<Record<Required, boolean>>>({})
  const [notice, setNotice] = useState<null | string>(null)
  const [discountNotice, setDiscountNotice] = useState(false)

  // The cart is read from storage after mount; until then there is nothing honest to show.
  const mounted = Boolean(cart?.ready)

  const lines = cart?.lines ?? []
  const subtotal = cart?.subtotal ?? 0
  const total = formatAmount(subtotal)
  const recurring = lines.filter((l) => l.billingNote)

  const set =
    (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value
      setValues((v) => ({ ...v, [key]: value }))
      if (errors[key as Required]) setErrors((x) => ({ ...x, [key]: false }))
    }

  const unavailable =
    str(unavailableMessage) || 'Online payment is not switched on yet, so nothing has been charged.'

  /*
   * No payment provider is connected yet, so there is no way to take money here. Pay checks
   * the delivery details the way a working checkout would, then says plainly that nothing was
   * charged — rather than appearing to place an order that does not exist.
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Partial<Record<Required, boolean>> = {}
    for (const key of REQUIRED) if (!values[key].trim()) next[key] = true
    if (values.email && !EMAIL.test(values.email.trim())) next.email = true
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setNotice(null)
      const first = REQUIRED.find((k) => next[k])
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setNotice(unavailable)
  }

  const payText =
    typeof payLabel === 'string'
      ? payLabel.replace('{total}', total)
      : (payLabel ?? `Pay ${total} now`)

  const signIn = str(signInUrl) || '/login'
  const signInHref = `${signIn}${signIn.includes('?') ? '&' : '?'}next=${encodeURIComponent('/checkout')}`

  const express = (expressMethods ?? []).filter(Boolean)
  const cards = (cardBrands ?? []).filter((c) => CARD_MARKS[c])
  const quotes = Array.isArray(testimonials) ? testimonials : []
  const promises = Array.isArray(trustItems) ? trustItems : []
  const legal = Array.isArray(legalLinks) ? legalLinks : []

  const isEmpty = mounted && lines.length === 0

  /* ---------- right column: the order ---------- */

  const summary = (
    <div className="flex flex-col gap-5">
      {orderTitle && (
        <h2
          className="font-playfair text-[26px] font-bold leading-tight text-heading [&_sup]:leading-[0]"
          data-payload-subpath="orderTitle"
        >
          {marks(orderTitle)}
        </h2>
      )}

      {!mounted ? (
        <div aria-hidden="true" className="h-24 animate-pulse rounded-xl bg-mist" />
      ) : isEmpty ? (
        <div className="rounded-xl border border-dashed border-ash-300 bg-white px-5 py-8 text-center">
          <p className="text-sm text-navy">{marks(emptyMessage || 'Your cart is empty.')}</p>
          <Link
            className="mt-3 inline-block text-sm font-semibold text-brand-500 underline underline-offset-4 hover:text-brand"
            href={str(emptyLinkUrl) || '/'}
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4 border-b border-ash-200 pb-5">
          {lines.map((line) => (
            <OrderLine key={line.id} line={line} />
          ))}
        </ul>
      )}

      {!isEmpty && mounted && (
        <>
          {showDiscount && (
            <div>
              <div className="flex gap-2.5">
                <label className="block grow">
                  <span className="sr-only">Discount code or gift card</span>
                  <input
                    className={cn(inputClass, 'h-[46px]')}
                    onChange={() => setDiscountNotice(false)}
                    placeholder="Discount code or gift card"
                    type="text"
                  />
                </label>
                <button
                  className="h-[46px] shrink-0 rounded-lg border border-ash-300 bg-ash-50 px-4 text-[15px] font-medium text-steel-600 transition-colors hover:bg-ash-100"
                  onClick={() => setDiscountNotice(true)}
                  type="button"
                >
                  Apply
                </button>
              </div>
              {discountNotice && (
                <p className="mt-2 text-xs text-steel-500" role="status">
                  Discount codes can be applied once online payment is switched on.
                </p>
              )}
            </div>
          )}

          <dl className="flex flex-col gap-2 border-b border-ash-200 pb-5 text-[15px] text-navy">
            <div className="flex justify-between gap-3">
              <dt>Subtotal</dt>
              <dd>{total}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Shipping</dt>
              <dd>{marks(shippingPrice || 'FREE')}</dd>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <dt>Tax</dt>
              <dd className="text-steel-500">{marks(taxNote || 'Calculated at checkout')}</dd>
            </div>
          </dl>

          <div>
            <div className="flex items-baseline justify-between gap-3 text-heading">
              <span className="text-lg font-bold">Total before tax</span>
              <span className="text-xl font-bold">{total}</span>
            </div>
            {recurring.map((line) => (
              <p className="mt-1 text-sm text-navy" key={line.id}>
                {marks(line.billingNote)}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )

  /* ---------- right column: why it is safe to buy ---------- */

  const reassurance = (
    <div className="flex flex-col gap-6">
      {(guaranteeTitle || guaranteeText) && (
        <div className="flex gap-4 rounded-xl border border-brand-200 bg-tint-100 p-5">
          <ShieldCheck
            aria-hidden="true"
            className="size-11 shrink-0 text-heading"
            strokeWidth={1.5}
          />
          <div className="text-sm leading-relaxed text-navy">
            {guaranteeTitle && (
              <h3
                className="text-lg font-bold leading-tight text-heading [&_sup]:leading-[0]"
                data-payload-subpath="guaranteeTitle"
              >
                {marks(guaranteeTitle)}
              </h3>
            )}
            {guaranteeText && (
              <p className="mt-1" data-payload-subpath="guaranteeText">
                {marks(guaranteeText)}
              </p>
            )}
            {guaranteeLinkLabel && str(guaranteeUrl) && (
              <Link
                className="mt-1 inline-block text-brand-500 underline underline-offset-2 hover:text-brand"
                href={str(guaranteeUrl)}
              >
                {marks(guaranteeLinkLabel)}
              </Link>
            )}
          </div>
        </div>
      )}

      {promises.length > 0 && (
        <ul className="flex flex-col gap-5 border-b border-ash-200 pb-8">
          {promises.map((item, i) => {
            const Icon = TRUST_ICONS[item.icon ?? ''] ?? ShieldCheck
            return (
              <li
                className="flex gap-4"
                data-payload-subpath={`trustItems.${i}`}
                key={item.id ?? i}
              >
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-8 shrink-0 text-heading"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="text-lg font-bold leading-tight text-heading">
                    {marks(item.title)}
                  </p>
                  {item.text && (
                    <p className="mt-0.5 text-[15px] text-steel-600">{marks(item.text)}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {quotes.length > 0 && (
        <section className="flex flex-col gap-4">
          {testimonialsTitle && (
            <h2
              className="font-playfair text-[24px] font-bold leading-tight text-heading [&_sup]:leading-[0]"
              data-payload-subpath="testimonialsTitle"
            >
              {marks(testimonialsTitle)}
            </h2>
          )}
          {quotes.map((quote, i) => (
            <figure
              className="flex gap-4 rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(5,25,89,0.08)]"
              data-payload-subpath={`testimonials.${i}`}
              key={quote.id ?? i}
            >
              <span
                aria-hidden="true"
                className="font-playfair text-5xl font-bold leading-[0.8] text-heading"
              >
                &ldquo;
              </span>
              <div>
                <blockquote className="font-playfair text-lg italic leading-snug text-heading">
                  &ldquo;{marks(quote.quote)}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-bold text-heading">— {marks(quote.name)}</span>
                  {quote.role && (
                    <span className="block pl-3.5 text-steel-500">{marks(quote.role)}</span>
                  )}
                </figcaption>
              </div>
            </figure>
          ))}
          {testimonialsFootnote && (
            <p
              className="text-xs italic text-steel-500"
              data-payload-subpath="testimonialsFootnote"
            >
              {marks(testimonialsFootnote)}
            </p>
          )}
        </section>
      )}
    </div>
  )

  /* ---------- left column: the form ---------- */

  const form = (
    <form className="flex flex-col gap-9" noValidate onSubmit={onSubmit}>
      {express.length > 0 && (
        <section className="flex flex-col gap-3">
          {expressTitle && (
            <p
              className="text-center text-[15px] text-steel-600"
              data-payload-subpath="expressTitle"
            >
              {marks(expressTitle)}
            </p>
          )}
          <div className="flex gap-2">
            {express.map((m) => (
              <ExpressButton key={m} method={m} onClick={() => setNotice(unavailable)} />
            ))}
          </div>
          {expressNote && (
            <p
              className="text-xs leading-relaxed text-steel-500"
              data-payload-subpath="expressNote"
            >
              {marks(expressNote)}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-steel-500 before:h-px before:grow before:bg-ash-300 after:h-px after:grow after:bg-ash-300">
            OR
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <SectionTitle>{contactTitle || 'Contact'}</SectionTitle>
          <Link
            className="text-sm text-brand-500 underline underline-offset-2 hover:text-brand"
            href={signInHref}
          >
            Sign in
          </Link>
        </div>
        <Field
          error={errors.email}
          help
          input={{
            autoComplete: 'email',
            name: 'email',
            onChange: set('email'),
            placeholder: 'Email',
            type: 'email',
            value: values.email,
          }}
        />
        {newsletterLabel && (
          <label className="flex cursor-pointer items-center gap-3 text-sm text-navy">
            <input
              checked={newsletter}
              className="size-[18px] shrink-0 accent-brand"
              onChange={(e) => setNewsletter(e.target.checked)}
              type="checkbox"
            />
            {marks(newsletterLabel)}
          </label>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>{deliveryTitle || 'Delivery'}</SectionTitle>
        <Select
          label="Country/Region"
          select={{
            autoComplete: 'country-name',
            disabled: false,
            name: 'country',
            value: 'US',
            onChange: () => {},
          }}
          showLabel
        >
          <option value="US">United States</option>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Field
            error={errors.firstName}
            input={{
              autoComplete: 'given-name',
              name: 'firstName',
              onChange: set('firstName'),
              placeholder: 'First name',
              value: values.firstName,
            }}
          />
          <Field
            error={errors.lastName}
            input={{
              autoComplete: 'family-name',
              name: 'lastName',
              onChange: set('lastName'),
              placeholder: 'Last name',
              value: values.lastName,
            }}
          />
        </div>
        <Field
          error={errors.address}
          input={{
            autoComplete: 'address-line1',
            name: 'address',
            onChange: set('address'),
            placeholder: 'Address',
            value: values.address,
          }}
        />
        <Field
          input={{
            autoComplete: 'address-line2',
            name: 'apartment',
            onChange: set('apartment'),
            placeholder: 'Apartment, suite, etc. (optional)',
            value: values.apartment,
          }}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            error={errors.city}
            input={{
              autoComplete: 'address-level2',
              name: 'city',
              onChange: set('city'),
              placeholder: 'City',
              value: values.city,
            }}
          />
          <Select
            error={errors.state}
            label="State"
            select={{
              autoComplete: 'address-level1',
              name: 'state',
              onChange: set('state'),
              value: values.state,
            }}
          >
            <option disabled value="">
              State
            </option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Field
            error={errors.zip}
            input={{
              autoComplete: 'postal-code',
              inputMode: 'numeric',
              name: 'zip',
              onChange: set('zip'),
              placeholder: 'ZIP code',
              value: values.zip,
            }}
          />
        </div>
        <Field
          help
          input={{
            autoComplete: 'tel',
            name: 'phone',
            onChange: set('phone'),
            placeholder: 'Phone (optional)',
            type: 'tel',
            value: values.phone,
          }}
        />
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>{shippingTitle || 'Shipping method'}</SectionTitle>
        <div className="flex items-start gap-3.5 rounded-lg border-[1.5px] border-brand bg-tint-50 px-4 py-3.5">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand"
          >
            <span className="size-2 rounded-full bg-white" />
          </span>
          <div className="grow text-sm">
            <p className="font-semibold text-heading">
              {marks(shippingLabel || 'Standard shipping')}
            </p>
            {shippingNote && <p className="text-navy">{marks(shippingNote)}</p>}
          </div>
          <span className="text-sm font-bold text-heading">{marks(shippingPrice || 'FREE')}</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <SectionTitle>{paymentTitle || 'Payment'}</SectionTitle>
          {paymentNote && <p className="mt-1 text-sm text-steel-600">{marks(paymentNote)}</p>}
        </div>

        <div className="overflow-hidden rounded-lg border border-ash-300">
          <label className="flex cursor-pointer items-center gap-3.5 bg-tint-50 px-4 py-3.5">
            <input
              checked={method === 'card'}
              className="size-5 accent-brand"
              name="method"
              onChange={() => setMethod('card')}
              type="radio"
            />
            <span className="grow text-[15px] font-semibold text-heading">Credit card</span>
            {cards.length > 0 && (
              <span className="flex gap-1.5">
                {cards.map((c) => (
                  <img
                    alt={CARD_MARKS[c]}
                    className="h-[26px] w-[42px]"
                    height={32}
                    key={c}
                    src={`/icons/payment/${c}.svg`}
                    width={52}
                  />
                ))}
              </span>
            )}
          </label>

          {method === 'card' && (
            /*
             * Locked until a payment provider is connected: card numbers are only ever typed
             * into the provider's own secure fields, never into a form on this site.
             */
            <div className="flex flex-col gap-3 border-t border-ash-200 bg-tint-50 px-4 pb-4 pt-1">
              <Field
                input={{ disabled: true, placeholder: 'Card number' }}
                icon={<Lock aria-hidden="true" className="size-4" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field input={{ disabled: true, placeholder: 'Expiration date (MM / YY)' }} />
                <Field help input={{ disabled: true, placeholder: 'Security code' }} />
              </div>
              <Field input={{ disabled: true, placeholder: 'Name on card' }} />
              <label className="flex cursor-pointer items-center gap-3 text-sm text-navy">
                <input
                  checked={billingSame}
                  className="size-[18px] accent-brand"
                  onChange={(e) => setBillingSame(e.target.checked)}
                  type="checkbox"
                />
                Use shipping address as billing address
              </label>
            </div>
          )}

          {offerPaypal && (
            <label className="flex cursor-pointer items-center gap-3.5 border-t border-ash-200 px-4 py-3.5">
              <input
                checked={method === 'paypal'}
                className="size-5 accent-brand"
                name="method"
                onChange={() => setMethod('paypal')}
                type="radio"
              />
              <span className="grow text-[15px] font-semibold text-heading">PayPal</span>
              <span className="text-lg font-black italic leading-none">
                <span className="text-paypal-navy">Pay</span>
                <span className="text-paypal-blue">Pal</span>
              </span>
            </label>
          )}
        </div>

        {recurring.length > 0 && (
          <div className="rounded-lg bg-tint-100 px-4 py-3.5 text-sm leading-relaxed text-navy">
            {subscriptionTitle && (
              <p className="font-bold text-heading">{marks(subscriptionTitle)}</p>
            )}
            {recurring.map((line) => (
              <p key={line.id}>
                {marks(line.name)}: {marks(line.billingNote)}
              </p>
            ))}
            {subscriptionNote && <p>{marks(subscriptionNote)}</p>}
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3">
        <button
          className="h-[52px] w-full rounded-lg bg-navy text-lg font-bold text-white transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!mounted || lines.length === 0}
          type="submit"
        >
          {payText}
        </button>

        {notice && (
          <p
            className="rounded-lg border border-amber/60 bg-cream px-4 py-3 text-sm text-navy"
            role="alert"
          >
            {marks(notice)}
          </p>
        )}

        {(legalLead || legal.length > 0) && (
          <p className="text-sm leading-relaxed text-navy">
            {marks(legalLead)}{' '}
            {legal.map((link, i) => (
              <React.Fragment key={link.id ?? i}>
                <Link
                  className="text-brand-500 underline underline-offset-2 hover:text-brand"
                  href={str(link.url) || '#'}
                >
                  {marks(link.label)}
                </Link>
                {i < legal.length - 2 ? ', ' : i === legal.length - 2 ? ' and ' : '.'}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
    </form>
  )

  /*
   * Phone: what is being bought first, then the form, then the reassurance. Desktop: the
   * form down the left; the order and reassurance down a tinted right column, which the
   * section's split background carries to the bottom of the page.
   */
  return (
    <section className="w-full bg-white font-inter lg:bg-[linear-gradient(to_right,var(--color-white)_50%,var(--color-mist-50)_50%)]">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 lg:grid-cols-2">
        <div className="bg-mist-50 px-4 py-8 sm:px-6 lg:col-start-2 lg:row-start-1 lg:border-l lg:border-ash-200 lg:bg-transparent lg:px-8 lg:pb-8 lg:pt-12">
          {summary}
        </div>
        <div className="px-4 py-8 sm:px-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:px-8 lg:py-12">
          {form}
        </div>
        <div className="bg-mist-50 px-4 py-8 sm:px-6 lg:col-start-2 lg:row-start-2 lg:border-l lg:border-ash-200 lg:bg-transparent lg:px-8 lg:pb-12 lg:pt-0">
          {reassurance}
        </div>
      </div>
    </section>
  )
}

/** One line of the order: the product shot with its quantity badge, name, terms and price. */
const OrderLine: React.FC<{ line: CartLine }> = ({ line }) => {
  const was = toAmount(line.comparePrice)
  const now = toAmount(line.price)

  return (
    <li className="flex items-center gap-4">
      <span className="relative block size-[80px] shrink-0 rounded-xl border border-ash-200 bg-white">
        {line.image && typeof line.image === 'object' && (
          <Media
            className="absolute inset-0 overflow-hidden rounded-xl"
            fill
            imgClassName="object-contain p-1.5"
            pictureClassName="absolute inset-0"
            resource={line.image}
            size="80px"
          />
        )}
        <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {line.quantity}
        </span>
      </span>

      <div className="min-w-0 grow">
        <p className="text-base font-bold leading-tight text-heading [&_sup]:leading-[0]">
          {marks(line.name)}
          {line.packageName && <span className="font-semibold"> · {marks(line.packageName)}</span>}
        </p>
        {line.billingNote && (
          <p className="mt-0.5 text-sm text-steel-600">{marks(line.billingNote)}</p>
        )}
        {line.bonusLabel && (
          <p className="mt-1 inline-block rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {marks(line.bonusLabel)}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        {was > now && (
          <s className="block text-sm text-steel-500">{formatAmount(was * line.quantity)}</s>
        )}
        <span className="text-base font-bold text-heading">
          {formatAmount(now * line.quantity)}
        </span>
      </div>
    </li>
  )
}
