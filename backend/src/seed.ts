import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { PLACE_COPY_EN } from '../../frontend/src/i18n/placeCopyEn.ts'
import { PLACE_COPY_VI } from '../../frontend/src/i18n/placeCopyVi.ts'
import type { CityData, Place } from '../../frontend/src/types/place.ts'

const BACKEND_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const DATA_DIR = path.join(BACKEND_ROOT, 'data')
const DB_PATH = path.join(DATA_DIR, 'places.sqlite')
const SCHEMA_PATH = path.join(BACKEND_ROOT, 'schema.sql')

function loadCity(fileName: string): CityData {
  const filePath = path.join(DATA_DIR,fileName)
  const raw = readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as CityData
}

function insertPlace(db: DatabaseSync, cityId: string, place: Place): void {
  db.prepare(
    `
    INSERT INTO places (
      id, city_id, name_ja, category, area, duration_minutes,
      open_label, close_label, price_range, age_min, age_max,
      description_ja, reason_hint_ja, image_url, lat, lng
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    place.id,
    cityId,
    place.nameJa,
    place.category,
    place.area,
    place.durationMinutes,
    place.openLabel,
    place.closeLabel,
    place.priceRange,
    place.ageMin,
    place.ageMax,
    place.descriptionJa,
    place.reasonHintJa,
    place.imageUrl ?? null,
    place.lat,
    place.lng,
  )

  const insertTag = db.prepare(
    'INSERT INTO place_tags (place_id, tag) VALUES (?, ?)',
  )
  for (const tag of place.tags) {
    insertTag.run(place.id, tag)
  }

  const insertLifestyle = db.prepare(
    'INSERT INTO place_lifestyles (place_id, lifestyle) VALUES (?, ?)',
  )
  for (const lifestyle of place.lifestyle) {
    insertLifestyle.run(place.id, lifestyle)
  }

  const insertSlot = db.prepare(
    'INSERT INTO place_time_slots (place_id, time_slot) VALUES (?, ?)',
  )
  for (const timeSlot of place.timeSlots) {
    insertSlot.run(place.id, timeSlot)
  }

  const insertCopy = db.prepare(
    `
    INSERT INTO place_translations (
      place_id, locale, name, description, reason_hint
    ) VALUES (?, ?, ?, ?, ?)
    `,
  )

  const english = PLACE_COPY_EN[place.id]
  if (english) {
    insertCopy.run(
      place.id,
      'en',
      english.name,
      english.description,
      english.reasonHint,
    )
  }

  const vietnamese = PLACE_COPY_VI[place.id]
  if (vietnamese) {
    insertCopy.run(
      place.id,
      'vi',
      vietnamese.name,
      vietnamese.description,
      vietnamese.reasonHint,
    )
  }
}

const hanoi = loadCity('hanoi.json')
const chiba = loadCity('chiba.json')

mkdirSync(DATA_DIR, { recursive: true })
rmSync(DB_PATH, { force: true })

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA foreign_keys = ON')
db.exec(readFileSync(SCHEMA_PATH, 'utf8'))

const insertCity = db.prepare(
  'INSERT INTO cities (id, name_ja, summary_ja) VALUES (?, ?, ?)',
)

for (const city of [hanoi, chiba]) {
  insertCity.run(city.cityId, city.cityNameJa, city.citySummaryJa)
  for (const place of city.places) {
    insertPlace(db, city.cityId, place)
  }
}

const cityCount = db.prepare('SELECT COUNT(*) AS n FROM cities').get() as {
  n: number
}
const placeCount = db.prepare('SELECT COUNT(*) AS n FROM places').get() as {
  n: number
}

db.close()

console.log(`Seeded ${String(cityCount.n)} cities, ${String(placeCount.n)} places`)
console.log(DB_PATH)