'use client'

/**
 * Sidebar text inputs that hand their value to the page once typing pauses, not per key.
 *
 * Puck's own text and textarea fields dispatch on every keystroke, and every dispatch
 * re-renders the edited section on the canvas — synchronously, inside the key's event
 * handler. For a small section that goes unnoticed; for Product Detail, whose `variants`
 * each carry their own plans, it blocked the editor for up to a second per character
 * (reported by the dev tools as an INP issue on `…plans-1_saveLabel`).
 *
 * This keeps Puck's own field — the input still updates on every key from its own local
 * state — and only defers the change reaching the page. The pending value is flushed as
 * soon as the input loses focus or unmounts, so publishing, switching sections or closing a
 * row never drops the last characters typed.
 */
import React, { cloneElement, isValidElement, useCallback, useEffect, useRef } from 'react'
import type { Plugin } from '@puckeditor/core'

/** Long enough to cover the gap between keys of steady typing, short enough to feel live. */
const COMMIT_AFTER_MS = 250

type OnChange = (...args: unknown[]) => void

const DeferredField: React.FC<{ children: React.ReactNode; onChange: OnChange }> = ({
  children,
  onChange,
}) => {
  const latest = useRef(onChange)
  latest.current = onChange
  const pending = useRef<null | unknown[]>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const flush = useCallback(() => {
    clearTimeout(timer.current)
    const args = pending.current
    pending.current = null
    if (args) latest.current(...args)
  }, [])

  const defer = useCallback<OnChange>(
    (...args) => {
      pending.current = args
      clearTimeout(timer.current)
      timer.current = setTimeout(flush, COMMIT_AFTER_MS)
    },
    [flush],
  )

  useEffect(() => flush, [flush])

  if (!isValidElement<{ onChange?: OnChange }>(children)) return <>{children}</>

  // `onBlur` here runs before Puck's own wrapper clears the field's focus, so the page holds
  // the final value by the time the input stops guarding its local copy.
  return (
    <div onBlur={flush} style={{ display: 'contents' }}>
      {cloneElement(children, { onChange: defer })}
    </div>
  )
}

const deferred = ({ children, onChange }: { children: React.ReactNode; onChange: unknown }) => (
  <DeferredField onChange={onChange as OnChange}>{children}</DeferredField>
)

export const deferredTypingPlugin: Plugin = {
  name: 'deferred-typing',
  overrides: {
    fieldTypes: {
      text: deferred,
      textarea: deferred,
    },
  },
}
