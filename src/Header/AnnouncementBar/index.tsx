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
 * The navy strip above the header (Figma `TOP BAR`, 2002:24): a two-line offer and a live
 * countdown, every item spaced 5px apart in one centred 56px row.
 *
 * The countdown starts empty and fills in after mount: rendering a live clock during SSR
 * would produce markup that never matches the client's first paint.
 */
export const AnnouncementBar: React.FC<{
  endsAt?: string | null
  text?: string | null
  title?: string | null
}> = ({ endsAt, text, title }) => {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!endsAt) return

    const target = new Date(endsAt).getTime()
    if (Number.isNaN(target)) return

    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return (
    <div className="w-full bg-navy px-1 font-inter text-white sm:px-4">
      {/* Mobile (6246:2933): offer and countdown stack, 6px / 4px padding, 5px apart. */}
      <div className="mx-auto flex min-h-14 max-w-[1400px] flex-col items-center justify-center gap-[5px] py-[6px] text-center sm:flex-row sm:py-0 [&_sup]:leading-[0]">
        <p className="w-[401px] max-w-full leading-[normal] sm:w-[557px] sm:shrink-0">
          {title && (
            <span className="block text-[17px] font-bold text-cream">{marks(title)}</span>
          )}
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
