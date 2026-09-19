import React from 'react'

import { marks } from '@/utilities/marks'

/** Figma "PILL DISCLAIMER" (2003:240): the note box under the cards. */
export const Disclaimer: React.FC<{ text?: string | null; title?: string | null }> = ({
  text,
  title,
}) => {
  if (!title && !text) return null

  return (
    <div className="py-[18.75px] lg:px-[62.5px]">
      <div className="flex items-start gap-3 rounded-[15.63px] border-[1.25px] border-aqua-200 bg-white px-[15px] py-[11.25px] sm:gap-[18.75px] sm:px-[17.5px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-7 w-7 shrink-0 sm:h-[35px] sm:w-[35px]"
          decoding="async"
          height={35}
          loading="lazy"
          src="/icons/ingredients/info.svg"
          width={35}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[3.13px]">
          {title && (
            <p className="text-[15px] font-bold leading-5 text-brand-600 [&_sup]:leading-[0]">
              {marks(title)}
            </p>
          )}
          {text && (
            <p
              className="whitespace-pre-line text-[12.5px] leading-[17.5px] text-brand-600 [&_sup]:leading-[0]"
              data-payload-subpath="disclaimer"
            >
              {marks(text)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
