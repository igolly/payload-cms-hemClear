'use client'

import React, { useState, useTransition } from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { marks } from '@/utilities/marks'
import { subscribe } from './actions'

type Props = NonNullable<FooterType['newsletter']>

/**
 * The footer's email opt-in (reference `public/email.png`): an uppercase heading, a line of
 * copy, a pill-shaped field over a full-width pill button, then the consent note.
 */
export const Newsletter: React.FC<{ data: Props }> = ({ data }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'error' | 'idle' | 'invalid' | 'subscribed'>('idle')
  const [pending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await subscribe(email)
      setStatus(result.status)
      if (result.status === 'subscribed') setEmail('')
    })
  }

  return (
    <div className="flex w-full max-w-[400px] shrink-0 flex-col gap-[12.5px] lg:w-[340px] xl:w-[380px]">
      {data.heading && (
        <h2 className="text-base font-extrabold uppercase leading-tight text-white">
          {marks(data.heading)}
        </h2>
      )}
      {data.text && <p className="text-sm leading-snug text-white/90">{marks(data.text)}</p>}

      {status === 'subscribed' ? (
        <p
          className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white"
          role="status"
        >
          {marks(data.successMessage || "You're in!")}
        </p>
      ) : (
        <form className="flex flex-col gap-2.5" noValidate onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="footer-newsletter-email">
            Email address
          </label>
          <input
            aria-describedby={status !== 'idle' ? 'footer-newsletter-status' : undefined}
            aria-invalid={status === 'invalid'}
            autoComplete="email"
            className="h-11 w-full rounded-full bg-white px-5 text-sm text-navy-950 placeholder:text-navy-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky"
            id="footer-newsletter-email"
            inputMode="email"
            name="email"
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            placeholder={data.placeholder || 'Email address'}
            required
            type="email"
            value={email}
          />
          <button
            className="h-11 w-full rounded-full bg-sky text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-sky-dark disabled:opacity-70"
            disabled={pending}
            type="submit"
          >
            {pending ? 'Joining…' : marks(data.buttonLabel || 'Join now')}
          </button>
          {(status === 'invalid' || status === 'error') && (
            <p
              className="text-xs font-medium text-aqua-200"
              id="footer-newsletter-status"
              role="alert"
            >
              {status === 'invalid'
                ? 'Please enter a valid email address.'
                : 'Something went wrong. Please try again.'}
            </p>
          )}
        </form>
      )}

      {data.consent && (
        <p className="text-xs leading-[15px] text-white/90">{marks(data.consent)}</p>
      )}
    </div>
  )
}
