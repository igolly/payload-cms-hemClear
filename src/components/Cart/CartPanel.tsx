'use client'

import React, { useEffect, useRef } from 'react'
import { Check, Minus, Plus, Trash2, Truck, X } from 'lucide-react'

import type { Media as MediaDoc } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

import { type CartLine, formatAmount, toAmount, useCart } from './CartProvider'

export type CrossSellItem = {
  description?: null | string
  id?: null | string
  image?: MediaDoc | null | number | string
  name: string
  price: string
}

/** Only the methods an editor has confirmed the shop actually takes. */
const PAYMENT_LABELS: Record<string, string> = {
  amex: 'American Express',
  applePay: 'Apple Pay',
  googlePay: 'Google Pay',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
  visa: 'Visa',
}

const Row: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('flex items-center justify-between gap-3', className)}>{children}</div>

/**
 * The slide-out cart.
 *
 * It sits over the page rather than replacing it, so the reader can close it and carry on
 * from where they were — the whole point of a panel over a cart page. The list scrolls and
 * the total and checkout stay put at the bottom, because the one control the reader came
 * for should never be the one they have to go looking for.
 */
export const CartPanel: React.FC<{
  crossSell?: CrossSellItem[]
  /** Order subtotal at or above which shipping is free. Zero or unset: no shipping line. */
  freeShippingThreshold?: null | number
  paymentMethods?: null | string[]
}> = ({ crossSell = [], freeShippingThreshold, paymentMethods }) => {
  const cart = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const isOpen = Boolean(cart?.isOpen)

  // Escape closes it, as it does the mega menu and the mobile drawer.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cart?.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cart, isOpen])

  // The panel scrolls on its own; the page behind it should not.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  if (!cart) return null

  const { close, lines, savings, setQuantity, subtotal } = cart
  const threshold = freeShippingThreshold ?? 0
  const hasFreeShipping = threshold > 0 && subtotal >= threshold
  const methods = (paymentMethods ?? []).filter((m) => PAYMENT_LABELS[m])

  // The checkout the chosen package points at. Mixed carts take the first line that has one.
  const checkoutUrl = lines.find((l) => l.checkoutUrl)?.checkoutUrl

  return (
    <>
      {/* The page stays visible behind this, as the reference draws it. */}
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-50 bg-navy-900/50 transition-opacity duration-300 motion-reduce:transition-none',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
      />

      <div
        aria-hidden={!isOpen}
        aria-label="Your cart"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white font-inter shadow-[0_0_40px_rgba(5,25,89,0.25)]',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        ref={panelRef}
        role="dialog"
      >
        <Row className="shrink-0 border-b border-ash-200 px-5 py-4">
          <h2 className="text-base font-bold uppercase tracking-wide text-heading">Your Cart</h2>
          <button
            aria-label="Close cart"
            className="-mr-1 flex size-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-mist"
            onClick={close}
            ref={closeRef}
            type="button"
          >
            <X className="size-5" />
          </button>
        </Row>

        {/* Everything above the footer scrolls; the footer does not. */}
        <div className="min-h-0 grow overflow-y-auto overscroll-contain px-5 py-4">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-sm text-steel-400">Your cart is empty.</p>
          ) : (
            <>
              {threshold > 0 && (
                <div
                  className={cn(
                    'mb-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold',
                    hasFreeShipping ? 'bg-success-tint text-success-dark' : 'bg-mist text-navy',
                  )}
                >
                  <Truck aria-hidden="true" className="size-4 shrink-0" />
                  <span className="grow">
                    {hasFreeShipping
                      ? 'You unlocked FREE shipping!'
                      : `Spend ${formatAmount(threshold - subtotal)} more for FREE shipping`}
                  </span>
                  {hasFreeShipping && <Check aria-hidden="true" className="size-4 shrink-0" />}
                </div>
              )}

              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <CartRow key={line.id} line={line} onQuantity={setQuantity} />
                ))}
              </ul>

              {crossSell.length > 0 && <CrossSell items={crossSell} />}
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="shrink-0 border-t border-ash-200 px-5 py-4">
            {savings > 0 && (
              <Row className="mb-2 rounded-lg bg-success-tint/50 px-3 py-2 text-xs font-semibold text-success-dark">
                <span>Discount applied</span>
                <span>−{formatAmount(savings)}</span>
              </Row>
            )}

            <Row className="text-sm font-bold text-heading">
              <span>Subtotal</span>
              <span>{formatAmount(subtotal)}</span>
            </Row>
            {threshold > 0 && (
              <Row className="mt-1 text-xs text-navy">
                <span>Shipping</span>
                <span className={hasFreeShipping ? 'font-bold text-success-dark' : undefined}>
                  {hasFreeShipping ? 'FREE' : 'Calculated at checkout'}
                </span>
              </Row>
            )}
            <Row className="mt-1 text-xs text-steel-400">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </Row>

            {/*
             * The only way out of the cart. It points at the chosen package's own checkout
             * link; with none set there is nowhere to send anyone, so it says so rather than
             * pretending to be a button.
             */}
            {checkoutUrl ? (
              <a
                className="cta-gleam [--cta-glow:var(--color-brand)] mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
                href={checkoutUrl}
              >
                Checkout • {formatAmount(subtotal)}
              </a>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-ash-300 px-4 py-3 text-center text-xs text-steel-400">
                No checkout link is set for this package yet. Add one in the CMS under the
                package&rsquo;s &ldquo;Buy link&rdquo;.
              </p>
            )}

            {methods.length > 0 && (
              <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {methods.map((method) => (
                  <li
                    className="rounded border border-ash-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-steel-400"
                    key={method}
                  >
                    {PAYMENT_LABELS[method]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  )
}

const CartRow: React.FC<{
  line: CartLine
  onQuantity: (id: string, quantity: number) => void
}> = ({ line, onQuantity }) => {
  const was = toAmount(line.comparePrice)
  const now = toAmount(line.price)

  return (
    <li className="flex gap-3 border-b border-ash-100 pb-4 last:border-b-0">
      <span className="relative block size-[72px] shrink-0 overflow-hidden rounded-lg bg-mist">
        {line.image && typeof line.image === 'object' && (
          <Media
            className="absolute inset-0"
            fill
            imgClassName="object-contain p-1"
            pictureClassName="absolute inset-0"
            resource={line.image}
            size="72px"
          />
        )}
      </span>

      <div className="min-w-0 grow">
        <Row className="items-start">
          <p className="text-sm font-bold leading-tight text-heading [&_sup]:leading-[0]">
            {marks(line.name)}
          </p>
          <button
            aria-label={`Remove ${line.name}`}
            className="-mt-1 shrink-0 p-1 text-steel-400 transition-colors hover:text-danger-muted"
            onClick={() => onQuantity(line.id, 0)}
            type="button"
          >
            <Trash2 className="size-4" />
          </button>
        </Row>

        {line.packageName && (
          <p className="mt-0.5 text-xs text-navy [&_sup]:leading-[0]">{marks(line.packageName)}</p>
        )}

        {line.bonusLabel && (
          <p className="mt-1 inline-block rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {marks(line.bonusLabel)}
          </p>
        )}

        {/* Subscription terms, and only where the package actually has them. */}
        {line.billingNote && (
          <p className="mt-1 text-[11px] leading-tight text-steel-400">{marks(line.billingNote)}</p>
        )}

        <Row className="mt-2">
          <span className="flex items-center gap-1 rounded-lg border border-ash-300">
            <button
              aria-label={`Decrease quantity of ${line.name}`}
              className="flex size-7 items-center justify-center text-navy transition-colors hover:bg-mist"
              onClick={() => onQuantity(line.id, line.quantity - 1)}
              type="button"
            >
              <Minus className="size-3.5" />
            </button>
            <span aria-live="polite" className="w-7 text-center text-sm font-semibold text-heading">
              {line.quantity}
            </span>
            <button
              aria-label={`Increase quantity of ${line.name}`}
              className="flex size-7 items-center justify-center text-navy transition-colors hover:bg-mist"
              onClick={() => onQuantity(line.id, line.quantity + 1)}
              type="button"
            >
              <Plus className="size-3.5" />
            </button>
          </span>

          <span className="flex items-baseline gap-1.5">
            {was > now && (
              <s className="text-xs text-steel-400">{formatAmount(was * line.quantity)}</s>
            )}
            <span className="text-sm font-bold text-heading">
              {formatAmount(now * line.quantity)}
            </span>
          </span>
        </Row>

        {was > now && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-success-dark">
            <Check aria-hidden="true" className="size-3" />
            You save {formatAmount((was - now) * line.quantity)}
          </p>
        )}
      </div>
    </li>
  )
}

/**
 * "Customers also bought". Nothing here is in the cart until the reader presses Add, and the
 * total moves the moment they do.
 */
const CrossSell: React.FC<{ items: CrossSellItem[] }> = ({ items }) => {
  const cart = useCart()
  if (!cart) return null

  return (
    <section className="mt-6 border-t border-ash-200 pt-4">
      <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-heading">
        Customers also bought
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => {
          const id = `extra-${item.id ?? i}`
          const inCart = cart.lines.some((l) => l.id === id)

          return (
            <li className="flex items-center gap-3 rounded-xl border border-ash-200 p-2.5" key={id}>
              <span className="relative block size-14 shrink-0 overflow-hidden rounded-lg bg-mist">
                {item.image && typeof item.image === 'object' && (
                  <Media
                    className="absolute inset-0"
                    fill
                    imgClassName="object-contain p-1"
                    pictureClassName="absolute inset-0"
                    resource={item.image}
                    size="56px"
                  />
                )}
              </span>

              <div className="min-w-0 grow">
                <p className="text-sm font-bold leading-tight text-heading [&_sup]:leading-[0]">
                  {marks(item.name)}
                </p>
                {item.description && (
                  <p className="text-[11px] leading-tight text-steel-400">
                    {marks(item.description)}
                  </p>
                )}
                <p className="mt-0.5 text-sm font-bold text-heading">{marks(item.price)}</p>
              </div>

              <button
                className={cn(
                  'shrink-0 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                  inCart
                    ? 'border-ash-300 text-steel-400'
                    : 'border-brand text-brand hover:bg-brand hover:text-white',
                )}
                disabled={inCart}
                onClick={() =>
                  cart.add({
                    id,
                    image: item.image,
                    isExtra: true,
                    name: item.name,
                    price: item.price,
                  })
                }
                type="button"
              >
                {inCart ? 'Added' : '+ Add'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
