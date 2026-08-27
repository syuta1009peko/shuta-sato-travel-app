export const MAX_CLOCK_MINUTES = 30 * 60
export const ALWAYS_OPEN_HOURS = '24h'

export function timeLabelToMinutes(timeLabel: string): number | undefined {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(timeLabel)
  if (!match || match[1] === undefined || match[2] === undefined) {
    return undefined
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour < 0 || hour > 30) {
    return undefined
  }

  if (hour === 30 && minute !== 0) {
    return undefined
  }

  return hour * 60 + minute
}

export function minutesToTimeLabel(minutes: number): string {
  const clamped = Math.min(MAX_CLOCK_MINUTES, Math.max(0, minutes))
  const hour = Math.floor(clamped / 60)
  const minute = clamped % 60
  return `${hour}:${minute.toString().padStart(2, '0')}`
}

export function ceilToFiveMinutes(minutes: number): number {
  return Math.ceil(minutes / 5) * 5
}
