import type { RelatedTravelType } from '@/features/result/result.types'

export type QuizSubmitRequest = {
  answers: ('A' | 'B')[]
}

export type QuizSubmitDetailCard = {
  title: string
  description: string
}

export type QuizSubmitDestination = {
  place_id: number
  place_name: string
  description: string | null
  image_url: string
  tags: string[]
  match_rate: number
}

export type QuizSubmitResponse = {
  saved: boolean
  travel_type_id: number
  type_key: string
  name: string
  description: string
  image_url: string
  type_tags: string[]
  /** API에서 JSON 문자열로 반환됨. 사용 시 JSON.parse() 필요 */
  result_vector: string
  accuracy: number
  detail_cards: QuizSubmitDetailCard[]
  destinations: QuizSubmitDestination[]
  compatible_type: RelatedTravelType | null
  incompatible_type: RelatedTravelType | null
}

export type QuizSubmitError = {
  error_detail: string
}
