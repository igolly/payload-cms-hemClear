import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { FooterView } from './View'

export async function Footer() {
  const footer = await getCachedGlobal('footer', 2)()

  return <FooterView data={footer} />
}
