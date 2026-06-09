import api from '@/lib/api'

const TOKEN_REFRESH_PATH = '/auth/token/refresh'
const LOGOUT_PATH = '/auth/logout'

export type TokenRefreshResponse = {
  access_token: string
}

export const refreshAccessToken = async () => {
  const response = await api.post<TokenRefreshResponse>(TOKEN_REFRESH_PATH)

  return response.data
}

export const logout = async () => {
  await api.post(LOGOUT_PATH)
}
