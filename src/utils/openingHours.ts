import type { Place } from '../types/place'
import {
  ALWAYS_OPEN_HOURS,
  MAX_CLOCK_MINUTES,
  minutesToTimeLabel,
  timeLabelToMinutes,
} from './slotTime'

type PlaceHours = Pick<Place, 'openLabel' | 'closeLabel' | 'durationMinutes'>

export interface OpeningWindow {
  open: number
  close: number
  latestStart: number
}

export function isAlwaysOpen(place: Pick<PlaceHours, 'openLabel' | 'closeLabel'>): boolean {
  return place.openLabel === ALWAYS_OPEN_HOURS && place.closeLabel === ALWAYS_OPEN_HOURS
}

export function openingWindow(place: PlaceHours): OpeningWindow {
  if (isAlwaysOpen(place)) {
    const close = MAX_CLOCK_MINUTES
    const latestStart = Math.max(0, close - place.durationMinutes)
    return { open: 0, close, latestStart }
  }

  const open = timeLabelToMinutes(place.openLabel) ?? 9 * 60
  const close = timeLabelToMinutes(place.closeLabel) ?? 21 * 60
  const latestStart = Math.max(open, close - place.durationMinutes)
  return { open, close, latestStart }
}

export function clampVisitStart(minutes: number, place: PlaceHours): number {
  const { open, latestStart } = openingWindow(place)
  return Math.min(latestStart, Math.max(open, minutes))
}

export function visitFitsHours(minutes: number, place: PlaceHours): boolean {
  const { open, latestStart } = openingWindow(place)
  return minutes >= open && minutes <= latestStart
}

export function clampedTimeLabel(timeLabel: string, place: PlaceHours): string {
  const minutes = timeLabelToMinutes(timeLabel) ?? openingWindow(place).open
  return minutesToTimeLabel(clampVisitStart(minutes, place))
}
