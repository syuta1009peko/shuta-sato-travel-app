import type { Place, PriceRange } from '../types/place'
import { ALWAYS_OPEN_HOURS } from '../utils/slotTime'
import type { AppLocale } from './locale'
import { PLACE_COPY_EN, type PlaceCopy } from './placeCopyEn'
import { PLACE_COPY_VI } from './placeCopyVi'
import { fillTemplate, getUi } from './ui'

export function getPlaceCopy(place: Place, locale: AppLocale): PlaceCopy {
  if (locale === 'en') {
    return PLACE_COPY_EN[place.id] ?? japaneseCopy(place)
  }

  if (locale === 'vi') {
    return PLACE_COPY_VI[place.id] ?? japaneseCopy(place)
  }

  return japaneseCopy(place)
}

function japaneseCopy(place: Place): PlaceCopy {
  return {
    name: place.nameJa,
    description: place.descriptionJa,
    reasonHint: place.reasonHintJa,
  }
}

export function getAreaLabel(area: string, locale: AppLocale): string {
  return getUi(locale).area[area] ?? area
}

export function getCityName(cityId: 'hanoi' | 'chiba', locale: AppLocale): string {
  const ui = getUi(locale)
  return cityId === 'hanoi' ? ui.cityHanoi : ui.cityChiba
}

export function formatDuration(minutes: number, locale: AppLocale): string {
  const ui = getUi(locale)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) {
    return fillTemplate(ui.durationAboutMinutes, { minutes })
  }

  if (rest === 0) {
    return fillTemplate(ui.durationAboutHours, { hours })
  }

  return fillTemplate(ui.durationAboutHoursMinutes, { hours, minutes: rest })
}

export function formatHours(
  openLabel: string,
  closeLabel: string,
  locale: AppLocale,
): string {
  if (openLabel === ALWAYS_OPEN_HOURS && closeLabel === ALWAYS_OPEN_HOURS) {
    return getUi(locale).hoursAlwaysOpen
  }

  return fillTemplate(getUi(locale).hoursLabel, {
    open: openLabel,
    close: closeLabel,
  })
}

export function formatPrice(priceRange: PriceRange, locale: AppLocale): string {
  const ui = getUi(locale)
  return fillTemplate(ui.priceLabel, {
    price: ui.price[priceRange],
  })
}

export function slotNameFromTime(timeLabel: string, locale: AppLocale): string {
  const ui = getUi(locale)
  const hourText = timeLabel.split(':')[0]
  const hour = Number(hourText)

  if (!Number.isFinite(hour)) {
    return ui.slotFallback
  }

  if (hour >= 23) {
    return ui.slotLateNight
  }

  if (hour >= 18) {
    return ui.slotNight
  }

  if (hour < 11) {
    return ui.slotMorning
  }

  if (hour < 14) {
    return ui.slotLunch
  }

  return ui.slotAfternoon
}
