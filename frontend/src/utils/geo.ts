import type { HobbyTag } from '../types/place'
import type { Gender, RangePref, TransportMode } from '../types/traveler'
import type { TravelLeg } from '../types/plan'

export interface LatLng {
  lat: number
  lng: number
}

const EARTH_KM = 6371
const TRAIN_SHORT_KM = 2
const BUS_LONG_KM = 25

export const WALK_KMH = 4.8
export const WALK_MAX_MINUTES = 20
export const WALK_MAX_MINUTES_MALE = 25

const MODE_SPEED: Record<TransportMode, { kmh: number; minMinutes: number }> = {
  taxi: { kmh: 40, minMinutes: 10 },
  train: { kmh: 45, minMinutes: 20 },
  bus: { kmh: 22, minMinutes: 20 },
  walk: { kmh: WALK_KMH, minMinutes: 1 },
}

export const MAX_FIRST_LEG_EXPLORE = 90
export const MAX_FIRST_LEG_STAY_LOCAL = 50
export const MAX_HOP_KM_EXPLORE = 50
export const MAX_HOP_KM_STAY_LOCAL = 12
export const DAY_DEPART_MINUTES = 8 * 60
export const NIGHTLIFE_ONLY_DEPART_MINUTES = 15 * 60
export const NIGHTLIFE_LAST_END_MINUTES = 23 * 60

export function isNightlifeOnly(hobbies: HobbyTag[]): boolean {
  return hobbies.length === 1 && hobbies[0] === 'nightlife'
}

export function includesNightlife(hobbies: HobbyTag[]): boolean {
  return hobbies.includes('nightlife')
}

export function dayDepartMinutes(hobbies: HobbyTag[]): number {
  return isNightlifeOnly(hobbies)
    ? NIGHTLIFE_ONLY_DEPART_MINUTES
    : DAY_DEPART_MINUTES
}

export function walkMaxMinutes(gender: Gender): number {
  return gender === 'male' ? WALK_MAX_MINUTES_MALE : WALK_MAX_MINUTES
}

export function maxFirstLegMinutes(rangePref: RangePref): number {
  return rangePref === 'stayLocal' ? MAX_FIRST_LEG_STAY_LOCAL : MAX_FIRST_LEG_EXPLORE
}

export function maxHopKm(rangePref: RangePref): number {
  return rangePref === 'stayLocal' ? MAX_HOP_KM_STAY_LOCAL : MAX_HOP_KM_EXPLORE
}

export function haversineKm(from: LatLng, to: LatLng): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const latFrom = toRad(from.lat)
  const latTo = toRad(to.lat)
  const half =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latFrom) * Math.cos(latTo) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(half)))
}

export function pickTransportMode(
  preferred: TransportMode,
  km: number,
): TransportMode {
  if (km < TRAIN_SHORT_KM && preferred === 'train') {
    return 'bus'
  }

  if (km >= BUS_LONG_KM && preferred === 'bus') {
    return 'train'
  }

  return preferred
}

function walkingMinutesForKm(km: number): number {
  return Math.max(1, Math.round((km / WALK_KMH) * 60))
}

export function travelMinutes(
  from: LatLng,
  to: LatLng,
  mode: TransportMode,
): number {
  const km = haversineKm(from, to)
  const speed = MODE_SPEED[mode]
  return Math.max(speed.minMinutes, Math.round((km / speed.kmh) * 60))
}

export function buildTravelLeg(
  from: LatLng,
  to: LatLng,
  preferred: TransportMode,
  walkLimitMinutes: number = WALK_MAX_MINUTES,
): TravelLeg {
  const kmRaw = haversineKm(from, to)
  const km = roundKm(kmRaw)
  const walkMinutes = walkingMinutesForKm(kmRaw)
  if (walkMinutes <= walkLimitMinutes) {
    return {
      mode: 'walk',
      km,
      minutes: walkMinutes,
    }
  }

  const mode = pickTransportMode(preferred, km)
  return {
    mode,
    km,
    minutes: travelMinutes(from, to, mode),
  }
}

export function roundKm(km: number): number {
  return Math.round(km * 10) / 10
}

export function samePoint(left: LatLng, right: LatLng, epsilon = 0.0008): boolean {
  return (
    Math.abs(left.lat - right.lat) < epsilon &&
    Math.abs(left.lng - right.lng) < epsilon
  )
}

export function clampLatLng(
  point: LatLng,
  bounds: [[number, number], [number, number]],
): LatLng {
  const south = bounds[0][0]
  const west = bounds[0][1]
  const north = bounds[1][0]
  const east = bounds[1][1]

  return {
    lat: Math.min(north, Math.max(south, point.lat)),
    lng: Math.min(east, Math.max(west, point.lng)),
  }
}
