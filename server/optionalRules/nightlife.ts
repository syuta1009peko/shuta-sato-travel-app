import type { AppLocale } from '../../src/i18n/locale.ts'
import type { Traveler } from '../../src/types/traveler.ts'
import { includesNightlife, isNightlifeOnly } from '../../src/utils/geo.ts'

const COPY: Record<
  AppLocale,
  {
    afternoonOnly: string
    afternoonOrder: string
    untilEleven: string
  }
> = {
  ja: {
    afternoonOnly:
      '15:00 以降だけのプランにする。午前は入れない。必ずプランを返す',
    afternoonOrder: '自然な順番（15:00以降、食事、夜、深夜）',
    untilEleven:
      '最後の滞在が 23:00 以降まで続くようにする。nightlife タグの場所を1つ以上入れる',
  },
  en: {
    afternoonOnly:
      'Plan only from 15:00 onward. Do not add morning stops. Still return a plan.',
    afternoonOrder: 'Natural order: from 15:00, meal, night, late night.',
    untilEleven:
      'The last visit must continue until 23:00 or later. Include at least one place tagged nightlife.',
  },
  vi: {
    afternoonOnly:
      'Chỉ xếp từ 15:00 trở đi. Không thêm buổi sáng. Vẫn phải trả về kế hoạch.',
    afternoonOrder: 'Thứ tự tự nhiên: từ 15:00, ăn, tối, đêm muộn.',
    untilEleven:
      'Lần dừng cuối phải kéo đến 23:00 trở đi. Gồm ít nhất một chỗ gắn thẻ nightlife.',
  },
}

export function nightlifeOptionalRules(
  traveler: Traveler,
  locale: AppLocale,
): string[] {
  const copy = COPY[locale]
  const lines: string[] = []

  if (isNightlifeOnly(traveler.hobbies)) {
    lines.push(copy.afternoonOnly)
    lines.push(copy.afternoonOrder)
  }

  if (includesNightlife(traveler.hobbies)) {
    lines.push(copy.untilEleven)
  }

  return lines
}
