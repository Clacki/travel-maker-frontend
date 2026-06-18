import api from '@/lib/api'

type SharePlaceRequest = {
  content_type: 'place'
  content_id: number
}

type ShareRouteRequest = {
  content_type: 'route'
  content_id: number
}

type ShareQuizLoggedInRequest = {
  content_type: 'travel_quiz'
  content_id: number
}

type ShareQuizGuestRequest = {
  content_type: 'travel_quiz'
  type_key: string
  vector: number[]
}

export type ShareRequestBody =
  | SharePlaceRequest
  | ShareRouteRequest
  | ShareQuizLoggedInRequest
  | ShareQuizGuestRequest

type ShareResponse = {
  share_url: string
}

export const postShare = async (
  body: ShareRequestBody
): Promise<ShareResponse> => {
  const response = await api.post<ShareResponse>('/share', body)
  return response.data
}
