import { logout, refreshAccessToken } from '@/features/auth/api/authApi'

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'

export function getKakaoAuthorizeUrl() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim()
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim()

  if (!clientId) {
    throw new Error('카카오 로그인 Client ID가 설정되지 않았습니다.')
  }

  if (!redirectUri) {
    throw new Error('카카오 Redirect URI가 설정되지 않았습니다.')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  })

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`
}

export function redirectToKakaoLogin() {
  window.location.href = getKakaoAuthorizeUrl()
}

export { logout, refreshAccessToken }
