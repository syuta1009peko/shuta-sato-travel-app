import type { AppLocale } from '../src/i18n/locale.ts'
import { getUi } from '../src/i18n/ui.ts'
import type { Traveler } from '../src/types/traveler.ts'

interface PromptParts {
  regenerateNote: string
  paceNote: string
  body: string
}

export function buildLocalizedPrompt(options: {
  traveler: Traveler
  locale: AppLocale
  cityName: string
  citySummary: string
  candidatesJson: string
  regenerate: boolean
  retryNote: string
  dayPace: 'longStay' | 'manyStops'
}): string {
  const ui = getUi(options.locale)
  const hobbyLabels = options.traveler.hobbies
    .map((hobby) => ui.hobby[hobby] ?? hobby)
    .join(options.locale === 'ja' ? '、' : ', ')
  const parts = promptParts(options.locale, options.dayPace, options.regenerate)

  return `${parts.body}

${options.locale === 'en' ? 'City' : options.locale === 'vi' ? 'Thành phố' : '都市'}: ${options.cityName}（${options.citySummary}）
${options.locale === 'en' ? 'Gender' : options.locale === 'vi' ? 'Giới tính' : '性別'}: ${ui.gender[options.traveler.gender]}
${options.locale === 'en' ? 'Age' : options.locale === 'vi' ? 'Tuổi' : '年齢'}: ${options.traveler.age}
${options.locale === 'en' ? 'Interests' : options.locale === 'vi' ? 'Sở thích' : '趣味'}: ${hobbyLabels}
${options.locale === 'en' ? 'Travel style' : options.locale === 'vi' ? 'Phong cách đi' : 'ライフスタイル'}: ${ui.lifestyle[options.traveler.lifestyle]}

${parts.paceNote}
${parts.regenerateNote}
${options.retryNote}

${options.locale === 'en' ? 'Candidates' : options.locale === 'vi' ? 'Danh sách địa điểm' : '候補'}:
${options.candidatesJson}`
}

function promptParts(
  locale: AppLocale,
  dayPace: 'longStay' | 'manyStops',
  regenerate: boolean,
): PromptParts {
  if (locale === 'en') {
    return {
      body: `You are a travel planner. Choose places only from the candidate list and return a one-day plan as JSON.

Rules:
- Use 2 to 8 slots. Do not treat a larger count as better.
- Match interests and travel style. Do not prefer short stops over long ones, or the reverse.
- Places with durationMinutes of 120 or more (theme parks are 540 minutes / 9 hours) count as half a day or a full day. One to three long stops are equal in value to six to eight short ones.
- Aim for roughly a full day in total (for example a 9-hour park plus a meal and evening).
- Keep a natural order: morning sight, meal, afternoon, café if needed, dinner, night.
- Avoid stacking the same area or genre too tightly.
- Tokyo Disneyland and Tokyo DisneySea are alternatives for a park day, not a pair. Choose at most one. Treat them as equal; do not default to Disneyland.
- placeId must be from the candidate list. Do not invent places. Do not repeat an id.
- timeLabel is H:MM or HH:MM, ascending.
- Each visit must finish before the next starts: the next timeLabel must be at least the previous timeLabel plus that place’s durationMinutes plus 15 minutes of travel. Do not overlap stays.
- Schedule only while the place is open: timeLabel must be between openLabel and closeLabel, and timeLabel plus durationMinutes must finish by closeLabel. Never put a restaurant or shop after it has closed (for example a place that closes at 21:00 must not appear at 23:00).
- If two nearby places would overlap, put the one that closes earlier first.
- reasonJa is a short reason in English for this traveler.`,
      regenerateNote: regenerate
        ? 'Prefer a different combination from last time. Do not use slot count as the reason.'
        : '',
      paceNote:
        dayPace === 'longStay'
          ? 'Pace for this plan: 3–4 stops built around long-duration places. Theme parks of about 9 hours are welcome. Do not pad with many short stops.'
          : 'Pace for this plan: 5–8 shorter stops that walk easily in one area.',
    }
  }

  if (locale === 'vi') {
    return {
      body: `Bạn là người lập kế hoạch du lịch. Chỉ chọn địa điểm trong danh sách ứng viên và trả về kế hoạch một ngày dạng JSON.

Quy tắc:
- Số mục từ 2 đến 8. Không coi nhiều địa điểm hơn là tốt hơn.
- Chọn theo sở thích và phong cách đi. Không thiên vị chỗ ngắn hay chỗ dài.
- Địa điểm có durationMinutes từ 120 trở lên (công viên giải trí 540 phút / 9 giờ) được tính là nửa ngày hoặc cả ngày. 1–3 điểm dài có giá trị ngang 6–8 điểm ngắn.
- Tổng thời gian khoảng một ngày (ví dụ công viên 9 giờ cộng bữa ăn và buổi tối).
- Thứ tự tự nhiên: tham quan sáng, ăn, chiều, cà phê nếu cần, tối, đêm.
- Tránh lặp cùng khu hay cùng thể loại quá dày.
- Tokyo Disneyland và Tokyo DisneySea là hai lựa chọn cho một ngày công viên, không đi cả hai. Chỉ chọn tối đa một. Coi hai nơi ngang nhau; đừng mặc định chọn Disneyland.
- placeId chỉ lấy từ danh sách. Không bịa địa điểm. Không trùng id.
- timeLabel dạng H:MM hoặc HH:MM, tăng dần.
- Điểm sau phải bắt đầu sau khi điểm trước kết thúc: timeLabel sau ≥ timeLabel trước + durationMinutes + 15 phút di chuyển. Không chồng thời gian lưu trú.
- Chỉ xếp giờ trong thời gian mở cửa: timeLabel nằm giữa openLabel và closeLabel, và timeLabel cộng durationMinutes phải xong trước closeLabel. Không xếp nhà hàng hay cửa hàng sau giờ đóng (ví dụ đóng lúc 21:00 thì không được hiện lúc 23:00).
- Nếu hai chỗ gần nhau bị chồng giờ, xếp chỗ đóng cửa sớm hơn lên trước.
- reasonJa là lý do ngắn bằng tiếng Việt cho đúng người này.`,
      regenerateNote: regenerate
        ? 'Ưu tiên tổ hợp khác lần trước. Đừng lấy số lượng địa điểm làm lý do.'
        : '',
      paceNote:
        dayPace === 'longStay'
          ? 'Nhịp lần này: 3–4 điểm xoay quanh chỗ mất nhiều thời gian. Công viên khoảng 9 giờ được phép. Đừng nhồi thêm nhiều điểm ngắn.'
          : 'Nhịp lần này: 5–8 điểm ngắn, dễ đi bộ trong một khu.',
    }
  }

  return {
    body: `あなたは旅行プランナーです。候補リストの中からだけ場所を選び、この人に合う一日プランを JSON で返してください。

ルール:
- slots の件数は 2〜8。件数の多さで優劣をつけない
- 選ぶ基準は趣味・ライフスタイルとの相性。所要時間の長短や件数では差別しない
- durationMinutes が長い場所（120分以上、パークは540分＝9時間）は半日〜一日として扱う。1〜3件でも、短い場所を 6〜8 件回る一日と同じ価値
- 合計でだいたい一日分になるようにする（例: パーク540分＋食事＋夜）
- 一日として自然な順番（午前の観光地、食事、午後、必要ならカフェ、夕食、夜）
- 同じエリアやジャンルが連続しすぎないようにする
- 東京ディズニーランドと東京ディズニーシーは同じ日に両方は入れない。パークは最大1つ。どちらも同等で、ランドを固定で選ばない
- placeId は候補の id のみ。存在しない場所は作らない。同じ id は使わない
- timeLabel は 9:00 形式。時刻は昇順
- 次の timeLabel は、前の開始＋durationMinutes＋移動15分以降。滞在が重ならないようにする
- 各場所の openLabel〜closeLabel の営業時間内だけに入れる。timeLabel から durationMinutes 後が closeLabel を超えない。閉店後（例: 21:00閉店なのに 23:00）は禁止
- 連続する場所が時間的に重なるときは、閉店の早い方を先にする
- reasonJa はその人向けの短い日本語`,
    regenerateNote: regenerate
      ? '前回と違う組み合わせを優先してください。件数の多さは理由にしないでください。'
      : '',
    paceNote:
      dayPace === 'longStay'
        ? '今回の型: 所要の長い場所を軸に 3〜4 件。パーク級（9時間）を含めてよい。短い場所をたくさん足さない。'
        : '今回の型: 所要の短い場所を多めに 5〜8 件。同じエリアで歩きやすい一日。',
  }
}
