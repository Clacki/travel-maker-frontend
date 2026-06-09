import api from '@/lib/api'

const TOKEN_REFRESH_PATH = '/auth/token/refresh'

export type TokenRefreshResponse = {
  access_token: string
}

export const refreshAccessToken = async () => {
  const response = await api.post<TokenRefreshResponse>(TOKEN_REFRESH_PATH)

  return response.data
}
