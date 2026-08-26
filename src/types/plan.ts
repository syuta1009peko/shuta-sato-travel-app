import type { Place, TimeSlot } from './place'
import type { TransportMode } from './traveler'
import type { AppLocale } from '../i18n/locale'

export interface TravelLeg {
  mode: TransportMode
  minutes: number
  km: number
}

export interface PlanSlot {
  timeLabel: string
  slotId?: TimeSlot
  slotNameJa: string
  place: Place
  reasonJa: string
  travelFromPrevious?: TravelLeg
}

export interface DayPlan {
  locale?: AppLocale
  cityNameJa: string
  citySummaryJa: string
  slots: PlanSlot[]
}
