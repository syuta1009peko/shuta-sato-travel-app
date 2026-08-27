import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AppLocale } from '../../frontend/src/i18n/locale.ts'
import { getUi } from '../../frontend/src/i18n/ui.ts'
import type { Traveler } from '../../frontend/src/types/traveler.ts'

const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const LOG_PATH = path.join(PROJECT_ROOT, 'logs', 'logs_check')

interface SlotLog {
  placeId: string
  timeLabel: string
}

function timestamp(): string {
  return new Date().toISOString()
}

export async function appendPlanLog(lines: string[]): Promise<void> {
  if (lines.length === 0) {
    return
  }

  try {
    await mkdir(path.dirname(LOG_PATH), { recursive: true })
    await appendFile(LOG_PATH, `${lines.join('\n')}\n`, 'utf8')
  } catch {
    // Logging must not fail plan generation.
  }
}

export function beginPlanLog(options: {
  locale: AppLocale
  traveler: Traveler
  regenerate: boolean
  pace: string
  candidateCount: number
  optionalRules: string[]
}): string[] {
  const hobbies = options.traveler.hobbies.join(',')
  const optional =
    options.optionalRules.length === 0
      ? '(none)'
      : options.optionalRules.join(' / ')

  return [
    `===== ${timestamp()} =====`,
    `locale=${options.locale} city=${options.traveler.cityId} gender=${options.traveler.gender} hobbies=${hobbies} regenerate=${options.regenerate} pace=${options.pace}`,
    `optional: ${optional}`,
    `candidates=${options.candidateCount}`,
  ]
}

export function promptPlanLog(attempt: number, prompt: string): string[] {
  return [`--- prompt attempt=${attempt} ---`, prompt, '--- end prompt ---']
}

export function attemptPlanLog(
  attempt: number,
  slots: SlotLog[],
  validate: string | undefined,
): string[] {
  const slotText =
    slots.length === 0
      ? '(none)'
      : slots.map((slot) => `${slot.placeId}@${slot.timeLabel}`).join(', ')

  return [
    `attempt=${attempt} slots=${slotText}`,
    `validate=${validate ?? 'ok'}`,
  ]
}

export function resultPlanLog(ok: boolean, error?: string): string {
  if (ok) {
    return 'result=ok'
  }

  return `result=fail ${error ?? ''}`.trimEnd()
}

export function httpPlanLog(status: number, error: string): string[] {
  return [`===== ${timestamp()} =====`, `http=${status} error=${error}`]
}

const LOCALIZED_ERROR_KEYS = [
  'errorPlanFailed',
  'errorPlanUnavailable',
  'errorInvalidInput',
  'errorEmptyGemini',
  'errorGeminiJson',
  'errorBuildPlan',
] as const

export function toEnglishLogError(message: string): string {
  const en = getUi('en')
  for (const locale of ['ja', 'vi'] as const) {
    const ui = getUi(locale)
    for (const key of LOCALIZED_ERROR_KEYS) {
      if (message === ui[key]) {
        return en[key]
      }
    }
  }

  return message
}
