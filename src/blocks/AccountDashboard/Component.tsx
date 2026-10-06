import React from 'react'

import type { AccountDashboardBlock as Props } from '@/payload-types'

import { Dashboard } from './Dashboard'

/**
 * The customer account page (reference: IM8-style account dashboard, in the brand palette).
 * The page around it is static, so the customer's own data is fetched in the browser after
 * load, through a server action that checks their Supabase session; a visitor without one is
 * sent to the login page.
 */
export const AccountDashboardBlock: React.FC<Props> = (props) => (
  <section className="w-full bg-white px-4 font-inter text-navy sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[860px] py-6 lg:py-8">
      <Dashboard {...props} />
    </div>
  </section>
)
