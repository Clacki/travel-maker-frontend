import { mockTrips } from '../data/mockTrips'
import type {
  CreateTripPayload,
  TripDetailResponse,
  TripListResponse,
  UpdateTripPayload,
} from '../types/trips.types'

export const getTrips = async (): Promise<TripListResponse> => {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // const response = await api.get<TripListResponse>('/trips')
  // return response.data
  return {
    trips: mockTrips.map(
      ({
        id,
        title,
        description,
        ownerId,
        region,
        startDate,
        endDate,
        visibility,
      }) => ({
        id,
        title,
        description,
        ownerId,
        region,
        startDate,
        endDate,
        visibility,
      })
    ),
    totalCount: mockTrips.length,
  }
}

export const getTripDetail = async (
  tripId: string
): Promise<TripDetailResponse | null> => {
  // TODO: 실제 API 연동 시 아래 코드로 교체
  // const response = await api.get<TripDetailResponse>(`/trips/${tripId}`)
  // return response.data
  // TODO: 실제 API 연동 전까지 ID 불일치 시 첫 번째 mock 데이터로 fallback
  return mockTrips.find((trip) => trip.id === tripId) ?? mockTrips[0] ?? null
}

export const createTrip = async (
  payload: CreateTripPayload
): Promise<TripDetailResponse> => {
  // TODO: 실제 API 연동 시 POST /trips로 교체
  return {
    id: 'new-trip',
    ownerId: 'me',
    description: payload.description ?? '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...payload,
  }
}

export const updateTrip = async (
  tripId: string,
  payload: UpdateTripPayload
): Promise<TripDetailResponse | null> => {
  // TODO: 실제 API 연동 시 PATCH /trips/{tripId}로 교체
  const trip = mockTrips.find((item) => item.id === tripId)

  if (!trip) {
    return null
  }

  return {
    ...trip,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
}
