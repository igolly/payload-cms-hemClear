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

import { puckConfig } from '@/puck/config'
import { pinnedSyncPlugin } from '@/puck/pinnedSync'
import { seedFromBlocksPlugin } from '@/puck/seedFromBlocks'

export const PuckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // Seeding runs first: it fills an empty canvas from the page's blocks, and the pinned
  // plugin then frames whatever ended up there with the header, hero and footer.
  <PuckConfigProvider config={puckConfig} plugins={[seedFromBlocksPlugin, pinnedSyncPlugin]}>
    {children}
  </PuckConfigProvider>
)

export default PuckProvider
