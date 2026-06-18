import type { RelatedTravelType } from '@/features/result/result.types'

export type ResultVectorItem = {
  label: string
  value: number
}

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
  result_vector: ResultVectorItem[]
  accuracy: number
  detail_cards: QuizSubmitDetailCard[]
  destinations: QuizSubmitDestination[]
  compatible_type: RelatedTravelType | null
  incompatible_type: RelatedTravelType | null
}

export type QuizSubmitError = {
  error_detail: string
}
