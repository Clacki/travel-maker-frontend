export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EXPLORE: '/explore',
  DETAIL: (id: string) => `/detail/${id}`,
  PROFILE: (userId: string) => `/profile/${userId}`,
  PROFILE_EDIT: (userId: string) => `/profile/${userId}/edit`,
  TEST: '/test',
  TEST_RESULT: '/test/result',
} as const
