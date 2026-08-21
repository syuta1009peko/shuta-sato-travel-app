import type { Place, TimeSlot } from './place'
import type { AppLocale } from '../i18n/locale'

export interface PlanSlot {
  timeLabel: string
  slotId?: TimeSlot
  slotNameJa: string
  place: Place
  reasonJa: string
}

export interface DayPlan {
  locale?: AppLocale
  cityNameJa: string
  citySummaryJa: string
  slots: PlanSlot[]
}

export interface PlanSlot {
  timeLabel: string
  slotId?: TimeSlot
  slotNameJa: string
  place: Place
  reasonJa: string
}

export interface DayPlan {
  cityNameJa: string
  citySummaryJa: string
  slots: PlanSlot[]
}
