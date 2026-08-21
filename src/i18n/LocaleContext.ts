import { createContext, useContext } from 'react'
import type { AppLocale } from './locale'
import type { UiCopy } from './ui'

interface LocaleContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  ui: UiCopy
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined,
)

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (value === undefined) {
    throw new Error('useLocale must be used inside LocaleProvider.')
  }

  return value
}
