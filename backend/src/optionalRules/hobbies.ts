import type { HobbyTag } from '../../../frontend/src/types/place.ts'
import type { Traveler } from '../../../frontend/src/types/traveler.ts'
import { includesNightlife, isNightlifeOnly } from '../../../frontend/src/utils/geo.ts'

const HOBBY_FOCUS: Record<Exclude<HobbyTag, 'nightlife'>, string> = {
  foodie: 'Lean toward eating and food markets.',
  history: 'Lean toward historic sites.',
  nature: 'Lean toward outdoor and green places.',
  shopping: 'Lean toward shops and markets.',
  photo: 'Lean toward photogenic spots.',
  cafe: 'Lean toward cafés as pauses in the day.',
  art: 'Lean toward art and culture.',
  walking: 'Lean toward places that are good to stroll.',
}

export function hobbyFocusRules(traveler: Traveler): string[] {
  const lines: string[] = []

  if (isNightlifeOnly(traveler.hobbies)) {
    lines.push('Focus on more night-time activities around 15:00.')
  } else if (includesNightlife(traveler.hobbies)) {
    lines.push('Focus on more night-time activities around 23:00.')
  }

  for (const hobby of traveler.hobbies) {
    if (hobby === 'nightlife') {
      continue
    }

    const line = HOBBY_FOCUS[hobby]
    if (line !== undefined) {
      lines.push(line)
    }
  }

  return lines
}
