import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { HeaderView } from './View'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  return <HeaderView data={headerData} />
}
