'use client'

/**
 * Makes the site's Puck configuration available to the visual editor view that the
 * payload-puck plugin registers at `/admin/puck-editor/:collection/:id`.
 *
 * Registered through `admin.components.providers` in `payload.config.ts` rather than by
 * editing `src/app/(payload)/layout.tsx`, which Payload regenerates.
 */
import React from 'react'
import { PuckConfigProvider } from '@delmaredigital/payload-puck/client'
import { blocksPlugin } from '@puckeditor/core'

import { puckConfig } from '@/puck/config'
import { pageSwitcherPlugin } from '@/puck/pageSwitcher'
import { pinnedSyncPlugin } from '@/puck/pinnedSync'
import { seedFromBlocksPlugin } from '@/puck/seedFromBlocks'

/*
 * The editor opens on the Outline tab rather than Blocks. Puck opens whichever sidebar tab
 * comes first, and always lists its own Blocks then Outline ahead of anything passed in —
 * but a plugin passed again under a name it already has replaces that tab at its new
 * position. Handing Blocks back here therefore moves it after Outline, and leaves Outline
 * first. Editing an existing page starts from its sections more often than from new ones.
 */
const blocksAfterOutline = blocksPlugin({ label: 'Blocks' })

export const PuckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // Seeding runs first: it fills an empty canvas from the page's blocks, and the pinned
  // plugin then frames whatever ended up there with the header, hero and footer.
  <PuckConfigProvider
    config={puckConfig}
    plugins={[blocksAfterOutline, seedFromBlocksPlugin, pinnedSyncPlugin, pageSwitcherPlugin]}
  >
    {children}
  </PuckConfigProvider>
)

export default PuckProvider
