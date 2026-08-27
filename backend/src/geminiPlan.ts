import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import type { AppLocale } from '../../frontend/src/i18n/locale.ts'
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
} from '../../frontend/src/constants/options.ts'
import { CITY_STARTS } from '../../frontend/src/constants/startPoints.ts'
import { getAreaLabel, getCityName, getPlaceCopy, slotNameFromTime } from '../../frontend/src/i18n/content.ts'
import { PLACE_COPY_EN } from '../../frontend/src/i18n/placeCopyEn.ts'
import { fillTemplate, getUi } from '../../frontend/src/i18n/ui.ts'
import type { CityData, CityId, HobbyTag, Place } from '../../frontend/src/types/place.ts'
import type { DayPlan, TravelLeg } from '../../frontend/src/types/plan.ts'
import type { RangePref, StartPoint, Traveler } from '../../frontend/src/types/traveler.ts'
import {
  clampVisitStart,
  openingWindow,
  visitFitsHours,
} from '../../frontend/src/utils/openingHours.ts'
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
} from '../../frontend/src/utils/geo.ts'
import { ceilToFiveMinutes, minutesToTimeLabel, timeLabelToMinutes } from '../../frontend/src/utils/slotTime.ts'
import { placesShareDistinctiveName, shuffleSimilarNameGroups } from '../../frontend/src/utils/similarPlaceNames.ts'
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
  '../..',
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

function isPlaceCategory(value: string): value is Place['category'] {
  return (
    value === 'attraction' ||
    value === 'restaurant' ||
    value === 'cafe' ||
    value === 'market'
  )
}

function isTimeSlot(value: string): value is Place['timeSlots'][number] {
  return (
    value === 'morning' ||
    value === 'lunch' ||
    value === 'afternoon' ||
    value === 'snack' ||
    value === 'dinner' ||
    value === 'evening'
  )
}

function isPriceRange(value: number): value is Place['priceRange'] {
  return value === 1 || value === 2 || value === 3
}

export function loadCityData(cityId: CityId): CityData {
  const dbPath = path.join(PROJECT_ROOT, 'backend', 'data', 'places.sqlite')
  const db = new DatabaseSync(dbPath)

  const cityRow = db
    .prepare(
      'SELECT id, name_ja, summary_ja FROM cities WHERE id = ?',
    )
    .get(cityId) as
    | { id: string; name_ja: string; summary_ja: string }
    | undefined

  if (!cityRow) {
    db.close()
    throw new Error(`Unknown city: ${cityId}`)
  }

  const placeRows = db
    .prepare(
      `
      SELECT
        id, name_ja, category, area, duration_minutes,
        open_label, close_label, price_range, age_min, age_max,
        description_ja, reason_hint_ja, image_url, lat, lng
      FROM places
      WHERE city_id = ?
      `,
    )
    .all(cityId) as Array<{
    id: string
    name_ja: string
    category: string
    area: string
    duration_minutes: number
    open_label: string
    close_label: string
    price_range: number
    age_min: number
    age_max: number
    description_ja: string
    reason_hint_ja: string
    image_url: string | null
    lat: number
    lng: number
  }>

  const tagsByPlace = new Map<string, Place['tags']>()
  const lifestylesByPlace = new Map<string, Place['lifestyle']>()
  const slotsByPlace = new Map<string, Place['timeSlots']>()

  const tagRows = db
    .prepare(
      `
      SELECT t.place_id AS place_id, t.tag AS tag
      FROM place_tags t
      JOIN places p ON p.id = t.place_id
      WHERE p.city_id = ?
      `,
    )
    .all(cityId) as Array<{ place_id: string; tag: string }>

  for (const row of tagRows) {
    if (!isHobbyTag(row.tag)) {
      continue
    }
    const list = tagsByPlace.get(row.place_id) ?? []
    list.push(row.tag)
    tagsByPlace.set(row.place_id, list)
  }

  const lifestyleRows = db
    .prepare(
      `
      SELECT l.place_id AS place_id, l.lifestyle AS lifestyle
      FROM place_lifestyles l
      JOIN places p ON p.id = l.place_id
      WHERE p.city_id = ?
      `,
    )
    .all(cityId) as Array<{ place_id: string; lifestyle: string }>

  for (const row of lifestyleRows) {
    if (!isLifestyleTag(row.lifestyle)) {
      continue
    }
    const list = lifestylesByPlace.get(row.place_id) ?? []
    list.push(row.lifestyle)
    lifestylesByPlace.set(row.place_id, list)
  }

  const slotRows = db
    .prepare(
      `
      SELECT s.place_id AS place_id, s.time_slot AS time_slot
      FROM place_time_slots s
      JOIN places p ON p.id = s.place_id
      WHERE p.city_id = ?
      `,
    )
    .all(cityId) as Array<{ place_id: string; time_slot: string }>

  for (const row of slotRows) {
    if (!isTimeSlot(row.time_slot)) {
      continue
    }
    const list = slotsByPlace.get(row.place_id) ?? []
    list.push(row.time_slot)
    slotsByPlace.set(row.place_id, list)
  }

  db.close()

  const places: Place[] = []
  for (const row of placeRows) {
    if (!isPlaceCategory(row.category) || !isPriceRange(row.price_range)) {
      continue
    }

    places.push({
      id: row.id,
      nameJa: row.name_ja,
      category: row.category,
      area: row.area,
      timeSlots: slotsByPlace.get(row.id) ?? [],
      durationMinutes: row.duration_minutes,
      openLabel: row.open_label,
      closeLabel: row.close_label,
      priceRange: row.price_range,
      tags: tagsByPlace.get(row.id) ?? [],
      ageMin: row.age_min,
      ageMax: row.age_max,
      lifestyle: lifestylesByPlace.get(row.id) ?? [],
      descriptionJa: row.description_ja,
      reasonHintJa: row.reason_hint_ja,
      imageUrl: row.image_url ?? undefined,
      lat: row.lat,
      lng: row.lng,
    })
  }

  return {
    cityId,
    cityNameJa: cityRow.name_ja,
    citySummaryJa: cityRow.summary_ja,
    places,
  }
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

function formatValidateIssue(
  issue: SlotValidateIssue,
  locale: 'ja' | 'en',
): string {
  const en = locale === 'en'

  switch (issue.kind) {
    case 'slotCount':
      return en
        ? `Use ${MIN_SLOT_COUNT}–${MAX_SLOT_COUNT} stops.`
        : `件数は ${MIN_SLOT_COUNT}〜${MAX_SLOT_COUNT} にしてください。`
    case 'unknownPlace':
      return en
        ? `placeId ${issue.placeId} is not in the candidate list.`
        : `placeId ${issue.placeId} は候補にありません。`
    case 'duplicatePlace':
      return en
        ? 'Do not repeat the same placeId.'
        : '同じ placeId を重複させないでください。'
    case 'timeFormat':
      return en
        ? 'timeLabel must be 9:00 or 25:00 (1:00 next day) format, max 30:00.'
        : 'timeLabel は 9:00 または 25:00（翌朝1時）形式、上限は 30:00 にしてください。'
    case 'timeOrder':
      return en
        ? 'Times must be in ascending order.'
        : '時刻は昇順にしてください。'
    case 'nightlifeStart':
      return en
        ? 'For nightlife-only, start at 15:00 or later.'
        : 'ナイトライフのみのときは 15:00 以降にしてください。'
    case 'openingHours':
      return en
        ? `Put timeLabel within opening hours ${issue.openLabel}–${issue.closeLabel} (visit must finish before close).`
        : `${issue.openLabel}〜${issue.closeLabel} の営業時間内に timeLabel を入れてください（閉店までに終わる時刻）。`
    case 'firstLeg':
      return en
        ? `The first place must be within ${issue.minutes} minutes from the start point.`
        : `最初の場所は出発地点から移動${issue.minutes}分以内にしてください。`
    case 'hopKm':
      return en
        ? `Neighboring places must be within ${issue.km} km.`
        : `隣り合う場所は ${issue.km}km 以内にしてください。`
    case 'travelGap':
      return en
        ? 'The next start must be after the previous stay plus travel time, or after departure plus travel time.'
        : '次の開始は、出発または前の滞在のあと、移動時間を足した時刻以降にしてください。'
    case 'similarNames':
      return en
        ? 'Use at most one place with a similar name.'
        : '名前が似ている場所は1つまでにしてください。'
    case 'hobbyAttraction':
      return en
        ? 'Include at least one attraction that matches hobbies (a candidate with matchedTags).'
        : '観光は趣味に合う場所（matchedTags がある候補）を1つ以上入れてください。'
    case 'nightlifePlace':
      return en
        ? 'Include at least one nightlife place.'
        : 'ナイトライフの場所を1つ以上入れてください。'
    case 'nightlifeLastEnd':
      return en
        ? 'When nightlife is included, keep the last visit going until 23:00 or later.'
        : 'ナイトライフを含むときは、最後の滞在を 23:00 以降まで続けてください。'
  }
}

function placesFromIds(
  ids: Iterable<string>,
  placesById: Map<string, Place>,
): Place[] {
  return [...ids].flatMap((id) => {
    const place = placesById.get(id)
    return place === undefined ? [] : [place]
  })
}

function hasSimilarNamePair(places: Place[]): boolean {
  for (let leftIndex = 0; leftIndex < places.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < places.length;
      rightIndex += 1
    ) {
      const leftPlace = places[leftIndex]
      const rightPlace = places[rightIndex]
      if (
        leftPlace !== undefined &&
        rightPlace !== undefined &&
        placesShareDistinctiveName(leftPlace, rightPlace)
      ) {
        return true
      }
    }
  }

  return false
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

  const selectedPlaces = placesFromIds(
    slots.map((slot) => slot.placeId),
    placesById,
  )
  if (hasSimilarNamePair(selectedPlaces)) {
    return { kind: 'similarNames' }
  }

  const poolPlaces = placesFromIds(candidateIds, placesById)
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

interface PlanAttemptInput {
  attempt: number
  traveler: Traveler
  logTraveler: Traveler
  city: CityData
  candidates: CompactPlace[]
  candidatesEn: CompactPlace[]
  regenerate: boolean
  retryNote: string
  retryNoteEn: string
  dayPace: DayPace
  locale: AppLocale
  placesById: Map<string, Place>
  candidateIds: Set<string>
  log: string[]
}

async function runPlanAttempt(input: PlanAttemptInput): Promise<{
  fitted: GeminiSlot[]
  issue: SlotValidateIssue | undefined
}> {
  const prompt = buildPrompt(
    input.traveler,
    input.city,
    input.candidates,
    input.regenerate,
    input.retryNote,
    input.dayPace,
    input.locale,
  )
  input.log.push(
    ...promptPlanLog(
      input.attempt,
      buildPrompt(
        input.logTraveler,
        input.city,
        input.candidatesEn,
        input.regenerate,
        input.retryNoteEn,
        input.dayPace,
        'en',
      ),
    ),
  )
  const slots = await requestSlots(prompt, input.locale)
  const fitted = fitSlotsToHours(slots, input.placesById, input.traveler)
  const issue = validateSlots(
    fitted,
    input.placesById,
    input.traveler,
    input.candidateIds,
  )
  input.log.push(
    ...attemptPlanLog(
      input.attempt,
      fitted,
      issue === undefined ? undefined : formatValidateIssue(issue, 'en'),
    ),
  )
  return { fitted, issue }
}

function retryNote(
  locale: AppLocale,
  issue: SlotValidateIssue,
  errorLocale: 'ja' | 'en',
): string {
  return fillTemplate(getUi(locale).retryInvalidPlan, {
    error: formatValidateIssue(issue, errorLocale),
    min: MIN_SLOT_COUNT,
    max: MAX_SLOT_COUNT,
  })
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
    const logTraveler = travelerForEnglishLog(normalized)
    const attemptInput = {
      traveler: normalized,
      logTraveler,
      city,
      candidates,
      candidatesEn,
      regenerate,
      dayPace,
      locale,
      placesById,
      candidateIds,
      log,
    }

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

    const first = await runPlanAttempt({
      ...attemptInput,
      attempt: 1,
      retryNote: '',
      retryNoteEn: '',
    })
    if (first.issue === undefined) {
      log.push(resultPlanLog(true))
      return toDayPlan(city, first.fitted, locale, normalized)
    }

    const retry = await runPlanAttempt({
      ...attemptInput,
      attempt: 2,
      retryNote: retryNote(locale, first.issue, 'ja'),
      retryNoteEn: retryNote('en', first.issue, 'en'),
    })
    if (retry.issue !== undefined) {
      log.push(resultPlanLog(false, getUi('en').errorBuildPlan))
      throw new Error(ui.errorBuildPlan)
    }

    log.push(resultPlanLog(true))
    return toDayPlan(city, retry.fitted, locale, normalized)
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
