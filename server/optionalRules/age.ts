import type { Traveler } from '../../src/types/traveler.ts'

export function ageFocusRules(traveler: Traveler): string[] {
  if (traveler.age < 18) {
    return ['Prefer a comfortable day that does not run too late.']
  }

  if (traveler.age < 35) {
    return ['A longer evening is fine.']
  }

  if (traveler.age < 60) {
    return ['Lean toward a balanced day.']
  }

  return ['Prefer a gentler pace.']
}
