import {
  LOCALE_STORAGE_KEY,
  isAppLocale,
  type AppLocale,
} from './locale'

export function detectBrowserLocale(): AppLocale {
  const languages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language]

  for (const language of languages) {
    const lower = language.toLowerCase()
    if (lower.startsWith('ja')) {
      return 'ja'
    }
    if (lower.startsWith('vi')) {
      return 'vi'
    }
    if (lower.startsWith('en')) {
      return 'en'
    }
  }

  return 'en'
}

export function readStoredLocale(): AppLocale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored !== null && isAppLocale(stored)) {
    return stored
  }

  return detectBrowserLocale()
}
