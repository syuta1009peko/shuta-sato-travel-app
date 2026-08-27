import type { CityId } from '../types/place'

export interface CityVisual {
  cityId: CityId
  cityNameJa: string
  primary: string
  accent: string
  background: string
  paper: string
  reasonBg: string
  reasonText: string
  heroImageUrl: string
  heroCredit: string
}

export const CITY_VISUALS: Record<CityId, CityVisual> = {
  hanoi: {
    cityId: 'hanoi',
    cityNameJa: 'ハノイ',
    primary: '#C45C26',
    accent: '#1F6B4A',
    background: '#F7EFE4',
    paper: '#FFFBF6',
    reasonBg: '#F3E6D4',
    reasonText: '#6B3A16',
    heroImageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Hoan_Kiem_Lake.jpg?width=1600',
    heroCredit: 'Wikimedia Commons',
  },
  chiba: {
    cityId: 'chiba',
    cityNameJa: '千葉',
    primary: '#1B4B7A',
    accent: '#C9A227',
    background: '#EEF3F8',
    paper: '#F7FBFF',
    reasonBg: '#E4EEF7',
    reasonText: '#123252',
    heroImageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Makuhari_Seaside_Park_1.JPG?width=1600',
    heroCredit: 'Wikimedia Commons',
  },
}

export const DEFAULT_BACKGROUND = '#F4EDE6'
export const DEFAULT_PRIMARY = '#C45C26'

export function toCommonsThumbUrl(imageUrl: string): string {
  const match = imageUrl.match(/Special:FilePath\/([^?]+)(?:\?width=(\d+))?/)
  if (match === null) {
    return imageUrl
  }

  const fileName = decodeURIComponent(match[1])
  const width = match[2] ?? '800'
  return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(fileName)}&w=${width}`
}

