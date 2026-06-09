import api from '@/lib/api'
import { refreshAccessToken } from '@/features/auth/api/authApi'
import {
  ACCESS_TOKEN_STORAGE_KEY,
  setStoredAccessToken,
} from '@/features/auth/utils/tokenStorage'

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'
const DEFAULT_KAKAO_REDIRECT_URI =
  'https://www.travel-maker.site/social-callback'
const KAKAO_LOGIN_PATH = '/auth/kakao/login'
export { ACCESS_TOKEN_STORAGE_KEY }

export type KakaoLoginResponse = {
  access_token: string
  is_new_user?: boolean
}

export function getKakaoAuthorizeUrl() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim()
  const redirectUri =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim() ||
    DEFAULT_KAKAO_REDIRECT_URI

  if (!clientId) {
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

export { refreshAccessToken }

export function saveAccessToken(accessToken: string) {
  setStoredAccessToken(accessToken)
}
