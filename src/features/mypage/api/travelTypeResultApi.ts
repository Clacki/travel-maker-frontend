import api from '@/lib/api'
import type { RecommendedDestination } from '@/features/result/result.types'

/** GET /api/v1/users/quiz/result 응답 스키마 */
export type TravelTypeResultResponse = {
  name: string
  description: string
  image_url: string
  type_tags: string[]
  /**
   * Swagger 상 string 타입으로 문서화되어 있으나, 실제 응답은 `{ label: string, value: number }[]`
   * 형태의 배열로 반환됨 (value: 0~100 정수).
   * unknown으로 선언해 런타임 파싱 시 안전하게 처리한다.
   */
  result_vector: unknown
  accuracy: number
  /**
   * Swagger 상 string 타입으로 문서화되어 있으나, 실제 응답은 `{ place_id, place_name, match_rate }[]`
   * 형태의 배열로 반환됨.
   * unknown으로 선언해 런타임 파싱 시 안전하게 처리한다.
   */
  destinations: unknown
  updated_at: string
}

export type VectorItem = {
  label: string
  /** 0~100 정수 */
  value: number
}

export type TravelTypeResult = {
  name: string
  description: string
  image_url: string
  type_tags: string[]
  /** 백엔드 라벨 + 0~100 값 배열 */
  result_vector: VectorItem[]
  accuracy: number
  destinations: RecommendedDestination[]
  updated_at: string
}

export async function getTravelTypeResult(): Promise<TravelTypeResultResponse> {
  const response = await api.get<TravelTypeResultResponse>('/users/quiz/result')
  return response.data
}

/** W3: unknown 값이 plain object인지 확인하는 타입 가드 — 반복되는 `as Record<string, unknown>` 캐스팅 대체 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** raw가 배열이거나 JSON 배열 문자열이면 배열로 반환, 그 외 빈 배열 */
function toArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw) {
    try {
      return JSON.parse(raw) as unknown[]
    } catch {
      return []
    }
  }
  return []
}

function parseVectorItem(item: unknown): VectorItem | null {
  if (!isRecord(item)) return null
  const label = typeof item.label === 'string' ? item.label : ''
  const value =
    typeof item.value === 'number'
      ? item.value
      : typeof item.value === 'string'
        ? parseFloat(item.value) || 0
        : 0
  if (!label) return null
  return { label, value }
}

function parseResultVector(raw: unknown): VectorItem[] {
  const arr = toArray(raw)
  if (!Array.isArray(arr)) return []
  return arr
    .map(parseVectorItem)
    .filter((item): item is VectorItem => item !== null)
}

function parseDestinations(raw: unknown): RecommendedDestination[] {
  const arr = toArray(raw)
  if (!Array.isArray(arr)) return []

  return arr.flatMap((item: unknown) => {
    if (!isRecord(item)) return []
    return [
      {
        id: String(item.place_id ?? ''),
        imageSrc:
          typeof item.image_url === 'string' && item.image_url
            ? item.image_url
            : undefined,
        title: typeof item.place_name === 'string' ? item.place_name : '',
        description:
          typeof item.description === 'string' ? item.description : '',
        hashtags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
        matchRate:
          typeof item.match_rate === 'number' ? item.match_rate : undefined,
      },
    ]
  })
}

export function normalizeTravelTypeResult(
  response: TravelTypeResultResponse | null | undefined
): TravelTypeResult | null {
  if (!response?.name) {
    return null
  }

  return {
    name: response.name,
    description: response.description,
    image_url: response.image_url ?? '',
    type_tags: Array.isArray(response.type_tags) ? response.type_tags : [],
    result_vector: parseResultVector(response.result_vector),
    accuracy: response.accuracy,
    destinations: parseDestinations(response.destinations),
    updated_at: response.updated_at,
  }
}
