import type { Place } from '../types/place'

type NamedPlace = Pick<Place, 'nameJa' | 'area'>

const GENERIC_FRAGMENTS = [
  'ナイトウォーク',
  'ライトアップ',
  'レストラン',
  'ウォーターパーク',
  'ショッピング',
  'サイクリング',
  'ミニゴルフ',
  'フードエリア',
  '食べ歩き',
  'アートスポット',
  '夕景スポット',
  '展望デッキ',
  'ギャラリー',
  '東京',
  '千葉',
  'ハノイ',
  'カフェ',
  'ストア',
  '公園',
  '散策',
  '周辺',
  '市場',
  'モール',
  '通り',
  '夜市',
  '夜景',
  'スポット',
  'エリア',
  'ディナー',
].sort((left, right) => right.length - left.length)

const MIN_KANA_OR_LATIN = 4
const MIN_KANJI = 3

function stripGenericFragments(name: string): string {
  let stripped = name
  for (const fragment of GENERIC_FRAGMENTS) {
    stripped = stripped.split(fragment).join('')
  }

  return stripped.replace(/[の・／/\s（）()]/g, '')
}

function areaParts(area: string): string[] {
  return area.split('・').map((part) => part.trim()).filter((part) => part !== '')
}

function isAreaToken(token: string, area: string): boolean {
  return areaParts(area).some((part) => part === token)
}

function longestCommonSubstring(left: string, right: string): string {
  if (left.length === 0 || right.length === 0) {
    return ''
  }

  const lengths: number[][] = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0),
  )
  let best = 0
  let endIndex = 0

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      if (left[i - 1] !== right[j - 1]) {
        continue
      }

      const previous = lengths[i - 1]?.[j - 1] ?? 0
      const next = previous + 1
      const row = lengths[i]
      if (row === undefined) {
        continue
      }

      row[j] = next
      if (next > best) {
        best = next
        endIndex = i
      }
    }
  }

  return left.slice(endIndex - best, endIndex)
}

function isDistinctiveToken(token: string): boolean {
  const kanaMatches = token.match(/[\u30A0-\u30FFー]+/g) ?? []
  if (kanaMatches.some((run) => run.length >= MIN_KANA_OR_LATIN)) {
    return true
  }

  const latinMatches = token.match(/[A-Za-z]+/g) ?? []
  if (latinMatches.some((run) => run.length >= MIN_KANA_OR_LATIN)) {
    return true
  }

  const kanjiMatches = token.match(/[\u4E00-\u9FFF]+/g) ?? []
  return kanjiMatches.some((run) => run.length >= MIN_KANJI)
}

export function placesShareDistinctiveName(
  left: NamedPlace,
  right: NamedPlace,
): boolean {
  const token = longestCommonSubstring(
    stripGenericFragments(left.nameJa),
    stripGenericFragments(right.nameJa),
  )
  if (!isDistinctiveToken(token)) {
    return false
  }

  if (isAreaToken(token, left.area) || isAreaToken(token, right.area)) {
    return false
  }

  return true
}

function findRoot(parent: number[], index: number): number {
  const current = parent[index]
  if (current === undefined || current === index) {
    return index
  }

  const root = findRoot(parent, current)
  parent[index] = root
  return root
}

function shuffleIndexes<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1))
    const left = shuffled[index]
    const right = shuffled[swapWith]
    if (left === undefined || right === undefined) {
      continue
    }

    shuffled[index] = right
    shuffled[swapWith] = left
  }

  return shuffled
}

export function shuffleSimilarNameGroups<T extends NamedPlace>(places: T[]): T[] {
  const next = [...places]
  const parent = places.map((_, index) => index)

  for (let leftIndex = 0; leftIndex < places.length; leftIndex += 1) {
    const left = places[leftIndex]
    if (left === undefined) {
      continue
    }

    for (let rightIndex = leftIndex + 1; rightIndex < places.length; rightIndex += 1) {
      const right = places[rightIndex]
      if (right === undefined) {
        continue
      }

      if (!placesShareDistinctiveName(left, right)) {
        continue
      }

      const leftRoot = findRoot(parent, leftIndex)
      const rightRoot = findRoot(parent, rightIndex)
      if (leftRoot !== rightRoot) {
        parent[leftRoot] = rightRoot
      }
    }
  }

  const groups = new Map<number, number[]>()
  for (let index = 0; index < places.length; index += 1) {
    const root = findRoot(parent, index)
    const members = groups.get(root)
    if (members === undefined) {
      groups.set(root, [index])
    } else {
      members.push(index)
    }
  }

  for (const indexes of groups.values()) {
    if (indexes.length < 2) {
      continue
    }

    const members = indexes.flatMap((index) => {
      const place = next[index]
      return place === undefined ? [] : [place]
    })
    const shuffled = shuffleIndexes(members)
    for (let offset = 0; offset < indexes.length; offset += 1) {
      const slot = indexes[offset]
      const place = shuffled[offset]
      if (slot !== undefined && place !== undefined) {
        next[slot] = place
      }
    }
  }

  return next
}

