'use client'
/* eslint-disable @next/next/no-img-element -- subscription images arrive as plain URLs */
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  Gift,
  LogOut,
  Minus,
  MoreVertical,
  Package,
  PiggyBank,
  Plus,
  ShoppingBag,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'

import type { AccountDashboardBlock as Props } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'
import { getAccountOverview, signOut } from './actions'
import { SAMPLE_ACCOUNT } from './sample'
import type { AccountOverview, Subscription, SubscriptionItem } from './types'

type Ready = Extract<AccountOverview, { status: 'ready' }>
type State = AccountOverview | { status: 'loading' }

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' }).format(n)

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined)

const card = 'rounded-xl border border-tint-100 bg-white'
const sectionTitle = 'font-marcellus text-xl leading-tight text-heading'
const outlineButton =
  'inline-flex h-9 items-center gap-2 rounded-lg border border-tint-150 bg-white px-3 text-[13px] font-semibold text-brand transition-colors hover:bg-mist-100'

/**
 * Inside the visual editor, or with `?preview=sample` while developing, the page shows the
 * design's sample subscription instead of a real account. Neither has a customer session,
 * and the editor needs something to lay the copy out against. A real visitor never gets it:
 * production builds ignore the query string, and the editor runs under /admin.
 */
const usesSample = () => {
  if (typeof window === 'undefined') return false
  const inEditor = window.self !== window.top || window.location.pathname.startsWith('/admin')
  const preview =
    process.env.NODE_ENV === 'development' &&
    new URLSearchParams(window.location.search).get('preview') === 'sample'
  return inEditor || preview
}

export const Dashboard: React.FC<Props> = (props) => {
  const router = useRouter()
  const loginUrl = str(props.loginUrl) ?? '/login'
  const [state, setState] = useState<State>({ status: 'loading' })
  const [leaving, startLeaving] = useTransition()

  useEffect(() => {
    if (usesSample()) {
      setState(SAMPLE_ACCOUNT)
      return
    }
    let live = true
    getAccountOverview()
      .then((overview) => {
        if (!live) return
        if (overview.status === 'signedOut') router.replace(loginUrl)
        else setState(overview)
      })
      .catch(() => live && setState({ status: 'signedOut' }))
    return () => {
      live = false
    }
  }, [loginUrl, router])

  const logout = () =>
    startLeaving(async () => {
      await signOut()
      router.replace(loginUrl)
      router.refresh()
    })

  if (state.status === 'loading' || state.status === 'signedOut') {
    return (
      <div aria-busy="true" className="flex min-h-[50vh] items-center justify-center">
        <span className="size-8 animate-spin rounded-full border-2 border-tint-150 border-t-brand" />
        <span className="sr-only">Loading your account…</span>
      </div>
    )
  }

  if (state.status === 'unavailable') {
    return (
      <div className={cn(card, 'mx-auto my-16 max-w-md p-8 text-center')}>
        <h1 className={sectionTitle}>Account login is coming soon</h1>
        <p className="mt-2 text-sm text-body">Customer accounts are not switched on yet.</p>
      </div>
    )
  }

  return <AccountView account={state} leaving={leaving} onLogout={logout} props={props} />
}

const AccountView: React.FC<{
  account: Ready
  leaving: boolean
  onLogout: () => void
  props: Props
}> = ({ account, leaving, onLogout, props }) => {
  const sub = account.subscription

  return (
    <div className="flex flex-col gap-4">
      {/* Account menu */}
      <nav className="flex items-center gap-5 text-[13px] font-semibold text-navy">
        <a className="flex items-center gap-1.5 hover:text-brand" href="#orders">
          <Package aria-hidden="true" className="size-4" />
          {marks(props.ordersLabel || 'Orders')}
        </a>
        <a className="flex items-center gap-1.5 hover:text-brand" href="#account">
          <User aria-hidden="true" className="size-4" />
          {marks(props.accountLabel || 'Account')}
        </a>
        <button
          className="flex items-center gap-1.5 hover:text-brand disabled:opacity-50"
          disabled={leaving}
          onClick={onLogout}
          type="button"
        >
          <LogOut aria-hidden="true" className="size-4" />
          {leaving ? 'Logging out…' : marks(props.logoutLabel || 'Logout')}
        </button>
      </nav>

      <Link
        className="flex w-fit items-center gap-1 text-sm font-semibold text-navy hover:text-brand"
        href="/"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        Back
      </Link>

      <header
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        id="account"
      >
        {sub ? (
          <div>
            <h1 className="font-marcellus text-[32px] leading-tight text-heading">{sub.cadence}</h1>
            <p className="text-[15px] text-brand-500">{sub.planName}</p>
            <p className="mt-1 text-lg font-semibold text-navy">
              {money(sub.price)} ·{' '}
              <span className="underline underline-offset-4">
                Next on {shortDate(sub.nextOrderDate)}
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-marcellus text-[32px] leading-tight text-heading">My account</h1>
            <p className="text-[15px] text-body">{account.email}</p>
          </div>
        )}

        {sub && <SubscriptionActions giftCount={sub.giftCount} />}
      </header>

      <ReferBanner props={props} />

      {account.cashbackBalance !== null && (
        <CashbackStrip balance={account.cashbackBalance} props={props} />
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-5">
          <GiftingJourney props={props} />
          {sub ? (
            <SubscriptionDetails props={props} sub={sub} />
          ) : (
            <EmptySubscription props={props} />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <ShareCard props={props} />
          <Upsell props={props} />
        </div>
      </div>
    </div>
  )
}

/* The subscription's own controls. They act on an order, which needs the commerce platform
   behind them; until then they are the design's buttons and nothing more. */
const SubscriptionActions: React.FC<{ giftCount: number }> = ({ giftCount }) => (
  <div className="flex flex-wrap items-center gap-2">
    <button
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-navy px-3 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
      type="button"
    >
      <ShoppingBag aria-hidden="true" className="size-4" />
      Get now
    </button>
    <button className={outlineButton} type="button">
      <CalendarDays aria-hidden="true" className="size-4" />
      Next order date
    </button>
    <button className={outlineButton} type="button">
      <MoreVertical aria-hidden="true" className="size-4" />
      More
    </button>
    <span className="relative flex size-10 items-center justify-center rounded-full border border-tint-150 bg-white text-brand">
      <Gift aria-hidden="true" className="size-5" />
      {giftCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-300 text-[11px] font-bold text-white">
          {giftCount}
        </span>
      )}
      <span className="sr-only">{giftCount} gifts</span>
    </span>
  </div>
)

const ReferBanner: React.FC<{ props: Props }> = ({ props }) => {
  const photos = (props.referPhotos ?? []).filter((p) => p.image && typeof p.image === 'object')
  const results = props.results ?? []
  const buttonUrl = str(props.referButtonUrl)

  return (
    <section className="overflow-hidden rounded-xl border border-tint-150 bg-tint-50">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr]">
        <div className="flex flex-col gap-3 bg-navy p-5 text-white sm:p-6">
          <Logo className="h-9 w-auto self-start brightness-0 invert" />
          {props.referHeading && (
            <h2
              className="text-[34px] font-black uppercase leading-none tracking-tight sm:text-[38px]"
              data-payload-subpath="referHeading"
            >
              {marks(props.referHeading)}
            </h2>
          )}
          {props.referText && (
            <p className="text-sm leading-snug text-white/90" data-payload-subpath="referText">
              {multiline(props.referText)}
            </p>
          )}
          {buttonUrl && props.referButtonLabel && (
            <Link
              className="mt-1 inline-flex h-10 w-fit items-center rounded-md bg-brand-400 px-5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-300"
              href={buttonUrl}
            >
              {marks(props.referButtonLabel)}
            </Link>
          )}
        </div>

        {photos.length > 0 && (
          <ul
            className="grid min-h-[180px] grid-flow-col auto-cols-fr"
            data-payload-subpath="referPhotos"
          >
            {photos.map((p, i) => (
              <li className="relative min-w-0" key={p.id ?? i}>
                <Media
                  className="absolute inset-0"
                  fill
                  imgClassName="object-cover"
                  pictureClassName="absolute inset-0"
                  resource={p.image}
                  size="(min-width: 768px) 140px, 20vw"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-y-4 border-t border-tint-150 px-4 py-4 sm:grid-cols-3 md:flex md:items-center md:divide-x md:divide-tint-150">
          {props.resultsLabel && (
            <p className="col-span-2 text-[11px] font-bold uppercase leading-tight text-navy sm:col-span-3 md:w-[120px] md:shrink-0 md:pr-3">
              {marks(props.resultsLabel)}
            </p>
          )}
          {results.map((r, i) => (
            <div className="flex flex-col items-center px-2 text-center md:flex-1" key={r.id ?? i}>
              <span className="text-[30px] font-extrabold leading-none text-brand">
                {marks(r.value)}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase leading-tight text-navy">
                {marks(r.label)}
              </span>
              {r.note && <span className="text-[10px] text-body">{marks(r.note)}</span>}
            </div>
          ))}
          {props.resultsBadge && (
            <div className="flex flex-col items-center px-2 text-center md:w-[100px] md:shrink-0">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand text-white">
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase leading-tight text-navy">
                {marks(props.resultsBadge)}
              </span>
            </div>
          )}
        </div>
      )}

      {props.resultsFootnote && (
        <p className="border-t border-tint-150 px-4 py-2 text-center text-[10px] leading-snug text-body">
          {multiline(props.resultsFootnote)}
        </p>
      )}
    </section>
  )
}

const CashbackStrip: React.FC<{ balance: number; props: Props }> = ({ balance, props }) => {
  const redeemUrl = str(props.redeemUrl)
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy px-5 py-3 text-white">
      <div className="flex items-center gap-3">
        <Logo className="h-7 w-auto brightness-0 invert" />
        <span className="text-sm font-semibold">{marks(props.cashbackLabel || 'Cashback')}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-4 rounded-md bg-white px-3 py-1.5 text-xs text-navy">
          <span>
            {marks(props.balanceLabel || 'Your balance:')} <strong>{money(balance)}</strong>
          </span>
          {redeemUrl && (
            <Link className="font-semibold text-brand hover:underline" href={redeemUrl}>
              {marks(props.redeemLabel || 'Redeem')}
            </Link>
          )}
        </span>
        <ArrowRight aria-hidden="true" className="size-5" />
      </div>
    </section>
  )
}

const GiftingJourney: React.FC<{ props: Props }> = ({ props }) => {
  const steps = props.giftingSteps ?? []
  if (steps.length === 0) return null

  return (
    <section className="rounded-xl bg-tint-50 px-4 py-5">
      {props.giftingTitle && (
        <h2 className="text-center font-marcellus text-lg tracking-wide text-heading">
          {marks(props.giftingTitle)}
        </h2>
      )}
      <ol className="mt-3 flex items-start justify-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.id ?? i}>
            {i > 0 && (
              <li aria-hidden="true" className="mt-10 shrink-0 text-navy">
                <ArrowRight className="size-5" />
              </li>
            )}
            <li className="flex min-w-0 flex-1 flex-col items-center text-center">
              <span className="relative block h-20 w-full max-w-[120px]">
                {s.image && typeof s.image === 'object' ? (
                  <Media
                    className="absolute inset-0"
                    fill
                    imgClassName="object-contain"
                    pictureClassName="absolute inset-0"
                    resource={s.image}
                    size="120px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center rounded-lg bg-white/70 text-brand-300">
                    <Gift aria-hidden="true" className="size-8" />
                  </span>
                )}
              </span>
              <span className="mt-2 text-[11px] font-bold uppercase text-navy">
                {marks(s.order)}
              </span>
              <span className="text-[11px] text-navy">{marks(s.title)}</span>
              {s.value && (
                <span className="text-[11px] font-bold text-brand">{marks(s.value)}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
      {props.giftingNote && (
        <p className="mt-2 text-center text-[10px] text-body">{marks(props.giftingNote)}</p>
      )}
    </section>
  )
}

const ShareCard: React.FC<{ props: Props }> = ({ props }) => {
  const url = str(props.shareUrl)
  const [copied, setCopied] = useState(false)

  const share = async () => {
    if (!url) return
    const absolute = new URL(url, window.location.origin).toString()
    try {
      if (navigator.share) await navigator.share({ url: absolute })
      else {
        await navigator.clipboard.writeText(absolute)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // The visitor closed the share sheet.
    }
  }

  return (
    <section className={cn(card, 'flex flex-col gap-4 p-4')}>
      <div className="flex gap-3">
        <Gift aria-hidden="true" className="size-9 shrink-0 text-brand" strokeWidth={1.5} />
        <div>
          {props.shareHeading && (
            <h2 className="font-marcellus text-lg leading-tight text-heading">
              {marks(props.shareHeading)}
            </h2>
          )}
          {props.shareText && (
            <p className="mt-1 text-xs leading-snug text-body">{multiline(props.shareText)}</p>
          )}
        </div>
      </div>
      {url && props.shareButtonLabel && (
        <button
          className="flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          onClick={share}
          type="button"
        >
          {copied ? 'Link copied' : marks(props.shareButtonLabel)}
        </button>
      )}
    </section>
  )
}

const Upsell: React.FC<{ props: Props }> = ({ props }) => {
  const products = props.upsellProducts ?? []
  if (products.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      {props.upsellTitle && <h2 className={sectionTitle}>{marks(props.upsellTitle)}</h2>}
      <ul className={cn(card, 'flex flex-col gap-2 p-2')}>
        {products.map((p, i) => {
          const url = str(p.url)
          return (
            <li className="flex items-center gap-3 rounded-lg bg-mist p-2" key={p.id ?? i}>
              <span className="relative block size-20 shrink-0">
                {p.image && typeof p.image === 'object' && (
                  <Media
                    className="absolute inset-0"
                    fill
                    imgClassName="object-contain"
                    pictureClassName="absolute inset-0"
                    resource={p.image}
                    size="80px"
                  />
                )}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-semibold leading-tight text-navy">{marks(p.name)}</p>
                {p.option && (
                  <span className="w-fit rounded-md border border-tint-150 bg-white px-2 py-0.5 text-xs text-navy">
                    {marks(p.option)}
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  {p.price && <span className="text-sm font-bold text-navy">{marks(p.price)}</span>}
                  {url && (
                    <Link
                      className="rounded-md border border-brand px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                      href={url}
                    >
                      {marks(props.addLabel || 'Add')}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const EmptySubscription: React.FC<{ props: Props }> = ({ props }) => {
  const url = str(props.emptyButtonUrl)
  return (
    <section className={cn(card, 'flex flex-col items-center gap-3 p-8 text-center')} id="orders">
      <Package aria-hidden="true" className="size-10 text-brand-300" strokeWidth={1.5} />
      {props.emptyHeading && <h2 className={sectionTitle}>{marks(props.emptyHeading)}</h2>}
      {props.emptyText && (
        <p className="max-w-sm text-sm text-body">{multiline(props.emptyText)}</p>
      )}
      {url && props.emptyButtonLabel && (
        <Link
          className="mt-1 inline-flex h-10 items-center rounded-lg bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          href={url}
        >
          {marks(props.emptyButtonLabel)}
        </Link>
      )}
    </section>
  )
}

const ItemRow: React.FC<{ item: SubscriptionItem }> = ({ item }) =>
  item.gift ? (
    <li className="flex items-center gap-4 rounded-lg border border-tint-150 bg-white p-3">
      <ItemImage item={item} />
      <div className="min-w-0">
        <p className="text-sm font-bold text-navy">Congratulations!</p>
        {item.description && <p className="text-xs text-body">{item.description}</p>}
        <span className="mt-1 inline-block rounded bg-success-tint px-2 py-0.5 text-[11px] text-success">
          Surprise gift
        </span>
        <p className="mt-1 flex items-baseline gap-3">
          {item.originalPrice !== undefined && (
            <s className="text-sm font-semibold text-navy">{money(item.originalPrice)}</s>
          )}
          <span className="text-sm font-bold text-success">Free</span>
        </p>
      </div>
    </li>
  ) : (
    <li className="flex flex-col gap-3 p-1 sm:flex-row sm:items-center">
      <ItemImage item={item} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-navy">{item.name}</p>
            {item.description && <p className="text-xs text-body">{item.description}</p>}
          </div>
          <span className="text-sm font-bold text-navy">{money(item.price)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.quantity !== undefined && (
            <span className="flex items-center gap-2">
              <button
                aria-label="Decrease quantity"
                className="flex size-7 items-center justify-center rounded bg-navy text-white"
                type="button"
              >
                <Minus aria-hidden="true" className="size-3.5" />
              </button>
              <span className="w-4 text-center text-sm text-navy">{item.quantity}</span>
              <button
                aria-label="Increase quantity"
                className="flex size-7 items-center justify-center rounded bg-navy text-white"
                type="button"
              >
                <Plus aria-hidden="true" className="size-3.5" />
              </button>
            </span>
          )}
          {item.packageLabel && (
            <span className="rounded-md border border-tint-150 px-2 py-1 text-xs text-navy">
              {item.packageLabel}
            </span>
          )}
          <button
            className="rounded-md border border-tint-150 px-3 py-1 text-xs font-semibold text-brand"
            type="button"
          >
            Swap
          </button>
        </div>
      </div>
    </li>
  )

const ItemImage: React.FC<{ item: SubscriptionItem }> = ({ item }) => (
  <span className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-mist">
    {item.image ? (
      <img alt="" className="h-full w-full object-contain" src={item.image} />
    ) : (
      <Gift aria-hidden="true" className="size-6 text-brand-300" />
    )}
  </span>
)

const SubscriptionDetails: React.FC<{ props: Props; sub: Subscription }> = ({ props, sub }) => (
  <>
    <section className="flex flex-col gap-2" id="orders">
      <h2 className={sectionTitle}>{marks(props.productsTitle || 'Products')}</h2>
      <div className={cn(card, 'flex flex-col gap-3 p-3')}>
        <ul className="flex flex-col gap-3">
          {sub.items.map((item, i) => (
            <ItemRow item={item} key={i} />
          ))}
        </ul>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-navy text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add product
        </button>
      </div>
    </section>

    <section className="flex flex-col gap-2">
      <h2 className={sectionTitle}>{marks(props.shippingTitle || 'Shipping address')}</h2>
      <div className={cn(card, 'flex items-start justify-between gap-3 p-4 text-sm text-navy')}>
        <p>
          {sub.shippingAddress?.lines.map((line, i) => (
            <span className="block" key={i}>
              {line}
            </span>
          )) ?? 'No shipping address saved yet.'}
        </p>
        <button className="text-sm font-semibold text-brand hover:underline" type="button">
          Edit
        </button>
      </div>
    </section>

    <section className="flex flex-col gap-2">
      <h2 className={sectionTitle}>{marks(props.summaryTitle || 'Summary')}</h2>
      <div className={cn(card, 'flex flex-col gap-2 p-4 text-sm text-navy')}>
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{money(sub.summary.subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping</span>
          <span>{sub.summary.shipping === 0 ? 'Free' : money(sub.summary.shipping)}</span>
        </p>
        <div className="flex items-center gap-2 py-1">
          <input
            aria-label="Promo code"
            className="h-9 min-w-0 flex-1 rounded-md border border-tint-150 px-3 text-sm placeholder:text-steel-500"
            placeholder="Enter promo code"
          />
          <button className="px-2 text-sm font-semibold text-steel-500" type="button">
            Apply
          </button>
        </div>
        <p className="flex justify-between font-bold">
          <span>Total</span>
          <span>{money(sub.summary.total)}</span>
        </p>
      </div>
      {sub.summary.saved > 0 && (
        <p className="flex items-center justify-center gap-2 rounded-xl border border-success-tint bg-success-tint/30 p-3 text-sm text-navy">
          <PiggyBank aria-hidden="true" className="size-5 text-brand-400" />
          You’ve saved with your subscription:
          <strong className="text-success">{money(sub.summary.saved)}</strong>
        </p>
      )}
    </section>

    <section className="flex flex-col gap-2">
      <h2 className={sectionTitle}>{marks(props.billingTitle || 'Billing')}</h2>
      <div className={cn(card, 'flex flex-col gap-3 p-4 text-sm text-navy')}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Your payment method</span>
          <button className="font-semibold text-brand hover:underline" type="button">
            Edit
          </button>
        </div>
        {sub.payment ? (
          <p className="flex items-center gap-3">
            <span className="rounded bg-navy px-1.5 py-0.5 text-[11px] font-black italic text-white">
              {sub.payment.brand}
            </span>
            <span className="flex-1">Card •••• {sub.payment.last4}</span>
            <span>{sub.payment.expiry}</span>
          </p>
        ) : (
          <p className="flex items-center gap-2 text-body">
            <CreditCard aria-hidden="true" className="size-4" />
            No payment method saved yet.
          </p>
        )}
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-navy text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add backup card
        </button>
      </div>
    </section>
  </>
)
