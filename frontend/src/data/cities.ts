import type { CityData, CityId } from '../types/place'

export async function fetchCityData(cityId: CityId): Promise<CityData> {
  const response = await fetch(`/api/cities/${cityId}`)
  const raw = await response.text()

  if (raw.trim() === '') {
    throw new Error(`Failed to load city: ${cityId}`)
  }

  let payload: unknown
  try {
    payload = JSON.parse(raw) as unknown
  } catch {
    throw new Error(`Failed to load city: ${cityId}`)
  }

  if (!response.ok) {
    throw new Error(`Failed to load city: ${cityId}`)
  }

  return payload as CityData
}