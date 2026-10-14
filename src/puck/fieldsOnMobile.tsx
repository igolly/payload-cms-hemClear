'use client'

/**
 * Puck's phone-layout "Fields" tab, mounted only when the phone layout is showing.
 *
 * Puck keeps every left-sidebar tab mounted and hides the inactive ones with CSS, and on a
 * desktop it adds a Fields tab there too — a second copy of the right sidebar, for phones.
 * So on a desktop every field of the selected section was rendered twice, and every
 * keystroke in the sidebar re-rendered both copies. Handing Puck a `fields` plugin of our
 * own replaces its default one; this one renders the same panel, but only below the
 * breakpoint where Puck's own layout actually shows it.
 */
import React, { useSyncExternalStore } from 'react'
import type { Plugin } from '@puckeditor/core'
import { fieldsPlugin } from '@puckeditor/core'

/** Puck shows its mobile-only tabs below 638px (`NavItem--mobileOnly` in its stylesheet). */
const PHONE_LAYOUT = '(max-width: 637px)'

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(PHONE_LAYOUT)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const isPhoneLayout = () => window.matchMedia(PHONE_LAYOUT).matches

const puckFields = fieldsPlugin()
const PuckFieldsPanel = puckFields.render as React.FC

const FieldsOnMobile: React.FC = () =>
  useSyncExternalStore(subscribe, isPhoneLayout, () => false) ? <PuckFieldsPanel /> : null

export const fieldsOnMobilePlugin: Plugin = { ...puckFields, render: () => <FieldsOnMobile /> }
