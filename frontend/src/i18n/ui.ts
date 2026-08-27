import type { HobbyTag, LifestyleTag, PlaceCategory, PriceRange } from '../types/place'
import type { Gender, RangePref, TransportMode } from '../types/traveler'
import type { AppLocale } from './locale'

export interface UiCopy {
  documentTitle: string
  appTitle: string
  headerLeadDefault: string
  headerLeadCity: string
  formTitle: string
  destinationLabel: string
  startLabel: string
  startHint: string
  startResetAirport: string
  startNaritaAirport: string
  startNoiBaiAirport: string
  startCustomPin: string
  startFromLabel: string
  cityHanoi: string
  cityChiba: string
  selectedBadge: string
  genderLabel: string
  ageLabel: string
  hobbiesLabel: string
  lifestyleLabel: string
  transportLabel: string
  rangePrefLabel: string
  submitPlan: string
  errorPickCity: string
  errorAge: string
  errorHobbies: string
  errorPlanFailed: string
  errorPlanUnavailable: string
  errorInvalidInput: string
  retryInvalidPlan: string
  errorEmptyGemini: string
  errorGeminiJson: string
  errorBuildPlan: string
  photoCredit: string
  dayInCity: string
  shufflePlan: string
  resetPlan: string
  durationAboutMinutes: string
  durationAboutHours: string
  durationAboutHoursMinutes: string
  hoursLabel: string
  hoursAlwaysOpen: string
  priceLabel: string
  travelLegLabel: string
  languageLabel: string
  slotMorning: string
  slotLunch: string
  slotAfternoon: string
  slotNight: string
  slotLateNight: string
  slotFallback: string
  gender: Record<Gender, string>
  hobby: Record<HobbyTag, string>
  lifestyle: Record<LifestyleTag, string>
  transport: Record<TransportMode, string>
  rangePref: Record<RangePref, string>
  category: Record<PlaceCategory, string>
  price: Record<PriceRange, string>
  citySummary: Record<'hanoi' | 'chiba', string>
  area: Record<string, string>
}

const JA: UiCopy = {
  documentTitle: 'ハノイ／千葉 一日旅行プラン',
  appTitle: '一日旅行プラン',
  headerLeadDefault: 'ハノイの旧市街か、千葉の海と寺。行き先から物語が始まる',
  headerLeadCity: '{city}の空気に合わせて、一日を編む',
  formTitle: '旅の主人公は、あなた',
  destinationLabel: '行き先',
  startLabel: 'スタート地点',
  startHint:
    '初期値は空港です。地図をクリックするかピンを動かして、ホテルなど一日の出発地点を選べます。',
  startResetAirport: '空港に戻す',
  startNaritaAirport: '成田空港',
  startNoiBaiAirport: 'ノイバイ空港',
  startCustomPin: '地図で選んだ地点',
  startFromLabel: '{place}から出発',
  cityHanoi: 'ハノイ',
  cityChiba: '千葉',
  selectedBadge: '選択中',
  genderLabel: '性別',
  ageLabel: '年齢',
  hobbiesLabel: '趣味（複数選べます）',
  lifestyleLabel: 'ライフスタイル',
  transportLabel: '優先する移動手段',
  rangePrefLabel: '一日の回り方',
  submitPlan: 'プランを考える',
  errorPickCity: '行き先を選んでください。',
  errorAge: '年齢は1から120の整数で入力してください。',
  errorHobbies: '趣味を1つ以上選んでください。',
  errorPlanFailed: 'プランの作成に失敗しました。',
  errorPlanUnavailable:
    'プラン API に繋がっていません。表示中の開発サーバーの URL で開き直してください。',
  errorInvalidInput: '入力内容が正しくありません。',
  retryInvalidPlan:
    '前回の出力は無効でした（{error}）。候補の id だけを使い、観光は matchedTags がある場所を選び、件数は {min}〜{max}、時刻は昇順、営業時間内にしてください。',
  errorEmptyGemini: 'Gemini から空の応答が返りました。',
  errorGeminiJson: 'Gemini の応答が JSON として解釈できませんでした。',
  errorBuildPlan: 'その条件ではプランを組み立てられませんでした。もう一度お試しください。',
  photoCredit: '写真',
  dayInCity: '{city}の一日',
  shufflePlan: '別のプランを考える',
  resetPlan: 'やり直す',
  durationAboutMinutes: '滞在目安時間 約{minutes}分',
  durationAboutHours: '滞在目安時間 約{hours}時間',
  durationAboutHoursMinutes: '滞在目安時間 約{hours}時間{minutes}分',
  hoursLabel: '営業 {open}〜{close}',
  hoursAlwaysOpen: '24時間営業',
  priceLabel: '値段 {price}',
  travelLegLabel: '{mode} 約{minutes}分',
  languageLabel: '言語',
  slotMorning: '午前',
  slotLunch: '昼',
  slotAfternoon: '午後',
  slotNight: '夜',
  slotLateNight: '深夜',
  slotFallback: '予定',
  gender: {
    male: '男性',
    female: '女性',
    other: 'その他',
    unspecified: '回答しない',
  },
  hobby: {
    foodie: 'グルメ',
    history: '歴史',
    nature: '自然',
    shopping: 'ショッピング',
    photo: '写真',
    cafe: 'カフェ',
    art: 'アート',
    nightlife: 'ナイトライフ',
    walking: '散策',
  },
  lifestyle: {
    relaxed: 'ゆったり',
    active: 'アクティブ',
    budget: 'コスパ重視',
    luxury: '少し贅沢',
    foodie: '食べ歩き',
  },
  transport: {
    train: '電車',
    bus: 'バス',
    taxi: 'タクシー',
    walk: '徒歩',
  },
  rangePref: {
    stayLocal: '同じエリアに滞在したい',
    explore: '移動して色々回りたい',
  },
  category: {
    attraction: '観光地',
    restaurant: 'レストラン',
    cafe: 'カフェ',
    market: '市場',
  },
  price: {
    1: 'リーズナブル',
    2: 'ふつう',
    3: '少し高め',
  },
  citySummary: {
    hanoi: '歴史ある旧市街とフォー・カフェが中心の街',
    chiba: '成田の門前町から海辺・水郷まで、一日で雰囲気を変えられる県',
  },
  area: {
    旧市街: '旧市街',
    西湖: '西湖',
    バーディン: 'バーディン',
    フレンチクォーター: 'フレンチクォーター',
    ロンビエン: 'ロンビエン',
    ドンダ: 'ドンダ',
    カウザイ: 'カウザイ',
    ナムトゥリエム: 'ナムトゥリエム',
    タインスアン: 'タインスアン',
    ハイバーチュン: 'ハイバーチュン',
    ホアイドゥク: 'ホアイドゥク',
    ハドン: 'ハドン',
    成田: '成田',
    千葉市中央: '千葉市中央',
    '幕張・海浜': '幕張・海浜',
    '舞浜・浦安': '舞浜・浦安',
    '佐原・香取': '佐原・香取',
    '房総・内陸': '房総・内陸',
    '銚子・九十九里': '銚子・九十九里',
    南房総: '南房総',
    '木更津・かずさ': '木更津・かずさ',
    '東葛・船橋': '東葛・船橋',
    '佐倉・北総': '佐倉・北総',
  },
}

const EN: UiCopy = {
  documentTitle: 'Hanoi / Chiba one-day trip planner',
  appTitle: 'One-day trip planner',
  headerLeadDefault:
    'Hanoi’s Old Quarter, or Chiba’s sea and temples. The story begins with where you go.',
  headerLeadCity: 'A day shaped around the mood of {city}',
  formTitle: 'This trip is about you',
  destinationLabel: 'Destination',
  startLabel: 'Starting point',
  startHint:
    'The pin starts at the airport. Click the map or drag the pin to set a hotel or another place as the start of your day.',
  startResetAirport: 'Reset to airport',
  startNaritaAirport: 'Narita Airport',
  startNoiBaiAirport: 'Noi Bai Airport',
  startCustomPin: 'Point chosen on the map',
  startFromLabel: 'Starting from {place}',
  cityHanoi: 'Hanoi',
  cityChiba: 'Chiba',
  selectedBadge: 'Selected',
  genderLabel: 'Gender',
  ageLabel: 'Age',
  hobbiesLabel: 'Interests (choose one or more)',
  lifestyleLabel: 'Travel style',
  transportLabel: 'Preferred way to get around',
  rangePrefLabel: 'How you want to spend the day',
  submitPlan: 'Plan my day',
  errorPickCity: 'Please choose a destination.',
  errorAge: 'Enter a whole number between 1 and 120 for age.',
  errorHobbies: 'Please choose at least one interest.',
  errorPlanFailed: 'We could not create a plan. Please try again.',
  errorPlanUnavailable:
    'The plan API is not available. Open the URL shown by the running dev server.',
  errorInvalidInput: 'Some of the details look incomplete.',
  retryInvalidPlan:
    'The previous output was invalid ({error}). Use candidate ids only, pick attractions that have matchedTags, {min}–{max} stops, times in ascending order and within opening hours.',
  errorEmptyGemini: 'Gemini returned an empty response.',
  errorGeminiJson: 'Gemini’s response could not be read as JSON.',
  errorBuildPlan: 'We could not assemble a plan for those conditions. Please try again.',
  photoCredit: 'Photo',
  dayInCity: 'A day in {city}',
  shufflePlan: 'Try another plan',
  resetPlan: 'Start over',
  durationAboutMinutes: 'Est. stay about {minutes} min',
  durationAboutHours: 'Est. stay about {hours} hr',
  durationAboutHoursMinutes: 'Est. stay about {hours} hr {minutes} min',
  hoursLabel: 'Open {open}–{close}',
  hoursAlwaysOpen: 'Open 24 hours',
  priceLabel: 'Price {price}',
  travelLegLabel: '{mode} about {minutes} min',
  languageLabel: 'Language',
  slotMorning: 'Morning',
  slotLunch: 'Lunch',
  slotAfternoon: 'Afternoon',
  slotNight: 'Night',
  slotLateNight: 'Late night',
  slotFallback: 'Planned',
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    unspecified: 'Prefer not to say',
  },
  hobby: {
    foodie: 'Food',
    history: 'History',
    nature: 'Nature',
    shopping: 'Shopping',
    photo: 'Photography',
    cafe: 'Cafés',
    art: 'Art',
    nightlife: 'Nightlife',
    walking: 'Walking',
  },
  lifestyle: {
    relaxed: 'Easygoing',
    active: 'Active',
    budget: 'Budget-friendly',
    luxury: 'A little indulgent',
    foodie: 'Food hopping',
  },
  transport: {
    train: 'Train',
    bus: 'Bus',
    taxi: 'Taxi',
    walk: 'Walk',
  },
  rangePref: {
    stayLocal: 'Stay around one area',
    explore: 'Travel around and see more',
  },
  category: {
    attraction: 'Sight',
    restaurant: 'Restaurant',
    cafe: 'Café',
    market: 'Market',
  },
  price: {
    1: 'Affordable',
    2: 'Moderate',
    3: 'A bit pricey',
  },
  citySummary: {
    hanoi: 'A city of historic streets, phở, and cafés',
    chiba:
      'A prefecture where temple towns, the waterfront, and riverside villages can all fit in one day',
  },
  area: {
    旧市街: 'Old Quarter',
    西湖: 'West Lake',
    バーディン: 'Ba Dinh',
    フレンチクォーター: 'French Quarter',
    ロンビエン: 'Long Bien',
    ドンダ: 'Dong Da',
    カウザイ: 'Cau Giay',
    ナムトゥリエム: 'Nam Tu Liem',
    タインスアン: 'Thanh Xuan',
    ハイバーチュン: 'Hai Ba Trung',
    ホアイドゥク: 'Hoai Duc',
    ハドン: 'Ha Dong',
    成田: 'Narita',
    千葉市中央: 'Central Chiba',
    '幕張・海浜': 'Makuhari waterfront',
    '舞浜・浦安': 'Maihama / Urayasu',
    '佐原・香取': 'Sawara / Katori',
    '房総・内陸': 'Inland Boso',
    '銚子・九十九里': 'Choshi / Kujukuri',
    南房総: 'Minami-Boso',
    '木更津・かずさ': 'Kisarazu / Kazusa',
    '東葛・船橋': 'Tokatsu / Funabashi',
    '佐倉・北総': 'Sakura / Hokuso',
  },
}

const VI: UiCopy = {
  documentTitle: 'Kế hoạch du lịch một ngày: Hà Nội / Chiba',
  appTitle: 'Kế hoạch du lịch một ngày',
  headerLeadDefault:
    'Phố cổ Hà Nội, hay biển và chùa chiền ở Chiba. Câu chuyện bắt đầu từ nơi bạn chọn.',
  headerLeadCity: 'Một ngày được sắp xếp theo nhịp sống của {city}',
  formTitle: 'Nhân vật chính của chuyến đi chính là bạn',
  destinationLabel: 'Điểm đến',
  startLabel: 'Điểm xuất phát',
  startHint:
    'Ghim mặc định ở sân bay. Nhấp bản đồ hoặc kéo ghim để chọn khách sạn hay nơi bắt đầu ngày đi.',
  startResetAirport: 'Đặt lại về sân bay',
  startNaritaAirport: 'Sân bay Narita',
  startNoiBaiAirport: 'Sân bay Nội Bài',
  startCustomPin: 'Điểm chọn trên bản đồ',
  startFromLabel: 'Xuất phát từ {place}',
  cityHanoi: 'Hà Nội',
  cityChiba: 'Chiba',
  selectedBadge: 'Đã chọn',
  genderLabel: 'Giới tính',
  ageLabel: 'Tuổi',
  hobbiesLabel: 'Sở thích (có thể chọn nhiều)',
  lifestyleLabel: 'Phong cách đi',
  transportLabel: 'Cách di chuyển ưu tiên',
  rangePrefLabel: 'Cách đi trong ngày',
  submitPlan: 'Lập kế hoạch',
  errorPickCity: 'Vui lòng chọn điểm đến.',
  errorAge: 'Tuổi phải là số nguyên từ 1 đến 120.',
  errorHobbies: 'Vui lòng chọn ít nhất một sở thích.',
  errorPlanFailed: 'Không lập được kế hoạch. Vui lòng thử lại.',
  errorPlanUnavailable:
    'Không kết nối được API lập kế hoạch. Hãy mở đúng URL của máy chủ đang chạy.',
  errorInvalidInput: 'Thông tin nhập chưa hợp lệ.',
  retryInvalidPlan:
    'Kết quả trước không hợp lệ ({error}). Chỉ dùng id trong danh sách, chọn điểm tham quan có matchedTags, {min}–{max} điểm, giờ tăng dần và trong giờ mở cửa.',
  errorEmptyGemini: 'Gemini trả về nội dung trống.',
  errorGeminiJson: 'Không đọc được JSON từ Gemini.',
  errorBuildPlan: 'Với điều kiện đó, không ghép được kế hoạch. Vui lòng thử lại.',
  photoCredit: 'Ảnh',
  dayInCity: 'Một ngày ở {city}',
  shufflePlan: 'Lập kế hoạch khác',
  resetPlan: 'Làm lại từ đầu',
  durationAboutMinutes: 'Thời gian lưu trú khoảng {minutes} phút',
  durationAboutHours: 'Thời gian lưu trú khoảng {hours} giờ',
  durationAboutHoursMinutes: 'Thời gian lưu trú khoảng {hours} giờ {minutes} phút',
  hoursLabel: 'Mở cửa {open}–{close}',
  hoursAlwaysOpen: 'Mở cửa 24 giờ',
  priceLabel: 'Giá {price}',
  travelLegLabel: '{mode} khoảng {minutes} phút',
  languageLabel: 'Ngôn ngữ',
  slotMorning: 'Sáng',
  slotLunch: 'Trưa',
  slotAfternoon: 'Chiều',
  slotNight: 'Tối',
  slotLateNight: 'Đêm khuya',
  slotFallback: 'Dự kiến',
  gender: {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
    unspecified: 'Không muốn nêu',
  },
  hobby: {
    foodie: 'Ẩm thực',
    history: 'Lịch sử',
    nature: 'Thiên nhiên',
    shopping: 'Mua sắm',
    photo: 'Chụp ảnh',
    cafe: 'Quán cà phê',
    art: 'Nghệ thuật',
    nightlife: 'Về đêm',
    walking: 'Đi dạo',
  },
  lifestyle: {
    relaxed: 'Thong thả',
    active: 'Năng động',
    budget: 'Tiết kiệm',
    luxury: 'Hơi sang trọng',
    foodie: 'Ăn dạo',
  },
  transport: {
    train: 'Tàu',
    bus: 'Xe buýt',
    taxi: 'Taxi',
    walk: 'Đi bộ',
  },
  rangePref: {
    stayLocal: 'Ở quanh một khu',
    explore: 'Di chuyển nhiều để đi nhiều nơi',
  },
  category: {
    attraction: 'Điểm tham quan',
    restaurant: 'Nhà hàng',
    cafe: 'Quán cà phê',
    market: 'Chợ',
  },
  price: {
    1: 'Bình dân',
    2: 'Vừa phải',
    3: 'Hơi cao',
  },
  citySummary: {
    hanoi: 'Thành phố của phố cổ, phở và cà phê',
    chiba:
      'Tỉnh có thể đổi không khí trong một ngày: phố cổ Narita, ven biển, rồi làng ven sông',
  },
  area: {
    旧市街: 'Phố cổ',
    西湖: 'Hồ Tây',
    バーディン: 'Ba Đình',
    フレンチクォーター: 'Khu phố Pháp',
    ロンビエン: 'Long Biên',
    ドンダ: 'Đống Đa',
    カウザイ: 'Cầu Giấy',
    ナムトゥリエム: 'Nam Từ Liêm',
    タインスアン: 'Thanh Xuân',
    ハイバーチュン: 'Hai Bà Trưng',
    ホアイドゥク: 'Hoài Đức',
    ハドン: 'Hà Đông',
    成田: 'Narita',
    千葉市中央: 'Trung tâm Chiba',
    '幕張・海浜': 'Makuhari ven biển',
    '舞浜・浦安': 'Maihama / Urayasu',
    '佐原・香取': 'Sawara / Katori',
    '房総・内陸': 'Nội địa Boso',
    '銚子・九十九里': 'Choshi / Kujukuri',
    南房総: 'Nam Boso',
    '木更津・かずさ': 'Kisarazu / Kazusa',
    '東葛・船橋': 'Tokatsu / Funabashi',
    '佐倉・北総': 'Sakura / Bắc Tổng',
  },
}

const UI_BY_LOCALE: Record<AppLocale, UiCopy> = {
  ja: JA,
  en: EN,
  vi: VI,
}

export function getUi(locale: AppLocale): UiCopy {
  return UI_BY_LOCALE[locale]
}

export function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce((text, [key, value]) => {
    return text.replaceAll(`{${key}}`, String(value))
  }, template)
}
