import type { Traveler } from '../../../frontend/src/types/traveler.ts'

export type DayPace = 'longStay' | 'manyStops'

export function dayShapeFocusRules(
  traveler: Traveler,
  dayPace: DayPace,
): string[] {
  if (traveler.rangePref === 'stayLocal') {
    return ['Keep the day in one area when you can.']
  }

  if (dayPace === 'longStay') {
    return ['Lean toward fewer, longer stops.']
  }

  return ['Lean toward more, shorter stops.']
}
