'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useState, useTransition } from 'react'

import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'
import { isSignedIn, requestLoginLink } from './actions'

type Notice = { text: React.ReactNode; tone: 'error' | 'info' } | null

/** Why `/auth/confirm` sent the customer back here. */
const LINK_ERRORS: Record<string, string> = {
  link: 'That login link has expired or was opened in a different browser. Enter your email to get a new one.',
  unavailable: 'Account login is not available yet.',
}

const buttonClass =
  'cta-gleam [--cta-glow:var(--color-brand-300)] flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-bold leading-tight text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-80 sm:text-[15px]'

/**
 * The email field and the button that emails a sign-in link. Clicking the link in the email
 * verifies the address and signs the customer in — there is no code to type. A visitor who
 * is already signed in is sent straight to their account.
 */
export const LoginForm: React.FC<{
  buttonLabel?: React.ReactNode
  emailLabel?: React.ReactNode
  emailPlaceholder?: string
  /** Where a signed-in customer lands. */
  redirectUrl?: string
  unavailableMessage?: React.ReactNode
}> = ({ buttonLabel, emailLabel, emailPlaceholder, redirectUrl, unavailableMessage }) => {
  const id = useId()
  const router = useRouter()
  const destination = redirectUrl || '/account'
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<null | string>(null)
  const [notice, setNotice] = useState<Notice>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get('error')
    if (reason && LINK_ERRORS[reason]) setNotice({ text: LINK_ERRORS[reason], tone: 'error' })

    let live = true
    isSignedIn()
      .then((signedIn) => {
        if (live && signedIn) router.replace(destination)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [destination, router])

  const send = () =>
    startTransition(async () => {
      const result = await requestLoginLink(email, destination)
      if (result.status === 'sent') {
        setSentTo(email.trim())
        setNotice(null)
      } else if (result.status === 'invalid') {
        setNotice({ text: 'Please enter a valid email address.', tone: 'error' })
      } else if (result.status === 'error') {
        setNotice({ text: result.message, tone: 'error' })
      } else {
        setNotice({ text: unavailableMessage, tone: 'info' })
      }
    })

  if (sentTo) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-lg bg-mist-100 px-5 py-6 text-center"
        role="status"
      >
        <svg
          aria-hidden="true"
          className="size-10 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect height="14" rx="2" width="20" x="2" y="5" />
          <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-navy">Check your email</p>
          <p className="text-sm leading-[1.5] text-body">
            We sent a login link to <strong className="text-navy">{sentTo}</strong>. Open it on this
            device to sign in.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-brand-500">
          <button
            className="underline-offset-4 hover:underline disabled:opacity-50"
            disabled={pending}
            onClick={send}
            type="button"
          >
            {pending ? 'Sending…' : 'Resend link'}
          </button>
          <span aria-hidden="true" className="h-4 w-px bg-tint-150" />
          <button
            className="underline-offset-4 hover:underline"
            onClick={() => setSentTo(null)}
            type="button"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  const invalid = notice?.tone === 'error'

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
    >
      <div className="flex flex-col gap-2">
        {emailLabel && (
          <label
            className="text-sm font-medium leading-none text-navy"
            data-payload-subpath="emailLabel"
            htmlFor={`${id}-email`}
          >
            {marks(emailLabel)}
          </label>
        )}
        <input
          aria-describedby={notice ? `${id}-status` : undefined}
          aria-invalid={invalid || undefined}
          autoComplete="email"
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-4 text-[15px] text-navy shadow-[0_1px_2px_rgba(1,25,61,0.06)] outline-none transition-colors placeholder:text-steel-500',
            'focus:border-brand-300 focus:ring-[3px] focus:ring-brand-300/20',
            invalid ? 'border-danger' : 'border-tint-100',
          )}
          id={`${id}-email`}
          inputMode="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value)
            if (notice) setNotice(null)
          }}
          placeholder={emailPlaceholder}
          required
          type="email"
          value={email}
        />
      </div>

      <button
        className={buttonClass}
        data-payload-subpath="buttonLabel"
        disabled={pending}
        type="submit"
      >
        {pending ? 'Sending…' : marks(buttonLabel)}
      </button>

      {notice && (
        <p
          className={cn(
            'rounded-lg px-4 py-3 text-center text-sm leading-[1.5]',
            notice.tone === 'error' ? 'bg-danger-tint/50 text-danger' : 'bg-mist-100 text-navy',
          )}
          id={`${id}-status`}
          role="status"
        >
          {multiline(notice.text)}
        </p>
      )}
    </form>
  )
}
