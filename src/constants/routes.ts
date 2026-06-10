export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
  TRIPS: '/trips',
  TRIP_CREATE: '/trips/create',
  TRIP_DETAIL: (tripId: string) => `/trips/${tripId}`,
  TRIP_EDIT: (tripId: string) => `/trips/${tripId}/edit`,
  DETAIL: (id: string) => `/detail/${id}`,
  PROFILE: (userId: string) => `/profile/${userId}`,
  PROFILE_EDIT: (userId: string) => `/profile/${userId}/edit`,
  TEST: '/test',
  TEST_RESULT: '/test/result',
} as const
