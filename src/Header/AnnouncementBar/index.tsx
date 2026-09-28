'use client'
import React, { useEffect, useState } from 'react'
import { marks } from '@/utilities/marks'

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

const parts = (ms: number) => [
  { label: 'Days', value: pad(Math.floor(ms / 86400000)) },
  { label: 'Hrs', value: pad(Math.floor(ms / 3600000) % 24) },
  { label: 'Mins', value: pad(Math.floor(ms / 60000) % 60) },
  { label: 'Secs', value: pad(Math.floor(ms / 1000) % 60) },
]


/**
 * When this visitor's countdown runs out.
 *
 * A fixed date is the same instant for everyone and simply passes. A rolling window is per
 * visitor: it starts when they first see the bar and is kept in `localStorage`, so it counts
 * down across pages and reloads rather than restarting on each one. Once it has passed, the
 * next visit opens a fresh window — that is what a rolling offer is.
 *
 * Storage can be unavailable (a private window, or blocked site data). The timer then runs
 * for the full stretch from this page view, which is the graceful version of the same thing.
 */
const deadlineFor = (countdown?: null | string, endsAt?: null | string): null | number => {
  if (!countdown || countdown === 'off') return null

  if (countdown === 'date') {
    if (!endsAt) return null
    const target = new Date(endsAt).getTime()
    return Number.isNaN(target) ? null : target
  }

  const hours = Number(countdown)
  if (!Number.isFinite(hours) || hours <= 0) return null

  const key = `hemclear:countdown:${hours}`
  const fresh = Date.now() + hours * 3600000

  try {
    const stored = Number(window.localStorage.getItem(key))
    if (stored > Date.now()) return stored
    window.localStorage.setItem(key, String(fresh))
  } catch {
    // Unavailable: fall through to the full stretch from now.
  }

  return fresh
}

/**
 * The navy strip above the header (Figma `TOP BAR`, 2002:24): a two-line offer and a live
 * countdown, every item spaced 5px apart in one centred 56px row.
 *
 * The countdown starts empty and fills in after mount: rendering a live clock during SSR
 * would produce markup that never matches the client's first paint.
 */
export const AnnouncementBar: React.FC<{
  countdown?: string | null
  endsAt?: string | null
  text?: string | null
  title?: string | null
}> = ({ countdown, endsAt, text, title }) => {
  const [remaining, setRemaining] = useState<null | number>(null)

  useEffect(() => {
    const target = deadlineFor(countdown, endsAt)
    if (target === null) return

    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [countdown, endsAt])

  return (
    <div className="w-full bg-navy px-1 font-inter text-white sm:px-4">
      {/* Mobile (6246:2933): offer and countdown stack, 6px / 4px padding, 5px apart. */}
      <div className="mx-auto flex min-h-14 max-w-[1400px] flex-col items-center justify-center gap-[5px] py-[6px] text-center sm:flex-row sm:py-0 [&_sup]:leading-[0]">
        <p className="w-[401px] max-w-full leading-[normal] sm:w-[557px] sm:shrink-0">
          {title && <span className="block text-[17px] font-bold text-cream">{marks(title)}</span>}
          <span className="block text-[13px]">{marks(text)}</span>
        </p>

        {remaining !== null && (
          <ul className="flex h-[30px] items-center justify-center gap-[5px] sm:h-auto">
            {parts(remaining).map((part, i) => (
              <React.Fragment key={part.label}>
                {i > 0 && (
                  <li
                    aria-hidden="true"
                    className="flex h-[42px] w-[7px] items-center justify-center text-[21px] font-bold leading-[normal] text-white/50"
                  >
                    :
                  </li>
                )}
                <li className="flex h-[42px] w-[30px] flex-col items-center justify-center leading-[normal]">
                  <span className="text-[17px] font-bold tabular-nums">{part.value}</span>
                  <span className="text-[9px] uppercase">{part.label}</span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
