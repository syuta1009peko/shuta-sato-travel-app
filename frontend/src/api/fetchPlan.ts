import type { DayPlan } from '../types/plan'
import type { Traveler } from '../types/traveler'
import type { AppLocale } from '../i18n/locale'
import { getUi } from '../i18n/ui'

interface PlanErrorPayload {
  error?: string
}

function isPlanErrorPayload(value: unknown): value is PlanErrorPayload {
  return typeof value === 'object' && value !== null
}

export async function fetchDayPlan(
  traveler: Traveler,
  regenerate = false,
  locale: AppLocale = 'ja',
): Promise<DayPlan> {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ traveler, regenerate, locale }),
  })

  const raw = await response.text()
  const uiCopy = getUi(locale)

  if (raw.trim() === '') {
    throw new Error(uiCopy.errorPlanUnavailable)
  }

  let payload: unknown
  try {
    payload = JSON.parse(raw) as unknown
  } catch {
    throw new Error(uiCopy.errorPlanFailed)
  }

  if (!response.ok) {
    const message =
      isPlanErrorPayload(payload) && typeof payload.error === 'string'
        ? payload.error
        : uiCopy.errorPlanFailed
    throw new Error(message)
  }

  return payload as DayPlan
}
