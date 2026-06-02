import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = !!request.cookies.get('session') // 실제 쿠키 키명은 백엔드 확인 필요
  const isDetailPage = request.nextUrl.pathname.startsWith('/detail')

  if (isDetailPage && !isLoggedIn) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('showLogin', 'true')
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/detail/:path*'],
}
