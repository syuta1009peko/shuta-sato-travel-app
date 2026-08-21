import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'
import type { AppLocale } from '../src/i18n/locale.ts'
import { getCityName, getPlaceCopy, slotNameFromTime } from '../src/i18n/content.ts'
import { fillTemplate, getUi } from '../src/i18n/ui.ts'
import type { CityData, CityId, Place } from '../src/types/place.ts'
import type { DayPlan } from '../src/types/plan.ts'
import type { Traveler } from '../src/types/traveler.ts'
import {
  clampVisitStart,
  openingWindow,
  visitFitsHours,
} from '../src/utils/openingHours.ts'
import { minutesToTimeLabel, timeLabelToMinutes } from '../src/utils/slotTime.ts'
import { buildLocalizedPrompt } from './promptI18n.ts'

const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const MIN_SLOT_COUNT = 2
const MAX_SLOT_COUNT = 8
const DISNEY_PARK_IDS = new Set(['tokyo-disneyland', 'tokyo-disneysea'])
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
            description: 'Start time in H:MM or HH:MM, e.g. 9:00',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
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

function isCityId(value: unknown): value is CityId {
  return value === 'hanoi' || value === 'chiba'
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

  return (
    isCityId(traveler.cityId) &&
    typeof traveler.gender === 'string' &&
    typeof traveler.age === 'number' &&
    Array.isArray(traveler.hobbies) &&
    traveler.hobbies.every((hobby) => typeof hobby === 'string') &&
    typeof traveler.lifestyle === 'string'
  )
}

function loadCityData(cityId: CityId): CityData {
  const fileName = cityId === 'hanoi' ? 'hanoi.json' : 'chiba.json'
  const filePath = path.join(PROJECT_ROOT, 'src', 'data', fileName)
  const raw = readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as CityData
}

function shuffleDisneyParkOrder(places: Place[]): Place[] {
  const parkIndexes: number[] = []
  for (let index = 0; index < places.length; index += 1) {
    const place = places[index]
    if (place !== undefined && DISNEY_PARK_IDS.has(place.id)) {
      parkIndexes.push(index)
    }
  }

  if (parkIndexes.length < 2 || Math.random() >= 0.5) {
    return places
  }

  const leftIndex = parkIndexes[0]
  const rightIndex = parkIndexes[1]
  if (leftIndex === undefined || rightIndex === undefined) {
    return places
  }

  const next = [...places]
  const leftPlace = next[leftIndex]
  const rightPlace = next[rightIndex]
  if (leftPlace === undefined || rightPlace === undefined) {
    return places
  }

  next[leftIndex] = rightPlace
  next[rightIndex] = leftPlace
  return next
}

function compactPlaces(places: Place[], locale: AppLocale): CompactPlace[] {
  return shuffleDisneyParkOrder(places).map((place) => {
    const copy = getPlaceCopy(place, locale)
    return {
      id: place.id,
      nameJa: copy.name,
      category: place.category,
      area: place.area,
      timeSlots: place.timeSlots,
      durationMinutes: place.durationMinutes,
      openLabel: place.openLabel,
      closeLabel: place.closeLabel,
      tags: place.tags,
      lifestyle: place.lifestyle,
      ageMin: place.ageMin,
      ageMax: place.ageMax,
      descriptionJa: copy.description,
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
    throw new Error('GOOGLE_CLOUD_PROJECT が設定されていません。')
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

function pickDayPace(): DayPace {
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

function validateSlots(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
): string | undefined {
  if (slots.length < MIN_SLOT_COUNT || slots.length > MAX_SLOT_COUNT) {
    return `件数は ${MIN_SLOT_COUNT}〜${MAX_SLOT_COUNT} にしてください。`
  }

  const usedIds = new Set<string>()
  let previousMinutes = -1
  let previousEnd: number | undefined

  for (const slot of slots) {
    if (!placesById.has(slot.placeId)) {
      return `placeId ${slot.placeId} は候補にありません。`
    }

    if (usedIds.has(slot.placeId)) {
      return '同じ placeId を重複させないでください。'
    }

    usedIds.add(slot.placeId)

    const minutes = timeLabelToMinutes(slot.timeLabel)
    if (minutes === undefined) {
      return 'timeLabel は 9:00 形式にしてください。'
    }

    if (minutes < previousMinutes) {
      return '時刻は昇順にしてください。'
    }

    const place = placesById.get(slot.placeId)
    if (place !== undefined && !visitFitsHours(minutes, place)) {
      return `${place.openLabel}〜${place.closeLabel} の営業時間内に timeLabel を入れてください（閉店までに終わる時刻）。`
    }

    if (
      previousEnd !== undefined &&
      minutes < previousEnd + TRAVEL_BUFFER_MINUTES
    ) {
      return '次の開始は、前の滞在が終わってから移動15分後以降にしてください。'
    }

    previousMinutes = minutes
    previousEnd = minutes + (place?.durationMinutes ?? 0)
  }

  return undefined
}

const TRAVEL_BUFFER_MINUTES = 15

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
  useGeminiStart: boolean,
): GeminiSlot[] | undefined {
  let previousEnd: number | undefined
  const packed: GeminiSlot[] = []

  for (const slot of slots) {
    const place = placesById.get(slot.placeId)
    if (place === undefined) {
      packed.push(slot)
      continue
    }

    const geminiStart =
      timeLabelToMinutes(slot.timeLabel) ?? openingWindow(place).open
    const earliestAfterPrev =
      previousEnd === undefined
        ? Number.NEGATIVE_INFINITY
        : previousEnd + TRAVEL_BUFFER_MINUTES
    const preferred = useGeminiStart
      ? Math.max(geminiStart, earliestAfterPrev)
      : Math.max(openingWindow(place).open, earliestAfterPrev)
    const start = clampVisitStart(preferred, place)

    if (start < earliestAfterPrev) {
      return undefined
    }

    packed.push({
      ...slot,
      timeLabel: minutesToTimeLabel(start),
    })
    previousEnd = start + place.durationMinutes
  }

  return packed
}

function fitSlotsToHours(
  slots: GeminiSlot[],
  placesById: Map<string, Place>,
): GeminiSlot[] {
  const byTime = sortSlotsByTime(slots)
  const packedByTime = packSlotsInOrder(byTime, placesById, true)
  if (packedByTime !== undefined) {
    return packedByTime
  }

  const byClose = sortSlotsByEarliestClose(slots, placesById)
  const packedByClose = packSlotsInOrder(byClose, placesById, true)
  if (packedByClose !== undefined) {
    return packedByClose
  }

  const packedFlexible = packSlotsInOrder(byClose, placesById, false)
  if (packedFlexible !== undefined) {
    return packedFlexible
  }

  let previousEnd: number | undefined
  return byClose.map((slot) => {
    const place = placesById.get(slot.placeId)
    if (place === undefined) {
      return slot
    }

    const earliestAfterPrev =
      previousEnd === undefined
        ? openingWindow(place).open
        : previousEnd + TRAVEL_BUFFER_MINUTES
    const start = clampVisitStart(earliestAfterPrev, place)
    previousEnd = start + place.durationMinutes
    return {
      ...slot,
      timeLabel: minutesToTimeLabel(start),
    }
  })
}

function toDayPlan(
  city: CityData,
  slots: GeminiSlot[],
  locale: AppLocale,
): DayPlan {
  const placesById = new Map(city.places.map((place) => [place.id, place]))
  const ui = getUi(locale)

  return {
    locale,
    cityNameJa: getCityName(city.cityId, locale),
    citySummaryJa: ui.citySummary[city.cityId],
    slots: slots.flatMap((slot) => {
      const place = placesById.get(slot.placeId)
      if (!place) {
        return []
      }

      return [
        {
          timeLabel: slot.timeLabel,
          slotNameJa: slotNameFromTime(slot.timeLabel, locale),
          place,
          reasonJa: slot.reasonJa,
        },
      ]
    }),
  }
}

async function requestSlots(
  traveler: Traveler,
  city: CityData,
  candidates: CompactPlace[],
  regenerate: boolean,
  retryNote: string,
  dayPace: DayPace,
  locale: AppLocale,
): Promise<GeminiSlot[]> {
  const ui = getUi(locale)
  const client = createClient()
  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildPrompt(
      traveler,
      city,
      candidates,
      regenerate,
      retryNote,
      dayPace,
      locale,
    ),
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
  const city = loadCityData(traveler.cityId)
  const candidates = compactPlaces(city.places, locale)
  const placesById = new Map(city.places.map((place) => [place.id, place]))
  const dayPace = pickDayPace()

  const firstSlots = await requestSlots(
    traveler,
    city,
    candidates,
    regenerate,
    '',
    dayPace,
    locale,
  )
  const firstFitted = fitSlotsToHours(firstSlots, placesById)
  const firstError = validateSlots(firstFitted, placesById)
  if (!firstError) {
    return toDayPlan(city, firstFitted, locale)
  }

  const retrySlots = await requestSlots(
    traveler,
    city,
    candidates,
    regenerate,
    fillTemplate(ui.retryInvalidPlan, {
      error: firstError,
      min: MIN_SLOT_COUNT,
      max: MAX_SLOT_COUNT,
    }),
    dayPace,
    locale,
  )
  const retryFitted = fitSlotsToHours(retrySlots, placesById)
  const retryError = validateSlots(retryFitted, placesById)
  if (retryError) {
    throw new Error(ui.errorBuildPlan)
  }

  return toDayPlan(city, retryFitted, locale)
}
