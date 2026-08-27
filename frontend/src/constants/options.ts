import type { CityId, HobbyTag, LifestyleTag } from '../types/place'
import type { Gender, RangePref, TransportMode } from '../types/traveler'

export const TRAVELER_AGE_MIN = 1
export const TRAVELER_AGE_MAX = 120
export const START_LABEL_MAX_LENGTH = 80

export const CITY_OPTIONS: { value: CityId; label: string }[] = [
  { value: 'hanoi', label: 'ハノイ（ベトナム）' },
  { value: 'chiba', label: '千葉（日本）' },
]

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
  { value: 'unspecified', label: '回答しない' },
]

export const HOBBY_OPTIONS: { value: HobbyTag; label: string }[] = [
  { value: 'foodie', label: 'グルメ' },
  { value: 'history', label: '歴史' },
  { value: 'nature', label: '自然' },
  { value: 'shopping', label: 'ショッピング' },
  { value: 'photo', label: '写真' },
  { value: 'cafe', label: 'カフェ' },
  { value: 'art', label: 'アート' },
  { value: 'nightlife', label: 'ナイトライフ' },
  { value: 'walking', label: '散策' },
]

export const LIFESTYLE_OPTIONS: { value: LifestyleTag; label: string }[] = [
  { value: 'relaxed', label: 'ゆったり' },
  { value: 'active', label: 'アクティブ' },
  { value: 'budget', label: 'コスパ重視' },
  { value: 'luxury', label: '少し贅沢' },
  { value: 'foodie', label: '食べ歩き' },
]

export const TRANSPORT_OPTIONS: { value: TransportMode }[] = [
  { value: 'train' },
  { value: 'bus' },
  { value: 'taxi' },
]

export const RANGE_PREF_OPTIONS: { value: RangePref }[] = [
  { value: 'stayLocal' },
  { value: 'explore' },
]

export function isCityId(value: unknown): value is CityId {
  return CITY_OPTIONS.some((option) => option.value === value)
}

export function isGender(value: unknown): value is Gender {
  return GENDER_OPTIONS.some((option) => option.value === value)
}

export function isHobbyTag(value: unknown): value is HobbyTag {
  return HOBBY_OPTIONS.some((option) => option.value === value)
}

export function isLifestyleTag(value: unknown): value is LifestyleTag {
  return LIFESTYLE_OPTIONS.some((option) => option.value === value)
}

export function isTransportMode(value: unknown): value is TransportMode {
  return TRANSPORT_OPTIONS.some((option) => option.value === value)
}

export function isRangePref(value: unknown): value is RangePref {
  return RANGE_PREF_OPTIONS.some((option) => option.value === value)
}
