import type { AppLocale } from '../../../frontend/src/i18n/locale.ts'
import type { Traveler } from '../../../frontend/src/types/traveler.ts'

const COPY: Record<AppLocale, string> = {
  ja: '徒歩に切り替える上限は 25 分にする',
  en: 'Switch to walking when the hop is 25 minutes or less.',
  vi: 'Chuyển sang đi bộ khi chặng trong 25 phút.',
}

export function maleWalkOptionalRules(
  traveler: Traveler,
  locale: AppLocale,
): string[] {
  if (traveler.gender !== 'male') {
    return []
  }

  return [COPY[locale]]
}
