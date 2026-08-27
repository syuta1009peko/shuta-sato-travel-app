export type AppLocale = 'ja' | 'en' | 'vi'

export const APP_LOCALES: AppLocale[] = ['ja', 'en', 'vi']

export const LOCALE_STORAGE_KEY = 'shuta-travel-locale'

export const LOCALE_LABELS: Record<AppLocale, string> = {
  ja: '日本語',
  en: 'English',
  vi: 'Tiếng Việt',
}

export function isAppLocale(value: string): value is AppLocale {
  return value === 'ja' || value === 'en' || value === 'vi'
}
