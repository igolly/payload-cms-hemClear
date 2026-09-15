import React from 'react'

import { cn } from '@/utilities/ui'

/**
 * The accordion header shared by the detail sections and "What's in it" — Figma 6216:3133:
 * a 50px row, the title in 22px bold, and the comp's 50px "-" glyph at the right edge
 * (drawn as a 17x3 bar, plus a crossing bar while the panel is closed).
 */
export const Toggle: React.FC<{
  children: React.ReactNode
  controls: string
  onClick: () => void
  open: boolean
}> = ({ children, controls, onClick, open }) => (
  <h2>
    <button
      aria-controls={controls}
      aria-expanded={open}
      className="flex min-h-[50px] w-full items-center justify-between gap-4 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="text-[22px] font-bold leading-[22px] text-navy [&_sup]:leading-[0]">
        {children}
      </span>
      <span aria-hidden="true" className="relative mr-[3px] h-[3px] w-[17px] shrink-0">
        <span className="absolute inset-0 bg-navy" />
        <span
          className={cn(
            'absolute inset-0 bg-navy transition-transform',
            open ? 'rotate-0' : 'rotate-90',
          )}
        />
      </span>
    </button>
  </h2>
)
