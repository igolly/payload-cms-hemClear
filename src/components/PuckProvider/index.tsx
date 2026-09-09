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
import { seedFromBlocksPlugin } from '@/puck/seedFromBlocks'

export const PuckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PuckConfigProvider config={puckConfig} plugins={[seedFromBlocksPlugin]}>
    {children}
  </PuckConfigProvider>
)

export default PuckProvider
