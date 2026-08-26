import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import type { AppLocale } from '../src/i18n/locale.ts'
import {
  START_LABEL_MAX_LENGTH,
  TRAVELER_AGE_MAX,
  TRAVELER_AGE_MIN,
  isCityId,
  isGender,
  isHobbyTag,
  isLifestyleTag,
  isRangePref,
  isTransportMode,
} from '../src/constants/options.ts'
import { CITY_STARTS } from '../src/constants/startPoints.ts'
import { getAreaLabel, getCityName, getPlaceCopy, slotNameFromTime } from '../src/i18n/content.ts'
import { PLACE_COPY_EN } from '../src/i18n/placeCopyEn.ts'
import { fillTemplate, getUi } from '../src/i18n/ui.ts'
import type { CityData, CityId, HobbyTag, Place } from '../src/types/place.ts'
import type { DayPlan, TravelLeg } from '../src/types/plan.ts'
import type { RangePref, StartPoint, Traveler } from '../src/types/traveler.ts'
import {
  clampVisitStart,
  openingWindow,
  visitFitsHours,
} from '../src/utils/openingHours.ts'
import {
  NIGHTLIFE_LAST_END_MINUTES,
  NIGHTLIFE_ONLY_DEPART_MINUTES,
  buildTravelLeg,
  clampLatLng,
  dayDepartMinutes,
  haversineKm,
  includesNightlife,
  isNightlifeOnly,
  maxFirstLegMinutes,
  maxHopKm,
  roundKm,
  samePoint,
  walkMaxMinutes,
  type LatLng,
} from '../src/utils/geo.ts'
import { ceilToFiveMinutes, minutesToTimeLabel, timeLabelToMinutes } from '../src/utils/slotTime.ts'
import { placesShareDistinctiveName, shuffleSimilarNameGroups } from '../src/utils/similarPlaceNames.ts'
import {
  filterCandidates,
  matchingHobbyTags,
  placeMatchesHobbies,
} from './candidateFilter.ts'
import { collectOptionalRules } from './optionalRules/index.ts'
import {
  appendPlanLog,
  attemptPlanLog,
  beginPlanLog,
  promptPlanLog,
  resultPlanLog,
  toEnglishLogError,
} from './planLog.ts'
import { buildLocalizedPrompt } from './promptI18n.ts'

const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const MIN_SLOT_COUNT = 2
const MAX_SLOT_COUNT = 8
const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

const PLAN_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slots'],
  properties: {
    slots: {
      type: 'array',
      minItems: MIN_SLOT_COUNT,
      maxItems: MAX_SLOT_COUNT,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['timeLabel', 'placeId', 'reasonJa'],
        properties: {
          timeLabel: {
            type: 'string',
            description:
              'Start time in H:MM or HH:MM. After midnight use 25:00 for 1:00 AM, up to 30:00 for 6:00 AM.',
            pattern: '^(([01]?[0-9]|2[0-9]):[0-5][0-9]|30:00)$',
          },
          placeId: {
            type: 'string',
            description: 'Must match an id from the candidate list',
          },
          reasonJa: {
            type: 'string',
            description: 'Short Japanese reason tailored to this traveler',
          },
        },
      },
    },
  },
} as const

interface GeminiSlot {
  timeLabel: string
  placeId: string
  reasonJa: string
}

interface CompactPlace {
  id: string
  nameJa: string
  category: Place['category']
  area: string
  timeSlots: Place['timeSlots']
  durationMinutes: number
  openLabel: string
  closeLabel: string
  tags: Place['tags']
  lifestyle: Place['lifestyle']
  ageMin: number
  ageMax: number
  descriptionJa: string
  lat: number
  lng: number
  distanceKmFromStart: number
  travelMinutesFromStart: number
  matchedTags: HobbyTag[]
}

type DayPace = 'longStay' | 'manyStops'

export interface PlanRequest {
  traveler: Traveler
  regenerate: boolean
  locale?: AppLocale
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function hopLeg(from: LatLng, to: Place, traveler: Traveler): TravelLeg {
  return buildTravelLeg(
    from,
    placePoint(to),
    traveler.transport,
    walkMaxMinutes(traveler.gender),
  )
}

function isStartPoint(value: unknown): value is StartPoint {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.lat === 'number' &&
    Number.isFinite(value.lat) &&
    typeof value.lng === 'number' &&
    Number.isFinite(value.lng) &&
    typeof value.label === 'string' &&
    value.label.trim() !== '' &&
    value.label.trim().length <= START_LABEL_MAX_LENGTH
  )
}

function placePoint(place: Place): LatLng {
  return { lat: place.lat, lng: place.lng }
}

function normalizeTraveler(traveler: Traveler): Traveler {
  const preset = CITY_STARTS[traveler.cityId]
  const clamped = clampLatLng(traveler.start, preset.bounds)
  return {
    ...traveler,
    start: {
      ...traveler.start,
      lat: clamped.lat,
      lng: clamped.lng,
    },
  }
}

export function isPlanRequest(value: unknown): value is PlanRequest {
  if (!isRecord(value)) {
    return false
  }

  const regenerate = value.regenerate
  if (regenerate !== undefined && typeof regenerate !== 'boolean') {
    return false
  }

  const traveler = value.traveler
  if (!isRecord(traveler)) {
    return false
  }

  const locale = value.locale
  if (locale !== undefined && locale !== 'ja' && locale !== 'en' && locale !== 'vi') {
    return false
  }

  const hobbies = traveler.hobbies
  if (!Array.isArray(hobbies) || hobbies.length === 0) {
    return false
  }

  if (!hobbies.every(isHobbyTag)) {
    return false
  }

  if (new Set(hobbies).size !== hobbies.length) {
    return false
  }

  return (
    isCityId(traveler.cityId) &&
    isGender(traveler.gender) &&
    typeof traveler.age === 'number' &&
    Number.isInteger(traveler.age) &&
    traveler.age >= TRAVELER_AGE_MIN &&
    traveler.age <= TRAVELER_AGE_MAX &&
    isLifestyleTag(traveler.lifestyle) &&
    isStartPoint(traveler.start) &&
    isTransportMode(traveler.transport) &&
    isRangePref(traveler.rangePref)
  )
}

function loadCityData(cityId: CityId): CityData {
  const fileName = cityId === 'hanoi' ? 'hanoi.json' : 'chiba.json'
  const filePath = path.join(PROJECT_ROOT, 'src', 'data', fileName)
  const raw = readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as CityData
}

function titleFromPlaceId(id: string): string {
  return id
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function compactPlaceCopy(place: Place, locale: AppLocale) {
  if (locale !== 'en') {
    return getPlaceCopy(place, locale)
  }

  const copy = PLACE_COPY_EN[place.id]
  if (copy !== undefined) {
    return copy
  }

  return {
    name: titleFromPlaceId(place.id),
    description: '',
    reasonHint: '',
  }
}

function englishStartLabel(traveler: Traveler): string {
  const preset = CITY_STARTS[traveler.cityId]
  const uiEn = getUi('en')
  if (samePoint(traveler.start, preset)) {
    return uiEn[preset.labelKey]
  }

  return uiEn.startCustomPin
}

function travelerForEnglishLog(traveler: Traveler): Traveler {
  return {
    ...traveler,
    start: {
      ...traveler.start,
      label: englishStartLabel(traveler),
    },
  }
}

function compactPlaces(
  places: Place[],
  locale: AppLocale,
  traveler: Traveler,
): CompactPlace[] {
  return places.map((place) => {
    const copy = compactPlaceCopy(place, locale)
    const fromStart = placePoint(place)
    const firstLeg = buildTravelLeg(
      traveler.start,
      fromStart,
      traveler.transport,
      walkMaxMinutes(traveler.gender),
    )
    return {
      id: place.id,
      nameJa: copy.name,
      category: place.category,
      area: getAreaLabel(place.area, locale),
      timeSlots: place.timeSlots,
      durationMinutes: place.durationMinutes,
      openLabel: place.openLabel,
      closeLabel: place.closeLabel,
      tags: place.tags,
      lifestyle: place.lifestyle,
      ageMin: place.ageMin,
      ageMax: place.ageMax,
      descriptionJa: copy.description,
      lat: place.lat,
      lng: place.lng,
      distanceKmFromStart: roundKm(haversineKm(traveler.start, fromStart)),
      travelMinutesFromStart: firstLeg.minutes,
      matchedTags: matchingHobbyTags(place, traveler.hobbies),
    }
  })
}

function resolveCredentialsPath(): string | undefined {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!raw) {
    return undefined
  }

  return path.isAbsolute(raw) ? raw : path.resolve(PROJECT_ROOT, raw)
}

const GEMINI_FLASH_LITE_LOCATIONS = new Set(['global', 'us', 'eu'])

function resolveLocation(): string {
  const requested = process.env.GOOGLE_CLOUD_LOCATION ?? 'global'
  if (GEMINI_FLASH_LITE_LOCATIONS.has(requested)) {
    return requested
  }

  // gemini-3.5-flash-lite is not served from single regions like us-central1.
  console.warn(
    `gemini-3.5-flash-lite is not available in "${requested}". Using "global" instead (supported: global, us, eu).`,
  )
  return 'global'
}

function createClient(): GoogleGenAI {
  const project = process.env.GOOGLE_CLOUD_PROJECT
  const location = resolveLocation()
  const credentialsPath = resolveCredentialsPath()

  if (!project) {
    throw new Error('GOOGLE_CLOUD_PROJECT is not set.')
  }

  return new GoogleGenAI({
    vertexai: true,
    project,
    location,
    googleAuthOptions: credentialsPath
      ? { keyFilename: credentialsPath }
      : undefined,
  })
}

function pickDayPace(rangePref: RangePref): DayPace {
  if (rangePref === 'stayLocal') {
    return 'manyStops'
  }

  return Math.random() < 0.5 ? 'longStay' : 'manyStops'
}

function buildPrompt(
  traveler: Traveler,
  city: CityData,
  candidates: CompactPlace[],
  regenerate: boolean,
  retryNote: string,
  dayPace: DayPace,
  locale: AppLocale,
): string {
  const ui = getUi(locale)

  return buildLocalizedPrompt({
    traveler,
    locale,
    cityName: getCityName(city.cityId, locale),
    citySummary: ui.citySummary[city.cityId],
    candidatesJson: JSON.stringify(candidates),
    regenerate,
    retryNote,
    dayPace,
  })
}

function isGeminiSlot(value: unknown): value is GeminiSlot {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.timeLabel === 'string' &&
    typeof value.placeId === 'string' &&
    typeof value.reasonJa === 'string'
  )
}

function parseGeminiSlots(text: string): GeminiSlot[] | undefined {
  const trimmed = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed) as unknown
  } catch {
    return undefined
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.slots)) {
    return undefined
  }

  if (!parsed.slots.every(isGeminiSlot)) {
    return undefined
  }

  return parsed.slots
}

type SlotValidateIssue =
  | { kind: 'slotCount' }
  | { kind: 'unknownPlace'; placeId: string }
  | { kind: 'duplicatePlace' }
  | { kind: 'timeFormat' }
  | { kind: 'timeOrder' }
  | { kind: 'nightlifeStart' }
  | { kind: 'openingHours'; openLabel: string; closeLabel: string }
  | { kind: 'firstLeg'; minutes: number }
  | { kind: 'hopKm'; km: number }
  | { kind: 'travelGap' }
  | { kind: 'similarNames' }
  | { kind: 'hobbyAttraction' }
  | { kind: 'nightlifePlace' }
  | { kind: 'nightlifeLastEnd' }

function formatValidateIssueJa(issue: SlotValidateIssue): string {
  switch (issue.kind) {
    case 'slotCount':
      return `件数は ${MIN_SLOT_COUNT}〜${MAX_SLOT_COUNT} にしてください。`
    case 'unknownPlace':
      return `placeId ${issue.placeId} は候補にありません。`
    case 'duplicatePlace':
      return '同じ placeId を重複させないでください。'
    case 'timeFormat':
      return 'timeLabel は 9:00 または 25:00（翌朝1時）形式、上限は 30:00 にしてください。'
    case 'timeOrder':
      return '時刻は昇順にしてください。'
    case 'nightlifeStart':
      return 'ナイトライフのみのときは 15:00 以降にしてください。'
    case 'openingHours':
      return `${issue.openLabel}〜${issue.closeLabel} の営業時間内に timeLabel を入れてください（閉店までに終わる時刻）。`
    case 'firstLeg':
      return `最初の場所は出発地点から移動${issue.minutes}分以内にしてください。`
    case 'hopKm':
      return `隣り合う場所は ${issue.km}km 以内にしてください。`
    case 'travelGap':
      return '次の開始は、出発または前の滞在のあと、移動時間を足した時刻以降にしてください。'
    case 'similarNames':
      return '名前が似ている場所は1つまでにしてください。'
    case 'hobbyAttraction':
      return '観光は趣味に合う場所（matchedTags がある候補）を1つ以上入れてください。'
    case 'nightlifePlace':
      return 'ナイトライフの場所を1つ以上入れてください。'
    case 'nightlifeLastEnd':
      return 'ナイトライフを含むときは、最後の滞在を 23:00 以降まで続けてください。'
  }
}

function formatValidateIssueEn(issue: SlotValidateIssue): string {
  switch (issue.kind) {
    case 'slotCount':
      return `Use ${MIN_SLOT_COUNT}–${MAX_SLOT_COUNT} stops.`
    case 'unknownPlace':
      return `placeId ${issue.placeId} is not in the candidate list.`
    case 'duplicatePlace':
      return 'Do not repeat the same placeId.'
    case 'timeFormat':
      return 'timeLabel must be 9:00 or 25:00 (1:00 next day) format, max 30:00.'
    case 'timeOrder':
      return 'Times must be in ascending order.'
    case 'nightlifeStart':
      return 'For nightlife-only, start at 15:00 or later.'
    case 'openingHours':
      return `Put timeLabel within opening hours ${issue.openLabel}–${issue.closeLabel} (visit must finish before close).`
    case 'firstLeg':
      return `The first place must be within ${issue.minutes} minutes from the start point.`
    case 'hopKm':
      return `Neighboring places must be within ${issue.km} km.`
    case 'travelGap':
      return 'The next start must be after the previous stay plus travel time, or after departure plus travel time.'
    case 'similarNames':
      return 'Use at most one place with a similar name.'
    case 'hobbyAttraction':
      return 'Include at least one attraction that matches hobbies (a candidate with matchedTags).'
    case 'nightlifePlace':
      return 'Include at least one nightlife place.'
    case 'nightlifeLastEnd':
      return 'When nightlife is included, keep the last visit going until 23:00 or later.'
  }
}

function validateSlots(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
  traveler: Traveler,
  candidateIds: Set<string>,
): SlotValidateIssue | undefined {
  if (slots.length < MIN_SLOT_COUNT || slots.length > MAX_SLOT_COUNT) {
    return { kind: 'slotCount' }
  }

  const usedIds = new Set<string>()
  let previousMinutes = -1
  let previousEnd: number | undefined
  let previousPlace: Place | undefined
  const firstLimit = maxFirstLegMinutes(traveler.rangePref)
  const hopLimitKm = maxHopKm(traveler.rangePref)

  for (const slot of slots) {
    if (!candidateIds.has(slot.placeId) || !placesById.has(slot.placeId)) {
      return { kind: 'unknownPlace', placeId: slot.placeId }
    }

    if (usedIds.has(slot.placeId)) {
      return { kind: 'duplicatePlace' }
    }

    usedIds.add(slot.placeId)

    const minutes = timeLabelToMinutes(slot.timeLabel)
    if (minutes === undefined) {
      return { kind: 'timeFormat' }
    }

    if (minutes < previousMinutes) {
      return { kind: 'timeOrder' }
    }

    if (
      isNightlifeOnly(traveler.hobbies) &&
      minutes < NIGHTLIFE_ONLY_DEPART_MINUTES
    ) {
      return { kind: 'nightlifeStart' }
    }

    const place = placesById.get(slot.placeId)
    if (place !== undefined && !visitFitsHours(minutes, place)) {
      return {
        kind: 'openingHours',
        openLabel: place.openLabel,
        closeLabel: place.closeLabel,
      }
    }

    if (place !== undefined) {
      const origin =
        previousPlace === undefined ? traveler.start : placePoint(previousPlace)
      const leg = hopLeg(origin, place, traveler)

      if (previousPlace === undefined && leg.minutes > firstLimit) {
        return { kind: 'firstLeg', minutes: firstLimit }
      }

      if (previousPlace !== undefined && leg.km > hopLimitKm) {
        return { kind: 'hopKm', km: hopLimitKm }
      }

      const earliest =
        previousEnd === undefined
          ? dayDepartMinutes(traveler.hobbies) + leg.minutes
          : previousEnd + leg.minutes

      if (minutes < earliest) {
        return { kind: 'travelGap' }
      }

      previousEnd = minutes + place.durationMinutes
      previousPlace = place
    }

    previousMinutes = minutes
  }

  const selectedPlaces = slots.flatMap((slot) => {
    const place = placesById.get(slot.placeId)
    return place === undefined ? [] : [place]
  })
  for (let leftIndex = 0; leftIndex < selectedPlaces.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < selectedPlaces.length;
      rightIndex += 1
    ) {
      const leftPlace = selectedPlaces[leftIndex]
      const rightPlace = selectedPlaces[rightIndex]
      if (
        leftPlace !== undefined &&
        rightPlace !== undefined &&
        placesShareDistinctiveName(leftPlace, rightPlace)
      ) {
        return { kind: 'similarNames' }
      }
    }
  }

  const poolPlaces = [...candidateIds].flatMap((id) => {
    const place = placesById.get(id)
    return place === undefined ? [] : [place]
  })
  const hobbyAttractionsExist = poolPlaces.some(
    (place) =>
      place.category === 'attraction' &&
      placeMatchesHobbies(place, traveler.hobbies),
  )
  if (hobbyAttractionsExist) {
    const attractionSlots = slots.flatMap((slot) => {
      const place = placesById.get(slot.placeId)
      return place !== undefined && place.category === 'attraction' ? [place] : []
    })
    if (
      attractionSlots.length > 0 &&
      !attractionSlots.some((place) =>
        placeMatchesHobbies(place, traveler.hobbies),
      )
    ) {
      return { kind: 'hobbyAttraction' }
    }
  }

  if (includesNightlife(traveler.hobbies)) {
    if (!selectedPlaces.some((place) => place.tags.includes('nightlife'))) {
      return { kind: 'nightlifePlace' }
    }

    const lastSlot = slots[slots.length - 1]
    const lastPlace =
      lastSlot === undefined ? undefined : placesById.get(lastSlot.placeId)
    const lastStart =
      lastSlot === undefined ? undefined : timeLabelToMinutes(lastSlot.timeLabel)
    if (
      lastPlace !== undefined &&
      lastStart !== undefined &&
      lastStart + lastPlace.durationMinutes < NIGHTLIFE_LAST_END_MINUTES
    ) {
      return { kind: 'nightlifeLastEnd' }
    }
  }

  return undefined
}

function sortSlotsByTime(slots: GeminiSlot[]): GeminiSlot[] {
  return [...slots].sort((left, right) => {
    const leftMinutes = timeLabelToMinutes(left.timeLabel) ?? 0
    const rightMinutes = timeLabelToMinutes(right.timeLabel) ?? 0
    return leftMinutes - rightMinutes
  })
}

function sortSlotsByEarliestClose(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
): GeminiSlot[] {
  return [...slots].sort((left, right) => {
    const leftPlace = placesById.get(left.placeId)
    const rightPlace = placesById.get(right.placeId)
    const leftClose =
      leftPlace === undefined ? 0 : openingWindow(leftPlace).close
    const rightClose =
      rightPlace === undefined ? 0 : openingWindow(rightPlace).close
    if (leftClose !== rightClose) {
      return leftClose - rightClose
    }

    const leftMinutes = timeLabelToMinutes(left.timeLabel) ?? 0
    const rightMinutes = timeLabelToMinutes(right.timeLabel) ?? 0
    return leftMinutes - rightMinutes
  })
}

function packSlotsInOrder(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
  traveler: Traveler,
  useGeminiStart: boolean,
): GeminiSlot[] | undefined {
  let previousEnd: number | undefined
  let previousPlace: Place | undefined
  const packed: GeminiSlot[] = []
  const firstLimit = maxFirstLegMinutes(traveler.rangePref)
  const hopLimitKm = maxHopKm(traveler.rangePref)

  for (const slot of slots) {
    const place = placesById.get(slot.placeId)
    if (place === undefined) {
      packed.push(slot)
      continue
    }

    const origin =
      previousPlace === undefined ? traveler.start : placePoint(previousPlace)
    const leg = hopLeg(origin, place, traveler)
    if (previousPlace === undefined && leg.minutes > firstLimit) {
      return undefined
    }

    if (previousPlace !== undefined && leg.km > hopLimitKm) {
      return undefined
    }

    const geminiStart =
      timeLabelToMinutes(slot.timeLabel) ?? openingWindow(place).open
    const earliestAfterPrev =
      previousEnd === undefined
        ? dayDepartMinutes(traveler.hobbies) + leg.minutes
        : previousEnd + leg.minutes
    const preferred = useGeminiStart
      ? Math.max(geminiStart, earliestAfterPrev)
      : Math.max(openingWindow(place).open, earliestAfterPrev)
    const visitStart = clampVisitStart(preferred, place)

    if (visitStart < earliestAfterPrev) {
      return undefined
    }

    const alignedStart = ceilToFiveMinutes(visitStart)
    if (
      alignedStart < earliestAfterPrev ||
      clampVisitStart(alignedStart, place) !== alignedStart
    ) {
      return undefined
    }

    packed.push({
      ...slot,
      timeLabel: minutesToTimeLabel(alignedStart),
    })
    previousEnd = alignedStart + place.durationMinutes
    previousPlace = place
  }

  return packed
}

function fitSlotsToHours(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
  traveler: Traveler,
): GeminiSlot[] {
  const byTime = sortSlotsByTime(slots)
  const packedByTime = packSlotsInOrder(byTime, placesById, traveler, true)
  if (packedByTime !== undefined) {
    return packedByTime
  }

  const byClose = sortSlotsByEarliestClose(slots, placesById)
  const packedByClose = packSlotsInOrder(byClose, placesById, traveler, true)
  if (packedByClose !== undefined) {
    return packedByClose
  }

  const packedFlexible = packSlotsInOrder(byClose, placesById, traveler, false)
  if (packedFlexible !== undefined) {
    return packedFlexible
  }

  let previousEnd: number | undefined
  let previousPlace: Place | undefined
  return byClose.map((slot) => {
    const place = placesById.get(slot.placeId)
    if (place === undefined) {
      return slot
    }

    const origin =
      previousPlace === undefined ? traveler.start : placePoint(previousPlace)
    const leg = hopLeg(origin, place, traveler)
    const earliestAfterPrev =
      previousEnd === undefined
        ? dayDepartMinutes(traveler.hobbies) + leg.minutes
        : previousEnd + leg.minutes
    const visitStart = clampVisitStart(earliestAfterPrev, place)
    const alignedStart = ceilToFiveMinutes(visitStart)
    const startMinutes =
      clampVisitStart(alignedStart, place) === alignedStart
        ? alignedStart
        : visitStart
    previousEnd = startMinutes + place.durationMinutes
    previousPlace = place
    return {
      ...slot,
      timeLabel: minutesToTimeLabel(startMinutes),
    }
  })
}

function toDayPlan(
  city: CityData,
  slots: GeminiSlot[],
  locale: AppLocale,
  traveler: Traveler,
): DayPlan {
  const placesById = new Map(city.places.map((place) => [place.id, place]))
  const ui = getUi(locale)
  let previousPlace: Place | undefined

  return {
    locale,
    cityNameJa: getCityName(city.cityId, locale),
    citySummaryJa: ui.citySummary[city.cityId],
    slots: slots.flatMap((slot) => {
      const place = placesById.get(slot.placeId)
      if (!place) {
        return []
      }

      const origin =
        previousPlace === undefined ? traveler.start : placePoint(previousPlace)
      const travelFromPrevious = hopLeg(origin, place, traveler)
      previousPlace = place

      return [
        {
          timeLabel: slot.timeLabel,
          slotNameJa: slotNameFromTime(slot.timeLabel, locale),
          place,
          reasonJa: slot.reasonJa,
          travelFromPrevious,
        },
      ]
    }),
  }
}

async function requestSlots(
  prompt: string,
  locale: AppLocale,
): Promise<GeminiSlot[]> {
  const ui = getUi(locale)
  const client = createClient()
  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: PLAN_JSON_SCHEMA,
    },
  })

  const text = response.text
  if (!text) {
    throw new Error(ui.errorEmptyGemini)
  }

  const slots = parseGeminiSlots(text)
  if (!slots) {
    throw new Error(ui.errorGeminiJson)
  }

  return slots
}

export async function buildDayPlanWithGemini(
  traveler: Traveler,
  regenerate: boolean,
  locale: AppLocale = 'ja',
): Promise<DayPlan> {
  const ui = getUi(locale)
  const log: string[] = []

  try {
    const normalized = normalizeTraveler(traveler)
    const city = loadCityData(normalized.cityId)
    const filteredPlaces = shuffleSimilarNameGroups(
      filterCandidates(city.places, normalized),
    )
    const candidates = compactPlaces(filteredPlaces, locale, normalized)
    const candidatesEn = compactPlaces(filteredPlaces, 'en', normalized)
    const candidateIds = new Set(candidates.map((place) => place.id))
    const placesById = new Map(city.places.map((place) => [place.id, place]))
    const dayPace = pickDayPace(normalized.rangePref)
    const uiEn = getUi('en')
    const logTraveler = travelerForEnglishLog(normalized)

    log.push(
      ...beginPlanLog({
        locale,
        traveler: normalized,
        regenerate,
        pace: dayPace,
        candidateCount: candidates.length,
        optionalRules: collectOptionalRules(normalized, 'en', dayPace),
      }),
    )

    const firstPrompt = buildPrompt(
      normalized,
      city,
      candidates,
      regenerate,
      '',
      dayPace,
      locale,
    )
    log.push(
      ...promptPlanLog(
        1,
        buildPrompt(logTraveler, city, candidatesEn, regenerate, '', dayPace, 'en'),
      ),
    )
    const firstSlots = await requestSlots(firstPrompt, locale)
    const firstFitted = fitSlotsToHours(firstSlots, placesById, normalized)
    const firstIssue = validateSlots(
      firstFitted,
      placesById,
      normalized,
      candidateIds,
    )
    log.push(
      ...attemptPlanLog(
        1,
        firstFitted,
        firstIssue === undefined ? undefined : formatValidateIssueEn(firstIssue),
      ),
    )
    if (firstIssue === undefined) {
      log.push(resultPlanLog(true))
      return toDayPlan(city, firstFitted, locale, normalized)
    }

    const retryPrompt = buildPrompt(
      normalized,
      city,
      candidates,
      regenerate,
      fillTemplate(ui.retryInvalidPlan, {
        error: formatValidateIssueJa(firstIssue),
        min: MIN_SLOT_COUNT,
        max: MAX_SLOT_COUNT,
      }),
      dayPace,
      locale,
    )
    log.push(
      ...promptPlanLog(
        2,
        buildPrompt(
          logTraveler,
          city,
          candidatesEn,
          regenerate,
          fillTemplate(uiEn.retryInvalidPlan, {
            error: formatValidateIssueEn(firstIssue),
            min: MIN_SLOT_COUNT,
            max: MAX_SLOT_COUNT,
          }),
          dayPace,
          'en',
        ),
      ),
    )
    const retrySlots = await requestSlots(retryPrompt, locale)
    const retryFitted = fitSlotsToHours(retrySlots, placesById, normalized)
    const retryIssue = validateSlots(
      retryFitted,
      placesById,
      normalized,
      candidateIds,
    )
    log.push(
      ...attemptPlanLog(
        2,
        retryFitted,
        retryIssue === undefined ? undefined : formatValidateIssueEn(retryIssue),
      ),
    )
    if (retryIssue !== undefined) {
      log.push(resultPlanLog(false, uiEn.errorBuildPlan))
      throw new Error(ui.errorBuildPlan)
    }

    log.push(resultPlanLog(true))
    return toDayPlan(city, retryFitted, locale, normalized)
  } catch (caught) {
    if (!log.some((line) => line.startsWith('result='))) {
      const message =
        caught instanceof Error ? caught.message : ui.errorPlanFailed
      log.push(resultPlanLog(false, toEnglishLogError(message)))
    }
    throw caught
  } finally {
    await appendPlanLog(log)
  }
}
