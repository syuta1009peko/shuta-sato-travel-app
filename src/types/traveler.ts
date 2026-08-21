import type { CityId, HobbyTag, LifestyleTag } from './place'

export type Gender = 'male' | 'female' | 'other' | 'unspecified'

export interface Traveler {
  cityId: CityId
  gender: Gender
  age: number
  hobbies: HobbyTag[]
  lifestyle: LifestyleTag
}
