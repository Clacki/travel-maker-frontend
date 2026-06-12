import api from '@/lib/api'

export type DetailCard = {
  title: string
  description: string
}

export type PlaceRecommendation = {
  place_id: number
  place_name: string
  description: string | null
  image_url: string | null
  tags: string[]
  style_vector: number[]
}

export type QuizSubmitResponse = {
  saved: boolean
  travel_type_id: number
  type_key: string
  name: string
  description: string
  image_url: string
  type_tags: string[]
  detail_cards: DetailCard[]
  result_vector: number[]
  destinations: PlaceRecommendation[]
}

export const postQuizSubmit = async (
  answers: string[]
): Promise<QuizSubmitResponse> => {
  const response = await api.post<QuizSubmitResponse>('/quiz/submit', {
    answers,
  })
  return response.data
}
