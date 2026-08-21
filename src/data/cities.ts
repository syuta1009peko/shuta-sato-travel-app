import type { CityData } from '../types/place'
import hanoiJson from './hanoi.json' with { type: 'json' }
import chibaJson from './chiba.json' with { type: 'json' }

export const hanoiData = hanoiJson as CityData
export const chibaData = chibaJson as CityData

export function getCityData(cityId: CityData['cityId']): CityData {
  return cityId === 'hanoi' ? hanoiData : chibaData
}
