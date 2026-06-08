import api from '@/lib/api'

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'
const KAKAO_LOGIN_PATH = '/auth/kakao/login'
const TOKEN_REFRESH_PATH = '/auth/token/refresh'
export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

export type KakaoLoginResponse = {
  access_token: string
  is_new_user?: boolean
}

export type TokenRefreshResponse = {
  access_token: string
}

export function getKakaoAuthorizeUrl() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim()
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim()

  if (!clientId || !redirectUri) {
    throw new Error('카카오 로그인 환경변수가 설정되지 않았습니다.')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  })

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`
}

export async function loginWithKakaoCode({ code }: { code: string }) {
  const response = await api.post<KakaoLoginResponse>(KAKAO_LOGIN_PATH, {
    code,
  })

  return response.data
}

export async function refreshAccessToken() {
  const response = await api.post<TokenRefreshResponse>(TOKEN_REFRESH_PATH)

  return response.data
}

export function saveAccessToken(accessToken: string) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}
