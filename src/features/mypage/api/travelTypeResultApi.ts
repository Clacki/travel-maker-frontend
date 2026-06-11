export type TravelTypeDetailCard = {
  title: string
  description: string
}

export type TravelTypeResultVectorItem = {
  label: string
  value: number
}

export type TravelTypeResultVectorInput = TravelTypeResultVectorItem | number

export type RecommendedDestination = {
  place_id: number
  place_name: string
  description: string
  image_url: string
  tags: string[]
  match_rate?: number
}

export type TravelTypeResultResponse = {
  saved: boolean
  travel_type_id: number
  type_key: string
  name: string
  description: string
  image_url: string
  type_tags: string[]
  detail_cards: TravelTypeDetailCard[]
  result_vector: TravelTypeResultVectorInput[]
  destinations: RecommendedDestination[]
  updated_at?: string
  answered_count?: number
}

export type TravelTypeResult = Omit<
  TravelTypeResultResponse,
  'result_vector' | 'destinations'
> & {
  result_vector: TravelTypeResultVectorItem[]
  destinations: RecommendedDestination[]
}

// TODO: 백엔드가 result_vector label을 내려주기 전까지만 사용하는 임시 fallback입니다.
// 최종 구조는 백엔드의 { label, value }[]를 그대로 표시하는 방향이 맞습니다.
export const DEFAULT_VECTOR_LABELS = [
  '액티비티형',
  '혼자형',
  '자연형',
  '바다 선호',
] as const

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  const percentValue = value >= 0 && value <= 1 ? value * 100 : value
  return Math.min(100, Math.max(0, Math.round(percentValue)))
}

function normalizeVectorItem(
  item: TravelTypeResultVectorInput,
  index: number
): TravelTypeResultVectorItem {
  if (typeof item === 'number') {
    return {
      label: DEFAULT_VECTOR_LABELS[index] ?? `성향 지표 ${index + 1}`,
      value: clampPercent(item),
    }
  }

  return {
    label:
      item.label || DEFAULT_VECTOR_LABELS[index] || `성향 지표 ${index + 1}`,
    value: clampPercent(item.value),
  }
}

function normalizeDestination(
  destination: RecommendedDestination
): RecommendedDestination {
  return {
    ...destination,
    image_url: destination.image_url ?? '',
    tags: Array.isArray(destination.tags) ? destination.tags : [],
    match_rate:
      destination.match_rate === undefined
        ? undefined
        : clampPercent(destination.match_rate),
  }
}

export function normalizeTravelTypeResult(
  response: TravelTypeResultResponse | null | undefined
): TravelTypeResult | null {
  if (!response?.name || !response.type_key) {
    return null
  }

  return {
    ...response,
    image_url: response.image_url ?? '',
    type_tags: Array.isArray(response.type_tags) ? response.type_tags : [],
    detail_cards: Array.isArray(response.detail_cards)
      ? response.detail_cards
      : [],
    result_vector: Array.isArray(response.result_vector)
      ? response.result_vector.map(normalizeVectorItem)
      : [],
    destinations: Array.isArray(response.destinations)
      ? response.destinations.map(normalizeDestination)
      : [],
  }
}
