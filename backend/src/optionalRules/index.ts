import type { AppLocale } from '../../../frontend/src/i18n/locale.ts'
import type { Traveler } from '../../../frontend/src/types/traveler.ts'
import { ageFocusRules } from './age.ts'
import { dayShapeFocusRules, type DayPace } from './dayShape.ts'
import { genderFocusRules } from './gender.ts'
import { hobbyFocusRules } from './hobbies.ts'
import { lifestyleFocusRules } from './lifestyle.ts'
import { maleWalkOptionalRules } from './maleWalk.ts'
import { nightlifeOptionalRules } from './nightlife.ts'

export type { DayPace }

export function collectEnglishFocus(
  traveler: Traveler,
  dayPace: DayPace,
): string[] {
  return [
    ...hobbyFocusRules(traveler),
    ...ageFocusRules(traveler),
    ...genderFocusRules(traveler),
    ...lifestyleFocusRules(traveler),
    ...dayShapeFocusRules(traveler, dayPace),
  ]
}

export function collectOptionalRules(
  traveler: Traveler,
  locale: AppLocale,
  dayPace: DayPace = 'manyStops',
): string[] {
  if (locale === 'en') {
    return collectEnglishFocus(traveler, dayPace)
  }

  return [
    ...nightlifeOptionalRules(traveler, locale),
    ...maleWalkOptionalRules(traveler, locale),
  ]
}
