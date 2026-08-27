import type { CityId, HobbyTag, LifestyleTag } from './place'

export type Gender = 'male' | 'female' | 'other' | 'unspecified'

export type TransportMode = 'bus' | 'taxi' | 'train' | 'walk'

export type RangePref = 'explore' | 'stayLocal'

export interface StartPoint {
  lat: number
  lng: number
  label: string
}

export interface Traveler {
  cityId: CityId
  gender: Gender
  age: number
  hobbies: HobbyTag[]
  lifestyle: LifestyleTag
  start: StartPoint
  transport: TransportMode
  rangePref: RangePref
}
