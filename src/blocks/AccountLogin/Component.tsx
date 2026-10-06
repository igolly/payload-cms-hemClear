import Link from 'next/link'
import React from 'react'

import type { AccountLoginBlock as Props } from '@/payload-types'

import { marks } from '@/utilities/marks'
import { LoginForm } from './LoginForm'

/**
 * The account login page: a centred welcome, one email field and a button that asks for a
 * one-time code, then a fallback way in. A 490px column — the reference design's 704px at 70%,
 * which read oversized on the site — on white with the brand palette in place of its red.
 */
export const AccountLoginBlock: React.FC<Props> = ({
  alternateLabel,
  alternateUrl,
  buttonLabel,
  emailLabel,
  emailPlaceholder,
  heading,
  helpText,
  subheading,
  unavailableMessage,
}) => {
  const hasAlternate = Boolean(alternateLabel && typeof alternateUrl === 'string' && alternateUrl)

  return (
    <section className="w-full bg-white px-4 font-inter text-navy sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[490px] flex-col justify-center gap-8 py-12 lg:py-16">
        {(heading || subheading) && (
          <header className="flex flex-col items-center gap-1.5 text-center [&_sup]:leading-[0]">
            {heading && (
              <h1
                className="font-marcellus text-[32px] leading-[1.15] text-heading sm:text-[40px]"
                data-payload-subpath="heading"
              >
                {marks(heading)}
              </h1>
            )}
            {subheading && (
              <p
                className="font-playfair text-[15px] leading-[1.4] text-body sm:text-base"
                data-payload-subpath="subheading"
              >
                {marks(subheading)}
              </p>
            )}
          </header>
        )}

        <LoginForm
          buttonLabel={buttonLabel}
          emailLabel={emailLabel}
          emailPlaceholder={typeof emailPlaceholder === 'string' ? emailPlaceholder : undefined}
          unavailableMessage={unavailableMessage}
        />

        {/* The help line is a question, so it only shows with the link that answers it. */}
        {hasAlternate && (
          <div className="-mt-3 flex flex-col items-center gap-0.5 text-center text-sm leading-[1.5]">
            {helpText && (
              <p className="font-medium text-navy" data-payload-subpath="helpText">
                {marks(helpText)}
              </p>
            )}
            <Link
              className="text-brand-500 underline-offset-4 transition-colors hover:text-brand hover:underline"
              data-payload-subpath="alternateLabel"
              href={alternateUrl as string}
            >
              {marks(alternateLabel)}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
