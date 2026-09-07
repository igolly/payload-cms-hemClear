'use client'
import React, { useEffect, useState } from 'react'

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

const parts = (ms: number) => [
  { label: 'Days', value: pad(Math.floor(ms / 86400000)) },
  { label: 'Hrs', value: pad(Math.floor(ms / 3600000) % 24) },
  { label: 'Mins', value: pad(Math.floor(ms / 60000) % 60) },
  { label: 'Secs', value: pad(Math.floor(ms / 1000) % 60) },
]

/**
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
    <div className="w-full bg-[#1c2f6e] px-4 py-2 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-x-8 gap-y-1 text-center sm:flex-row">
        <p className="text-xs leading-tight">
          {title && <span className="block font-bold text-[#ffe066]">{title}</span>}
          {text}
        </p>

        {remaining !== null && (
          <ul className="flex items-center gap-3">
            {parts(remaining).map((part) => (
              <li className="flex flex-col items-center leading-none" key={part.label}>
                <span className="text-sm font-bold tabular-nums">{part.value}</span>
                <span className="text-[9px] uppercase tracking-wide text-white/70">
                  {part.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
