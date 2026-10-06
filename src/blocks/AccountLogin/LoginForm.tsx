'use client'
import React, { useId, useState, useTransition } from 'react'

import { cn } from '@/utilities/ui'
import { marks, multiline } from '@/utilities/marks'
import { type LoginCodeResult, requestLoginCode } from './actions'

type Status = LoginCodeResult['status'] | 'idle'

/**
 * The email field and the "get login code" button. The browser's own `type="email"` check
 * catches a mistyped address before anything is sent; the server action checks again and
 * says whether a code actually went out.
 */
export const LoginForm: React.FC<{
  buttonLabel?: React.ReactNode
  emailLabel?: React.ReactNode
  emailPlaceholder?: string
  unavailableMessage?: React.ReactNode
}> = ({ buttonLabel, emailLabel, emailPlaceholder, unavailableMessage }) => {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [pending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      setStatus((await requestLoginCode(email)).status)
    })
  }

  const message =
    status === 'invalid'
      ? 'Please enter a valid email address.'
      : status === 'sent'
        ? 'Check your email and phone — your login code is on its way.'
        : status === 'unavailable'
          ? unavailableMessage
          : null

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
          aria-describedby={message ? `${id}-status` : undefined}
          aria-invalid={status === 'invalid' || undefined}
          autoComplete="email"
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-4 text-[15px] text-navy shadow-[0_1px_2px_rgba(1,25,61,0.06)] outline-none transition-colors placeholder:text-steel-500',
            'focus:border-brand-300 focus:ring-[3px] focus:ring-brand-300/20',
            status === 'invalid' ? 'border-danger' : 'border-tint-100',
          )}
          id={`${id}-email`}
          inputMode="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
          placeholder={emailPlaceholder}
          required
          type="email"
          value={email}
        />
      </div>

      <button
        className="cta-gleam [--cta-glow:var(--color-brand-300)] flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-bold leading-tight text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-80 sm:text-[15px]"
        data-payload-subpath="buttonLabel"
        disabled={pending}
        type="submit"
      >
        {pending ? 'Sending…' : marks(buttonLabel)}
      </button>

      {message && (
        <p
          className={cn(
            'rounded-lg px-4 py-3 text-center text-sm leading-[1.5]',
            status === 'invalid' ? 'bg-danger-tint/50 text-danger' : 'bg-mist-100 text-navy',
          )}
          id={`${id}-status`}
          role="status"
        >
          {multiline(message)}
        </p>
      )}
    </form>
  )
}
