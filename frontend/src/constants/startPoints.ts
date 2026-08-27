import type { CityId } from '../types/place'

export type MapBounds = [[number, number], [number, number]]

export interface CityStartPreset {
  lat: number
  lng: number
  labelKey: 'startNaritaAirport' | 'startNoiBaiAirport'
  bounds: MapBounds
}

export const CITY_STARTS: Record<CityId, CityStartPreset> = {
  chiba: {
    lat: 35.772,
    lng: 140.3929,
    labelKey: 'startNaritaAirport',
    bounds: [
      [34.9, 139.7],
      [36.15, 140.9],
    ],
  },
  hanoi: {
    lat: 21.2187,
    lng: 105.8042,
    labelKey: 'startNoiBaiAirport',
    bounds: [
      [20.85, 105.6],
      [21.25, 106.05],
    ],
  },
}
