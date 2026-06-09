import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // refresh_token은 HttpOnly Cookie로 발급되므로 서버에서 읽기 가능
  const isLoggedIn = !!request.cookies.get('refresh_token')

  if (!isLoggedIn) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('showLogin', 'true')
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  // 마이페이지만 로그인 필수, 상세/탐색 등 콘텐츠 페이지는 비로그인 접근 허용
  matcher: ['/profile/:path*'],
}
