import type { CityId, HobbyTag, LifestyleTag } from '../types/place'
import type { Gender } from '../types/traveler'

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

export const HOBBY_LABELS: Record<HobbyTag, string> = {
  foodie: 'グルメ',
  history: '歴史',
  nature: '自然',
  shopping: 'ショッピング',
  photo: '写真',
  cafe: 'カフェ',
  art: 'アート',
  nightlife: 'ナイトライフ',
  walking: '散策',
}

export const CATEGORY_LABELS = {
  attraction: '観光地',
  restaurant: 'レストラン',
  cafe: 'カフェ',
  market: '市場',
} as const

export const PRICE_LABELS = {
  1: 'リーズナブル',
  2: 'ふつう',
  3: '少し高め',
} as const

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
  unspecified: '回答しない',
}

export const LIFESTYLE_LABELS: Record<LifestyleTag, string> = {
  relaxed: 'ゆったり',
  active: 'アクティブ',
  budget: 'コスパ重視',
  luxury: '少し贅沢',
  foodie: '食べ歩き',
}
