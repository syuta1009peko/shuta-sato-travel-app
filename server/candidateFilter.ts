import type { HobbyTag, Place, PlaceCategory } from '../src/types/place.ts'
import type { TravelLeg } from '../src/types/plan.ts'
import type { Traveler } from '../src/types/traveler.ts'
import {
  NIGHTLIFE_LAST_END_MINUTES,
  NIGHTLIFE_ONLY_DEPART_MINUTES,
  buildTravelLeg,
  includesNightlife,
  isNightlifeOnly,
  maxFirstLegMinutes,
  walkMaxMinutes,
} from '../src/utils/geo.ts'
import { openingWindow } from '../src/utils/openingHours.ts'

const FOOD_CATEGORIES = new Set<PlaceCategory>(['restaurant', 'cafe', 'market'])
const MAX_ATTRACTIONS = 24
const MAX_MEALS = 16
const MIN_ATTRACTIONS = 8
const LATE_NIGHT_RESERVE = 6

export function isFoodPlace(place: Place): boolean {
  return FOOD_CATEGORIES.has(place.category)
}

export function matchingHobbyTags(
  place: Place,
  hobbies: HobbyTag[],
): HobbyTag[] {
  const hobbySet = new Set(hobbies)
  return place.tags.filter((tag) => hobbySet.has(tag))
}

export function placeMatchesHobbies(
  place: Place,
  hobbies: HobbyTag[],
): boolean {
  return matchingHobbyTags(place, hobbies).length > 0
}

export function fitsTravelerAge(place: Place, age: number): boolean {
  return place.ageMin <= age && age <= place.ageMax
}

function travelFromStart(place: Place, traveler: Traveler): TravelLeg {
  return buildTravelLeg(
    traveler.start,
    { lat: place.lat, lng: place.lng },
    traveler.transport,
    walkMaxMinutes(traveler.gender),
  )
}

function canVisitFromAfternoon(place: Place): boolean {
  return openingWindow(place).latestStart >= NIGHTLIFE_ONLY_DEPART_MINUTES
}

function closesAtOrAfterLastEnd(place: Place): boolean {
  return openingWindow(place).close >= NIGHTLIFE_LAST_END_MINUTES
}

function applyNightlifeVisitWindow(places: Place[], traveler: Traveler): Place[] {
  if (!isNightlifeOnly(traveler.hobbies)) {
    return places
  }

  return places.filter(canVisitFromAfternoon)
}

function mixLateNightlifePlaces(
  picked: Place[],
  pool: Place[],
  traveler: Traveler,
  preferredAreas: Set<string> | undefined,
  limit: number,
): Place[] {
  if (!includesNightlife(traveler.hobbies)) {
    return picked
  }

  const nightlifeTagged = sortByScore(
    pool.filter((place) => place.tags.includes('nightlife')),
    traveler,
    preferredAreas,
  )
  const lateClosers = sortByScore(
    pool.filter(closesAtOrAfterLastEnd),
    traveler,
    preferredAreas,
  )
  const reserved = takeUnique(
    [...nightlifeTagged, ...lateClosers],
    Math.min(LATE_NIGHT_RESERVE, limit),
  )

  return takeUnique([...reserved, ...picked], limit)
}

function priceBonus(place: Place, traveler: Traveler): number {
  if (traveler.lifestyle === 'budget' && place.priceRange === 1) {
    return 1
  }

  if (traveler.lifestyle === 'luxury' && place.priceRange === 3) {
    return 1
  }

  return 0
}

function scorePlace(
  place: Place,
  traveler: Traveler,
  preferredAreas: Set<string> | undefined,
): number {
  const hobbyHits = matchingHobbyTags(place, traveler.hobbies).length
  let score = hobbyHits * 3

  if (place.lifestyle.includes(traveler.lifestyle)) {
    score += 2
  }

  score += priceBonus(place, traveler)

  if (preferredAreas !== undefined && preferredAreas.has(place.area)) {
    score += 2
  }

  const firstLeg = travelFromStart(place, traveler)
  score += Math.max(0, 3 - Math.floor(firstLeg.minutes / 30))

  return score
}

function sortByScore(
  places: Place[],
  traveler: Traveler,
  preferredAreas: Set<string> | undefined,
): Place[] {
  return [...places].sort((left, right) => {
    const scoreDiff =
      scorePlace(right, traveler, preferredAreas) -
      scorePlace(left, traveler, preferredAreas)
    if (scoreDiff !== 0) {
      return scoreDiff
    }

    return left.id.localeCompare(right.id)
  })
}

function nearbyAreas(places: Place[], traveler: Traveler): Set<string> | undefined {
  if (traveler.rangePref !== 'stayLocal') {
    return undefined
  }

  const firstLimit = maxFirstLegMinutes(traveler.rangePref)
  const nearby = places.filter((place) => {
    const leg = travelFromStart(place, traveler)
    return leg.minutes <= firstLimit
  })

  if (nearby.length === 0) {
    return undefined
  }

  const counts = new Map<string, number>()
  for (const place of nearby) {
    counts.set(place.area, (counts.get(place.area) ?? 0) + 1)
  }

  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1])
  const topCount = ranked[0]?.[1] ?? 0
  const topAreas = ranked
    .filter(([, count], index) => index === 0 || count >= topCount * 0.5)
    .slice(0, 3)
    .map(([area]) => area)

  return new Set(topAreas)
}

function takeUnique(places: Place[], limit: number): Place[] {
  const seen = new Set<string>()
  const picked: Place[] = []
  for (const place of places) {
    if (seen.has(place.id)) {
      continue
    }

    seen.add(place.id)
    picked.push(place)
    if (picked.length >= limit) {
      break
    }
  }

  return picked
}

function pickAttractions(
  attractions: Place[],
  traveler: Traveler,
  preferredAreas: Set<string> | undefined,
): Place[] {
  const ranked = sortByScore(attractions, traveler, preferredAreas)
  const hobbyHits = ranked.filter((place) =>
    placeMatchesHobbies(place, traveler.hobbies),
  )
  const lifestyleHits = ranked.filter((place) =>
    place.lifestyle.includes(traveler.lifestyle),
  )

  let pooled = hobbyHits
  if (pooled.length < MIN_ATTRACTIONS) {
    pooled = takeUnique([...pooled, ...lifestyleHits], ranked.length)
  }

  if (pooled.length < MIN_ATTRACTIONS) {
    pooled = takeUnique([...pooled, ...ranked], ranked.length)
  }

  return takeUnique(pooled, MAX_ATTRACTIONS)
}

function hasValidCoords(place: Place): boolean {
  return (
    Number.isFinite(place.lat) &&
    Number.isFinite(place.lng)
  )
}

export function filterCandidates(
  places: Place[],
  traveler: Traveler,
): Place[] {
  const withCoords = places.filter(hasValidCoords)
  const ageOk = withCoords.filter((place) => fitsTravelerAge(place, traveler.age))
  const visitable = applyNightlifeVisitWindow(ageOk, traveler)
  const preferredAreas = nearbyAreas(visitable, traveler)
  const attractions = visitable.filter((place) => place.category === 'attraction')
  const meals = visitable.filter((place) => isFoodPlace(place))

  const pickedAttractions = mixLateNightlifePlaces(
    pickAttractions(attractions, traveler, preferredAreas),
    attractions,
    traveler,
    preferredAreas,
    MAX_ATTRACTIONS,
  )
  const pickedMeals = mixLateNightlifePlaces(
    takeUnique(sortByScore(meals, traveler, preferredAreas), MAX_MEALS),
    meals,
    traveler,
    preferredAreas,
    MAX_MEALS,
  )

  const picked = [...pickedAttractions, ...pickedMeals]
  if (picked.length < 2) {
    return mixLateNightlifePlaces(
      takeUnique(
        sortByScore(visitable, traveler, preferredAreas),
        MAX_ATTRACTIONS + MAX_MEALS,
      ),
      visitable,
      traveler,
      preferredAreas,
      MAX_ATTRACTIONS + MAX_MEALS,
    )
  }

  return picked
}
