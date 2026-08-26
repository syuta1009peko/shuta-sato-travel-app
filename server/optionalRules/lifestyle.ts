import type { Traveler } from '../../src/types/traveler.ts'

const LIFESTYLE_FOCUS: Record<Traveler['lifestyle'], string> = {
  relaxed: 'Lean toward a slower day with longer stays.',
  active: 'Lean toward more movement through the day.',
  budget: 'Lean toward places with a lower priceRange.',
  luxury: 'Lean toward nicer places.',
  foodie: 'Let meals shape the day.',
}

export function lifestyleFocusRules(traveler: Traveler): string[] {
  return [LIFESTYLE_FOCUS[traveler.lifestyle]]
}
