import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { AnnouncementBar } from './AnnouncementBar'
import { HeaderClient } from './Component.client'

/**
 * The header, rendered from data it is handed rather than data it fetches.
 *
 * `Component.tsx` reads the global and hands it over; the Puck canvas hands over the props
 * an editor is currently typing into. Keeping the markup here is what lets the same header
 * appear in both places without the editor needing a second implementation to drift from.
 */
export const HeaderView: React.FC<{ data: HeaderType }> = ({ data }) => (
  <>
    {data?.announcementEnabled && (
      <AnnouncementBar
        endsAt={data.announcementEndsAt}
        text={data.announcementText}
        title={data.announcementTitle}
      />
    )}
    <HeaderClient data={data} />
  </>
)
