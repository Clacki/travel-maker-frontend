import api from '@/lib/api'

export type MyRouteItem = {
  route_id: number
  title: string
  description: string | null
  image_url: string | null
  place_count: number
  like_count: number
  created_at: string
  updated_at: string
}

export type PaginatedMyRoutesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: MyRouteItem[]
}

export type MyRoutesResponse = PaginatedMyRoutesResponse | MyRouteItem[]

export type GetMyTripsParams = {
  page?: number
}

export async function getMyTrips(
  nickname: string,
  { page = 1 }: GetMyTripsParams = {}
) {
  const response = await api.get<MyRoutesResponse>(
    `/users/${nickname}/routes`,
    {
      params: { page },
    }
  )

  return response.data
}
