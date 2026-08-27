export type CityId = 'hanoi' | 'chiba'

export type PlaceCategory = 'attraction' | 'restaurant' | 'cafe' | 'market'

export type TimeSlot =
  | 'morning'
  | 'lunch'
  | 'afternoon'
  | 'snack'
  | 'dinner'
  | 'evening'

export type HobbyTag =
  | 'history'
  | 'nature'
  | 'photo'
  | 'shopping'
  | 'art'
  | 'walking'
  | 'nightlife'
  | 'foodie'
  | 'cafe'

export type LifestyleTag = 'relaxed' | 'active' | 'budget' | 'luxury' | 'foodie'

export type PriceRange = 1 | 2 | 3

export interface Place {
  id: string
  nameJa: string
  category: PlaceCategory
  area: string
  timeSlots: TimeSlot[]
  durationMinutes: number
  openLabel: string
  closeLabel: string
  priceRange: PriceRange
  tags: HobbyTag[]
  ageMin: number
  ageMax: number
  lifestyle: LifestyleTag[]
  descriptionJa: string
  reasonHintJa: string
  imageUrl?: string
  lat: number
  lng: number
}

export interface CityData {
  cityId: CityId
  cityNameJa: string
  citySummaryJa: string
  places: Place[]
}
