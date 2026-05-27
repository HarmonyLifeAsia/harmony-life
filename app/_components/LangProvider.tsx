'use client'

import { createContext, useContext } from 'react'
import type { Dictionary } from '../_i18n/dictionaries'

interface LangContextValue {
  dict: Dictionary
  lang: string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({
  dict,
  lang,
  children,
}: {
  dict: Dictionary
  lang: string
  children: React.ReactNode
}) {
  return (
    <LangContext.Provider value={{ dict, lang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useDict(): Dictionary {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useDict must be used within LangProvider')
  return ctx.dict
}

export function useLocale(): string {
  const ctx = useContext(LangContext)
  return ctx?.lang ?? 'en'
}
