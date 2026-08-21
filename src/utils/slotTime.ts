export function slotNameFromTime(timeLabel: string): string {
  const hourText = timeLabel.split(':')[0]
  const hour = Number(hourText)

  if (!Number.isFinite(hour)) {
    return '予定'
  }

  if (hour < 11) {
    return '午前'
  }

  if (hour < 14) {
    return '昼'
  }

  return '午後'
}

export function timeLabelToMinutes(timeLabel: string): number | undefined {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(timeLabel)
  if (!match || match[1] === undefined || match[2] === undefined) {
    return undefined
  }

  return Number(match[1]) * 60 + Number(match[2])
}

export function minutesToTimeLabel(minutes: number): string {
  const clamped = Math.min(23 * 60 + 59, Math.max(0, minutes))
  const hour = Math.floor(clamped / 60)
  const minute = clamped % 60
  return `${hour}:${minute.toString().padStart(2, '0')}`
}
