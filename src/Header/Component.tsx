import { HeaderClient } from './Component.client'
import { AnnouncementBar } from './AnnouncementBar'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  return (
    <>
      {headerData?.announcementEnabled && (
        <AnnouncementBar
          endsAt={headerData.announcementEndsAt}
          text={headerData.announcementText}
          title={headerData.announcementTitle}
        />
      )}
      <HeaderClient data={headerData} />
    </>
  )
}
