import type { AppLocale } from '../src/i18n/locale.ts'
import { getUi } from '../src/i18n/ui.ts'
import type { Traveler } from '../src/types/traveler.ts'
import { dayDepartMinutes, isNightlifeOnly } from '../src/utils/geo.ts'
import { minutesToTimeLabel } from '../src/utils/slotTime.ts'
import { collectOptionalRules, type DayPace } from './optionalRules/index.ts'

interface PromptParts {
  regenerateNote: string
  paceNote: string
  body: string
}

interface LocaleCopy {
  intro: string
  rulesHeading: string
  ids: string
  slotCount: string
  attractions: string
  meals: string
  lifestyle: string
  morningOrder: string
  similarNames: string
  timeLabel: string
  hours: string
  reason: string
  city: string
  start: (label: string, lat: string, lng: string, depart: string) => string
  gender: string
  age: string
  interests: string
  travelStyle: string
  transport: string
  dayShape: string
  candidates: string
  stayLocal: string
  longStay: string
  manyStops: string
  regenerate: string
}

const COPY: Record<AppLocale, LocaleCopy> = {
  en: {
    intro:
      "You are a travel planner. The candidate list is already filtered for this traveler's age. Return a one-day plan as JSON.",
    rulesHeading: 'Rules:',
    ids: 'Use only candidate ids. Do not invent places. Do not repeat an id.',
    slotCount: 'Use 2 to 8 slots. A larger count is not better.',
    attractions:
      'Sightseeing: prefer candidates whose matchedTags array is not empty. Meals may ignore matchedTags.',
    meals:
      'Meals (restaurant, cafe, market) may ignore matchedTags. Include food in a natural day.',
    lifestyle:
      "Prefer places whose lifestyle array includes this traveler's travel style.",
    morningOrder:
      'Keep a natural sequence through the day that fits opening hours.',
    similarNames:
      'If two candidates share a distinctive name, pick at most one.',
    timeLabel:
      'timeLabel is H:MM or HH:MM from 0:00 to 30:00. After midnight use 25:00 for 1:00 AM, up to 30:00 for 6:00 AM. Do not use 1:00 for the next morning.',
    hours:
      'Stay within openLabel–closeLabel; the visit must finish before close. Candidates with openLabel 24h are open all day. The server will fix travel times.',
    reason:
      'reasonJa is one short English sentence about this traveler.',
    city: 'City',
    start: (label, lat, lng, depart) =>
      `Start: ${label} (${lat}, ${lng}). Leave at ${depart}.`,
    gender: 'Gender',
    age: 'Age',
    interests: 'Interests',
    travelStyle: 'Travel style',
    transport: 'Preferred transport',
    dayShape: 'Day shape',
    candidates: 'Candidates',
    stayLocal:
      'Day shape: stay in one area. Short hops only. Repeat the same area when it fits.',
    longStay:
      'Pace: 3–4 stops around long-duration places. A 9-hour park is welcome.',
    manyStops: 'Pace: 5–8 shorter stops. Changing areas is allowed.',
    regenerate:
      'Prefer a different combination from last time. Do not use slot count as the reason.',
  },
  vi: {
    intro:
      'Bạn là người lập kế hoạch du lịch. Danh sách ứng viên đã lọc theo tuổi của người này. Trả về kế hoạch một ngày dạng JSON.',
    rulesHeading: 'Quy tắc:',
    ids: 'Chỉ dùng id trong danh sách. Không bịa địa điểm. Không trùng id.',
    slotCount: 'Số mục từ 2 đến 8. Không coi nhiều điểm hơn là tốt hơn.',
    attractions:
      'Tham quan: chỉ chọn chỗ có matchedTags không rỗng. Đừng chọn điểm tham quan không trùng sở thích.',
    meals:
      'Ăn uống (restaurant, cafe, market) không cần matchedTags. Hãy xếp bữa ăn cho một ngày tự nhiên.',
    lifestyle: 'Ưu tiên chỗ có lifestyle trùng phong cách đi của người này.',
    morningOrder:
      'Thứ tự tự nhiên: tham quan sáng, ăn, chiều, cà phê nếu cần, tối, đêm.',
    similarNames:
      'Địa điểm trùng phần tên đặc trưng (ví dụ Disneyland và DisneySea) chỉ chọn một.',
    timeLabel:
      'timeLabel dạng H:MM hoặc HH:MM từ 0:00 đến 30:00. Sau nửa đêm dùng 25:00 cho 1 giờ sáng, tối đa 30:00 cho 6 giờ sáng. Đừng dùng 1:00 cho sáng hôm sau.',
    hours:
      'Trong openLabel–closeLabel; phải xong trước giờ đóng. Ứng viên openLabel 24h mở cả ngày. Máy chủ sẽ chỉnh thời gian di chuyển.',
    reason:
      'reasonJa là một câu tiếng Việt ngắn, nhắc sở thích, tuổi hoặc phong cách của người này.',
    city: 'Thành phố',
    start: (label, lat, lng, depart) =>
      `Xuất phát: ${label} (${lat}, ${lng}). Rời lúc ${depart}.`,
    gender: 'Giới tính',
    age: 'Tuổi',
    interests: 'Sở thích',
    travelStyle: 'Phong cách đi',
    transport: 'Cách di chuyển',
    dayShape: 'Cách đi trong ngày',
    candidates: 'Danh sách địa điểm',
    stayLocal: 'Cách đi: ở một khu. Chỉ nhảy ngắn. Lặp cùng area khi hợp.',
    longStay:
      'Nhịp: 3–4 điểm xoay quanh chỗ mất nhiều thời gian. Công viên 9 giờ được phép.',
    manyStops: 'Nhịp: 5–8 điểm ngắn. Được đổi khu.',
    regenerate: 'Ưu tiên tổ hợp khác lần trước. Đừng lấy số lượng địa điểm làm lý do.',
  },
  ja: {
    intro:
      'あなたは旅行プランナーです。候補はすでにこの人の年齢で絞ってあります。一日プランを JSON で返してください。',
    rulesHeading: 'ルール:',
    ids: 'placeId は候補の id のみ。存在しない場所は作らない。同じ id は使わない',
    slotCount: 'slots は 2〜8。件数の多さで優劣をつけない',
    attractions:
      '観光は matchedTags が空でない場所だけを選ぶ。趣味と重ならない観光は選ばない',
    meals:
      '食事（restaurant / cafe / market）は matchedTags がなくてよい。一日として自然に食事を入れる',
    lifestyle: 'lifestyle にこの人のライフスタイルが含まれる場所を優先する',
    morningOrder: '自然な順番（午前の観光、食事、午後、必要ならカフェ、夕食、夜）',
    similarNames:
      '名前の主要部分が重なる場所（例: ディズニーランドとディズニーシー）は同じ日に1つまで',
    timeLabel:
      'timeLabel は 9:00 形式。翌朝1時は 25:00、翌朝6時は 30:00。上限は 30:00。翌朝の 1:00 は使わない',
    hours:
      'openLabel〜closeLabel の営業時間内に収め、閉店までに終わる。openLabel が 24h の候補は一日中入れてよい。移動時間はサーバーが直す',
    reason: 'reasonJa はこの人の趣味・年齢・ライフスタイルに触れる短い日本語',
    city: '都市',
    start: (label, lat, lng, depart) =>
      `出発地点: ${label}（${lat}, ${lng}）。${depart} に出発。`,
    gender: '性別',
    age: '年齢',
    interests: '趣味',
    travelStyle: 'ライフスタイル',
    transport: '優先する移動手段',
    dayShape: '一日の回り方',
    candidates: '候補',
    stayLocal: '今回の型: 同じエリアに滞在。短い移動だけ。合うなら同じ area を続ける。',
    longStay: '今回の型: 所要の長い場所を軸に 3〜4 件。パーク級（9時間）を含めてよい。',
    manyStops: '今回の型: 所要の短い場所を多めに 5〜8 件。エリアを変えてよい。',
    regenerate:
      '前回と違う組み合わせを優先してください。件数の多さは理由にしないでください。',
  },
}

export function buildLocalizedPrompt(options: {
  traveler: Traveler
  locale: AppLocale
  cityName: string
  citySummary: string
  candidatesJson: string
  regenerate: boolean
  retryNote: string
  dayPace: DayPace
}): string {
  const ui = getUi(options.locale)
  const copy = COPY[options.locale]
  const hobbyLabels = options.traveler.hobbies
    .map((hobby) => ui.hobby[hobby] ?? hobby)
    .join(options.locale === 'ja' ? '、' : ', ')
  const parts = promptParts(
    options.locale,
    options.dayPace,
    options.regenerate,
    options.traveler,
  )

  const start = options.traveler.start
  const departLabel = minutesToTimeLabel(dayDepartMinutes(options.traveler.hobbies))
  const startLine = copy.start(
    start.label,
    start.lat.toFixed(4),
    start.lng.toFixed(4),
    departLabel,
  )

  const cityLine =
    options.locale === 'ja'
      ? `${copy.city}: ${options.cityName}（${options.citySummary}）`
      : `${copy.city}: ${options.cityName} (${options.citySummary})`

  return `${parts.body}

${cityLine}
${startLine}
${copy.gender}: ${ui.gender[options.traveler.gender]}
${copy.age}: ${options.traveler.age}
${copy.interests}: ${hobbyLabels}
${copy.travelStyle}: ${ui.lifestyle[options.traveler.lifestyle]}
${copy.transport}: ${ui.transport[options.traveler.transport]}
${copy.dayShape}: ${ui.rangePref[options.traveler.rangePref]}

${parts.paceNote}
${parts.regenerateNote}
${options.retryNote}

${copy.candidates}:
${options.candidatesJson}`
}

function baseRules(
  locale: AppLocale,
  copy: LocaleCopy,
  traveler: Traveler,
  dayPace: DayPace,
): string[] {
  if (locale === 'en') {
    return [
      copy.ids,
      copy.slotCount,
      copy.attractions,
      copy.meals,
      copy.morningOrder,
      copy.similarNames,
      copy.timeLabel,
      copy.hours,
      copy.reason,
    ]
  }

  const order = isNightlifeOnly(traveler.hobbies) ? [] : [copy.morningOrder]

  return [
    copy.ids,
    copy.slotCount,
    copy.attractions,
    copy.meals,
    copy.lifestyle,
    ...order,
    ...collectOptionalRules(traveler, locale, dayPace),
    copy.similarNames,
    copy.timeLabel,
    copy.hours,
    copy.reason,
  ]
}

function formatRuleList(rules: string[]): string {
  return rules.map((rule) => `- ${rule}`).join('\n')
}

function promptParts(
  locale: AppLocale,
  dayPace: DayPace,
  regenerate: boolean,
  traveler: Traveler,
): PromptParts {
  const copy = COPY[locale]
  const rules = formatRuleList(baseRules(locale, copy, traveler, dayPace))

  if (locale === 'en') {
    const focus = formatRuleList(collectOptionalRules(traveler, locale, dayPace))
    return {
      body: `${copy.intro}

${copy.rulesHeading}
${rules}

Focus:
${focus}`,
      regenerateNote: regenerate ? copy.regenerate : '',
      paceNote: '',
    }
  }

  return {
    body: `${copy.intro}

${copy.rulesHeading}
${rules}`,
    regenerateNote: regenerate ? copy.regenerate : '',
    paceNote:
      traveler.rangePref === 'stayLocal'
        ? copy.stayLocal
        : dayPace === 'longStay'
          ? copy.longStay
          : copy.manyStops,
  }
}
