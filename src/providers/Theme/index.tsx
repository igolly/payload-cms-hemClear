'use client'

import React, { createContext, use, useEffect, useState } from 'react'

import type { ThemeContextType } from './types'

import { defaultTheme } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: defaultTheme,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState(defaultTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', defaultTheme)
  }, [])

  return <ThemeContext value={{ setTheme: () => null, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
