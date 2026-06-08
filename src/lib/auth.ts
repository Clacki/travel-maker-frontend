import { cookies } from 'next/headers'

/** 서버 컴포넌트에서 로그인 여부를 확인합니다. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has('refresh_token')
}
