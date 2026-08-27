import type { Traveler } from '../../../frontend/src/types/traveler.ts'

export function genderFocusRules(traveler: Traveler): string[] {
  if (traveler.gender !== 'male') {
    return []
  }

  return ['Prefer walking when hops are short.']
}
